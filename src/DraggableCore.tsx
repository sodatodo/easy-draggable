import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  useEffect,
  useRef,
} from 'react';
// import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { addEvent, removeEvent } from './utils/domFns';

const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
};

function DraggableCore({ ref, children, onMouseDown: propsOnMouseDown }:
  {
    onMouseDown?: Function,
    ref: React.MutableRefObject<HTMLElement>,
    children: React.ReactNode,
  }) {
  console.log('ref :>> ', ref);
  const onTouchStart: EventListener = function (event: Event) {
    console.log('event :>> ', event);
  };
  const rootRef = useRef(null);
  useEffect(() => {
    const rootNode = rootRef.current;
    // touchStart 一个快速响应的移动端事件 比click快300ms因为 click需要判断是否为双击
    if (rootNode) {
      addEvent(rootNode, eventsFor.touch.start, onTouchStart, { passive: false });
    }
    return (() => {
      if (rootNode) {
        removeEvent(rootNode, eventsFor.touch.start, onTouchStart, { passive: false });
      }
    });
  }, [rootRef]);

  const handleDragStart = (event: Event) => {
    if (propsOnMouseDown) {
      propsOnMouseDown(event);
    }
  };

  const onMouseDown = (event: Event) => {
    console.log('onMouseDown: ', event);
    handleDragStart(event);
  };
  const onMouseUp = (event: Event) => {
    console.log('onMouseUp: ', event);
  };

  const singleChildren: any = React.Children.only(children);
  const core = React.cloneElement(singleChildren, {
    onMouseDown,
    onMouseUp,
    ref: rootRef,
  });
  return core;
}

DraggableCore.displayName = 'EasyDraggableCore';

type Props = DetailedHTMLProps<
  HTMLAttributes <HTMLDivElement>,
  HTMLDivElement
>;

export default React.forwardRef<HTMLDivElement, Props>(
  (args, ref) => (<DraggableCore {...args} ref={ref} />),
);
