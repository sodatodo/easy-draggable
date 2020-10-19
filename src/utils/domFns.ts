import { ControlPosition } from './types';

export function addEvent(
  el?: Node,
  eventName?: string,
  handler?: EventListener,
  inputOptions?: Object,
): void {
  if (!el) return;
  const options = { capture: true, ...inputOptions };

  if (el.addEventListener) {
    el.addEventListener(eventName, handler, options);
    // console.log('el :>> ', el);
    // console.log('add event listener: ', eventName);
  }
}

export function removeEvent(
  el?: Node,
  eventName?: string,
  handler?: EventListener,
  inputOptions?: Object,
): void {
  if (!el) return;
  const options = { capture: true, ...inputOptions };
  if (el.removeEventListener) {
    el.removeEventListener(eventName, handler, options);
  }
}

export function getTouchIdentifier(): any {
  // console.log('event.targetTouches', event.targetTouches);
  return undefined;
}

export function offsetXYFromParent(
  event: MouseEvent,
  offsetParent: Element,
  scale: number,
): ControlPosition {
  const isBody = offsetParent === offsetParent.ownerDocument.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

  const { clientX, clientY } = event;

  const x = (clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  const y = (clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;

  return { x, y };
}

export default {};
