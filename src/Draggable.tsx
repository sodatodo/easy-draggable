import React, { RefObject } from 'react';
import PropTypes from 'prop-types';

import DraggableCore from './DraggableCore';

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
}

const Draggable = React.forwardRef<HTMLElement, DraggableProps>((props, ref) => {
  const { children } = props;
  const singleChildren = React.Children.only(children);
  const eventHandler = {};
  return (
    <DraggableCore ref={ref}>
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
};

export default Draggable;
