import React, { RefObject } from 'react';
import PropTypes from 'prop-types';

import DraggableCore from './DraggableCore';
import { DraggableData } from './utils/types';

// function Draggable({ ...draggableCoreProps }) {
//   return (
//     <DraggableCore {...draggableCoreProps}>
//       <div>Draggable</div>
//     </DraggableCore>
//   );
// }

interface DraggableProps {
  children: any;
  ref?: RefObject<HTMLElement>;
  grid?: number[]
}

const Draggable = React.forwardRef<HTMLElement, DraggableProps>((props, ref) => {
  const { children, grid } = props;
  const singleChildren = React.Children.only(children);
  const eventHandler = {};
  const onDragStart = () => {
  };
  const onDragStop = () => { };
  const onDrag = (event: any, draggableData: DraggableData) => { 
    console.log('draggableData', draggableData);
  };

  return (
    <DraggableCore ref={ref} onStart={onDragStart} onDrag={onDrag} onStop={onDragStop} grid={grid}>
      {React.cloneElement(singleChildren, eventHandler)}
    </DraggableCore>
  );
});

// ({ props, ref }) => {
//   const className = 'draggalbe';
//   const singleChildren = React.Children.only(children);
//   const coreEventHanlder = {
//     ref,
//   };
//   const coreStyle = {
//     className,
//   };
//   console.log('typeof ref :>> ', typeof ref);
//   return (
//     <DraggableCore>
//       {React.cloneElement(singleChildren, coreEventHanlder, coreStyle)}
//     </DraggableCore>
//   );
// };

Draggable.propTypes = {
  children: PropTypes.node.isRequired,
  grid: PropTypes.arrayOf(PropTypes.number),
};
Draggable.defaultProps = {
  grid: null,
};

export default Draggable;
