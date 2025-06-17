// Products Tab Component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "./SharedComponents";

interface ProductsTabProps {
  tableData: any[];
}

export const ProductsTab = ({ tableData }: ProductsTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="dashboard-card border-border/30">
        <CardHeader>
          <CardTitle>Product Portfolio Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of individual product impacts and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
};
