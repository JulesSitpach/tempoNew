import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataContext } from "@/contexts/DataContext";
import { SMBContextService } from "@/services/apiServices";
import {
  AlertTriangle,
  Building,
  CheckCircle,
  DollarSign,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface SMBContextReceiverProps {
  onContextReceived?: (context: any) => void;
  className?: string;
}

interface UserContextData {
  companySize: number;
  industry: string;
  location: {
    country: string;
    state?: string;
    region: string;
  };
  currentSpendingPatterns: {
    averageOrderValue: number;
    orderFrequency: string;
    primarySuppliers: string[];
  };
  budgetConstraints: {
    maxMonthlyImpact: number;
    cashFlowSensitivity: string;
  };
}

const SMBContextReceiver: React.FC<SMBContextReceiverProps> = ({
  onContextReceived,
  className = "",
}) => {
  const [contextData, setContextData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const dataContext = useDataContext();

  // Listen for messages from the primary application
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // In production, verify the origin
      // if (event.origin !== 'https://your-primary-app.com') return;

      if (event.data.type === "SMB_CONTEXT_DATA") {
        setIsProcessing(true);
        setError(null);

        try {
          const userContextData: UserContextData = event.data.payload;

          // Process the user context data
          const processedContext = await SMBContextService.receiveUserContext(
            userContextData
          );

          setContextData(processedContext);
          setSessionId(processedContext.sessionId);

          // Update the DataContext with SMB profile
          dataContext.updateSMBContext(processedContext);

          // Notify parent component
          if (onContextReceived) {
            onContextReceived(processedContext);
          }

          // Send confirmation back to primary app
          (event.source as Window)?.postMessage(
            {
              type: "SMB_CONTEXT_RECEIVED",
              sessionId: processedContext.sessionId,
              status: "success",
            },
            event.origin
          );
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to process context data";
          setError(errorMessage);

          // Send error back to primary app
          (event.source as Window)?.postMessage(
            {
              type: "SMB_CONTEXT_ERROR",
              error: errorMessage,
              status: "error",
            },
            event.origin
          );
        } finally {
          setIsProcessing(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Send ready signal to primary app
    window.parent.postMessage(
      {
        type: "SMB_CALCULATOR_READY",
        timestamp: new Date().toISOString(),
      },
      "*"
    );

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dataContext, onContextReceived]);

  // Try to load existing context from session storage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const existingSessionId = urlParams.get("smbSessionId");

    if (existingSessionId) {
      const existingContext =
        SMBContextService.getSMBContext(existingSessionId);
      if (existingContext) {
        setContextData(existingContext);
        setSessionId(existingSessionId);
        dataContext.updateSMBContext(existingContext);

        if (onContextReceived) {
          onContextReceived(existingContext);
        }
      }
    }
  }, [dataContext, onContextReceived]);

  const getBusinessSizeLabel = (classification: string) => {
    switch (classification) {
      case "micro":
        return "Micro Business (1-9 employees)";
      case "small":
        return "Small Business (10-49 employees)";
      case "medium":
        return "Medium Business (50-249 employees)";
      case "large":
        return "Large Business (250+ employees)";
      default:
        return "Unknown";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "conservative":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "aggressive":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isProcessing) {
    return (
      <Card className={`border-blue-200 bg-blue-50 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-medium text-blue-800">
                Processing SMB Context...
              </p>
              <p className="text-sm text-blue-600">
                Analyzing your business profile for personalized insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Error processing business context:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!contextData) {
    return (
      <Card className={`border-gray-200 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            SMB Context Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Waiting for Business Context
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This dashboard will be personalized with your business
                information from the primary application.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-blue-800 mb-2">
                What we'll analyze:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Business size and industry classification</li>
                <li>• Current procurement patterns and spending</li>
                <li>• Cash flow sensitivity and budget constraints</li>
                <li>• Risk tolerance and compliance requirements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { smbProfile, riskMultipliers, thresholds } = contextData;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* SMB Profile Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg text-green-800">
              <CheckCircle className="h-5 w-5 mr-2" />
              SMB Profile Active
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Session: {sessionId?.slice(-8)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Business Classification */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getBusinessSizeLabel(smbProfile.businessClassification)}
                </p>
                <p className="text-xs text-gray-600">
                  {smbProfile.employeeCount} employees
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {smbProfile.geographicLocation.region}
                </p>
                <p className="text-xs text-gray-600">
                  {smbProfile.geographicLocation.country}
                </p>
              </div>
            </div>

            {/* Cash Flow Sensitivity */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Cash Flow: {smbProfile.budgetConstraints.cashFlowSensitivity}
                </p>
                <p className="text-xs text-gray-600">
                  Max Impact: $
                  {smbProfile.budgetConstraints.maxMonthlyImpact.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Risk Tolerance */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Shield className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <Badge
                  className={getRiskLevelColor(
                    smbProfile.riskProfile.riskTolerance
                  )}
                >
                  {smbProfile.riskProfile.riskTolerance}
                </Badge>
                <p className="text-xs text-gray-600 mt-1">
                  Risk tolerance level
                </p>
              </div>
            </div>
          </div>

          {/* Risk Multipliers */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">
              SMB Risk Adjustments Applied:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Flow Multiplier:</span>
                <span className="font-medium">
                  {riskMultipliers.cashFlowMultiplier.toFixed(1)}x
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier Risk Multiplier:</span>
                <span className="font-medium">
                  {riskMultipliers.supplierRiskMultiplier.toFixed(1)}x
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compliance Multiplier:</span>
                <span className="font-medium">
                  {riskMultipliers.complianceMultiplier.toFixed(1)}x
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-yellow-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            SMB-Specific Alert Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Critical Impact:</span>
                <span className="font-medium text-red-600">
                  ${thresholds.criticalImpactThreshold.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Impact:</span>
                <span className="font-medium text-orange-600">
                  ${thresholds.highImpactThreshold.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Medium Impact:</span>
                <span className="font-medium text-yellow-600">
                  ${thresholds.mediumImpactThreshold.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Flow Alert:</span>
                <span className="font-medium text-blue-600">
                  ${thresholds.cashFlowAlertThreshold.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMBContextReceiver;
