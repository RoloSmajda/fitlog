import * as React from 'react';
import { FC } from 'react';
import { useState, useEffect } from 'react';


export interface Props {
}

export const Timer: FC<Props> = () => {
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [time, setTime] = useState(0);


	const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };
  
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

	useEffect(() => {
		let interval:any;

		if (isActive && isPaused === false) {
			interval = setInterval(() => {
				setTime((time) => time + 10);
			}, 10);
		} else {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, [isActive, isPaused]);

	const StartButton = (
    <div className="btn btn-one btn-start"
         onClick={handleStart}>
      Start
    </div>
  );
  const ActiveButtons = (
    <div className="btn-grp">
      <div className="btn btn-two" 
           onClick={handleReset}>
        Reset
      </div>
      <div className="btn btn-one" 
           onClick={handlePauseResume}>
        {isPaused ? "Resume" : "Pause"}
      </div>
    </div>
  );

	return (
		<div>
			<div className='time'>
				<span className="digits">
					{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
				</span>
				<span className="digits">
					{("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
				</span>
				<span className="digits mili-sec">
					{("0" + ((time / 10) % 100)).slice(-2)}
				</span>
			</div>

			<div className='timerControls'>
				{isActive ? ActiveButtons : StartButton}
			</div>

		</div>
	);
}