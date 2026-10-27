"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { DataTableFeatures } from "@/components/ui/data-table"

import { CellAction } from "./cell-action"

export type BillboardColumn = {
  id: string
  label: string;
  createdAt: string;
}

export const columns: ColumnDef<DataTableFeatures, BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
