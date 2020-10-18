import React, {useRef} from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import DraggableTest from './DraggableTest';

export default {
    title: 'DraggableCore/Default',
    component: DraggableTest,
    argTypes: {
      backgroundColor: { control: 'color' },
    },
  } as Meta;

const Template: Story = (args) => <DraggableTest />;

// const domRef = useRef(null);
  export const Primary = Template.bind({
    // ref:{domRef}
  });