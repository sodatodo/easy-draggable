import React, { Fragment, useRef, useState } from 'react';
import Draggable, { Direction } from '../';
import './DraggableTest.css';

function DraggableUsage(props: any) {
  const [activeDrags, setActiveDrags] = useState(0);
  const refActiveDrags = useRef(activeDrags);
  const setRefActiveDrags = (count: number) => {
    refActiveDrags.current = count;
    setActiveDrags(count);
  }
  const handleOnStart = () => {
    setRefActiveDrags(refActiveDrags.current + 1);
  }
  const handleOnStop = () => {
    console.log('on stop');
    setRefActiveDrags(refActiveDrags.current - 1);
  }
  document.onselectstart = () => false;
  return (
    <Fragment>
      <h1>activeDrags: {activeDrags}</h1>
      <div style={{ transform: 'scale(0.5)', transformOrigin: 'left top' }}>
        <Draggable>
          <div className="box"></div>
        </Draggable>
        <Draggable axis={Direction.both} onStart={handleOnStart} onStop={handleOnStop} positionOffset={{ x: '-10%', y: '-10%' }} scale={0.5}>
          <div className="box"></div>
        </Draggable>
      </div>
    </Fragment>
  )
}

export default DraggableUsage;
