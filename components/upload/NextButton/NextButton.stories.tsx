import type { Meta, StoryObj } from '@storybook/react';
import NextButton from '.';

const meta: Meta<typeof NextButton> = {
  title: 'NextButton',
  component: NextButton,
};

export default meta;
type Story = StoryObj<typeof NextButton>;

export const Primary: Story = {
  args: {},
};
