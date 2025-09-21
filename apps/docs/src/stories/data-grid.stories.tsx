import { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "@medusa-clone/data-grid";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const meta: Meta<typeof DataGrid> = {
  component: DataGrid,
};

export default meta;

type Story = StoryObj<typeof DataGrid>;

const EXAMPLE_DATA = Array.from({ length: 200 }).map((_, i) => ({
  id: i,
  first: `first ${i}`,
  second: `second ${i}`,
  second_2: ``,
  third: `third ${i}`,
  four: `four ${i}`,
  five: `five ${i}`,
  six: `six ${i}`,
  seven: `seven ${i}`,
  eight: `eight ${i}`,
  nine: `nine ${i}`,
  ten: `ten ${i}`,
}));

const columns = [
  {
    id: "id",
    accessorKey: "id",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "first",
    accessorKey: "first",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "second",
    accessorKey: "second",
    cell: (context) => <DataGrid.BooleanCell context={context} />,
    meta: {
      type: "boolean",
    },
  },
  {
    id: "second_2",
    accessorKey: "second_2",
    cell: (context) => <DataGrid.CurrencyCell context={context} />,
    meta: {
      type: "number",
    },
  },
  {
    id: "third",
    accessorKey: "third",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "four",
    accessorKey: "four",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "five",
    accessorKey: "five",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "six",
    accessorKey: "six",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "seven",
    accessorKey: "seven",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "eight",
    accessorKey: "eight",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "nine",
    accessorKey: "nine",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
  {
    id: "ten",
    accessorKey: "ten",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
    },
  },
];

const basicSchema = z.object({
  data: z.array(
    z.object({
      first: z.string(),
      second: z.boolean(),
      second_2: z.number(),
      third: z.string(),
      four: z.string(),
      five: z.string(),
      six: z.string(),
      seven: z.string(),
      eight: z.string(),
      nine: z.string(),
      ten: z.string(),
    })
  ),
});

export const Default: Story = {
  render: () => {
    const form = useForm({
      resolver: zodResolver(basicSchema),
    });
    return (
      <div className="fixed inset-2 flex flex-col overflow-hidden">
        <form className="flex flex-col h-full">
          <div className="flex size-full flex-col overflow-hidden">
            <div className="flex-1 size-full overflow-hidden">
              <DataGrid data={EXAMPLE_DATA} columns={columns} state={form} />
            </div>
          </div>
        </form>
      </div>
    );
  },
};
