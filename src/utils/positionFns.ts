import {
  innerHeight, innerWidth, offsetXYFromParent, outerHeight, outerWidth,
} from './domFns';
import { Bounds, ControlPosition, DraggableData } from './types';
import { int, isNum } from './shims';
import { Direction } from '../constant/direction';

export function getControlPosition(
  event: MouseEvent,
  propsOffsetParent: Element,
  currentNode: HTMLElement,
  scale: number,
  touchIdentifier: number,
): ControlPosition {
  const touchObj: any = typeof touchIdentifier === 'number' ? undefined : null;

  if (typeof touchIdentifier === 'number' && !touchObj) return null;

  const offsetParent = propsOffsetParent
    || currentNode.offsetParent
    || currentNode.ownerDocument.body;

  return offsetXYFromParent(touchObj || event, offsetParent, scale);
}

export function snapToGrid(
  grid: [number, number], pendingX: number, pendingY: number,
): [number, number] {
  const x = Math.round(pendingX / grid[0]) * grid[0];
  const y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
}

export function createCoreData(
  node: HTMLElement, lastX: number, lastY: number, x: number, y: number,
): DraggableData {
  const isStart = !isNum(lastX);
  if (isStart) {
    return {
      node,
      deltaX: 0,
      deltaY: 0,
      lastX,
      lastY,
      x,
      y,
    };
  }
  return {
    node,
    deltaX: x - lastX,
    deltaY: y - lastY,
    lastX,
    lastY,
    x,
    y,
  };
}

export function createDraggableData(
  x: number,
  y: number,
  scale: number,
  coreData: DraggableData,
): DraggableData {
  const { node, deltaX, deltaY } = coreData;
  return {
    node,
    x: x + deltaX / scale,
    y: y + deltaY / scale,
    deltaX: deltaX / scale,
    deltaY: deltaY / scale,
    lastX: x,
    lastY: y,
  };
}

export function canDragX(axis: Direction) {
  return axis === Direction.both || axis === Direction.x;
}

export function canDragY(axis: Direction) {
  return axis === Direction.both || axis === Direction.y;
}

function cloneBounds(bounds:Bounds): Bounds {
  return {
    ...bounds,
  };
}
export function getBoundPosition(
  node: HTMLElement,
  bounds: Bounds | string,
  x: number,
  y: number,
): [number, number] {
  if (!bounds) return [x, y];
  let copyBounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
  let newX = x;
  let newY = y;

  if (typeof bounds === 'string') {
    const { ownerDocument } = node;
    const ownerWindow = ownerDocument.defaultView;
    let boundNode;
    if (bounds === 'parent') {
      boundNode = node.parentNode;
    } else {
      boundNode = ownerDocument.querySelector(bounds);
    }
    if (!(boundNode instanceof ownerWindow.HTMLElement)) {
      throw new Error(`Bounds selector ${bounds} could not find an element.`);
    }
    const nodeStyle = ownerWindow.getComputedStyle(node);
    const boundNodeStyle = ownerWindow.getComputedStyle(boundNode);
    copyBounds = {
      left: -node.offsetLeft + int(boundNodeStyle.paddingLeft) + int(nodeStyle.marginLeft),
      top: -node.offsetTop + int(boundNodeStyle.paddingTop) + int(nodeStyle.marginTop),
      right: innerWidth(boundNode) - outerWidth(node) - node.offsetLeft
        + int(boundNodeStyle.paddingRight) - int(nodeStyle.marginRight),
      bottom: innerHeight(boundNode) - outerHeight(node) - node.offsetTop
        + int(boundNodeStyle.paddingBottom) - int(nodeStyle.marginBottom),
    };
  }
  if (typeof bounds !== 'string' && typeof copyBounds !== 'string') {
    if (isNum(bounds.right)) newX = Math.min(x, copyBounds.right);
    if (isNum(bounds.bottom)) newY = Math.min(y, copyBounds.bottom);

    if (isNum(bounds.left)) newX = Math.max(newX, copyBounds.left);
    if (isNum(bounds.top)) newY = Math.max(newY, copyBounds.top);
  }

  return [newX, newY];
}

export default {};
