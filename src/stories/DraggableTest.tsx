import React, { useEffect, useRef } from 'react';
import Draggable from '../';
import './DraggableTest.css';

function DraggableTest() {
  const ref = useRef(null);
  console.log('typeof ref :>> ', typeof ref);
  useEffect(() => {
    console.log('ref.current :>> ', ref.current);
  }, []);
  return (
    <Draggable ref={ref}>
      <div className="box">Hello world</div>
    </Draggable>
  )
}

export default DraggableTest;
