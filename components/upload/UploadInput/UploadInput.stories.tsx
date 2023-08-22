import type { Meta, StoryObj } from '@storybook/react';
import UploadInput from '.';

const meta: Meta<typeof UploadInput> = {
  title: 'UploadInput',
  component: UploadInput,
};

export default meta;
type Story = StoryObj<typeof UploadInput>;

export const Primary: Story = {
  args: {
    label: '업로드',
    name: '인풋',
    type: 'text',
  },
};
