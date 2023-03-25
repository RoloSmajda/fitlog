import * as React from "react";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";

export interface Props {
  id: string;
  date: string;
}

export const WorkoutThumbnail: FC<Props> = ({ id, date }) => {
  const navigate = useNavigate();

  return (
    <button
      className="bg-smokewhite text-right shadow-3xl mb-8 rounded-2xl"
      onClick={() => {
        navigate("/workout/" + id);
      }}
    >
      <div className="px-6 py-4">
        <div className="text-teal font-inter font-medium text-2xl mb-1">
          WORKOUT
        </div>
        <div className="text-charcoalgray font-inter italic font-black text-6xl">
          {date.toUpperCase()}
        </div>
      </div>
    </button>
  );
};
