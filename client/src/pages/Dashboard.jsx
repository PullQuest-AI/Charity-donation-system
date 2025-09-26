import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { DisplayCampaigns, Loader } from "../components";

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, contract, getUserDonations, getCampaigns, getUserCampaigns, getTopDonors } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donations, setDonations] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !address) return;
      setIsLoading(true);

      setDonations(await getUserDonations());

      const allCampaigns = await getCampaigns();
      setActiveCampaigns(allCampaigns.filter(c => c.deadline * 1000 > Date.now()));

      setUserCampaigns(await getUserCampaigns());

      setIsLoading(false);
    };
    fetchData();
  }, [contract, address]);

  return (
    <div className="p-6 text-white">
      {isLoading && <Loader />}

      <h2 className="text-xl font-bold mb-4">Your Created Campaigns</h2>
      <DisplayCampaigns
        title="My Campaigns"
        isLoading={isLoading}
        campaigns={userCampaigns}
      />

      {/* Leaderboard for top donors */}
      <div className="bg-[#1c1c24] p-6 rounded-xl mt-6">
        <h2 className="text-xl font-bold mb-4">Top Donors for Your Campaigns</h2>
        {userCampaigns.map((c, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="text-lg font-semibold">{c.title} {c.verified && "(Verified)"}</h3>
            <TopDonors pId={c.pId} getTopDonors={getTopDonors} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TopDonors = ({ pId, getTopDonors }) => {
  const [donors, setDonors] = useState([]);

  useEffect(() => { getTopDonors(pId).then(setDonors); }, [pId]);

  if(donors.length === 0) return <p>No donations yet</p>;

  return (
    <ul className="list-decimal ml-6">
      {donors.map((d, i) => (
        <li key={i} className="text-sm text-[#b2b3bd]">
          {d.donator} – {d.donation} ETH
        </li>
      ))}
    </ul>
  );
};

export default Dashboard;
