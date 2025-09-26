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
    }
  }, [contract, address]);

  // Donate
  const handleDonate = async () => {
    try {
      setIsLoading(true);
      await donate(campaign.pId, amount);
      await fetchCampaign();
      await fetchDonators();
      setAmount('');
      alert('Donation successful!');
    } catch (err) {
      console.error(err);
      alert('Donation failed!');
    } finally {
      setIsLoading(false);
    }
  };

  // Request verification
  const handleRequestVerification = async () => {
    try {
      setIsVerifying(true);
      await requestVerification(campaign.pId);
      await fetchCampaign();
      alert('Verification requested!');
    } catch (err) {
      alert(err?.data?.message || err.message || 'Error requesting verification');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 overflow-x-hidden">
      {isLoading && <Loader />}

      {/* Top Section */}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-6">
        {/* Campaign Image + Progress Bar */}
        <div className="flex-1 flex-col">
          <img
            src={campaign.image}
            alt="campaign"
            className="w-full max-h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2 rounded">
            <div
              className="absolute h-full bg-[#4acd8d] rounded"
              style={{
                width: `${calculateBarPercentage(campaign.target, campaign.amountCollected)}%`,
                maxWidth: '100%',
              }}
            />
          </div>
        </div>

        {/* Count Boxes */}
        <div className="flex md:w-[180px] w-full flex-wrap justify-between gap-4">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${campaign.target}`} value={campaign.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      {/* Verified / Request Verification */}
      <div className="mt-4 flex items-center gap-4">
        {campaign.verified && (
          <span className="px-2 py-1 bg-yellow-500 text-black rounded-full">Verified</span>
        )}
        {!campaign.verified && !campaign.verificationRequested && address === campaign.owner && (
          <CustomButton
            btnType="button"
            title="Request Verification"
            styles="bg-yellow-500 text-black"
            handleClick={handleRequestVerification}
            disabled={isVerifying}
          />
        )}
        {!campaign.verified && campaign.verificationRequested && (
          <span className="px-2 py-1 bg-gray-500 text-black rounded-full">Requested</span>
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-10 flex lg:flex-row flex-col gap-8">
        {/* Left Content */}
        <div className="flex-[2] flex flex-col gap-10">
          {/* Creator */}
          <div>
            <h4 className="font-epilogue font-semibold text-lg text-white uppercase">Creator</h4>
            <div className="mt-5 flex flex-row items-center flex-wrap gap-4">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div className="min-w-0">
                <h4 className="font-epilogue font-semibold text-sm text-white break-words">{campaign.owner}</h4>
                <p className="mt-1 font-epilogue font-normal text-xs text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div>
            <h4 className="font-epilogue font-semibold text-lg text-white uppercase">Story</h4>
            <div className="mt-5">
              <p className="font-epilogue font-normal text-base text-[#808191] leading-6 text-justify break-words">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Donators */}
          <div>
            <h4 className="font-epilogue font-semibold text-lg text-white uppercase">Donators</h4>
            <div className="mt-5 flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div
                  key={`${item.donator}-${index}`}
                  className="flex justify-between items-center gap-4 flex-wrap"
                >
                  <p className="font-epilogue font-normal text-base text-[#b2b3bd] leading-6 break-all">
                    {index + 1}. {item.donator}
                  </p>
                  <p className="font-epilogue font-normal text-base text-[#808191] leading-6 break-words">
                    {item.donation} ETH
                  </p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-base text-[#808191] leading-6 text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Fund Section */}
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-lg text-white uppercase">Fund</h4>
          <div className="mt-5 flex flex-col p-4 bg-[#1c1c24] rounded-lg">
            <p className="font-epilogue font-medium text-xl text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-6">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-2 sm:px-4 px-3 outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-lg placeholder:text-[#4b5264] rounded-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="my-5 p-4 bg-[#13131a] rounded-lg">
                <h4 className="font-epilogue font-semibold text-sm text-white">Back it because you believe in it.</h4>
                <p className="mt-3 font-epilogue font-normal text-sm text-[#808191]">
                  Support the project for no reward, just because it speaks to you.
                </p>
              </div>
              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
