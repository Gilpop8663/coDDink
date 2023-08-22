import type { Meta, StoryObj } from '@storybook/react';

import TitleInput from '.';

const meta: Meta<typeof TitleInput> = {
  component: TitleInput,
};

export default meta;
type Story = StoryObj<typeof TitleInput>;

export const Nickname: Story = {
  render: () => <TitleInput />,
};
