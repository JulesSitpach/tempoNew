// Analysis Tab Component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "./SharedComponents";

interface AnalysisTabProps {
  displayData: any[];
  tableData: any[];
}

export const AnalysisTab = ({ displayData, tableData }: AnalysisTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="dashboard-card border-border/30">
        <CardHeader>
          <CardTitle>Detailed Impact Analysis</CardTitle>
          <CardDescription>
            Product-level breakdown of tariff impacts and cost increases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Impact Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {
                    displayData.filter(
                      item => Math.abs(item.marginImpact || 0) <= 5
                    ).length
                  }
                </div>
                <div className="text-sm text-green-700 font-medium">
                  Low Impact Products
                </div>
                <div className="text-xs text-green-600">≤5% margin impact</div>
              </div>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {
                    displayData.filter(
                      item =>
                        Math.abs(item.marginImpact || 0) > 5 &&
                        Math.abs(item.marginImpact || 0) <= 15
                    ).length
                  }
                </div>
                <div className="text-sm text-yellow-700 font-medium">
                  Medium Impact Products
                </div>
                <div className="text-xs text-yellow-600">
                  5-15% margin impact
                </div>
              </div>
            </div>
            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {
                    displayData.filter(
                      item => Math.abs(item.marginImpact || 0) > 15
                    ).length
                  }
                </div>
                <div className="text-sm text-red-700 font-medium">
                  High Impact Products
                </div>
                <div className="text-xs text-red-600">
                  &gt;15% margin impact
                </div>
              </div>
            </div>
          </div>

          <DataTable data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
};
