import React, {
  RefObject, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import DraggableCore from './DraggableCore';
import {
  PositionOffsetControlPosition, Position, DraggableEventHandler, Bounds,
} from './utils/types';
import {
  canDragX, canDragY, createDraggableData, getBoundPosition,
} from './utils/positionFns';
import { Direction } from './constant/direction';
import { createCSSTransform } from './utils/domFns';
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
  grid?: number[],
  position?: Position,
  defaultPosition?: Position,
  axis: Direction,
  positionOffset: PositionOffsetControlPosition,
  scale?: number,
  onStart?: DraggableEventHandler,
  bounds?: Bounds | string,
  onDrag?: DraggableEventHandler
}

const Draggable = React.forwardRef<HTMLElement, DraggableProps>((props, ref) => {
  const [dragging, setDragging] = useState(false);
  const refDragging = useRef(dragging);
  const setRefDragging = (value: boolean) => {
    refDragging.current = value;
    setDragging(value);
  };
  const [dragged, setDragged] = useState(false);
  const refDragged = useRef(dragged);
  const setRefDragged = (value: boolean) => {
    refDragging.current = value;
    setDragged(value);
  };
  const {
    children, grid, onStart, position, defaultPosition, axis, positionOffset, scale, bounds,
  } = props;
  const controlled = Boolean(position);
  const [x, setX] = useState(controlled ? position.x : defaultPosition.x);
  const [y, setY] = useState(controlled ? position.y : defaultPosition.y);
  const refX = useRef(x);
  const setRefX = (value: number) => {
    refX.current = value;
    setX(value);
  };

  const refY = useRef(y);
  const setRefY = (value: number) => {
    refY.current = value;
    setY(value);
  };

  const [slackX, setSlackX] = useState(0);
  const [slackY, setSlackY] = useState(0);

  const singleChildren = React.Children.only(children);

  // eslint-disable-next-line consistent-return
  const onDragStart: DraggableEventHandler = (event, draggableCoreData) => {
    console.log('on drag starrt');
    const x = refX.current;
    const y = refY.current;
    const draggableData = createDraggableData(x, y, scale, draggableCoreData);
    let shouldStart = true;
    if (onStart) {
      if (onStart(event, draggableData) === false) {
        shouldStart = false;
      }
    }
    if (shouldStart === false) return false;
    console.log('set ref dragging');
    setRefDragging(true);
    setRefDragged(true);
  };
  const onDragStop: DraggableEventHandler = (event, draggableCoreData) => {
    console.log('event :>> ', event);
    console.log('draggableData :>> ', draggableCoreData);
  };
  const onDrag: DraggableEventHandler = (event, draggableCoreData) => {
    if (!refDragging.current) return false;
    const x = refX.current;
    const y = refY.current;
    console.log('draggableCoreData :>> ', draggableCoreData);
    const uiData = createDraggableData(x, y, scale, draggableCoreData);
    console.log('uiData :>> ', uiData);
    // const newState = {
    //   x: uiData.x,
    //   y: uiData.y,
    // };
    let newStateX = uiData.x;
    let newStateY = uiData.y;
    console.log('newStateX, newStateY :>> ', newStateX, newStateY);

    let newSlackX = slackX;
    let newSlackY = slackY;
    if (bounds) {
      // const { x: originX, y: originY } = newState;
      const originX = newStateX;
      const originY = newStateY;

      newStateX += slackX;
      newStateY += slackY;

      [newStateX, newStateY] = getBoundPosition(
        draggableCoreData.node, bounds, newStateX, newStateY,
      );
      console.log('newStateX :>> ', newStateX);

      newSlackX = slackX + (originX - newStateX);
      newSlackY = slackY + (originY - newStateY);

      uiData.x = newStateX;
      uiData.y = newStateY;
      uiData.deltaX = newStateX - x;
      uiData.deltaY = newStateY - y;
    }
    console.log('uiData :>> ', uiData);
    if (props.onDrag) {
      const shouldUpdate = props.onDrag(event, uiData);
    }
    setRefX(newStateX);
    setRefY(newStateY);
    // if (shouldUpdate === false) return false;
  };

  const draggable = !controlled || dragging;
  const validPosition = position || defaultPosition;
  console.log('validPosition :>> ', validPosition);
  const transformOpts = {
    x: (canDragX(axis) && draggable) ? x : validPosition.x,
    y: (canDragY(axis) && draggable) ? y : validPosition.y,
  };
  console.log('transformOpts :>> ', transformOpts);
  let style = {};
  style = createCSSTransform(transformOpts, positionOffset);
  console.log('style :>> ', style);
  const elementProps = {
    style: { ...children.props.style, ...style },
  };
  return (
    <DraggableCore ref={ref} onStart={onDragStart} onDrag={onDrag} onStop={onDragStop} grid={grid}>
      {React.cloneElement(singleChildren, elementProps)}
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
  position: PropTypes.exact({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  defaultPosition: PropTypes.exact({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  axis: PropTypes.number,
  positionOffset: PropTypes.exact({
    x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  scale: PropTypes.number,
  onStart: PropTypes.func,
  bounds: PropTypes.oneOfType([
    PropTypes.shape({
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
      bottom: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  onDrag: PropTypes.func,
};
Draggable.defaultProps = {
  grid: null,
  position: null,
  defaultPosition: {
    x: 0,
    y: 0,
  },
  axis: Direction.both,
  positionOffset: {
    x: 0,
    y: 0,
  },
  scale: 1,
  onStart: null,
  bounds: null,
  onDrag: null,
};

export default Draggable;
