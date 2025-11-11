import type { Meta, StoryObj } from '@storybook/react';
import CalendarView from './CalendarView';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

// 🟦 Default Story
export const Default: Story = {
  render: () => (
    <div style={{ padding: 20, background: '#f9fafb', minHeight: '100vh' }}>
      <CalendarView />
    </div>
  ),
};

// 🟩 Second Story (clean version – no unused variable)
export const WithSampleEvents: Story = {
  render: () => (
    <div style={{ padding: 20, background: '#f9fafb', minHeight: '100vh' }}>
      <CalendarView />
    </div>
  ),
};
