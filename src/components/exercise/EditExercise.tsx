import * as React from 'react';
import { FC } from 'react';
import { Exercise } from '../workout/WorkoutDetail';
import '../../css/style.css'
import { useState, useEffect, useContext } from 'react';
import { createTheme, TextField, ThemeProvider, makeStyles, Menu, MenuItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';


import { db } from "../../db/firebase-config";
import { collection, updateDoc, doc } from "firebase/firestore";

import { styled } from "@mui/system";

const SmallTextField = styled(TextField, {
    name: "SmallTextField",
})({
    width: "80%",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#3FC2C4"
    },
    secondary:{
      main: "#C4413F"
    }
  },
  typography: {
    fontFamily: 'Poppins',
    fontSize: 16,
  },
  
});

export interface Props {
  exerciseId: string | undefined,
  name: string,
  type: string,
  isWeighted: string
  weight: number,
  repsCount: number,
  seriesCount: number,
  note: string,
  workoutId: string,
  closeEdit: () => void
}

export const EditExercise: FC<Props> = (
  { exerciseId, name, type, isWeighted, weight, repsCount, seriesCount, note, workoutId, closeEdit }
) => {

  const [nameInput, setNameInput] = useState<string>(name);
  const [weightInput, setWeightInput] = useState<string>(weight.toString());
  const [repsCountInput, setRepsCountInput] = useState<string>(repsCount.toString());
  const [seriesCountInput, setSeriesCountInput] = useState<string>(seriesCount.toString());

  const [nameError, setNameError] = useState({error: false, msg: ""});
  const [weightError, setWeightError] = useState({error: false, msg: ""});
  const [seriesError, setSeriesError] = useState({error: false, msg: ""});
  const [repsError, setRepsError] = useState({error: false, msg: ""});

  const validateInputs = ():boolean => {
    let valid = true;
    if(isNaN(parseInt(repsCountInput))){
      setRepsError({error: true, msg: "Enter a number."});
      valid = false;
    }
    if(isNaN(parseInt(seriesCountInput))){
      setSeriesError({error: true, msg: "Enter a number."});
      valid = false;
    }
    if(isNaN(parseInt(weightInput))){
      setWeightError({error: true, msg: "Enter a number."});
      valid = false;
    }

    if(nameInput === ""){
      setNameError({error: true, msg: "Name cannot be empty."});
      valid = false;
    }
    if(repsCountInput === ""){
      setRepsError({error: true, msg: "Field cannot be empty."});
      valid = false;
    }
    if(seriesCountInput === ""){
      setSeriesError({error: true, msg: "Field cannot be empty."});
      valid = false;
    }
    if(isWeighted === "yes" && weightInput === ""){
      setWeightError({error: true, msg: "Field cannot be empty."});
      valid = false;
    }

    return valid;
  }

  const updateExercise = async () => {
    if(validateInputs()){
      const email = localStorage.getItem("user_email");
      const docRef = doc(db, "users/" + email + "/workouts/", workoutId, "/exercises/" + exerciseId)

      await updateDoc(docRef, {
        name: nameInput,
        weight: parseInt(weightInput),
        repsCount: parseInt(repsCountInput),
        seriesCount: parseInt(seriesCountInput)
      });

      closeEdit();
    }
  }

  return (
    <ThemeProvider theme={theme}>
    <div className='exerciseThumbnail'>
      <div className='exerciseTopRow'>
        <div className='exerciseNameEdit'>
          <TextField 
            id="name" 
            label="Exercise name" 
            variant="outlined" 
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setNameError({error: false, msg: ""});
            }}
            margin="dense"
            fullWidth 
            inputProps={{
              style: {
                padding: 10
              }
            }}
            error={nameError.error ? nameError.error : false}
            helperText={nameError.error ? nameError.msg : ""}
          />
        </div>
      </div>

      <div className='exerciseInfoEdit'>
        <div className='seriesEdit'>
          {
            seriesCount !== 1
              ? <div>
                  <SmallTextField 
                    id="seriesCount" 
                    label="Series" 
                    variant="outlined" 
                    value={seriesCountInput}
                    onChange={(e) => {
                      setSeriesCountInput(e.target.value);
                      setSeriesError({error: false, msg: ""});
                    }}
                    margin="dense"
                    inputProps={{
                      style: {
                        padding: 10
                      }
                    }}
                    error={seriesError.error ? seriesError.error : false}
                    helperText={seriesError.error ? seriesError.msg : ""}
                  />
                </div>
              : ""
          }
        </div>
        <div className='repsEdit'>
          {
            <SmallTextField 
              id="repsCount" 
              label={type === "reps" ? "Reps" : "Seconds"}
              variant="outlined" 
              value={repsCountInput}
              onChange={(e) => {
                setRepsCountInput(e.target.value);
                setRepsError({error: false, msg: ""});
              }}
              margin="dense"
              inputProps={{
                style: {
                  padding: 10
                }
              }}
              error={repsError.error ? repsError.error : false}
              helperText={repsError.error ? repsError.msg : ""}
            />
          }
        </div>
        <div className='weightEdit'>
          {
            isWeighted === "yes"
              ? <SmallTextField 
                  id="weight" 
                  label="Weight"
                  variant="outlined"
                  value={weightInput}
                  onChange={(e) => {
                    setWeightInput(e.target.value);
                    setWeightError({error: false, msg: ""});
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  margin="dense"
                  inputProps={{
                    style: {
                      padding: 10
                    }
                  }}
                  error={weightError.error ? weightError.error : false}
                  helperText={weightError.error ? weightError.msg : ""}
                />
              : ""
          }
        </div>
      </div>
      <div className='editControls'>
        <Button
          variant="text" 
          sx={{color: '#C4413F', fontSize: 16, fontWeight: 600}}
          onClick={closeEdit}
        >
          CLOSE
        </Button>
        <Button
          variant="text" 
          sx={{color: 'primary', fontSize: 16, fontWeight: 600}}
          onClick={updateExercise}
        >
          SAVE
        </Button>
        
      </div>
    </div>
    </ThemeProvider>
    
  );
}
