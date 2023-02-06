import { listenerCount } from 'process';
import * as React from 'react';
import {FC} from 'react';
import { Exercise } from '../workout/WorkoutDetail';
import { ExerciseThumbnail } from './ExerciseThumbnail';

export interface Props {
    list: Exercise[]
}

export const ExerciseList:FC<Props> = ({list}) => {
  return (
    <div>
      {
        list.map((exercise, i) => {
            return <ExerciseThumbnail
                key={i}
                name={exercise.name}
                weight={exercise.weight}
                repsCount={exercise.repsCount}
                seriesCount={exercise.seriesCount}
            />
        })
      }
    </div>
  );
}
