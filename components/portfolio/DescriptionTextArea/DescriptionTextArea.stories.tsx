import type { Meta, StoryObj } from '@storybook/react';

import DescriptionTextArea from '.';

const meta: Meta<typeof DescriptionTextArea> = {
  component: DescriptionTextArea,
};

export default meta;
type Story = StoryObj<typeof DescriptionTextArea>;

export const Nickname: Story = {
  render: () => <DescriptionTextArea />,
};
