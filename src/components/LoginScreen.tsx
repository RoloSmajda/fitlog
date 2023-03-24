import React from "react";
import { FC } from "react";
import { UserContext } from "../db/UserContext";
import { useEffect, useState, useContext } from "react";
import "../css/App.css";

import logo from "../img/fitlog_logo02.png";
import googleIcon from "../img/google.svg";

type Props = {};

export const LoginScreen: FC<Props> = () => {
  const { handleSignIn } = useContext(UserContext);
  return (
    <div className="flex flex-col h-full text-charcoalgray">
      <div className="h-80 flex flex-col justify-center items-center">
        <img className="w-80" src={logo} alt="" />
      </div>

      <div className="h-full flex flex-col justify-between items-center text-center">
        <div>
          <div className="font-bold text-2xl font-poppins">
            Welcome to FitLog
          </div>
          <div className="text-xl font-poppins">Stay on track, get fit.</div>
        </div>
        <div>
          <div className="font-poppins font-semibold text-xl mb-2">Sign In</div>
          <button
            className="bg-teal px-16 py-3 text-2xl  text-smokewhite font-poppins mb-16 rounded-3xl"
            onClick={handleSignIn}
          >
            <div className="flex flex-row justify-between items-center">
              <img src={googleIcon} alt="" className="h-6 mr-3" />{" "}
              <div>Google</div>
            </div>
          </button>
        </div>
        <div className="mb-8 font-poppins">Roland Šmajda © 2023</div>
      </div>
    </div>
  );
};
