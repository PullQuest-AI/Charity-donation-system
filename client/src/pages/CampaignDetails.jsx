import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const { donate, getDonations, contract, address, getCampaigns, requestVerification } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [campaign, setCampaign] = useState(state);

  const remainingDays = daysLeft(campaign.deadline);

  // Fetch campaign from blockchain to get updated verified / verificationRequested
  const fetchCampaign = async () => {
    if (!contract) return;
    const allCampaigns = await getCampaigns();
    const updated = allCampaigns.find(c => c.pId === state.pId);
    if (updated) setCampaign(updated);
  };

  // Fetch donators
  const fetchDonators = async () => {
    if (!contract) return;
    const data = await getDonations(campaign.pId);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) {
      fetchCampaign();
      fetchDonators();
    
          </div>
        </div>

        {/* Right Fund Section */}
        <div className="flex-1">
          