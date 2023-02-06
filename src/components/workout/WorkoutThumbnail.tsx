import * as React from 'react';
import {FC} from 'react';
import { Link } from 'react-router-dom';
import { Timestamp } from "firebase/firestore";

export interface Props {
    id: string,
    date: string
}

export const WorkoutThumbnail:FC<Props> = ({id, date}) => {

    const newTo = {
        pathname: "/workout/" + id
    }

    return (
        <Link to={newTo} className="link">
            <div className='workoutThumbnail'>
                <div className='smallTitle'>
                    WORKOUT
                </div>
                <div className='date'>
                    {date.toUpperCase()}
                </div>
            </div>
        </Link>
        
    );
}
