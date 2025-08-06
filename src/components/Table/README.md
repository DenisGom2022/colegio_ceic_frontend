# Table Component Documentation

## Overview

The Table component is a reusable React component that provides a styled and feature-rich data table with consistent styling that matches the design in the reference image. It supports various features such as:

- Column definitions with custom rendering
- Action buttons
- Pagination
- Loading state
- Empty state message
- Row click events
- Index column

## Usage

```tsx
import Table from '../../components/Table';
import type { ColumnDefinition, ActionButton } from '../../components/Table';

// Define your columns
const columns: ColumnDefinition<YourDataType>[] = [
  {
    header: 'Column Name',
    accessor: 'propertyName',  // Simple property access
    icon: <YourIcon />,        // Optional icon
    width: '100px',            // Optional width
    align: 'left'              // Optional alignment ('left', 'center', 'right')
  },
  {
    header: 'Complex Column',
    // Function for complex rendering
    accessor: (item) => (
      <span className={styles.badge}>{item.someProperty}</span>
    ),
    icon: <AnotherIcon />
  }
];

// Define actions (optional)
const actions: ActionButton[] = [
  {
    icon: <ViewIcon />,
    title: 'Ver detalle',
    onClick: (item) => handleViewItem(item)
  },
  {
    icon: <EditIcon />,
    title: 'Editar',
    onClick: (item) => handleEditItem(item)
  }
];

// Use the Table component
<Table
  data={yourData}
  columns={columns}
  actions={actions}
  showIndex={true}
  currentPage={page}
  pageSize={pageSize}
  noDataMessage="Sin resultados"
  className={styles.yourCustomClass}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | The array of data to display in the table |
| `columns` | `ColumnDefinition<T>[]` | The column definitions (see below) |
| `actions` | `ActionButton[]` | Optional array of action buttons to display for each row |
| `onRowClick` | `(item: T, index: number) => void` | Optional function to handle row clicks |
| `isLoading` | `boolean` | Optional flag to show loading state |
| `noDataMessage` | `string` | Optional message to display when there's no data |
| `className` | `string` | Optional CSS class to apply to the table wrapper |
| `showIndex` | `boolean` | Optional flag to show index column |
| `currentPage` | `number` | Optional current page for index calculation |
| `pageSize` | `number` | Optional page size for index calculation |

### ColumnDefinition

Each column definition requires:

| Property | Type | Description |
|----------|------|-------------|
| `header` | `string` | The column header text |
| `accessor` | `keyof T \| ((item: T) => React.ReactNode)` | Property name or render function |
| `icon` | `React.ReactNode` | Optional icon to display next to header |
| `width` | `string` | Optional width of the column |
| `align` | `'left' \| 'center' \| 'right'` | Optional text alignment |

### ActionButton

Each action button requires:

| Property | Type | Description |
|----------|------|-------------|
| `icon` | `React.ReactNode` | Icon to display in the button |
| `title` | `string` | Title/tooltip for the button |
| `onClick` | `(item: any, index: number) => void` | Click handler for the button |

## Styling

The component comes with built-in styling, but you can customize it further by:

1. Adding a custom className and defining additional styles
2. Modifying the Table.module.css file directly

Key CSS classes that can be overridden:

- `.tableWrapper` - The outer container
- `.table` - The table element
- `.tableHeader` - Table headers
- `.tableRow` - Table rows
- `.actionButton` - Action buttons
- `.badge` - Badge styling for categories
- `.date` - Date styling

## Implementation Example

See the provided `TableExample.tsx` for a complete implementation example.
