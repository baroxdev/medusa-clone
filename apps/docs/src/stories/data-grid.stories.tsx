import { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "@medusa-clone/data-grid";

const meta: Meta<typeof DataGrid> = {
  component: DataGrid,
};

export default meta;

type Story = StoryObj<typeof DataGrid>;

export const Default: Story = {
  render: () => {
    return (
      <div className="fixed inset-2 flex flex-col overflow-hidden">
        <form className="flex flex-col h-full">
          <div className="flex size-full flex-col overflow-hidden">
            <div className="flex-1 size-full overflow-hidden">
              <DataGrid />
            </div>
          </div>
        </form>
      </div>
    );
  },
};
