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

// 默认的鼠标事件
let dragEventFor = eventsFor.mouse;

function DraggableCore({ ref, children, onMouseDown: propsOnMouseDown, allowAnyClick, disabled }:
  {
    onMouseDown?: Function,
    ref: React.MutableRefObject<HTMLElement>,
    children: React.ReactNode,
  }) {
  console.log('ref :>> ', ref);
  const onTouchStart: EventListener = function (event: TouchEvent) {
    dragEventFor = eventsFor.touch;
    return handleDragStart(event);
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

  const handleDrag: EventListener = (event: Event) => {
    console.log('handle drag', event);
  };

  const handleDragStart = (event: MouseEvent | TouchEvent) => {
    if (propsOnMouseDown) {
      propsOnMouseDown(event);
    }
    // 只接受鼠标左键 event.button === 0 表示鼠标左键 event.button === 2 表示鼠标右键 event.button === 1 表示点击鼠标滚轮
    if (
      true// allowAnyClick
      && typeof event.button === 'number'
      && event.button !== 0
    ) return false;

    const rootNode = rootRef.current;
    if (!rootNode || !rootNode.ownerDocument || !rootNode.ownerDocument.body) {
      throw new Error('<DraggableCore> not mounted on DragStart!');
    }
    const { ownerDocument } = rootNode;
    console.log('ownerDocument :>> ', ownerDocument);

    console.log('event.type :>> ', event.type);
    if (event.type === 'touchstart') event.preventDefault();
    addEvent(ownerDocument, dragEventFor.move, handleDrag);
    // return false;
  };

  const handleDragStop = (event: MouseEvent) => {
    dragEventFor = eventsFor.mouse;
    const rootNode = rootRef.current;
    if (rootNode) {
      const { ownerDocument } = rootNode;
      removeEvent(ownerDocument, dragEventFor.move, handleDrag);
      removeEvent(ownerDocument, dragEventFor.stop, handleDrag);
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    dragEventFor = eventsFor.mouse;
    return handleDragStart(event);
  };
  const onMouseUp = (event: MouseEvent) => {
    dragEventFor = eventsFor.mouse;
    return handleDragStop(event);
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
