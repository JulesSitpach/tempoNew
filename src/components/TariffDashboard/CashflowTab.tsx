// Cashflow Tab Component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CashFlowProjection } from "./types";

interface CashflowTabProps {
  totalImpact: number;
  potentialSavings: {
    totalPotential: number;
  };
  cashFlowProjections: CashFlowProjection[];
}

export const CashflowTab = ({
  totalImpact,
  potentialSavings,
  cashFlowProjections,
}: CashflowTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="dashboard-card border-border/30">
        <CardHeader>
          <CardTitle>Cash Flow Projections</CardTitle>
          <CardDescription>
            12-month financial impact forecast for budget planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Cash Flow Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 font-medium">
                Monthly Impact
              </div>
              <div className="text-xl font-bold text-red-700">
                -${Math.abs(totalImpact).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-red-100 rounded-lg border border-red-300">
              <div className="text-sm text-red-700 font-medium">
                Quarterly Impact
              </div>
              <div className="text-xl font-bold text-red-800">
                -${Math.abs(totalImpact * 3).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-red-200 rounded-lg border border-red-400">
              <div className="text-sm text-red-800 font-medium">
                Annual Impact
              </div>
              <div className="text-xl font-bold text-red-900">
                -${Math.abs(totalImpact * 12).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">
                Potential Recovery
              </div>
              <div className="text-xl font-bold text-green-700">
                ${potentialSavings.totalPotential.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-card/50 border-border">
                  <TableHead className="text-foreground font-semibold">
                    Month
                  </TableHead>
                  <TableHead className="text-right text-foreground font-semibold">
                    Additional Cost
                  </TableHead>
                  <TableHead className="text-right text-foreground font-semibold">
                    Cumulative Impact
                  </TableHead>
                  <TableHead className="text-right text-foreground font-semibold">
                    Cash Flow Impact
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashFlowProjections.map((projection, index) => (
                  <TableRow
                    key={projection.period}
                    className="border-border hover:bg-muted/50"
                  >
                    <TableCell className="font-medium text-foreground">
                      {projection.period}
                    </TableCell>
                    <TableCell className="text-right text-red-400 font-medium">
                      ${Math.abs(projection.impact).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-300 font-semibold">
                      ${Math.abs(projection.cumulativeImpact).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-200 font-bold">
                      -$
                      {Math.abs(projection.impact).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
