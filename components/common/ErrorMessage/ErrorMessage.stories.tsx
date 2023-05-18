import type { Meta, StoryObj } from '@storybook/react';
import ErrorMessage from '.';

const meta: Meta<typeof ErrorMessage> = {
  title: 'ErrorMessage',
  component: ErrorMessage,
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  args: {
    text: '올바른 입력을 해주세요.',
  },
};
