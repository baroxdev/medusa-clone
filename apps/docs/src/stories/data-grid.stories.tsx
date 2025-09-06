import {Meta, StoryObj} from "@storybook/react";
import { DataGrid } from "@medusa-clone/data-grid";

const meta: Meta<typeof DataGrid> = {
    component: DataGrid,
}

export default meta

type Story = StoryObj<typeof DataGrid>


export const Default: Story =  {
    render: () => {
        return <DataGrid/>
    }
}
