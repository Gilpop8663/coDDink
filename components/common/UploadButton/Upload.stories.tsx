import type { Meta, StoryObj } from '@storybook/react';
import UploadButton from '@components/uploadButton';

const meta: Meta<typeof UploadButton> = {
  title: 'UploadButtonsss',
  component: UploadButton,
};

export default meta;
type Story = StoryObj<typeof UploadButton>;

export const Default: Story = {
  args: {
    kind: 'text',
    label: '텍스트',
  },
};

export const Picture: Story = {
  args: {
    kind: 'profile',
    label: '이미지',
    previewImage:
      'https://images.unsplash.com/photo-1684419081530-d0dd7ed6921a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
};

export const PictureNotPreview: Story = {
  args: {
    kind: 'profile',
    label: '이미지',
  },
};

export const Thumbnail: Story = {
  args: {
    kind: 'thumbnail',
    label: '이미지',
  },
};

export const ChangeThumb: Story = {
  args: {
    kind: 'changeThumb',
    label: '이미지',
  },
};
