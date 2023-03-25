import * as React from "react";
import { useEffect, useState, useContext } from "react";
import "../css/style.css";
import { signInGoogle } from "../db/firebase-config";
import { UserContext } from "../db/UserContext";

import { User } from "../App";

import { db } from "../db/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { Link, useNavigate } from "react-router-dom";

import logo from "../img/fitlog_logo02.png";
import { createTheme, TextField, ThemeProvider, Button } from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3FC2C4",
    },
  },
  typography: {
    fontFamily: "Poppins",
    fontSize: 20,
  },
});

export interface Props {}

export function Header(props: Props) {
  const { user, handleLogOut, handlePageRefreshSignIn } =
    useContext(UserContext);

  const getFirstName = () => {
    const words = user.name.split(" ");
    return words[0];
  };

  useEffect(() => {
    handlePageRefreshSignIn();
    //getUsers();
  }, []);

  return (
    <div className="header">
      <div className="headerRow">
        <div className="appLogo">
          <img src={logo} alt="" />
        </div>
        <div className="userImg">
          <img src={user.photoUrl} alt="user_pic" />
        </div>
      </div>

      <div className="flex flex-row justify-between items-end mt-4">
        <button onClick={handleLogOut}>
          <ThemeProvider theme={theme}>
            <LogoutIcon fontSize="large" className="text-gray-400" />
          </ThemeProvider>
        </button>
        <div className="userGreeting">
          <div>Hello</div>
          <div>{getFirstName()}</div>
        </div>
      </div>
    </div>
  );
}
