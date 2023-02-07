import * as React from 'react';
import { FC } from 'react';
import '../../css/style.css'
import { db } from "../../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, deleteDoc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { Exercise } from '../workout/WorkoutDetail';
import { MenuItem } from '@mui/material';

import { useState, useEffect } from 'react';

type Preset = {
  id?: string,
  workoutId: string,
}

export interface Props {
  exercises: Exercise[] | null,
  closeMenu: () => void,
  workoutId: string | undefined
}

export const CreateNewPreset: FC<Props> = ({exercises, closeMenu, workoutId}) => {

  const [presets, setPresets] = useState<Preset[] | null>(null);
  const getPresets = async () => {
    const email = localStorage.getItem("user_email");
    const exercisesQuery = query(collection(db, "users/" + email + "/presets"));
    const data = await getDocs(exercisesQuery);

    setPresets(data.docs.map((doc) => ({
      id: doc.id,
      workoutId: doc.data().workoutId
    })));
  }

  const saveExercicesAsPreset = async () => {
    const email = localStorage.getItem("user_email");
    

    if(presets !== null && presets.some(preset => preset.workoutId === workoutId)){
      console.log("preset exists")
    }else{
      const docRef = await addDoc(collection(db, "users/" + email + "/presets"), {workoutId: workoutId});
      if(exercises !== null){
        for(const exercise of exercises){
          await addDoc(collection(db, "users/" + email + "/presets/" + docRef.id + "/exercises"), exercise);
        }
      }
      console.log("Preset saved");
    }

    closeMenu();
    
  }

  useEffect(() => {
    getPresets();
  }, []);


  return (
    <MenuItem onClick={saveExercicesAsPreset}>Save as preset</MenuItem>
  );
}
