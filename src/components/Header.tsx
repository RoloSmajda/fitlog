import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import '../css/style.css'
import { signInGoogle } from '../db/firebase-config'
import { UserContext } from '../db/UserContext';

import { User } from '../App';

import { db } from "../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, orderBy } from "firebase/firestore";

import { Link, useNavigate } from "react-router-dom";

import logo from '../img/fitlog_logo02.png'


export interface Props {
}

export function Header (props: Props) {
  const {user, setUser} = useContext(UserContext);


  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async () => {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef);
    const data = await getDocs(usersQuery);

    setUsers(data.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email, 
      photoUrl: doc.data().photoUrl
    })));
    

  }
  const addNewUser = async(newUser: User) => {
    getUsers();
    if(!users.some(obj => obj.id === newUser.email)){
      await setDoc(doc(db, "users", newUser.email), newUser, {merge: true});
      //await addDoc(collection(db, "users"), newUser);
    }
  }

  const handleSignIn = async () => {
    let result = await signInGoogle();

    const name = result.user.displayName;
    const email = result.user.email;
    const photoUrl = result.user.photoURL;

    if(name !== null && email !== null && photoUrl !== null){
      localStorage.setItem("user_name", name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_photo_url", photoUrl);

      let user: User = {
        name: name,
        email: email,
        photoUrl: photoUrl
      }

      setUser(user);
      addNewUser(user);
      getUsers();
    }

  }
  const handleLogOut = () => {
    localStorage.clear();
    setUser({
      name:  "",
      email: "",
      photoUrl: "",
    },);
  }
  const handlePageRefreshSignIn = () => {
    if(localStorage.getItem("user_name") !== null){
      const name = localStorage.getItem("user_name");
      const email = localStorage.getItem("user_email");
      const photoUrl = localStorage.getItem("user_photo_url");
      
      if(name !== null && email !== null && photoUrl !== null){
        let user: User = {
          name: name,
          email: email,
          photoUrl: photoUrl
        }
  
        setUser(user);
      }

    }
  }

  const getFirstName = () => {
    const words = user.name.split(" ");
    return words[0];
  }

  useEffect(() => {
    handlePageRefreshSignIn();
    getUsers();

  }, []);

  return (
    <div className='header'>
      <div className='headerRow'>
        <div className='appLogo'>
          <img src={logo} alt="" />
        </div>
        {
          user.name === "" 
            ? <div className='logIn'>
                <span onClick={handleSignIn}>
                  Log in
                </span> 
              </div>
            : <div className='userImg'>
                <img src={user.photoUrl} alt="user_pic" />
              </div>
        }
        
      </div>

      {
        user.name === "" 
          ? <></>
          : <div className='userInfo'>
              <span className="material-symbols-outlined logOut" onClick={handleLogOut}>
                logout
              </span>
              <div className='userGreeting'>
                <div>
                  Hello
                </div>
                <div>
                  {getFirstName()}
                </div>
              </div>
            </div>
      }
      
      
      {/* <div>
        {
          user.name === "" 
            ? <button onClick={handleSignIn}>
                SignIn
              </button> 
            : <div>{user.name} <button onClick={handleLogOut}>LOG OUT</button> </div>
        }
      </div> */}
    </div>
  );
}
