'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import { Barangay } from '@/lib/barangay-validation';

export const columns: ColumnDef<Barangay>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'city.name',
    header: 'CITY'
  },
  {
    accessorKey: 'city.province.name',
    header: 'PROVINCE'
  },
  {
    accessorKey: 'updatedAt',
    header: 'UPDATED AT',
    cell: ({ row }) => {
      return <span>{format(row.original.updatedAt, 'dd MMM yyyy')}</span>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
