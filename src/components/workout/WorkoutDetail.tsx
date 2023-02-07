import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExerciseList } from '../exercise/ExerciseList';
import { FC } from 'react';
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';

import { db } from "../../db/firebase-config";
import { collection, getDocs, doc, query, deleteDoc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { UserContext } from '../../db/UserContext';
import { Modal } from '../tools/Modal';
import { NewExercise } from '../exercise/NewExercise';


import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CreateNewPreset } from '../preset/CreateNewPreset';
import { PresetsPreview } from '../preset/PresetsPreview';

const theme = createTheme({
  palette:{
    primary: {
      main: "#3FC2C4"
    },
  },
});

export type Exercise = {
  id?: string,
  rank: number,
  name: string,
  type: string,
  isWeighted: string,
  weight: number,
  repsCount: number,
  seriesCount: number,
  note: string,
}

export interface Props {
}

export const WorkoutDetail: FC<Props> = () => {
  let { id } = useParams();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isAddEcerciseOpen, setAddEcerciseOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  //const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const [workoutDate, setWorkoutDate] = useState<Timestamp | null>();

  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const getExecises = async () => {
    const email = localStorage.getItem("user_email");
    const exercisesRef = collection(db, "users/" + email + "/workouts/" + id + "/exercises");
    const exercisesQuery = query(exercisesRef, orderBy("rank", "asc"));
    const data = await getDocs(exercisesQuery);
 
    setExercises(data.docs.map((doc) => ({
      id: doc.id,
      rank: doc.data().rank,
      name: doc.data().name,
      type: doc.data().type,
      isWeighted: doc.data().isWeighted,
      weight: doc.data().weight,
      repsCount: doc.data().repsCount,
      seriesCount: doc.data().seriesCount,
      note: doc.data().note
    })));
  }

  const deleteWorkout = async () => {
    const docId = "" + id;
    await deleteDoc(doc(db, "users/" + user.email + "/workouts/", docId));
    navigate("/");
  }

  const getWorkoutDate = async () => {
    const email = localStorage.getItem("user_email");
    const docId = "" + id
    const docRef = doc(db, "users/" + email + "/workouts/", docId);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
          setWorkoutDate(docSnap.data()?.date);
      } else {
          console.log("Document does not exist")
      }
  
    } catch(error) {
      console.log(error)
    }
  }

  const parseDate = ():string => {
    if(workoutDate instanceof Timestamp){
      return workoutDate.toDate().toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit'});
    }
    return ""
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    getExecises();
    getWorkoutDate();
  }, []);

  const newTo = {
    pathname: "/"
  }

  return (
    <div className='workoutDetail'>
      <div className='topRow'>
        <Link to={newTo} className="link">
          <ArrowBackIcon/>
        </Link>
        <div className='workoutTitle'>
          Workout {parseDate()}
        </div>

        <div onClick={handleClick}>
          <MoreVertIcon/>
        </div>
        
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <CreateNewPreset 
            exercises={exercises}
            closeMenu={handleClose}
            workoutId={id}
          />
          <MenuItem sx={{color: "red"}} onClick={() => {
            setIsDeleteOpen(true);
            handleClose();
          }}>Delete</MenuItem>

        </Menu>
      </div>
      
      <Modal isOpen={isDeleteOpen} onClose={() => {setIsDeleteOpen(false)}}>
        <div>
          Are you sure you want to delete this workout?
        </div>
        <button onClick={deleteWorkout}>
          DELETE
        </button>
      </Modal>

      

      {
        exercises === null
          ? <ThemeProvider theme={theme}>
              <div className='loading'>
                <CircularProgress size="4rem"/>
                <span>Loading exercises...</span>
              </div>
            </ThemeProvider>
          : <>
            {
              exercises.length < 1 
              ? <div className='emptyExercises'>
                  <PresetsPreview/>
                  This workout has no exercises. Use "Add exercise" button to add exercises to this workout.
                </div>
              : <ExerciseList
                  list={exercises}
                /> 
            }
      
            <NewExercise 
              isOpen={isAddEcerciseOpen} 
              openModal={()=>{setAddEcerciseOpen(true)}}
              closeModal={()=>{setAddEcerciseOpen(false)}}
              getExercises={()=>{getExecises()}}
              exercisesCount={exercises !== null ? exercises.length : 0}
            />
            </>
      }
      
    </div>
  );
}
