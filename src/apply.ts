type getState = () => any;
type setState = (newState: any) => void;
// 当需要存储state但不需要state引起render时 使用 apply方法获取更好的性能
export function applyState(defaultState: any): [getState, setState] {
  let state = defaultState;
  const getState: getState = () => state;
  const setState: setState = (newState: any) => {
    state = newState;
  };
  return [getState, setState];
}

export default {};
