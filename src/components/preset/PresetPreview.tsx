import * as React from 'react';
import { FC } from 'react';
import '../../css/style.css'
import { db } from "../../db/firebase-config";
import { collection, getDocs, addDoc, setDoc, doc, query, deleteDoc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { Exercise } from '../workout/WorkoutDetail';
import { MenuItem } from '@mui/material';

import { useState, useEffect } from 'react';


export interface Props {
}

export const PresetPreview: FC<Props> = ({}) => {


  useEffect(() => {
  }, []);


  return (
    <div>

    </div>
  );
}
