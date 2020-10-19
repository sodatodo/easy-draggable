/* eslint-disable react/button-has-type */
import React, {
  useEffect,
  useRef,
  RefObject,
  useState,
} from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { addEvent, removeEvent, getTouchIdentifier } from '../utils/domFns';
import { createCoreData, getControlPosition, snapToGrid } from '../utils/positionFns';

interface DraggableCoreProps {
  ref?: RefObject<HTMLElement>;
  children: any,
  onStart: EventListener,
  onStop: EventListener,
  onDrag: EventListener,
  offsetParent?: Element,
  grid?: number[],
}

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

// function DraggableCore({
//   ref, children, onMouseDown: propsOnMouseDown, allowAnyClick, disabled,
// }:
//   {
//     onMouseDown?: Function,
//     ref: React.MutableRefObject<HTMLElement>,
//     children: React.ReactNode,
//   }) {
//   console.log('ref :>> ', ref);
//   const onTouchStart: EventListener = function (event: TouchEvent) {
//     dragEventFor = eventsFor.touch;
//     return handleDragStart(event);
//   };
//   const rootRef = useRef(null);
//   useEffect(() => {
//     const rootNode = rootRef.current;
//     // touchStart 一个快速响应的移动端事件 比click快300ms因为 click需要判断是否为双击
//     if (rootNode) {
//       addEvent(rootNode, eventsFor.touch.start, onTouchStart, { passive: false });
//     }
//     return (() => {
//       if (rootNode) {
//         removeEvent(rootNode, eventsFor.touch.start, onTouchStart, { passive: false });
//       }
//     });
//   }, [rootRef]);

//   const handleDrag: EventListener = (event: Event) => {
//     console.log('handle drag', event);
//   };

//   const handleDragStart = (event: MouseEvent | TouchEvent) => {
//     console.log('handle Drag Start');
//     if (propsOnMouseDown) {
//       propsOnMouseDown(event);
//     }
//     // 只接受鼠标左键 event.button === 0 表示鼠标左键 event.button === 2 表示鼠标右键 event.button === 1 表示点击鼠标滚轮
//     if (event instanceof MouseEvent) {
//       const { button } = event;
//       // 如果不算鼠标主键 则不作处理 这里主键认定为鼠标左键,后续可根据配置进行变更
//       const aboveKey = 0;
//       if (button && button !== aboveKey) {
//         return false;
//       }
//       const rootNode = rootRef.current;
//       if (!rootNode || !rootNode.ownerDocument || !rootNode.ownerDocument.body) {
//         throw new Error('<DraggableCore> not mounted on DragStart!');
//       }

//       const { ownerDocument } = rootNode;
//       console.log('ownerDocument :>> ', ownerDocument);

//       console.log('event.type :>> ', event.type);
//       if (event.type === 'touchstart') event.preventDefault();
//       addEvent(ownerDocument, dragEventFor.move, handleDrag);
//     }

//     return false;
//   };

//   const handleDragStop = (event: MouseEvent) => {
//     dragEventFor = eventsFor.mouse;
//     const rootNode = rootRef.current;
//     if (rootNode) {
//       const { ownerDocument } = rootNode;
//       removeEvent(ownerDocument, dragEventFor.move, handleDrag);
//       removeEvent(ownerDocument, dragEventFor.stop, handleDrag);
//     }
//   };

//   const onMouseDown = (event: MouseEvent) => {
//     dragEventFor = eventsFor.mouse;
//     return handleDragStart(event);
//   };
//   const onMouseUp = (event: MouseEvent) => {
//     dragEventFor = eventsFor.mouse;
//     return handleDragStop(event);
//   };

//   const singleChildren: any = React.Children.only(children);
//   const core = React.cloneElement(singleChildren, {
//     onMouseDown,
//     onMouseUp,
//     ref: rootRef,
//   });
//   return core;
// }

