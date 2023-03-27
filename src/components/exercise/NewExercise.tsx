import * as React from "react";
import { FC } from "react";
import { useState, useEffect, useContext } from "react";
import { Exercise } from "../workout/WorkoutScreen";

import { db } from "../../db/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { UserContext } from "../../db/UserContext";
import { Modal } from "../tools/Modal";

import { useParams } from "react-router-dom";
import {
  createTheme,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  ThemeProvider,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3FC2C4",
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
});

export interface Props {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  getExercises: () => void;
  exercisesCount: number;
}

export const NewExercise: FC<Props> = ({
  isOpen,
  openModal,
  closeModal,
  getExercises,
  exercisesCount,
}) => {
  let { id } = useParams();
  const { user } = useContext(UserContext);

  //Exercise name
  const [exerciseName, setExerciseName] = useState<string>("");

  //Exercise radios
  const [exerciseType, setExerciseType] = useState<string>("reps");
  const [exerciseWeighted, setExerciseWeighted] = useState<string>("yes");

  //units - reps or sec
  const [exerciseUnits, setExerciseUnits] = useState<string>("");

  //exercise weight
  const [exerciseWeight, setExerciseWeight] = useState<string>("");

  const [seriesCount, setSeriesCount] = useState<string>("");

  const [note, setNote] = useState<string>("");

  const [nameError, setNameError] = useState({ error: false, msg: "" });
  const [weightError, setWeightError] = useState({ error: false, msg: "" });
  const [seriesError, setSeriesError] = useState({ error: false, msg: "" });
  const [repsError, setRepsError] = useState({ error: false, msg: "" });

  const validateInputs = (): boolean => {
    let valid = true;

    if (exerciseWeighted === "no") {
      setExerciseWeight("0");
    }

    if (isNaN(parseInt(exerciseUnits))) {
      setRepsError({ error: true, msg: "" });
      valid = false;
    }
    if (isNaN(parseInt(seriesCount))) {
      setSeriesError({ error: true, msg: "" });
      valid = false;
    }
    if (isNaN(parseInt(exerciseWeight))) {
      setWeightError({ error: true, msg: "" });
      valid = false;
    }

    if (exerciseName === "") {
      setNameError({ error: true, msg: "" });
      valid = false;
    }
    if (exerciseUnits === "") {
      setRepsError({ error: true, msg: "" });
      valid = false;
    }
    if (seriesCount === "") {
      setSeriesError({ error: true, msg: "" });
      valid = false;
    }
    if (exerciseWeighted === "yes" && exerciseWeight === "") {
      setWeightError({ error: true, msg: "" });
      valid = false;
    }

    console.log(exerciseWeighted, exerciseWeight);

    return valid;
  };

  const addExercise = async () => {
    if (validateInputs()) {
      const newExercise: Exercise = {
        rank: exercisesCount,
        name: exerciseName,
        type: exerciseType,
        isWeighted: exerciseWeighted,
        weight: parseInt(exerciseWeight),
        repsCount: parseInt(exerciseUnits),
        seriesCount: parseInt(seriesCount),
        note: note,
      };
      const email = localStorage.getItem("user_email");
      const exerciseRef = collection(
        db,
        "users/" + email + "/workouts/" + id + "/exercises"
      );
      await addDoc(exerciseRef, newExercise);
      getExercises();

      setExerciseName("");
      setExerciseWeight("");
      setExerciseUnits("");
      setSeriesCount("");
      setNote("");

      setExerciseType("reps");
      setExerciseWeighted("yes");
      closeModal();
    }
  };

  return (
    <div className="newExercise">
      <button
        onClick={openModal}
        className="bg-teal px-16 py-3 text-2xl  text-smokewhite font-poppins mb-8 mt-4 rounded-3xl"
      >
        Add exercise
      </button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ThemeProvider theme={theme}>
          <div className="flex flex-col">
            <TextField
              id="name"
              label="Exercise name"
              variant="outlined"
              value={exerciseName}
              onChange={(e) => {
                setExerciseName(e.target.value);
                setNameError({ error: false, msg: "" });
              }}
              error={nameError.error ? nameError.error : false}
              helperText={nameError.error ? nameError.msg : ""}
            />

            <div className="flex flex-row">
              <FormControl>
                <FormLabel>Type</FormLabel>
                <RadioGroup
                  row
                  value={exerciseType}
                  onChange={(e) => {
                    setExerciseType(e.target.value);
                    if (e.target.value == "timed") {
                      setSeriesCount("1");
                    } else {
                      setSeriesCount("");
                    }
                  }}
                >
                  <FormControlLabel
                    value="reps"
                    control={<Radio />}
                    label="Reps"
                  />
                  <FormControlLabel
                    value="timed"
                    control={<Radio />}
                    label="Timed"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="flex flex-row justify-between">
              <FormControl className="w-screen">
                <FormLabel>Weight</FormLabel>
                <RadioGroup
                  row
                  value={exerciseWeighted}
                  onChange={(e) => {
                    setExerciseWeighted(e.target.value);
                    if (e.target.value === "no") {
                      setExerciseWeight("0");
                    } else {
                      setExerciseWeight("");
                    }
                  }}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              {exerciseWeighted === "yes" ? (
                <div className="w-48">
                  <TextField
                    id="weight"
                    label=""
                    variant="outlined"
                    value={exerciseWeight}
                    onChange={(e) => {
                      setExerciseWeight(e.target.value);
                      setWeightError({ error: false, msg: "" });
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                    }}
                    margin="dense"
                    error={weightError.error ? weightError.error : false}
                    helperText={weightError.error ? weightError.msg : ""}
                  />
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="row">
              <TextField
                sx={{ width: "48%" }}
                id="units"
                label="Series"
                variant="outlined"
                value={seriesCount}
                onChange={(e) => {
                  setSeriesCount(e.target.value);
                  setSeriesError({ error: false, msg: "" });
                }}
                margin="dense"
                error={seriesError.error ? seriesError.error : false}
                helperText={seriesError.error ? seriesError.msg : ""}
              />

              <TextField
                sx={{ width: "48%" }}
                id="units"
                label={exerciseType === "reps" ? "Reps" : "Seconds"}
                variant="outlined"
                value={exerciseUnits}
                onChange={(e) => {
                  setExerciseUnits(e.target.value);
                  setRepsError({ error: false, msg: "" });
                }}
                margin="dense"
                error={repsError.error ? repsError.error : false}
                helperText={repsError.error ? repsError.msg : ""}
              />
            </div>

            {/* <TextField
              multiline
              id="note"
              label="Note"
              variant="outlined"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              margin="dense"
            /> */}

            <div className="modalControls">
              <ThemeProvider theme={theme}>
                <Button
                  variant="text"
                  sx={{ color: "#C4413F", fontSize: 16, fontWeight: 900 }}
                  onClick={closeModal}
                  className="closeBtn"
                >
                  CLOSE
                </Button>
                <Button
                  variant="text"
                  sx={{ fontSize: 16, fontWeight: 900 }}
                  onClick={addExercise}
                  className="addBtn"
                >
                  ADD
                </Button>
              </ThemeProvider>
            </div>
          </div>
        </ThemeProvider>
      </Modal>
    </div>
  );
};
