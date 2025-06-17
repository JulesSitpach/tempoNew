// Shared components for the Tariff Impact Dashboard
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { DataSourceSummary, DataValidation } from "./types";

export const DataTable = ({ data }: { data: any[] }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Original Cost</TableHead>
          <TableHead className="text-right">Tariff Rate</TableHead>
          <TableHead className="text-right">New Cost</TableHead>
          <TableHead className="text-right">Impact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id || index}>
            <TableCell className="font-medium">{item.sku}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-right">
              ${item.cost?.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {item.tariff?.toFixed(1)}%
            </TableCell>
            <TableCell className="text-right">
              ${item.totalCost?.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {item.margin?.toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export const DataSourceIndicator = ({
  dataSource,
  showTooltip = true,
}: {
  dataSource: any;
  showTooltip?: boolean;
}) => (
  <Badge variant="outline" className="text-xs">
    {dataSource.type === "external" ? "API" : "User"}
    {dataSource.confidence && ` (${dataSource.confidence}%)`}
  </Badge>
);

export const DataValidationPanel = ({
  validation,
  dataSourceSummary,
  onUpdateData,
}: {
  validation: DataValidation;
  dataSourceSummary: DataSourceSummary;
  onUpdateData: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Data Validation</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Completeness</span>
          <span className="font-medium">{validation.completeness}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Valid Records</span>
          <span className="font-medium">{validation.userDataCount}</span>
        </div>
        {validation.criticalFieldsMissing.length > 0 && (
          <div className="text-sm text-red-500">
            Missing: {validation.criticalFieldsMissing.join(", ")}
          </div>
        )}
        <Button
          onClick={onUpdateData}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </CardContent>
  </Card>
);
