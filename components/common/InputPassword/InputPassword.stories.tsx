import type { Meta, StoryObj } from '@storybook/react';
import InputPassword from '.';

const meta: Meta<typeof InputPassword> = {
  title: 'InputPassword',
  component: InputPassword,
};

export default meta;
type Story = StoryObj<typeof InputPassword>;

export const Default: Story = {
  args: {
    label: '아이디',
    name: 'id',
  },
};
