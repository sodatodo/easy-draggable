import { offsetXYFromParent } from './domFns';
import { ControlPosition, DraggableData } from './types';
import { isNum } from './shims';

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
  const isStart = isNum(lastX);
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

export default {};
