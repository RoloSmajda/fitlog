import * as React from 'react';
import {FC} from 'react';
import { WorkoutDetail } from './WorkoutDetail';
import { WorkoutThumbnail } from './WorkoutThumbnail';
import { Timestamp } from "firebase/firestore";

export interface Props {
    list: { 
      id: string,
      date: string,
      duration: string
    }[]
}

export const WorkoutList:FC<Props> = ({list}) => {
  return (
    <div>
      {
        list.map((workout, i) =>{
            return <WorkoutThumbnail
                key={i}
                id={workout.id}
                date={workout.date}
            />
        })
      }
    </div>
  );
}
