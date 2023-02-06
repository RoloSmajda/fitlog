import * as React from 'react';
import {FC} from 'react';
import '../../css/style.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'


export interface Props {
    name: string,
    weight: number, 
    repsCount: number,
    seriesCount: number,
}

export const ExerciseThumbnail:FC<Props> = ({name, weight, repsCount, seriesCount}) => {
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
        {seriesCount}x{repsCount}
        </div>
        <div className='weight'>
          {weight}kg
        </div>
      </div>
      
    </div>
  );
}
