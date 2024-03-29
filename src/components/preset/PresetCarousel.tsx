import * as React from "react";
import { FC } from "react";
import "../../css/presets.css";
import { db } from "../../db/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  query,
  deleteDoc,
  getDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";

import { useState, useEffect } from "react";

import Divider from "@mui/material/Divider";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Exercise } from "../workout/WorkoutScreen";

import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

export interface Props {
  presetToDisplayId: string | undefined;
}

export const PresetCarousel: FC<Props> = ({ presetToDisplayId }) => {
  const [presetExercises, setPresetExercises] = useState<Exercise[] | null>(
    null
  );
  const getPresetExercises = async () => {
    if (presetToDisplayId !== "") {
      const email = localStorage.getItem("user_email");
      const exercisesRef = collection(
        db,
        "users/" + email + "/presets/" + presetToDisplayId + "/exercises"
      );
      const exercisesQuery = query(exercisesRef, orderBy("rank", "asc"));
      const data = await getDocs(exercisesQuery);

      setPresetExercises(
        data.docs.map((doc) => ({
          id: doc.id,
          rank: doc.data().rank,
          name: doc.data().name,
          type: doc.data().type,
          isWeighted: doc.data().isWeighted,
          weight: doc.data().weight,
          repsCount: doc.data().repsCount,
          seriesCount: doc.data().seriesCount,
          note: doc.data().note,
        }))
      );
    }
  };

  useEffect(() => {
    getPresetExercises();
  }, []);

  useEffect(() => {
    getPresetExercises();
  }, [presetToDisplayId]);

  const responsive = {
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2.25,
    },
  };

  return (
    <div className="carouselWrapper">
      <div className="divider">
        <Divider />
      </div>
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {presetExercises !== null ? (
          presetExercises.map((exercise) => (
            <div
              className={`presetExerciseThumbnail ${
                exercise.rank === 0 ? "firstItem" : ""
              }`}
            >
              <div className="exerciseName">{exercise.name.toUpperCase()}</div>
              <div className="weight">
                {exercise.isWeighted === "yes" ? exercise.weight + "kg" : ""}
              </div>
              <div className="seriesReps">
                {exercise.seriesCount !== 1 ? exercise.seriesCount + "x" : ""}
                {exercise.repsCount}
                {exercise.type === "reps" ? " reps" : " sec"}
              </div>
            </div>
          ))
        ) : (
          <div>
            <ThemeProvider theme={theme}>
              <div className="loadingPreset">
                <CircularProgress size="2rem" />
              </div>
            </ThemeProvider>
          </div>
        )}
      </Carousel>
      <div className="divider">
        <Divider />
      </div>
    </div>
  );
};