const DraggableCore = React.forwardRef<HTMLElement, DraggableCoreProps>((props, ref) => {
  const { children, grid } = props;
  const singleChildren = React.Children.only(children);
  const rootRef: React.MutableRefObject<HTMLElement> = useRef(null);

  const [lastPosition, setLastPosition] = useState({ lastX: NaN, lastY: NaN });
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 以下方法用于解决动态添加事件监听函数导致的 处理方法内无法获取 state的问题
  const refLastPosition = useRef(lastPosition);
  const setRefLastPosition = (newPosition: { lastX: number, lastY: number }) => {
    refLastPosition.current = newPosition;
    setLastPosition(newPosition);
  };

  useEffect(() => {
    setMounted(true);

    return (() => {
      setMounted(false);
    });
  }, []);

  // console.log('out lastPosition :>> ', lastPosition);
  const handleDrag = (event: any) => {
    // console.log('on Drag event :>> ', event);
    const position = getPositon(event);
    if (position === null) return;
    let { x, y } = position;

    const { lastX, lastY } = refLastPosition.current;

    if (Array.isArray(grid)) {
      console.log('enter array handler');
      let deltaX = x - lastX;
      let deltaY = y - lastY;
      [deltaX, deltaY] = snapToGrid(grid as [number, number], deltaX, deltaY);
      if (!deltaX && !deltaY) return;
      x = lastX + deltaY;
      y = lastY + deltaY;
    }

    const coreEvent = createCoreData(findRootDOM(), lastX, lastY, x, y);
    // if (mounted === false) {

    // }
    console.log('coreEvent :>> ', coreEvent);
    if (props.onDrag) {
      props.onDrag(event, coreEvent);
    }
    setRefLastPosition({
      lastX: x,
      lastY: y,
    });
  };
  const handleDragStop = (event: any) => {
    // console.log('event :>> ', event);
    // console.log('sodalog handle stop');
    const { ownerDocument } = findRootDOM();
    if (ownerDocument) {
      removeEvent(ownerDocument, dragEventFor.move, handleDrag);
      removeEvent(ownerDocument, dragEventFor.stop, handleDragStop);
    }

    setRefLastPosition({
      lastX: NaN,
      lastY: NaN,
    });
    setDragging(false);
  };
  // 获取`position`
  const getPositon = (event: any) => {
    const touchIdentifier = getTouchIdentifier();
    let propsOffsetParent = null;
    if ('offsetParent' in props) {
      // eslint-disable-next-line react/prop-types
      propsOffsetParent = props.offsetParent;
    }
    const position = getControlPosition(
      event, propsOffsetParent, findRootDOM(), 1, touchIdentifier,
    );
    return position;
  };
  const handleDragStart = (event: MouseEvent | TouchEvent) => {
    const { onStart } = props;
    if (onStart) {
      onStart(event);
    }

    // 只接受鼠标左键 event.button === 0 表示鼠标左键 event.button === 2 表示鼠标右键 event.button === 1 表示点击鼠标滚轮
    if ('button' in event) {
      if (event.type === 'touchstart') event.preventDefault();
      const { button } = event;
      // 如果不算鼠标主键 则不作处理 这里主键认定为鼠标左键,后续可根据配置进行变更
      const aboveKey = 0;
      if (button && button !== aboveKey) {
        return false;
      }
      const rootNode = findRootDOM();
      if (!rootNode || !rootNode.ownerDocument || !rootNode.ownerDocument.body) {
        throw new Error('<DraggableCore> not mounted on DragStart!');
      }

      const { ownerDocument } = rootNode;

      const position = getPositon(event);

      // const shouldUpdate = this.props.onStart(event, )
      // 向上层透传事件
      const { x, y } = position;
      setLastPosition({
        lastX: x,
        lastY: y,
      });
      setDragging(true);

      console.log('position on drag start :>> ', position);
      addEvent(ownerDocument, dragEventFor.move, handleDrag);
      // ownerDocument.addEventListener('mousemove', (lastPosition) => {
      //   console.log('custom lastPosition :>> ', lastPosition);
      // });
      addEvent(ownerDocument, dragEventFor.stop, handleDragStop);
    }

    return false;
  };
  // 鼠标按下后通知上层 并开始监听 移动事件
  const onMouseDown = (event: MouseEvent) => {
    dragEventFor = eventsFor.mouse;
    return handleDragStart(event);
  };
  const onMouseUp = (event: MouseEvent) => {
    dragEventFor = eventsFor.mouse;
    return handleDragStop(event);
  };

  const eventHandler = {
    ref: ref || rootRef,
    onMouseDown,
    onMouseUp,
  };

  const findRootDOM = (): HTMLElement => {
    if (ref && 'current' in ref) {
      // console.log('sodalog return out side current');
      return ref.current;
    }
    return rootRef.current;
  };

  const handleClick = () => {
    console.log('findRootDOM() :>> ', findRootDOM());
  };
  return (
    <div>
      <button onClick={handleClick}>
        findRootDOM
      </button>
      {React.cloneElement(singleChildren, eventHandler)}
    </div>
  );
});

DraggableCore.propTypes = {
  children: PropTypes.node.isRequired,
  onStart: PropTypes.func.isRequired,
  grid: PropTypes.arrayOf(PropTypes.number),
  // offsetParent: PropTypes.object
};
DraggableCore.defaultProps = {
  grid: null,
};

DraggableCore.displayName = 'EasyDraggableCore';

// type Props = DetailedHTMLProps<
//   HTMLAttributes<HTMLDivElement>,
//   HTMLDivElement
// >;

export default DraggableCore;
