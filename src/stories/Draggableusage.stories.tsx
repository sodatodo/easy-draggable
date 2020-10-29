import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import DraggableUsage from './DraggableUsage'

export default {
  title: 'Draggable/usage',
  component: DraggableUsage
} as Meta;


const Template: Story = (args) => <DraggableUsage {...args} />

export const Default = Template.bind({});
Default.args = {
  
}