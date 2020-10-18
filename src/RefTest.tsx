import React, { RefObject } from 'react';

const RefTest = React.forwardRef<HTMLDivElement, RefTestProps>((props, ref) => (
  <div ref={ref}>
    Ref Test
  </div>
));
interface RefTestProps {
  ref: RefObject<HTMLDivElement>
}

export default RefTest;
