# @medusa-clone/data-grid

A powerful, virtualized data grid component for React with built-in form integration and flexible cell types.

## Features

- ✨ **Virtualized scrolling** - Handle thousands of rows efficiently
- 📝 **Form integration** - Built on react-hook-form for seamless form state management
- 🎨 **Multiple cell types** - Text, currency, and custom cells
- ⌨️ **Keyboard navigation** - Full keyboard support for accessibility
- 🎯 **TypeScript** - Fully typed with TypeScript
- 📦 **Lightweight** - Optimized bundle size with minimal dependencies

## Installation

### 1. Install the package

```bash
npm install @medusa-clone/data-grid react-hook-form
```

```bash
pnpm add @medusa-clone/data-grid react-hook-form
```

```bash
yarn add @medusa-clone/data-grid react-hook-form
```

### 2. Import styles

Add this to your app's entry point (`main.tsx`, `App.tsx`, or `_app.tsx`):

```tsx
import "@medusa-clone/data-grid/styles.css";
```

### 3. Optional: Install validation (recommended)

For form validation support:

```bash
npm install zod @hookform/resolvers
```

## Quick Start

```tsx
import { DataGrid } from "@medusa-clone/data-grid";
import "@medusa-clone/data-grid/styles.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define your data structure
const data = [
  { id: 1, name: "John Doe", price: 99.99 },
  { id: 2, name: "Jane Smith", price: 149.99 },
];

// Define columns
const columns = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: (context) => <DataGrid.TextCell context={context} />,
    meta: {
      type: "text",
      field: (context) => `data.${context.row.index}.name`,
    },
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    cell: (context) => <DataGrid.CurrencyCell context={context} />,
    meta: {
      type: "number",
      field: (context) => `data.${context.row.index}.price`,
    },
  },
];

// Optional: Define validation schema
const schema = z.object({
  data: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      price: z.number().positive("Price must be positive"),
    })
  ),
});

function App() {
  const form = useForm({
    resolver: zodResolver(schema), // Optional
    defaultValues: { data },
  });

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <DataGrid data={data} columns={columns} state={form} />
    </div>
  );
}
```

## API Reference

### DataGrid Props

```tsx
interface DataGridRootProps<TData> {
  /** Array of data to display */
  data: TData[];

  /** Column definitions */
  columns: ColumnDef<TData>[];

  /** react-hook-form instance */
  state: UseFormReturn<any>;
}
```

### Column Definition

```tsx
interface ColumnDef<TData> {
  /** Unique column identifier */
  id: string;

  /** Data accessor key */
  accessorKey: keyof TData;

  /** Optional header label */
  header?: string;

  /** Cell renderer */
  cell: (context: CellContext<TData>) => React.ReactNode;

  /** Column metadata */
  meta: {
    /** Cell type: "text" | "number" | "currency" */
    type: string;

    /** Field path for form integration */
    field: (context: CellContext<TData>) => string;
  };
}
```

### Built-in Cell Components

#### TextCell

```tsx
<DataGrid.TextCell context={context} />
```

Standard text input cell for string values.

#### CurrencyCell

```tsx
<DataGrid.CurrencyCell context={context} />
```

Formatted currency input with locale support.

## Requirements

- React 18+ or React 19+
- react-hook-form 7+

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/baroxdev/medusa-clone).
