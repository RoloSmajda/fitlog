import * as React from 'react';
import {FC} from 'react';
import '../../css/style.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'


export interface Props {
    name: string,
    type:string,
    isWeighted: string
    weight: number, 
    repsCount: number,
    seriesCount: number,
    note: string
}

export const ExerciseThumbnail:FC<Props> = ({name, type, isWeighted, weight, repsCount, seriesCount, note}) => {
  return (
    <div className='exerciseThumbnail'>
      <div className='exerciseTopRow'>
        <div className='exerciseName'>
          {name.toUpperCase()}
        </div>
        <div>
          <FontAwesomeIcon 
            icon={faEllipsisVertical}
            className='editIcon'
          />
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
