import { listenerCount } from 'process';
import * as React from 'react';
import {FC} from 'react';
import { Exercise } from '../workout/WorkoutDetail';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import '../../css/style.css'
import CircularProgress from '@mui/material/CircularProgress';

export interface Props {
    list: Exercise[],
    workoutId: string,
    getExecises: () => void
}

export const ExerciseList:FC<Props> = ({list, workoutId, getExecises}) => {
  return (
    <div>
      {
        list.map((exercise, i) => {
            return <ExerciseThumbnail
                key={i}
                exerciseId={exercise.id}
                name={exercise.name}
                type={exercise.type}
                isWeighted={exercise.isWeighted}
                weight={exercise.weight}
                repsCount={exercise.repsCount}
                seriesCount={exercise.seriesCount}
                note={exercise.note}
                workoutId={workoutId}
                getExecises={getExecises}
            />
        })
      }
    </div>
  );
}
