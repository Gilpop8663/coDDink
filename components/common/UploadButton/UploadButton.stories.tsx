import type { Meta, StoryObj } from '@storybook/react';
import UploadButton from '.';

const meta: Meta<typeof UploadButton> = {
  title: 'UploadButton',
  component: UploadButton,
};

export default meta;
type Story = StoryObj<typeof UploadButton>;

export const Default: Story = {
  args: {
    color: 'skyBlue',
    text: '텍스트',
    type: 'none',
  },
};

export const Picture: Story = {
  args: {
    color: 'orange',
    text: '이미지',
    type: 'file',
    subText: '업로드',
    borderRight: true,
    previewImage:
      'https://images.unsplash.com/photo-1684419081530-d0dd7ed6921a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
};

export const PictureNotPreview: Story = {
  args: {
    color: 'orange',
    text: '이미지',
    type: 'file',
    borderRight: true,
    subText: '업로드',
  },
};

export const Thumbnail: Story = {
  args: {
    color: 'blue',
    name: 'asdsa',
    type: 'file',
    kind: 'button',
    innerText: '이미지 업로드',
  },
};

export const ChangeThumb: Story = {
  args: {
    color: 'blue',
    subText: '표지 이미지 변경',
    kind: 'hidden',
  },
};
