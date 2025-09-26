import React, { useContext, createContext } from "react";
import { useAddress, useContract, useContractWrite, useDisconnect } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0x64871FFb9ec7c2d38fF2c451FAF16e42e53F7289");
  const address = useAddress();
  const disconnectWallet = useDisconnect();
  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");

  // Publish a new campaign
  const publishCampaign = async (form) => {
    try {
      if (!contract) throw new Error("Contract is not loaded");
      if (!address) throw new Error("Wallet not connected");

      await createCampaign({
        args: [
          address,
          form.title,
          form.description,
          ethers.utils.parseEther(form.target.toString()),
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
    } catch (error) {
      console.error("Publish campaign error:", error);
      throw error;
    }
  };

  // Get all campaigns (map contract field names to frontend-friendly keys)
  const getCampaigns = async () => {
    if (!contract) return [];
    try {
      const campaigns = await contract.call("getCampaigns");
      return campaigns.map((c, i) => ({
        owner: c.owner,
        title: c.title,
        description: c.description,
        target: ethers.utils.formatEther(c.target.toString()),
        deadline: c.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(c.amountCollected.toString()),
        image: c.image,
        pId: i,
        // IMPORTANT: map solidity flag name to `verificationRequested` expected by frontend
        verified: c.verified,
        verificationRequested: c.verificationRequestedFlag,
      }));
    } catch (err) {
      console.error("getCampaigns error:", err);
      return [];
    }
  };

  // Get campaigns created by the connected user (safe lowercase compare)
  const getUserCampaigns = async () => {
    const all = await getCampaigns();
    if (!address) return [];
    return all.filter((c) => c.owner?.toLowerCase() === address?.toLowerCase());
  };

  // Donate to a campaign
  const donate = async (pId, amount) => {
    if (!contract) throw new Error("Contract not loaded");
    try {
      return await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount),
      });
    } catch (err) {
      console.error("donate error:", err);
      throw err;
    }
  };

  // Get all donations of a specific campaign
  const getDonations = async (pId) => {
    if (!contract) return [];
    try {
      const donations = await contract.call("getDonators", [pId]);
      // donations = [address[], uint256[]]
      return donations[0].map((donator, i) => ({
        donator,
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      }));
    } catch (err) {
      console.error("getDonations error:", err);
      return [];
    }
  };

  // Get all donations made by the connected user (merge with campaign info)
  const getUserDonations = async () => {
    try {
      const all = await getCampaigns();
      const userDonations = [];
      for (let campaign of all) {
        const donations = await getDonations(campaign.pId);
        donations.forEach((d) => {
          if (d.donator?.toLowerCase() === address?.toLowerCase()) {
            userDonations.push({
              ...campaign,
              donatedAmount: d.donation,
            });
          }
        });
      }
      return userDonations;
    } catch (err) {
      console.error("getUserDonations error:", err);
      return [];
    }
  };

  // Request campaign verification
  const requestVerification = async (pId) => {
    if (!contract) throw new Error("Contract not loaded");
    try {
      return await contract.call("requestVerification", [pId]);
    } catch (err) {
      console.error("requestVerification error:", err);
      throw err;
    }
  };

  // Get top donors for a campaign (max 5)
  const getTopDonors = async (pId) => {
    try {
      const donations = await getDonations(pId);
      return donations
        .sort((a, b) => parseFloat(b.donation) - parseFloat(a.donation))
        .slice(0, 5);
    } catch (err) {
      console.error("getTopDonors error:", err);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getUserDonations,
        requestVerification,
        getTopDonors,
        disconnectWallet,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
