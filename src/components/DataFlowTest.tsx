import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Upload,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";

const DataFlowTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const dataContext = useDataContext();

  const runDataFlowTest = async () => {
    setTesting(true);
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    };

    try {
      // Test 1: DataContext availability
      results.tests.push({
        name: "DataContext Availability",
        status: dataContext ? "pass" : "fail",
        message: dataContext
          ? "DataContext is available and accessible"
          : "DataContext is not available",
        details: {
          hasContext: !!dataContext,
          contextMethods: dataContext ? Object.keys(dataContext).length : 0,
        },
      });

      // Test 2: Data completeness check
      if (dataContext) {
        const completeness = dataContext.getDataCompleteness();
        results.tests.push({
          name: "Data Completeness",
          status: completeness > 0 ? "pass" : "warn",
          message: `Data completeness: ${completeness.toFixed(1)}%`,
          details: {
            completeness,
            threshold: 50,
          },
        });

        // Test 3: Business data structure
        const businessData = dataContext.businessData;
        const hasImportedProducts =
          businessData.importedProducts?.value?.length > 0;
        results.tests.push({
          name: "Imported Products Data",
          status: hasImportedProducts ? "pass" : "warn",
          message: hasImportedProducts
            ? `${businessData.importedProducts.value.length} products found`
            : "No imported products found",
          details: {
            productsCount: businessData.importedProducts?.value?.length || 0,
            dataSource: businessData.importedProducts?.source,
            lastUpdated: businessData.importedProducts?.lastUpdated,
          },
        });

        // Test 4: File metadata
        const fileMetadata = businessData.fileMetadata?.value;
        results.tests.push({
          name: "File Metadata",
          status: fileMetadata?.fileName ? "pass" : "warn",
          message: fileMetadata?.fileName
            ? `File: ${fileMetadata.fileName}`
            : "No file metadata found",
          details: {
            fileName: fileMetadata?.fileName,
            fileSize: fileMetadata?.fileSize,
            processingStatus: fileMetadata?.processingStatus,
            uploadDate: fileMetadata?.uploadDate,
          },
        });

        // Test 5: Financial calculations
        const totalOriginalValue = businessData.totalOriginalValue?.value || 0;
        const totalNewValue = businessData.totalNewValue?.value || 0;
        results.tests.push({
          name: "Financial Calculations",
          status: totalOriginalValue > 0 ? "pass" : "warn",
          message:
            totalOriginalValue > 0
              ? `Original: $${totalOriginalValue.toLocaleString()}, New: $${totalNewValue.toLocaleString()}`
              : "No financial data calculated",
          details: {
            totalOriginalValue,
            totalNewValue,
            totalImpact: totalNewValue - totalOriginalValue,
            averageTariffRate: businessData.averageTariffRate?.value || 0,
          },
        });

        // Test 6: Data source summary
        const sourceSummary = dataContext.getDataSourceSummary();
        results.tests.push({
          name: "Data Source Distribution",
          status: sourceSummary.user > 0 ? "pass" : "warn",
          message: `User: ${sourceSummary.user}, Template: ${sourceSummary.template}, Calculated: ${sourceSummary.calculated}`,
          details: sourceSummary,
        });
      }

      // Test 7: Upload status
      const uploadComplete = dataContext?.getUploadStatus() || false;
      results.tests.push({
        name: "Upload Status",
        status: uploadComplete ? "pass" : "warn",
        message: uploadComplete
          ? "Upload process completed"
          : "No completed uploads detected",
        details: {
          uploadComplete,
        },
      });
    } catch (error) {
      results.tests.push({
        name: "Test Execution",
        status: "fail",
        message: `Test failed: ${error.message}`,
        details: {
          error: error.message,
          stack: error.stack,
        },
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warn":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800";
      case "warn":
        return "bg-yellow-100 text-yellow-800";
      case "fail":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const passedTests =
    testResults?.tests.filter((t: any) => t.status === "pass").length || 0;
  const totalTests = testResults?.tests.length || 0;

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Flow Diagnostics
          </CardTitle>
          <Button
            onClick={runDataFlowTest}
            disabled={testing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Testing..." : "Run Test"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!testResults && (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Click "Run Test" to diagnose data flow between file upload and
              dashboard display.
            </AlertDescription>
          </Alert>
        )}

        {testResults && (
          <>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Test Results</span>
              </div>
              <Badge
                variant={passedTests === totalTests ? "default" : "secondary"}
              >
                {passedTests}/{totalTests} Passed
              </Badge>
            </div>

            <div className="space-y-3">
              {testResults.tests.map((test: any, index: number) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {test.message}
                  </p>
                  {test.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Test completed at:{" "}
                {new Date(testResults.timestamp).toLocaleString()}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataFlowTest;
