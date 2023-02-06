import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate  } from 'react-router-dom';

import '../css/style.css'
import { WorkoutList } from './workout/WorkoutList';

import { UserContext } from '../db/UserContext';
import { User } from '../App';

import { db } from "../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, orderBy, Timestamp } from "firebase/firestore";
import { Header } from './Header';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'

type Workout = {
  id: string,
  date: string,
  duration: string
}

export interface Props {
}
export function Main(props: Props) {
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async () => {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef);
    const data = await getDocs(usersQuery);

    setUsers(data.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email, 
      photoUrl: doc.data().photoUrl
    })));
    

  }

  const parseDate = (date: Timestamp) => {
    return date.toDate().toLocaleDateString('en-US', { day: '2-digit', month: 'short'});
  }

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const getWorkouts = async () => {
    if(user.email !== ""){
      const workoutsRef = collection(db, "users/" + user.email + "/workouts");
      const workoutsQuery = query(workoutsRef, orderBy("date", "desc"));

      const data = await getDocs(workoutsQuery);

      setWorkouts(data.docs.map((doc) => ({
        id: doc.id, 
        date: parseDate(doc.data().date), 
        duration: doc.data().duration
      })))
      
    }
    
  }

  const addWorkout = async () => {
    const newWorkout = {
      date: Timestamp.now(),
      duration: "to do"
    };


    const workoutRef = collection(db, "users/" + user.email + "/workouts");
    const ref = await addDoc(workoutRef, newWorkout);
    
    navigate("/workout/" + ref.id);

    getWorkouts();

  }

  useEffect(() => {
    getUsers();
    getWorkouts();
    
  }, [user]);

  useEffect(() => {
    getUsers();
    getWorkouts();
  }, []);

  
  return (
    <div className='main'>
      <Header/>
      {
        user.name === "" 
          ? "NOT SIGNED IN." 
          : <div>
              <WorkoutList list={workouts}/>
              <FontAwesomeIcon 
                icon={faCirclePlus} 
                className="addButton"
                onClick={addWorkout}
              />
            </div>
      }
    </div>
    
  );
}
