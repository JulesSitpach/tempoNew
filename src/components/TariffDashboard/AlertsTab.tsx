// Alerts Tab Component
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { DataTable } from "./SharedComponents";

interface AlertsTabProps {
  highImpactItems: any[];
  tableData: any[];
}

export const AlertsTab = ({ highImpactItems, tableData }: AlertsTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="dashboard-card border-border/30">
        <CardHeader>
          <CardTitle>Risk Alerts & Notifications</CardTitle>
          <CardDescription>
            Monitor critical market conditions and portfolio risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {highImpactItems.length > 0 ? (
              highImpactItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center p-4 border border-red-500/20 rounded-lg bg-red-500/5"
                >
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.sku} - {item.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Risk Level: High | Impact:{" "}
                      <span className="text-red-400 font-medium">
                        {item.marginImpact?.toFixed(1) || 0}%
                      </span>
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    Review
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 chart-container">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-green-400 mb-2" />
                  <p className="text-muted-foreground">
                    All systems operational
                  </p>
                </div>
              </div>
            )}
          </div>
          <DataTable data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
};
