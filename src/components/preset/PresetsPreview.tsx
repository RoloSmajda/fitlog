import * as React from 'react';
import { FC } from 'react';
import '../../css/style.css'
import { db } from "../../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, deleteDoc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { Exercise } from '../workout/WorkoutDetail';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';

import { useState, useEffect } from 'react';
import { Preset } from './CreateNewPreset';


export interface Props {
}

export const PresetsPreview: FC<Props> = ({}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [presets, setPresets] = useState<Preset[] | null>(null);
  const getPresets = async () => {
    const email = localStorage.getItem("user_email");
    const exercisesQuery = query(collection(db, "users/" + email + "/presets"));
    const data = await getDocs(exercisesQuery);

    setPresets(data.docs.map((doc) => ({
      id: doc.id,
      presetName: doc.data().presetName,
      workoutId: doc.data().workoutId
    })));
  }

  const [presetsOptions, setPresetOptions] = useState<string[] | null>(null);
  const getPresetOptions = () => {
    if(presets !== null){
      return presets.map((preset) =>(preset.presetName));
    }
    return [];
  }

  useEffect(() => {
    getPresets();
  }, []);



  const ITEM_HEIGHT = 48;

  if(presets !== null && presets.length < 1){
    return <></>
  };

  return (
    <div>
      <button onClick={handleClick}>
        Presets
      </button>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {getPresetOptions().map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
