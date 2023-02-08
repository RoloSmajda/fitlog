import * as React from 'react';
import { FC } from 'react';
import '../../css/presets.css'
import { db } from "../../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, deleteDoc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { Exercise } from '../workout/WorkoutDetail';
import Menu from '@mui/material/Menu';
import { MenuItem, Typography } from '@mui/material';

import { useState, useEffect } from 'react';
import { Preset } from './CreateNewPreset';
import Button from '@mui/material/Button';

import { createTheme, TextField, ThemeProvider, makeStyles } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import { PresetCarousel } from './PresetCarousel';

const theme = createTheme({
  palette:{
    primary: {
      main: "#3FC2C4"
    },
  },
  typography:{
    fontFamily: 'Poppins',
    fontSize: 20,
  }
});

type PresetOption = {
  name: string,
  presetId: string,
}

export interface Props {
  loadExercisesFromPreset: (str:string | undefined) => void
}

export const PresetsPreview: FC<Props> = ({loadExercisesFromPreset}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openPresetOptions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closePresetOptions = () => {
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

  const [presetToDisplayName, setPresetToDisplayName] = useState<string | undefined>("");
  const [presetToDisplayId, setPresetToDisplayId] = useState<string | undefined>("");
  const getPresetOptions = () => {
    if(presets !== null){
      return presets.map((preset) =>({name: preset.presetName, presetId: preset.id}));
    }
    return [];
  }

  useEffect(() => {
    getPresets();
    
  }, []);



  const ITEM_HEIGHT = 48;

  if(presets !== null && presets.length < 1){
    return (
      <div className='emptyExercises'>
        This workout has no exercises. Use "Add exercise" button to add exercises to this workout.
      </div>
    )
  };

  return (
    <div className='presets'>
      <ThemeProvider theme={theme}>
        <div className='presetsRow'>
          <Typography fontSize={18}>
          <span>{
            presetToDisplayName === ""
            ? presets !== null
              ? presets[0].presetName
              : ""
            : presetToDisplayName
          }</span>
          </Typography>
          
          <Button 
            onClick={openPresetOptions} 
            color="primary" 
          >
            <ArrowDropDownIcon/>Presets
          </Button>
        </div>
      </ThemeProvider>
      
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={closePresetOptions}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            minWidth: '20ch',
          },
        }}
      >
        {
          getPresetOptions().map((option, i) => (
            <MenuItem 
              key={i} 
              selected={option.name === 'Pyxis'} 
              onClick={() => {
                setPresetToDisplayId(option.presetId);
                setPresetToDisplayName(option.name);
                closePresetOptions();
              }}
            >
              {option.name}
            </MenuItem>
          ))
        }

      </Menu>

      <PresetCarousel 
        presetToDisplayId={
          presetToDisplayId === ""
            ? presets !== null
              ? presets[0].id
              : ""
            : presetToDisplayId
        }
      />
      <ThemeProvider theme={theme}>
        <div className='loadBtn'>
          <Button 
            onClick={()=>{
              loadExercisesFromPreset(
                presetToDisplayId === ""
                  ? presets !== null
                      ? presets[0].id
                      : ""
                  : presetToDisplayId
              )}} 
            color="primary" 
            startIcon={<DownloadIcon/>}
          >
            Load Preset
          </Button>
        </div>
      </ThemeProvider>

      <div className='emptyExercises'>
        This workout has no exercises. Use "Add exercise" button to add exercises or choose from your saved presets.
      </div>
    </div>
  );
}
