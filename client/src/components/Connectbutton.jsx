// components/Navbar.jsx
import React from "react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function Connectbutton() {
  const address = useAddress();

  return (

    
      <div>
        <ConnectWallet

      </div>

  );
}
