import React, { useRef } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import DraggableTest from './DraggableTest';
import { snapToGrid } from '../utils/positionFns';

export default {
  title: 'DraggableCore/Default',
  component: DraggableTest,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story = (args) => <DraggableTest {...args} />;

export const Primary = Template.bind({});

export const OnlyX = Template.bind({});
OnlyX.args = {
  axis: 'x'
}

export const OnlyY = Template.bind({});
OnlyY.args = {
  axis: 'y'
}

export const CantMove = Template.bind({});
CantMove.args = {
  axis: 'none'
}

export const GridMove = Template.bind({})
GridMove.args = {
  grid: [25, 25]
}

export const BoundsMove = Template.bind({})
BoundsMove.args = {
  bounds: {top: -100, left: -100, right: 100, bottom: 100}
}