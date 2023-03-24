import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

import "../css/style.css";
import { WorkoutList } from "./workout/WorkoutList";

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
  Timestamp,
} from "firebase/firestore";
import { Header } from "./Header";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Fab } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3FC2C4",
    },
    secondary: {
      main: "#FDFDFD",
    },
  },
});

type Workout = {
  id: string;
  date: string;
  duration: string;
};

export interface Props {}
export function MainScreen(props: Props) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  const parseDate = (date: Timestamp) => {
    return date
      .toDate()
      .toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  };

  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const getWorkouts = async () => {
    if (user.email !== "") {
      const workoutsRef = collection(db, "users/" + user.email + "/workouts");
      const workoutsQuery = query(workoutsRef, orderBy("date", "desc"));

      const data = await getDocs(workoutsQuery);

      setWorkouts(
        data.docs.map((doc) => ({
          id: doc.id,
          date: parseDate(doc.data().date),
          duration: doc.data().duration,
        }))
      );
    }
  };

  const addWorkout = async () => {
    const newWorkout = {
      date: Timestamp.now(),
    };

    const workoutRef = collection(db, "users/" + user.email + "/workouts");
    const ref = await addDoc(workoutRef, newWorkout);

    navigate("/workout/" + ref.id);

    getWorkouts();
  };

  useEffect(() => {
    getUsers();
    getWorkouts();
  }, [user]);

  useEffect(() => {
    getUsers();
    getWorkouts();
  }, []);

  return (
    <div className="main">
      <Header />

      {workouts ? (
        <div className="workoutList">
          <WorkoutList list={workouts} />
          <div className="addButton">
            <ThemeProvider theme={theme}>
              <Fab
                color="primary"
                style={{ width: "4rem", height: "4rem" }}
                aria-label="add"
                onClick={addWorkout}
              >
                <AddIcon
                  color="secondary"
                  style={{ width: "2rem", height: "2rem" }}
                />
              </Fab>
            </ThemeProvider>
          </div>
        </div>
      ) : (
        <ThemeProvider theme={theme}>
          <div className="loading">
            <CircularProgress size="4rem" />
            <span>Loading workouts...</span>
          </div>
        </ThemeProvider>
      )}
    </div>
  );
}
