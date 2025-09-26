import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { CustomButton } from "./";
import { logo, menu, thirdweb } from "../assets";
import { navlinks } from "../constants";
import Connectbutton from "./Connectbutton";
import brandLogo from "../assets/heartChainlogo.png";

const HeroNavbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { address, connectWallet, disconnectWallet } = useStateContext();

  const handleConnect = async () => {
    try {
      await connectWallet("injected");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    window.location.reload();
  };

  return (
    <header className="flex justify-between items-center py-5 px-6 md:px-12 border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-20 rounded-3xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <img src={brandLogo} alt="HeartChain Logo" className="h-14 w-auto" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          to="/campaigns"
          className="text-gray-400 hover:text-white transition-colors duration-300 text-lg font-medium"
        >
          Campaign
        </Link>
        <Link
          to="/create-campaign"
          className="text-gray-400 hover:text-white transition-colors duration-300 text-lg font-medium"
        >
          Create Campaign
        </Link>
        <Link
          to="/dashboard"
          className="text-gray-400 hover:text-white transition-colors duration-300 text-lg font-medium"
        >
          Dashboard
        </Link>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        {address ? (
          <CustomButton
            btnType="button"
            title="Disconnect"
            styles="bg-[#1dc071]"
            handleClick={handleLogout}
          />
        ) : (
          <Connectbutton />
        )}

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Mobile Drawer */}
      <div className="sm:hidden flex items-center relative">
        <button
          className="w-10 h-10 flex flex-col justify-center items-center cursor-pointer focus:outline-none"
          aria-label="Open menu"
          onClick={() => setToggleDrawer(true)}
        >
          <span className="block w-8 h-1 bg-white rounded mb-2"></span>
          <span className="block w-8 h-1 bg-white rounded mb-2"></span>
          <span className="block w-8 h-1 bg-white rounded"></span>
        </button>

        {toggleDrawer && (
          <>
            {/* Overlay with opacity fix */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setToggleDrawer(false)}
            ></div>

            {/* Drawer Panel */}
            <div className="fixed top-0 right-0 h-full w-64 bg-[#1c1c24] z-50 shadow-2xl px-6 py-8 transition-transform duration-500 translate-x-0">
              <button
                className="absolute top-6 right-6 text-white text-2xl"
                onClick={() => setToggleDrawer(false)}
              >
                &times;
              </button>

              <ul className="mb-8 mt-12 flex flex-col gap-6">
                <li
                  className="cursor-pointer"
                  onClick={() => {
                    setToggleDrawer(false);
                    navigate("/campaigns");
                  }}
                >
                  <p className="font-epilogue font-semibold text-[18px] text-white">
                    Campaign
                  </p>
                </li>
                <li
                  className="cursor-pointer"
                  onClick={() => {
                    setToggleDrawer(false);
                    navigate("/create-campaign");
                  }}
                >
                  <p className="font-epilogue font-semibold text-[18px] text-white">
                    Create Campaign
                  </p>
                </li>
                <li
                  className="cursor-pointer"
                  onClick={() => {
                    setToggleDrawer(false);
                    navigate("/dashboard");
                  }}
                >
                  <p className="font-epilogue font-semibold text-[18px] text-white">
                    Dashboard
                  </p>
                </li>
              </ul>

              <div className="flex justify-start">
                <CustomButton
                  btnType="button"
                  title={address ? "Disconnect" : "Connect"}
                  styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
                  handleClick={() => {
                    if (address) handleLogout();
                    else handleConnect();
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default HeroNavbar;
