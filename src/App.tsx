import React from "react";
import "./css/App.css";
import { useEffect, useState, useContext } from "react";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WorkoutDetail } from "./components/workout/WorkoutDetail";

import { UserContext } from "./db/UserContext";
import { LoginScreen } from "./components/LoginScreen";
import { signInGoogle } from "./db/firebase-config";

import { db } from "./db/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { MainScreen } from "./components/MainScreen";

export type User = {
  id?: string;
  name: string;
  email: string;
  photoUrl: string;
};

function App() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photoUrl: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async () => {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef);
    const data = await getDocs(usersQuery);

    setUsers(
      data.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        photoUrl: doc.data().photoUrl,
      }))
    );
  };

  const createNewUserInDB = async (newUser: User) => {
    getUsers();
    if (!users.some((obj) => obj.id === newUser.email)) {
      await setDoc(doc(db, "users", newUser.email), newUser, { merge: true });
    }
  };

  const handleSignIn = async () => {
    let result = await signInGoogle();

    const name = result.user.displayName;
    const email = result.user.email;
    const photoUrl = result.user.photoURL;

    if (name !== null && email !== null && photoUrl !== null) {
      localStorage.setItem("user_name", name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_photo_url", photoUrl);

      let user: User = {
        name: name,
        email: email,
        photoUrl: photoUrl,
      };

      setUser(user);
      createNewUserInDB(user);
      getUsers();
    }
  };

  const handleLogOut = () => {
    localStorage.clear();
    setUser({
      name: "",
      email: "",
      photoUrl: "",
    });
  };

  const handlePageRefreshSignIn = () => {
    if (localStorage.getItem("user_name") !== null) {
      const name = localStorage.getItem("user_name");
      const email = localStorage.getItem("user_email");
      const photoUrl = localStorage.getItem("user_photo_url");

      if (name !== null && email !== null && photoUrl !== null) {
        let user: User = {
          name: name,
          email: email,
          photoUrl: photoUrl,
        };

        setUser(user);
      }
    }
  };

  useEffect(() => {
    handlePageRefreshSignIn();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        handleSignIn,
        handleLogOut,
        handlePageRefreshSignIn,
      }}
    >
      <Router>
        {user.name === "" ? (
          <Routes>
            <Route path="/fitlog" element={<LoginScreen />} />
            <Route path="/" element={<Navigate to="/fitlog" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/fitlog" element={<MainScreen />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/" element={<Navigate to="/fitlog" />} />
          </Routes>
        )}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
