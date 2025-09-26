import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./FundCard";
import { loader } from "../assets";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-4">
        <h1 className="font-epilogue font-semibold text-[24px] text-white text-left">
          {title} ({filteredCampaigns.length})
        </h1>

        <div className="relative w-full max-w-[458px]">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-12 pr-4 h-[52px] bg-[#1c1c24] rounded-full text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#1dc071] shadow-md placeholder:text-[#818183] transition-all duration-200"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1dc071]">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="2" stroke="currentColor" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && filteredCampaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns found
          </p>
        )}

        {!isLoading &&
          filteredCampaigns.length > 0 &&
          filteredCampaigns.map((campaign) => (
            <FundCard
              key={uuidv4()}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            >
              {campaign.verified && (
                <span className="ml-2 px-2 py-1 text-xs bg-yellow-500 text-black rounded-full">
                  Verified
                </span>
              )}
            </FundCard>
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
