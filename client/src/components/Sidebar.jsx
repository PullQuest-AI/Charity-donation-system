import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { logo, sun } from "../assets";
import { navlinks } from "../constants";
import { useStateContext } from "../context";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-[#2c2f32]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disconnectWallet } = useStateContext();

  // Find the active link based on current pathname
  const activeLink = navlinks.find((link) => link.link === location.pathname);
  const isActive = activeLink ? activeLink.name : "";

  const handleLogout = () => {
    disconnectWallet();
    window.location.reload(); // Reset UI and address
  };

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <div className="w-[52px] h-[52px] rounded-[10px] bg-[#1dc071] flex justify-center items-center cursor-pointer">
          <img src={logo} alt="HeartChain Logo" width={56} height={56} />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) =>
            link.name === "logout" ? (
              <Icon
                key={link.name}
                styles={isActive === link.name ? "bg-[#2c2f32]" : ""}
                name={link.name}
                imgUrl={link.imgUrl}
                isActive={isActive}
                disabled={false}
                handleClick={handleLogout}
              />
            ) : (
              <Icon
                key={link.name}
                {...link}
                isActive={isActive}
                handleClick={() => {
                  if (!link.disabled) {
                    navigate(link.link);
                  }
                }}
              />
            )
          )}
        </div>

        {/* <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} /> */}
      </div>
    </div>
  );
};

export default Sidebar;
