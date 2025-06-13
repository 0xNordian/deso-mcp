import type { Meta, StoryObj } from '@storybook/react';
import { PostAction } from './post-action';
import React, { useState, useEffect } from 'react';

const meta: Meta<typeof PostAction> = {
  title: 'DeSo/PostAction',
  component: PostAction,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['like', 'repost', 'comment', 'diamond', 'view'],
    },
    count: { control: 'number' },
    active: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PostAction>;

const StatefulPostAction = (
  props: React.ComponentProps<typeof PostAction>
) => {
  const [active, setActive] = useState(props.active || false);
  const [count, setCount] = useState(props.count);
  const [value, setValue] = useState(props.value);

  // Resets state when args change in Storybook controls
  useEffect(() => {
    setActive(props.active || false);
    setCount(props.count);
    setValue(props.value);
  }, [props.active, props.count, props.value]);

  const isToggleable = ['like', 'repost', 'comment', 'diamond'].includes(
    props.variant
  );

  const handleClick = () => {
    if (!isToggleable) return;

    const newActiveState = !active;
    setActive(newActiveState);

    let newCount: number = count;
    newCount = newActiveState ? newCount + 1 : newCount - 1;
    setCount(newCount);

    if (props.variant === 'diamond' && value) {
      const numericValue = parseFloat(value.replace(/[($)]/g, ''));
      const newValue = newActiveState ? numericValue + 0.01 : numericValue - 0.01;
      setValue(`($${newValue.toFixed(2)})`);
    }
  };

  return (
    <PostAction
      {...props}
      active={active}
      count={count}
      value={value}
      onClick={isToggleable ? handleClick : undefined}
    />
  );
};

export const Default: Story = {
  name: 'Default (Like)',
  render: (args) => <StatefulPostAction {...args} />,
  args: {
    variant: 'like',
    count: 11,
    active: false,
  },
};

export const AllActions: Story = {
  name: 'Post Actions Bar',
  render: () => (
    <div className="flex w-full max-w-lg items-center gap-x-4 rounded-lg bg-background p-4 border">
      <StatefulPostAction variant="comment" count={4} />
      <StatefulPostAction variant="repost" count={12} />
      <StatefulPostAction variant="like" count={43} active />
      <StatefulPostAction variant="diamond" count={5} value="($0.12)" />
      <div className="flex-grow" />
      <PostAction variant="view" count={1450} />
    </div>
  ),
}; 