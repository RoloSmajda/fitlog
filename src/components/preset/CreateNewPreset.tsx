import * as React from "react";
import { FC } from "react";
import "../../css/modal.css";
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
import { Exercise } from "../workout/WorkoutScreen";
import { Button, MenuItem } from "@mui/material";

import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";

import { createTheme, TextField, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3FC2C4",
    },
  },
  typography: {
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
  },
});

export type Preset = {
  id?: string;
  presetName: string;
  workoutId: string;
};

export interface Props {
  exercises: Exercise[] | null;
  closeMenu: () => void;
  workoutId: string | undefined;
}

export const CreateNewPreset: FC<Props> = ({
  exercises,
  closeMenu,
  workoutId,
}) => {
  const [newPresetName, setNewPresetName] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [presets, setPresets] = useState<Preset[] | null>(null);
  const getPresets = async () => {
    const email = localStorage.getItem("user_email");
    const exercisesQuery = query(collection(db, "users/" + email + "/presets"));
    const data = await getDocs(exercisesQuery);

    setPresets(
      data.docs.map((doc) => ({
        id: doc.id,
        presetName: doc.data().presetName,
        workoutId: doc.data().workoutId,
      }))
    );
  };

  const saveExercicesAsPreset = async () => {
    const email = localStorage.getItem("user_email");

    if (newPresetName === "") {
      console.log("no empty Input");
      return;
    }

    if (
      presets !== null &&
      presets.some((preset) => preset.workoutId === workoutId)
    ) {
      console.log("preset exists");
    } else {
      if (exercises !== null && exercises.length > 0) {
        const docRef = await addDoc(
          collection(db, "users/" + email + "/presets"),
          {
            presetName: newPresetName,
            workoutId: workoutId,
          }
        );

        for (const exercise of exercises) {
          await addDoc(
            collection(
              db,
              "users/" + email + "/presets/" + docRef.id + "/exercises"
            ),
            exercise
          );
        }
        console.log("Preset saved");
      } else {
        console.log("No exercises in thi workout to save as a preset");
      }
    }

    closeMenu();
  };

  useEffect(() => {
    getPresets();
  }, []);

  return (
    <>
      <MenuItem
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Save as preset
      </MenuItem>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <ThemeProvider theme={theme}>
            <TextField
              id="presetName"
              label="Preset name"
              variant="outlined"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
            />
          </ThemeProvider>
          <div className="modalControls">
            <ThemeProvider theme={theme}>
              <Button
                variant="text"
                sx={{ color: "#C4413F", fontSize: 16, fontWeight: 900 }}
                onClick={() => {
                  setModalOpen(false);
                }}
                className="closeBtn"
              >
                CLOSE
              </Button>
              <Button
                variant="text"
                sx={{ fontSize: 16, fontWeight: 900 }}
                onClick={saveExercicesAsPreset}
                className="addBtn"
              >
                SAVE
              </Button>
            </ThemeProvider>
          </div>
        </div>
      </Modal>
    </>
  );
};
