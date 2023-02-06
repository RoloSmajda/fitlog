import * as React from 'react';
import { FC } from 'react';
import { useState, useEffect, useContext } from 'react';
import { Exercise } from '../workout/WorkoutDetail';

import { db } from "../../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, orderBy } from "firebase/firestore";

import { UserContext } from '../../db/UserContext';
import { Modal } from '../tools/Modal';

import { useParams } from "react-router-dom";

export interface Props {
  isOpen: boolean,
  openModal: () => void,
  closeModal: () => void,
  getExercises: () => void,
}

export const NewExercise: FC<Props> = ({ isOpen, openModal, closeModal, getExercises }) => {
  let { id } = useParams();
  const { user, setUser } = useContext(UserContext);

  const [exerciseName, setExerciseName] = useState<string>("");
  const [repsCount, setRepsCount] = useState<string>("");
  const [seriesCount, setSeriesCount] = useState<string>("");
  const [exerciseWeight, setExerciseWeight] = useState<string>("");

  const addExercise = async () => {

    if (exerciseName === "" || exerciseWeight === "" || repsCount === "" || seriesCount === "") {
      console.log("NO EMPTY FIELDS");

    } else {
      const newExercise: Exercise = {
        name: exerciseName,
        weight: parseInt(exerciseWeight),
        repsCount: parseInt(repsCount),
        seriesCount: parseInt(seriesCount),
      }

      const exerciseRef = collection(db, "users/" + user.email + "/workouts/" + id + "/exercises");
      await addDoc(exerciseRef, newExercise);
      getExercises();

      setExerciseName("");
      setExerciseWeight("");
      setRepsCount("");
      setSeriesCount("");

      closeModal();
    }


  }

  return (
    <div className='newExercise'>
      <button onClick={openModal} className='btn'>
        Add exercise
      </button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className='modalTitle'>
          NEW EXERCISE
        </div>
        <div className='row'>
          <label htmlFor="name">Name</label>
          <input
            id='name'
            name='name'
            placeholder='exercise name'
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />
        </div>
        <div className='row'>
          <label htmlFor="weight">Weight</label>
          <input
            id='weight'
            name='weight'
            type="number"
            placeholder='weight'
            value={exerciseWeight}
            onChange={(e) => setExerciseWeight(e.target.value)}
          />
        </div>
        <div className='row'>
          <label htmlFor="series">Series</label>
          <input
            id='series'
            name='series'
            type="number"
            placeholder='seriesCount'
            value={seriesCount}
            onChange={(e) => setSeriesCount(e.target.value)}
          />
        </div>
        <div className='row'>
          <label htmlFor="reps">Reps</label>
          <input
            id='reps'
            name='reps'
            type="number"
            placeholder='repsCount'
            value={repsCount}
            onChange={(e) => setRepsCount(e.target.value)}
          />
        </div>
        
        <div className='modalControls'>
          <span className='closeBtn' onClick={closeModal}>CLOSE</span>
          <span className='addBtn' onClick={addExercise}>ADD</span>
        </div>
      </Modal>
    </div>
  );
}
