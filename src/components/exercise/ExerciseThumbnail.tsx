import * as React from 'react';
import { FC } from 'react';
import '../../css/style.css'

import { createTheme, TextField, ThemeProvider, makeStyles, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

import { db } from "../../db/firebase-config";
import { collection, getDocs, doc, query, deleteDoc, getDoc, Timestamp, orderBy, addDoc } from "firebase/firestore";
import { UserContext } from '../../db/UserContext';
import { useState, useEffect, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { fontSize } from '@mui/system';
import { EditExercise } from './EditExercise';

const theme = createTheme({
  palette: {
    primary: {
      main: "#3FC2C4"
    },
  },
  typography: {
    fontFamily: 'Poppins',
    fontSize: 18,
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
  getExecises: () => void
}

export const ExerciseThumbnail: FC<Props> = ({ 
  exerciseId, name, type, isWeighted, weight, repsCount, seriesCount, note, workoutId, getExecises
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const moreOptionsOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const moreOptionsClose = () => {
    setAnchorEl(null);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const deleteExercise = async () => {
    const email = localStorage.getItem("user_email");
    await deleteDoc(doc(db, "users/" + email + "/workouts/", workoutId, "/exercises/" + exerciseId))
    getExecises();
    moreOptionsClose();
  }

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const closeEdit = () => {
    getExecises();
    moreOptionsClose();
    setIsEdit(false);
  }


  if(isEdit){
    return (
      <EditExercise
        exerciseId={exerciseId}
        name={name}
        type={type}
        isWeighted={isWeighted}
        weight={weight}
        repsCount={repsCount}
        seriesCount={seriesCount}
        note={note}
        workoutId={workoutId}
        closeEdit={closeEdit}

      />
    );  
  }

  return (
    <div className='exerciseThumbnail'>
      <div className='exerciseTopRow'>
        <div className='exerciseName'>
          {name.toUpperCase()}
        </div>
        <div className='exerciseMoreBtn'>
          <ThemeProvider theme={theme}>
            <div>
              <IconButton className='exerciseMoreBtn' aria-label="delete" color='primary'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={moreOptionsOpen}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          </ThemeProvider>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={moreOptionsClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => {setIsEdit(true)}}>Edit</MenuItem>
            <MenuItem onClick={openModal} sx={{ color: "red" }}>Delete</MenuItem>
          </Menu>
          
          <Modal
            open={modalOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className='modal'>
              Are you sure you want to delete this exercise?
              <div className='modalControls'>
                <Button 
                  variant="text" 
                  sx={{color: '#C4413F', fontSize: 16, fontWeight: 600}}
                  onClick={() => {
                    deleteExercise();
                    closeModal();
                  }}
                >
                  DELETE
                </Button>
              </div>
            </div>
          </Modal>

        </div>
      </div>

      <div className='exerciseInfo'>
        <div className='seriesReps'>
          {
            seriesCount !== 1
              ? seriesCount + "x"
              : ""
          }
          {
            repsCount
          }
          {
            type === "reps"
              ? " reps"
              : " sec"

          }
        </div>
        <div className='weight'>
          {
            isWeighted === "yes"
              ? weight + "kg"
              : ""
          }
        </div>
      </div>

    </div>
  );
}
