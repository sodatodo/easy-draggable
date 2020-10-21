import browserPrefix, { browserPrefixToKey } from './getPrefix';
import { int } from './shims';
import { ControlPosition, PositionOffsetControlPosition } from './types';

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

export function getTranslation(
  { x, y }: ControlPosition,
  positionOffset: PositionOffsetControlPosition,
  unitSuffix: string,
): string {
  let translation = `translate(${x}${unitSuffix}, ${y}${unitSuffix})`;
  if (positionOffset) {
    const defaultX = `${(typeof positionOffset.x === 'string') ? positionOffset.x : positionOffset.x + unitSuffix}`;
    const defaultY = `${(typeof positionOffset.y === 'string') ? positionOffset.y : positionOffset.y + unitSuffix}`;
    translation = `translate(${defaultX}, ${defaultY})${translation}`;
  }
  return translation;
}

export function createCSSTransform(
  controlPos: ControlPosition,
  positionOffset: PositionOffsetControlPosition,
) {
  const translation = getTranslation(controlPos, positionOffset, 'px');
  return { [browserPrefixToKey('transform', browserPrefix)]: translation };
}

export function innerWidth(node: HTMLElement): number {
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width -= int(computedStyle.paddingLeft);
  width -= int(computedStyle.paddingRight);
  return width;
}

export function innerHeight(node: HTMLElement): number {
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height -= int(computedStyle.paddingTop);
  height -= int(computedStyle.paddingBottom);
  return height;
}

export function outerWidth(node: HTMLElement): number {
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width += int(computedStyle.borderLeftWidth);
  width += int(computedStyle.borderRightWidth);
  return width;
}

export function outerHeight(node: HTMLElement): number {
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height += int(computedStyle.borderTopWidth);
  height += int(computedStyle.borderBottomWidth);
  return height;
}

export default {};
