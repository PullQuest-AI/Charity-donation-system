import React, { useContext, createContext } from "react";
import { useAddress, useContract, useContractWrite, useDisconnect } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0x64871FFb9ec7c2d38fF2c451FAF16e42e53F7289");
  const address = useAddress();
  const disconnectWallet = useDisconnect();
  concontract field names to frontend-friendly keys)
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
      
      return await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount),
      });
    } catch (err) {
      console.error("donate error:", err);
      throw err;
    }
  };


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
        ,
        getTopDonors,
        disconnectWallet,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
