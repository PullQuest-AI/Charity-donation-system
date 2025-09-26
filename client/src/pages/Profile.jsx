import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useStateContext } from "../context";
import { DisplayCampaigns, Loader } from "../components";

// For CSV/PDF export
import jsPDF from "jspdf";
import "jspdf-autotable";

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, contract, getUserDonations, getCampaigns, getUserCampaigns } =
    useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donations, setDonations] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [favorites, setFavorites] = useState([]); // local bookmark system
  const [userCampaigns, setUserCampaigns] = useState([]);

  // tab state
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "campaigns"

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !address) return;
      setIsLoading(true);

      const userDonations = await getUserDonations();
      setDonations(userDonations);

      const allCampaigns = await getCampaigns();
      const active = allCampaigns.filter(
        (c) => c.deadline * 1000 > Date.now() // active = deadline not passed
      );
      setActiveCampaigns(active);

      const createdByUser = await getUserCampaigns();
      setUserCampaigns(createdByUser);

      setIsLoading(false);
    };
    fetchData();
  }, [contract, address]);

  // total ETH donated
  const totalContribution = donations.reduce(
    (acc, d) => acc + parseFloat(d.donatedAmount),
    0
  );

  // achievements
  const achievements = [];
  if (donations.length > 0) achievements.push("First Donation");
  if (totalContribution >= 1) achievements.push("Big Heart (1+ ETH)");
  if (donations.length >= 3) achievements.push("Charity Champion (3+ Campaigns)");
  if (donations.length >= 10) achievements.push("Community Builder (10+ Campaigns)");

  // export donation history
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Donation History", 14, 16);
    const tableData = donations.map((d) => [
      d.title,
      d.donatedAmount + " ETH",
      new Date(d.deadline * 1000).toLocaleDateString(),
    ]);
    doc.autoTable({
      head: [["Campaign", "Amount", "Date"]],
      body: tableData,
      startY: 20,
    });
    doc.save("donation_history.pdf");
  };

  return (
    <div className="p-6 text-white">
      {isLoading && <Loader />}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "dashboard" ? "bg-[#8c6dfd]" : "bg-[#1c1c24]"
          }`}
        >
          My Dashboard
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "campaigns" ? "bg-[#8c6dfd]" : "bg-[#1c1c24]"
          }`}
        >
          My Campaigns
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          {/* Total Contribution */}
          <div className="bg-[#1c1c24] p-6 rounded-xl mb-6 shadow-lg">
            <h2 className="text-2xl font-bold">Your Contributions</h2>
            <p className="text-lg mt-2">
              You donated{" "}
              <span className="text-[#4acd8d] font-semibold">
                {totalContribution.toFixed(3)} ETH
              </span>{" "}
              across {donations.length} campaigns.
            </p>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="bg-[#1c1c24] p-6 rounded-xl mb-6">
              <h2 className="text-xl font-bold mb-3">Achievements</h2>
              <ul className="list-disc ml-6">
                {achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Donation History */}
          <div className="bg-[#1c1c24] p-6 rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-4">Donation History</h2>
            {donations.length === 0 ? (
              <p>No donations yet. Start supporting campaigns!</p>
            ) : (
              <div className="space-y-4">
                {donations.map((don, i) => (
                  <div
                    key={i}
                    className="flex items-center bg-[#2c2f32] p-4 rounded-lg cursor-pointer hover:bg-[#333344]"
                    onClick={() =>
                      navigate(`/campaign-details/${don.title}`, { state: don })
                    }
                  >
                    <img
                      src={don.image}
                      alt={don.title}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{don.title}</h3>
                      <p className="text-sm text-[#b2b3bd]">
                        Donated {don.donatedAmount} ETH
                      </p>
                    </div>
                    <p className="text-sm text-[#808191]">
                      {new Date(don.deadline * 1000).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {/* {donations.length > 0 && (
              <button
                onClick={exportPDF}
                className="mt-4 bg-[#8c6dfd] px-4 py-2 rounded-lg"
              >
                Download Receipt (PDF)
              </button>
            )} */}
          </div>

          {/* Active Campaigns Supported */}
          <div className="bg-[#1c1c24] p-6 rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-4">
              Active Campaigns You Supported
            </h2>
            <DisplayCampaigns
              title="Active Campaigns"
              isLoading={isLoading}
              campaigns={activeCampaigns.filter((c) =>
                donations.some((d) => d.pId === c.pId)
              )}
            />
          </div>

          {/* Favorites */}
          {/* <div className="bg-[#1c1c24] p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Favorite Campaigns</h2>
            {favorites.length === 0 ? (
              <p>No favorites yet. Star campaigns to save them here!</p>
            ) : (
              <DisplayCampaigns
                title="Favorites"
                isLoading={false}
                campaigns={favorites}
              />
            )}
          </div> */}
        </>
      )}

      {/* My Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="bg-[#1c1c24] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Your Created Campaigns</h2>
          <DisplayCampaigns
            title="My Campaigns"
            isLoading={isLoading}
            campaigns={userCampaigns}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
