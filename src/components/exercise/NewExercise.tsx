import * as React from 'react';
import { FC } from 'react';
import { useState, useEffect, useContext } from 'react';
import { Exercise } from '../workout/WorkoutDetail';

import { db } from "../../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, orderBy } from "firebase/firestore";

import { UserContext } from '../../db/UserContext';
import { Modal } from '../tools/Modal';

import { useParams } from "react-router-dom";
import { createTheme, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, ThemeProvider } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

const theme = createTheme({
  palette:{
    primary: {
      main: "#3FC2C4"
    },
  },
  typography:{
    fontSize: 18,
    
  }
});

export interface Props {
  isOpen: boolean,
  openModal: () => void,
  closeModal: () => void,
  getExercises: () => void,
  exercisesCount: number
}

export const NewExercise: FC<Props> = ({ isOpen, openModal, closeModal, getExercises, exercisesCount }) => {
  let { id } = useParams();
  const { user, setUser } = useContext(UserContext);

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

  const addExercise = async () => {
    if ((exerciseName === "" || exerciseUnits === "" || seriesCount === "") && (exerciseWeighted === "yes" && exerciseWeight === "")) {
      console.log("NO EMPTY FIELDS");

    } else {
      const newExercise: Exercise = {
        rank: exercisesCount,
        name: exerciseName,
        type: exerciseType,
        isWeighted: exerciseWeighted,
        weight: parseInt(exerciseWeight),
        repsCount: parseInt(exerciseUnits),
        seriesCount: parseInt(seriesCount),
        note: note,
      }
      const email = localStorage.getItem("user_email");
      const exerciseRef = collection(db, "users/" + email + "/workouts/" + id + "/exercises");
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


  }

  return (
    <div className='newExercise'>
      <button onClick={openModal} className='btn'>
        Add exercise
      </button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ThemeProvider theme={theme}>
        <TextField 
          id="name" 
          label="Exercise name" 
          variant="outlined" 
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />

        <div className='row'>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <RadioGroup 
            row
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
          >
            <FormControlLabel value="reps" control={<Radio/>} label="Reps"/>
            <FormControlLabel value="timed" control={<Radio/>} label="Timed"/>
          </RadioGroup>
        </FormControl>
        </div>

        
        <div className='row'>
          <FormControl>
          <FormLabel>Weight</FormLabel>
            <RadioGroup 
              row
              value={exerciseWeighted}
              onChange={(e) => setExerciseWeighted(e.target.value)}
              
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio/>} label="No"/>
            </RadioGroup>
          </FormControl>
          {
            exerciseWeighted === "yes"
            ? <TextField 
              sx={{width: '48%'}}
              id="weight" 
              label="Weight"
              variant="outlined"
              value={exerciseWeight}
              onChange={(e) => setExerciseWeight(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              margin="dense"
            />
            
            : ""
          }
        </div>
        
        <div className='row'>
          <TextField 
            sx={{width: '48%'}}
            id="units" 
            label="Series"
            variant="outlined" 
            value={seriesCount}
            onChange={(e) => setSeriesCount(e.target.value)}
            margin="dense"
          />
          
          <TextField 
            sx={{width: '48%'}}
            id="units" 
            label={exerciseType === "reps" ? "Reps" : "Seconds"}
            variant="outlined" 
            value={exerciseUnits}
            onChange={(e) => setExerciseUnits(e.target.value)}
            margin="dense"
          />
        </div>

        <TextField 
          multiline
          id="note" 
          label="Note"
          variant="outlined" 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          margin="dense"
        />

        <div className='modalControls'>
          <span className='closeBtn' onClick={closeModal}>CLOSE</span>
          <span className='addBtn' onClick={addExercise}>ADD</span>
        </div>
        </ThemeProvider>
      </Modal>
    </div>
  );
}
