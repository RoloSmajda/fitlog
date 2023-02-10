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
  }
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

  const updateExercise = async () => {
    if(nameInput === ""){
      console.log("NAME EMPTY");
      return;
    }
    if(repsCountInput === ""){
      console.log("UNITS EMPTY");
      return;
    }
    if(isWeighted === "yes" && weightInput === ""){
      console.log("WEIGHT EMPTY");
      return;
    }
    if(seriesCountInput === ""){
      console.log("SERIES EMPTY");
      return;
    }

    const email = localStorage.getItem("user_email");
    const docRef = doc(db, "users/" + email + "/workouts/", workoutId, "/exercises/" + exerciseId)

    await updateDoc(docRef, {
      name: nameInput,
      weight: weightInput,
      repsCount: repsCountInput,
      seriesCount: seriesCountInput
    });

    closeEdit();
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
            onChange={(e) => setNameInput(e.target.value)}
            margin="dense"
            fullWidth 
            sx={{}}
          />
        </div>
      </div>

      <div className='exerciseInfoEdit'>
        <div className='seriesEdit'>
          {
            seriesCount !== 1
              ? <div>
                  <TextField 
                    id="seriesCount" 
                    label="Series" 
                    variant="outlined" 
                    value={seriesCountInput}
                    onChange={(e) => setSeriesCountInput(e.target.value)}
                    margin="dense"
                  />
                </div>
              : ""
          }
        </div>
        <div className='repsEdit'>
          {
            <TextField 
              id="repsCount" 
              label={type === "reps" ? "Reps" : "Seconds"}
              variant="outlined" 
              value={repsCountInput}
              onChange={(e) => setRepsCountInput(e.target.value)}
              margin="dense"
            />
          }
        </div>
        <div className='weightEdit'>
          {
            isWeighted === "yes"
              ? <TextField 
                  id="weight" 
                  label="Weight"
                  variant="outlined"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  margin="dense"
                />
              : ""
          }
        </div>
      </div>
      
      <div className='editControls'>
        <ThemeProvider theme={theme} >
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
        </ThemeProvider>
        
      </div>
    </div>
    </ThemeProvider>
    
  );
}
