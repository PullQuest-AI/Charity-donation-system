import FeaturesSection from "./FeatureSection";
import { useVanta } from "../VantaBackground";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import HeroNavbar from "../components/HeroNavbar";

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { createThirdwebClient } from "thirdweb";

import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';
import Connectbutton from '../components/Connectbutton';

const client = createThirdwebClient({ clientId : "07baf930ed674143787a0996a7bd15d7"});

const HeroSection = () => {
  // Use the Vanta hook for the hero section
  const vantaRef = useVanta({
    backgroundColor: 0x13131a,
    color: 0x98465f,
    spacing: 2.5,
    chaos: 0.25,
    mouseControls: true,
    touchControls: true,
  });

  const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const { disconnectWallet } = useStateContext();
  
    // 🔹 Added search state
    const [searchQuery, setSearchQuery] = useState("");
  
    // 🔹 Using context
    const { address, connectWallet, campaigns, setFilteredCampaigns } = useStateContext();
  
    const handleConnect = async () => {
      try {
        await connectWallet("injected");
        console.log("Wallet connected:", address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    };
  
      const handleLogout = () => {
      disconnectWallet();
      window.location.reload(); // Reset UI and address
    };
  
    // 🔹 Live Search Handler
    const handleSearch = (query) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setFilteredCampaigns(campaigns); // reset if empty
        return;
      }
      const filtered = campaigns.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCampaigns(filtered);
      navigate("/"); // redirect to dashboard
    };

  return (
    <>

      {/* Hero section with Vanta background */}
      <div
        ref={vantaRef}
        className="relative w-full overflow-hidden min-h-screen"
        style={{ backgroundColor: '#13131a' }}
      >
        <main className="flex-grow flex items-center px-6 md:px-12 relative z-10">
          <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 py-20 md:py-28">

            {/* Text content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight text-white">
                You're going to need a <br /> <span className="text-[#ea638c]">bigger</span> goal.
              </h1>
              <p className="text-lg md:text-xl mt-6 text-gray-300 max-w-lg mx-auto lg:mx-0">
                Fundraising and nonprofit done the WEB3 way
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* --- MODIFIED BUTTON --- */}
                <a
                  href="/create-campaign"
                  className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold w-full sm:w-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#ea638c]/40"
                >
                  REGISTER YOUR CAMPAIGN
                </a>
                {/* --- MODIFIED BUTTON --- */}
                <a
                  href="/"
                  className="inline-block border border-gray-700 text-white px-8 py-3 rounded-full font-semibold w-full sm:w-auto transition-all duration-300 ease-in-out transform hover:bg-white/10 hover:border-white hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
                >
                  TOUR THE PLATFORM
                </a>
              </div>
            </div>

            {/* Image with glow */}
            <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center relative">
              <div className="absolute inset-0 bg-[#ff66c4]/10 blur-3xl rounded-full"></div>

            </div>
          </div>
        </main>
      </div>

      {/* Regular section after hero remains normal */}
      <FeaturesSection />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HeroSection;