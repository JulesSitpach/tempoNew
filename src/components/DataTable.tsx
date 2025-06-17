import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Save,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface DataTableProps {
  data?: Array<Record<string, any>>;
  columns?: Array<{
    header: string;
    accessorKey: string;
    cell?: (info: any) => React.ReactNode;
    sortable?: boolean;
  }>;
  onDataChange?: (data: Array<Record<string, any>>) => void;
}

const DataTable = ({
  data = [
    {
      id: 1,
      sku: "ABC123",
      description: "Widget A",
      cost: 10.5,
      tariff: 25,
      totalCost: 13.13,
      margin: 15.2,
    },
    {
      id: 2,
      sku: "DEF456",
      description: "Widget B",
      cost: 15.75,
      tariff: 10,
      totalCost: 17.33,
      margin: 12.8,
    },
    {
      id: 3,
      sku: "GHI789",
      description: "Widget C",
      cost: 8.25,
      tariff: 15,
      totalCost: 9.49,
      margin: 18.5,
    },
    {
      id: 4,
      sku: "JKL012",
      description: "Widget D",
      cost: 22.0,
      tariff: 25,
      totalCost: 27.5,
      margin: 9.1,
    },
    {
      id: 5,
      sku: "MNO345",
      description: "Widget E",
      cost: 5.5,
      tariff: 0,
      totalCost: 5.5,
      margin: 25.0,
    },
  ],
  columns = [
    { header: "SKU", accessorKey: "sku", sortable: true },
    { header: "Description", accessorKey: "description", sortable: true },
    {
      header: "Base Cost ($)",
      accessorKey: "cost",
      cell: info => {
        const value = info.getValue();
        return value != null ? `${value.toFixed(2)}` : "$0.00";
      },
      sortable: true,
    },
    {
      header: "Tariff (%)",
      accessorKey: "tariff",
      cell: info => {
        const value = info.getValue();
        return (
          <Badge
            variant={
              value > 20 ? "destructive" : value > 0 ? "secondary" : "outline"
            }
          >
            {value}%
          </Badge>
        );
      },
      sortable: true,
    },
    {
      header: "Total Cost ($)",
      accessorKey: "totalCost",
      cell: info => {
        const value = info.getValue();
        return value != null ? `${value.toFixed(2)}` : "$0.00";
      },
      sortable: true,
    },
    {
      header: "Margin (%)",
      accessorKey: "margin",
      cell: info => {
        const value = info.getValue();
        const displayValue = value != null ? value : 0;
        return (
          <Badge
            variant={
              displayValue < 10
                ? "destructive"
                : displayValue < 15
                ? "secondary"
                : "default"
            }
          >
            {displayValue.toFixed(1)}%
          </Badge>
        );
      },
      sortable: true,
    },
  ],
  onDataChange = () => {},
}: DataTableProps) => {
  const [tableData, setTableData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    column: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, tableData.length);
  const currentData = tableData.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setTableData(sortedData);
    onDataChange(sortedData);
  };

  // Handle cell editing
  const startEditing = (rowIndex: number, column: string, value: any) => {
    setEditingCell({ rowIndex, column });
    setEditValue(String(value));
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = (rowIndex: number, column: string) => {
    const updatedData = [...tableData];
    const actualRowIndex = startIndex + rowIndex;

    // Convert value to appropriate type based on column
    let parsedValue: any = editValue;
    if (column === "cost" || column === "totalCost" || column === "margin") {
      parsedValue = parseFloat(editValue);
    } else if (column === "tariff") {
      parsedValue = parseInt(editValue, 10);
    }

    updatedData[actualRowIndex][column] = parsedValue;

    // If cost or tariff changes, recalculate totalCost
    if (column === "cost" || column === "tariff") {
      const cost =
        column === "cost" ? parsedValue : updatedData[actualRowIndex].cost;
      const tariff =
        column === "tariff" ? parsedValue : updatedData[actualRowIndex].tariff;
      updatedData[actualRowIndex].totalCost = cost * (1 + tariff / 100);
    }

    setTableData(updatedData);
    setEditingCell(null);
    setEditValue("");
    onDataChange(updatedData);
  };

  return (
    <div className="w-full bg-background rounded-md border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.accessorKey} className="font-semibold">
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6"
                        onClick={() => handleSort(column.accessorKey)}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex}>
                  {columns.map(column => (
                    <TableCell key={`${row.id}-${column.accessorKey}`}>
                      {editingCell &&
                      editingCell.rowIndex === rowIndex &&
                      editingCell.column === column.accessorKey ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="h-8 w-full"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              saveEdit(rowIndex, column.accessorKey)
                            }
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={cancelEditing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : column.cell ? (
                        column.cell({ getValue: () => row[column.accessorKey] })
                      ) : (
                        row[column.accessorKey]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        // Find first editable column
                        const editableColumn = columns.find(
                          col => !editingCell
                        );
                        if (editableColumn) {
                          startEditing(
                            rowIndex,
                            editableColumn.accessorKey,
                            row[editableColumn.accessorKey]
                          );
                        }
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {tableData.length > itemsPerPage && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {tableData.length} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  onClick={() => currentPage > 1 && setCurrentPage(1)}
                  className={`cursor-pointer ${
                    currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    currentPage > 1 &&
                    setCurrentPage(prev => Math.max(prev - 1, 1))
                  }
                  className={`cursor-pointer ${
                    currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    currentPage < totalPages &&
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  className={`cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(totalPages)
                  }
                  className={`cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <ChevronsRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default DataTable;
