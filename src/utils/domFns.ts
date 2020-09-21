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
    console.log('el :>> ', el);
    console.log('add event listener: ', eventName);
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

export default {};
