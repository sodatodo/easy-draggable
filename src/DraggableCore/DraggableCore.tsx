/* eslint-disable react/button-has-type */
import React, {
  useEffect,
  useRef,
  RefObject,
  useState,
  memo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { addEvent, removeEvent, getTouchIdentifier } from '../utils/domFns';
import { createCoreData, getControlPosition, snapToGrid } from '../utils/positionFns';
import { DraggableEventHandler } from '../utils/types';
import { applyState } from '../apply';

interface DraggableCoreProps {
  ref?: RefObject<HTMLElement>;
  children: any,
  onStart: DraggableEventHandler,
  onStop: DraggableEventHandler,
  onDrag: DraggableEventHandler,
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

const DraggableCore = React.forwardRef<HTMLElement, DraggableCoreProps>((props, ref) => {
  const { children, grid } = props;
  const singleChildren = React.Children.only(children);
  const rootRef: React.MutableRefObject<HTMLElement> = useRef(null);

  // const [lastPosition, setLastPosition] = useState({ lastX: NaN, lastY: NaN });
  const [getLastPosition, setLastPosition] = applyState({ lastX: NaN, lastY: NaN });
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 以下方法用于解决动态添加事件监听函数导致的 处理方法内无法获取 state的问题
  // const refLastPosition = useRef(lastPosition);
  // const setRefLastPosition = (newPosition: { lastX: number, lastY: number }) => {
  //   refLastPosition.current = newPosition;
  //   setLastPosition(newPosition);
  // };

  const refDragging = useRef(dragging);
  const setRefDragging = (dragging: boolean) => {
    refDragging.current = dragging;
    setDragging(dragging);
  };

  useEffect(() => {
    setMounted(true);

    return (() => {
      setMounted(false);
    });
  }, []);

  // console.log('out lastPosition :>> ', lastPosition);
  const handleDrag = useCallback((event: any) => {
    // console.log('on Drag event :>> ', event);
    const position = getPositon(event);
    if (position === null) return;
    let { x, y } = position;

    const { lastX, lastY } = getLastPosition();
    if (Array.isArray(grid)) {
      let deltaX = x - lastX;
      let deltaY = y - lastY;

      [deltaX, deltaY] = snapToGrid(grid as [number, number], deltaX, deltaY);
      if (!deltaX && !deltaY) return;
      x = lastX + deltaX;
      y = lastY + deltaY;
    }
    // console.log('y, lastY :>> ', y, lastY);
    const coreEvent = createCoreData(findRootDOM(), lastX, lastY, x, y);
    // if (mounted === false) {

    // }
    // console.log('coreEvent :>> ', coreEvent);
    props.onDrag(event, coreEvent);
    setLastPosition({
      lastX: x,
      lastY: y,
    });
  }, []);
  const handleDragStop = useCallback((event: any) => {
    if (!refDragging.current) return;
    // console.log('event :>> ', event);
    // console.log('sodalog handle stop');
    const { ownerDocument } = findRootDOM();
    if (ownerDocument) {
      removeEvent(ownerDocument, dragEventFor.move, handleDrag);
      removeEvent(ownerDocument, dragEventFor.stop, handleDragStop);
    }
    const position = getPositon(event);
    const { x, y } = position;
    const { lastX, lastY } = getLastPosition();
    const coreEvent = createCoreData(findRootDOM(), lastX, lastY, x, y);
    props.onStop(event, coreEvent);
    setLastPosition({
      lastX: NaN,
      lastY: NaN,
    });
    setRefDragging(false);
  }, []);
  // 获取`position`
  const getPositon = useCallback((event: any) => {
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
  }, []);
  const handleDragStart = useCallback((event: MouseEvent | TouchEvent) => {
    const { onStart } = props;
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
      const { x, y } = position;
      const { lastX, lastY } = getLastPosition();
      const coreEvent = createCoreData(findRootDOM(), lastX, lastY, x, y);

      const shouldUpdate = onStart(event, coreEvent);
      console.log('shouldUpdate :>> ', shouldUpdate);

      // const shouldUpdate = this.props.onStart(event, )
      // 向上层透传事件
      // const { x, y } = position;
      setLastPosition({
        lastX: x,
        lastY: y,
      });
      setRefDragging(true);

      console.log('position on drag start :>> ', position);
      addEvent(ownerDocument, dragEventFor.move, handleDrag);
      addEvent(ownerDocument, dragEventFor.stop, handleDragStop);
    }

    return false;
  }, []);
  // 鼠标按下后通知上层 并开始监听 移动事件
  const onMouseDown = useCallback((event: MouseEvent) => {
    dragEventFor = eventsFor.mouse;
    console.log('sodalog mousedown');
    return handleDragStart(event);
  }, [handleDragStart]);
  const onMouseUp = useCallback((event: MouseEvent) => {
    dragEventFor = eventsFor.mouse;
    console.log('sodalog mouseup');
    return handleDragStop(event);
  }, [handleDragStop]);

  const eventHandler = {
    ref: ref || rootRef,
    onMouseDown,
    onMouseUp,
  };

  const findRootDOM = useCallback((): HTMLElement => {
    if (ref && 'current' in ref) {
      // console.log('sodalog return out side current');
      return ref.current;
    }
    return rootRef.current;
  }, []);

  const handleClick = () => {
    console.log('findRootDOM() :>> ', findRootDOM());
  };
  console.log('render core');
  return (
    <div>
      {/* <button onClick={handleClick}>
        findRootDOM
      </button> */}
      {React.cloneElement(singleChildren, eventHandler)}
    </div>
  );
});

DraggableCore.propTypes = {
  children: PropTypes.node.isRequired,
  onStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  grid: PropTypes.arrayOf(PropTypes.number),
  // offsetParent: PropTypes.object
};
DraggableCore.defaultProps = {
  grid: null,
};

DraggableCore.displayName = 'EasyDraggableCore';

export default memo(DraggableCore);
