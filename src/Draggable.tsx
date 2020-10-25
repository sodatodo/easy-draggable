import React, {
  RefObject, useCallback, useRef, useState,
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
import { applyState } from './apply';

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
  // const [getState, setState] = applyState({ x: 0, y: 0 });
  // const [getCurrentState, setCurrentState] = applyState({ z: 0, e: 0 });
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
  // const [draggablePosition, setDraggablePosition] = useState(
  //   controlled ? position : defaultPosition,
  // );
  const [getDraggablePosition, setDraggablePosition] = applyState(
    controlled ? position : defaultPosition,
  );
  const [getFrameId, setFrameId] = applyState(null);
  // const [x, setX] = useState(controlled ? position.x : defaultPosition.x);
  // const [y, setY] = useState(controlled ? position.y : defaultPosition.y);
  // const refDraggablePosition = useRef(draggablePosition);
  // const setRefDraggablePosition = (position: Position) => {
  //   refDraggablePosition.current = position;
  //   setDraggablePosition(position);
  // };
  // const refX = useRef(x);
  // const setRefX = (value: number) => {
  //   refX.current = value;
  //   setX(value);
  // };

  // const refY = useRef(y);
  // const setRefY = (value: number) => {
  //   refY.current = value;
  //   setY(value);
  // };

  const [slackX, setSlackX] = useState(0);
  const [slackY, setSlackY] = useState(0);

  const singleChildren = React.Children.only(children);

  const onDragStart: DraggableEventHandler = useCallback((event, draggableCoreData) => {
    // const x = refX.current;
    // const y = refY.current;
    const { x, y } = getDraggablePosition();
    const draggableData = createDraggableData(x, y, scale, draggableCoreData);
    let shouldStart = true;
    if (onStart) {
      if (onStart(event, draggableData) === false) {
        shouldStart = false;
      }
    }
    if (shouldStart === false) return false;
    setRefDragging(true);
    setRefDragged(true);
  }, []);
  const onDragStop: DraggableEventHandler = useCallback((event, draggableCoreData) => {
  }, []);
  const onDrag: DraggableEventHandler = useCallback((event, draggableCoreData) => {
    if (!refDragging.current) return false;

    // const { x, y } = refDraggablePosition.current;
    const { x, y } = getDraggablePosition();
    const uiData = createDraggableData(x, y, scale, draggableCoreData);

    const transformOpts = {
      x: (canDragX(axis) && draggable) ? x : validPosition.x,
      y: (canDragY(axis) && draggable) ? y : validPosition.y,
    };
    // const newState = {
    //   x: uiData.x,
    //   y: uiData.y,
    // };
    let newStateX = uiData.x;
    let newStateY = uiData.y;

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

      newSlackX = slackX + (originX - newStateX);
      newSlackY = slackY + (originY - newStateY);

      uiData.x = newStateX;
      uiData.y = newStateY;
      uiData.deltaX = newStateX - x;
      uiData.deltaY = newStateY - y;
    }
    if (props.onDrag) {
      const shouldUpdate = props.onDrag(event, uiData);
    }
    // setRefX(newStateX);
    // setRefY(newStateY);
    // setRefDraggablePosition({
    //   x: newStateX,
    //   y: newStateY,
    // });
    const style = createCSSTransform(transformOpts, positionOffset);
    const elementProps = {
      style: { ...children.props.style, ...style },
    };
    // console.log('draggableCoreData.node :>> ', draggableCoreData.node);
    // console.log('style :>> ', style.transform);
    setDraggablePosition({
      x: newStateX,
      y: newStateY,
    });
    
    let frameId = getFrameId();
    if (frameId) {
      console.log('阻止无效的刷新');
      return false;
    }
    draggableCoreData.node.style.transform = style.transform;

    frameId = requestAnimationFrame(() => {
      setFrameId(null);
    });
    setFrameId(frameId);
    
    // setState({
    //   x: newStateX,
    //   y: newStateY,
    // });
    // setCurrentState({
    //   z: newStateX + 1,
    //   e: newStateY + 1,
    // });
    // if (shouldUpdate === false) return false;
  }, []);

  const draggable = !controlled || dragging;
  const validPosition = position || defaultPosition;

  const { x, y } = getDraggablePosition();
  const transformOpts = {
    x: (canDragX(axis) && draggable) ? x : validPosition.x,
    y: (canDragY(axis) && draggable) ? y : validPosition.y,
  };
  let style = {};
  style = createCSSTransform(transformOpts, positionOffset);
  const elementProps = {
    style: { ...children.props.style, ...style },
  };
  console.log('render draggable');
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
