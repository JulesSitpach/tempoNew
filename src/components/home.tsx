import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflow, WorkflowStep } from "@/contexts/WorkflowContext";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  Circle,
  Globe,
  LogOut,
  Play,
  Trophy,
  Truck,
  Upload,
  User,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AIRecommendations from "./AIRecommendations";
import AlertsMonitoring from "./AlertsMonitoring";
import APIStatusIndicator from "./APIStatusIndicator";
import FileImportSystem from "./FileImportSystem";
import SupplierDiversification from "./SupplierDiversification";
import SupplyChainPlanner from "./SupplyChainPlanner";
import TariffImpactDashboard from "./TariffImpactDashboard";
import WorkforcePlanner from "./WorkforcePlanner";

// Enhanced NavigationBar with 9/10 SaaS Standards
const NavigationBar = () => {
  const { currentStep, canNavigateToStep } = useWorkflow();
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation("dashboard");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModuleMenu, setShowModuleMenu] = useState(false);

  // Language toggle handler
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  const navigationItems = [
    {
      step: "file-import",
      label: t("navigation.steps.import"),
      icon: Upload,
    },
    {
      step: "tariff-analysis",
      label: t("navigation.steps.analysis"),
      icon: BarChart3,
    },
    {
      step: "supplier-diversification",
      label: t("navigation.steps.suppliers"),
      icon: Users,
    },
    {
      step: "supply-chain-planning",
      label: t("navigation.steps.planning"),
      icon: Truck,
    },
    {
      step: "workforce-planning",
      label: t("navigation.steps.workforce"),
      icon: User,
    },
    {
      step: "alerts-setup",
      label: t("navigation.steps.alerts"),
      icon: AlertTriangle,
    },
    {
      step: "ai-recommendations",
      label: t("navigation.steps.ai"),
      icon: Brain,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground tracking-tight">
                  {t("navigation.title")}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t("navigation.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Module Navigation Dropdown */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModuleMenu(!showModuleMenu)}
                className="flex items-center gap-2 text-sm"
                aria-label={t("navigation.menuButton")}
              >
                <span>Modules</span>
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    showModuleMenu ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {showModuleMenu && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-popover border border-border rounded-md shadow-lg z-50">
                  <div className="p-2 space-y-1">
                    {navigationItems.map(item => {
                      const Icon = item.icon;
                      const isAccessible = canNavigateToStep(
                        item.step as WorkflowStep
                      );
                      const isCurrent = currentStep === item.step;

                      return (
                        <button
                          key={item.step}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-left transition-colors ${
                            isCurrent
                              ? "bg-primary text-primary-foreground"
                              : isAccessible
                              ? "hover:bg-accent text-foreground"
                              : "text-muted-foreground cursor-not-allowed opacity-60"
                          }`}
                          disabled={!isAccessible}
                          onClick={() => {
                            if (isAccessible) {
                              handleStepNavigation(item.step as WorkflowStep);
                              setShowModuleMenu(false);
                            }
                          }}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                          {isCurrent && (
                            <div className="ml-auto h-1.5 w-1.5 bg-current rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: API Status, Language Toggle, and User Menu */}
          <div className="flex items-center gap-3">
            <APIStatusIndicator />

            {/* Language Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm"
              title={t("navigation.languageToggle")}
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase font-medium">
                {i18n.language === "en" ? "ES" : "EN"}
              </span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">
                  {user?.email?.split("@")[0] || "User"}
                </span>
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    showUserMenu ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                  <div className="p-2">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("navigation.signOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// HomeContent Component with Step-by-Step Workflow
const HomeContent = () => {
  const {
    currentStep,
    goToStep,
    workflowData,
    updateWorkflowData,
    canNavigateToStep,
    nextStep,
    previousStep,
    canProceed,
    getStepProgress,
    resetWorkflow,
  } = useWorkflow();
  const { t, i18n } = useTranslation("dashboard");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            previousStep();
            break;
          case "ArrowRight":
            event.preventDefault();
            if (canProceed) {
              nextStep();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canProceed, nextStep, previousStep]);
  // Listen for manual navigation from SupplierDiversification
  useEffect(() => {
    const handleNavigateToSupplyChain = () => {
      console.log("Custom navigation event received");
      // Navigate to supply chain planning step
      goToStep("supply-chain-planning");
    };

    window.addEventListener(
      "navigateToSupplyChain",
      handleNavigateToSupplyChain
    );
    return () =>
      window.removeEventListener(
        "navigateToSupplyChain",
        handleNavigateToSupplyChain
      );
  }, [goToStep]);

  const progress = useMemo(() => getStepProgress(), [getStepProgress]);
  const progressPercentage = useMemo(
    () => (progress.current / progress.total) * 100,
    [progress]
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const handleStepNavigation = useCallback(
    (step: WorkflowStep) => {
      goToStep(step);
    },
    [goToStep]
  );

  const getStepIcon = (step: string) => {
    switch (step) {
      case "welcome":
        return <Circle className="h-5 w-5" />;
      case "file-import":
        return <Upload className="h-5 w-5" />;
      case "tariff-analysis":
        return <BarChart3 className="h-5 w-5" />;
      case "supplier-diversification":
        return <Users className="h-5 w-5" />;
      case "supply-chain-planning":
        return <Truck className="h-5 w-5" />;
      case "workforce-planning":
        return <Users className="h-5 w5" />;
      case "alerts-setup":
        return <AlertTriangle className="h-5 w-5" />;
      case "ai-recommendations":
        return <Brain className="h-5 w-5" />;
      case "complete":
        return <Trophy className="h-5 w-5" />;
      default:
        return <Circle className="h-5 w-5" />;
    }
  };
  const getStepTitle = (step: string) => {
    switch (step) {
      case "welcome":
        return t("dashboard.welcome", "Welcome");
      case "file-import":
        return t("modules.fileImport");
      case "tariff-analysis":
        return t("modules.tariffAnalysis");
      case "supplier-diversification":
        return t("modules.supplierDiversification");
      case "supply-chain-planning":
        return t("modules.supplyChainPlanning");
      case "workforce-planning":
        return t("modules.workforcePlanning");
      case "alerts-setup":
        return t("modules.alertsSetup");
      case "ai-recommendations":
        return t("modules.aiRecommendations");
      case "complete":
        return t("modules.workflowComplete");
      default:
        return step;
    }
  };
  const getStepDescription = (step: string) => {
    switch (step) {
      case "welcome":
        return t("dashboard.welcome");
      case "file-import":
        return t("modules.fileImportDesc");
      case "tariff-analysis":
        return t("modules.tariffAnalysisDesc");
      case "supplier-diversification":
        return t("modules.supplierDiversificationDesc");
      case "supply-chain-planning":
        return t("modules.supplyChainPlanningDesc");
      case "workforce-planning":
        return t("modules.workforcePlanningDesc");
      case "alerts-setup":
        return t("modules.alertsSetupDesc");
      case "ai-recommendations":
        return t("modules.aiRecommendationsDesc");
      case "complete":
        return t("modules.completeDesc");
      default:
        return "";
    }
  };

  const handleFileImport = (data: any) => {
    updateWorkflowData("importedData", data);
  };

  const handleAnalysisComplete = (results: any) => {
    updateWorkflowData("analysisResults", results);
  };

  const exportTariffReport = (data: any, format: string) => {
    const reportData = {
      fileName: data.fileName,
      generatedDate: new Date().toISOString(),
      summary: {
        totalProducts: data.totalProducts,
        totalOriginalValue: data.totalOriginalValue,
        totalNewValue: data.totalNewValue,
        totalImpact: data.totalImpact,
        impactPercentage: data.impactPercentage,
        averageTariffRate: data.averageTariffRate,
      },
      products: data.extractedData,
      cashFlowProjections: data.cashFlowProjections,
      potentialSavings: data.potentialSavings,
    };

    if (format === "csv") {
      exportToCSV(reportData);
    } else if (format === "excel") {
      exportToExcel(reportData);
    } else if (format === "pdf") {
      exportToPDF(reportData);
    }
  };

  const exportToCSV = (data: any) => {
    const csvContent = [
      // Header
      ["Tariff Impact Analysis Report"],
      [`Generated: ${new Date(data.generatedDate).toLocaleString()}`],
      [`Source File: ${data.fileName}`],
      [""],
      // Summary
      ["EXECUTIVE SUMMARY"],
      [`Total Products Analyzed: ${data.summary.totalProducts}`],
      [
        `Original Portfolio Value: ${data.summary.totalOriginalValue?.toLocaleString()}`,
      ],
      [`New Portfolio Value: ${data.summary.totalNewValue?.toLocaleString()}`],
      [`Total Impact: ${data.summary.totalImpact?.toLocaleString()}`],
      [`Impact Percentage: ${data.summary.impactPercentage?.toFixed(2)}%`],
      [`Average Tariff Rate: ${data.summary.averageTariffRate?.toFixed(2)}%`],
      [""],
      // Product Details Header
      ["PRODUCT DETAILS"],
      [
        "SKU",
        "Description",
        "Original Cost",
        "Quantity",
        "Tariff Rate %",
        "New Cost",
        "Total Impact",
        "Margin Impact %",
        "HTS Code",
      ],
      // Product Data
      ...data.products.map((product: any) => [
        product.sku,
        product.description,
        product.originalCost,
        product.quantity || 1,
        product.tariffRate,
        product.newCost,
        (
          (product.newCost - product.originalCost) *
          (product.quantity || 1)
        ).toFixed(2),
        product.marginImpact?.toFixed(2),
        product.htsCode || "N/A",
      ]),
    ];

    const csvString = csvContent.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tariff-impact-analysis-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (data: any) => {
    // For now, export as CSV with Excel-friendly formatting
    // In production, use a library like xlsx
    exportToCSV(data);
  };

  const exportToPDF = (data: any) => {
    // For now, create a formatted text version
    // In production, use a PDF library like jsPDF
    const pdfContent = `
TARIFF IMPACT ANALYSIS REPORT

Generated: ${new Date(data.generatedDate).toLocaleString()}
Source File: ${data.fileName}

EXECUTIVE SUMMARY
================
Total Products Analyzed: ${data.summary.totalProducts}
Original Portfolio Value: ${data.summary.totalOriginalValue?.toLocaleString()}
New Portfolio Value: ${data.summary.totalNewValue?.toLocaleString()}
Total Impact: ${data.summary.totalImpact?.toLocaleString()}
Impact Percentage: ${data.summary.impactPercentage?.toFixed(2)}%
Average Tariff Rate: ${data.summary.averageTariffRate?.toFixed(2)}%

PRODUCT DETAILS
===============
${data.products
  .map(
    (product: any) =>
      `${product.sku}: ${product.description}
  Original Cost: ${product.originalCost} | New Cost: ${product.newCost}
  Tariff Rate: ${product.tariffRate}% | Impact: ${product.marginImpact?.toFixed(
        2
      )}%
`
  )
  .join("\n")}
`;

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tariff-impact-analysis-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Sleek Welcome Header */}
            <div className="text-center space-y-2 py-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {t("dashboard.welcome")}
              </h1>
              <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                {t("dashboard.workflow.journeyDescription")}
              </p>
            </div>

            {/* Quick Access to Supply Chain Planning */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Supply Chain Planning
                    </h3>
                    <p className="text-sm text-blue-700">
                      Optimize your supply chain with predictive analytics
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                  onClick={() => handleStepNavigation("supply-chain-planning")}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Launch Planner
                </Button>
              </div>
            </div>
            {/* Compact Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Step 1: File Import - Green "Start Here" Color */}
              <Card className="relative border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg animate-pulse-soft">
                <div className="absolute -top-2 left-4">
                  <Badge className="bg-green-500 text-white font-bold px-3 py-1">
                    {t("dashboard.workflow.startHere")}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    {t("modules.fileImport")}
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    {t("modules.fileImportDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                    onClick={() => goToStep("file-import")}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {t("dashboard.workflow.startAnalysis")}
                  </Button>
                </CardContent>
              </Card>{" "}
              {/* Step 2: Tariff Analysis */}
              <Card className="bg-orange-50 hover:bg-orange-100 transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    {t("modules.tariffAnalysis")}
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {t("modules.tariffAnalysisDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 border-orange-300 text-orange-700 hover:text-orange-800"
                    disabled={!canNavigateToStep("tariff-analysis")}
                    onClick={() => goToStep("tariff-analysis")}
                  >
                    {t("actions.reviewAndProceed")}
                  </Button>
                </CardContent>
              </Card>
              {/* Step 3: Supplier Diversification */}
              <Card className="bg-orange-50 hover:bg-orange-100 transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    {t("modules.supplierDiversification")}
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {t("modules.supplierDiversificationDesc")}
                  </CardDescription>{" "}
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 border-orange-300 text-orange-700 hover:text-orange-800"
                    onClick={() =>
                      handleStepNavigation("supplier-diversification")
                    }
                  >
                    {t("actions.exploreSources")}
                  </Button>
                </CardContent>
              </Card>
              {/* Step 4: Supply Chain Planning */}
              <Card className="bg-orange-50 hover:bg-orange-100 transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    {t("modules.supplyChainPlanning")}
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {t("modules.supplyChainPlanningDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 border-orange-300 text-orange-700 hover:text-orange-800"
                    onClick={() =>
                      handleStepNavigation("supply-chain-planning")
                    }
                  >
                    {t("actions.configureSettings")}
                  </Button>
                </CardContent>
              </Card>
              {/* Step 5: Workforce Planning */}
              <Card className="bg-orange-50 hover:bg-orange-100 transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    {t("modules.workforcePlanning")}
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {t("modules.workforcePlanningDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 border-orange-300 text-orange-700 hover:text-orange-800"
                    onClick={() => handleStepNavigation("workforce-planning")}
                  >
                    {t("actions.planWorkforce")}
                  </Button>
                </CardContent>
              </Card>
              {/* Step 6: Alerts & Monitoring */}
              <Card className="bg-orange-50 hover:bg-orange-100 transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      6
                    </div>
                    {t("modules.alertsSetup")}
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {t("modules.alertsSetupDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 border-orange-300 text-orange-700 hover:text-orange-800"
                    onClick={() => handleStepNavigation("alerts-setup")}
                  >
                    {t("actions.setupAlerts")}
                  </Button>
                </CardContent>
              </Card>{" "}
              {/* Step 7: AI Recommendations */}
              <Card className="bg-orange-50 hover:bg-orange-100 transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      7
                    </div>
                    {t("modules.aiRecommendations")}
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {t("modules.aiRecommendationsDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                    onClick={() => handleStepNavigation("ai-recommendations")}
                  >
                    {t("actions.getInsights")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "file-import":
        return (
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                {" "}
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t("modules.fileImport")}
                </CardTitle>
                <CardDescription>{t("modules.fileImportDesc")}</CardDescription>
              </CardHeader>
            </Card>
            <FileImportSystem
              onFileImport={handleFileImport}
              onProceedNext={() => {
                console.log("Proceeding to tariff analysis");
                goToStep("tariff-analysis");
              }}
            />
            {workflowData.importedData && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      File imported successfully!{" "}
                      {workflowData.importedData.extractedData?.length || 0}{" "}
                      products loaded.
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "tariff-analysis":
        return (
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t("modules.tariffAnalysis")}
                </CardTitle>
                <CardDescription>
                  {t("modules.tariffAnalysisDesc")}
                </CardDescription>
              </CardHeader>
            </Card>{" "}
            <TariffImpactDashboard
              data={workflowData.importedData?.extractedData}
              importedFileData={workflowData.importedData}
              onExport={format => {
                console.log(`Exporting in ${format}`);
                // Pass full workflow data for comprehensive reporting
                if (workflowData.importedData) {
                  exportTariffReport(
                    {
                      ...workflowData.importedData,
                      analysisResults: workflowData.analysisResults,
                      extractedData:
                        workflowData.importedData?.extractedData || [],
                    },
                    format
                  );
                }
              }}
              language={i18n.language as "en" | "es"}
              enableRealTimeUpdates={
                workflowData.importedData?.enhancementEnabled || false
              }
            />
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  handleAnalysisComplete({
                    analyzed: true,
                    timestamp: new Date(),
                  });
                  // Auto-advance to next step after analysis
                  setTimeout(() => nextStep(), 500);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                {t("actions.reviewAndProceed")}
              </Button>
            </div>
          </div>
        );

      case "supplier-diversification":
        return (
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("modules.supplierDiversification")}
                </CardTitle>
                <CardDescription>
                  {t("modules.supplierDiversificationDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
            <SupplierDiversification
              language={i18n.language as "en" | "es"}
              productData={workflowData.importedData?.extractedData || []}
              importedFileData={workflowData.importedData}
              onDataUpdate={async data => {
                // Update workflow data with supplier diversification results
                const enrichedData = {
                  ...data,
                  diversificationStrategy: "ai-powered analysis",
                  timestamp: new Date().toISOString(),
                  sourceData: {
                    products: workflowData.importedData?.extractedData || [],
                    analysisResults: workflowData.analysisResults,
                  },
                };
                await updateWorkflowData("supplierData", enrichedData);

                // Debug logging
                console.log(
                  "Supplier diversification onDataUpdate called:",
                  data
                );
                console.log("Analysis complete flag:", data.analysisComplete);
                console.log("Force navigation flag:", data.forceNavigation);

                // Auto-advance to next step if analysis is complete OR force navigation
                if (data.analysisComplete || data.forceNavigation) {
                  console.log("Auto-advancing to supply chain planning...");
                  setTimeout(() => {
                    console.log("Calling nextStep()...");
                    nextStep();
                  }, 200);
                }
              }}
            />
          </div>
        );

      case "supply-chain-planning":
        return (
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t("modules.supplyChainPlanning")}
                </CardTitle>
                <CardDescription>
                  {t("modules.supplyChainPlanningDesc")}
                </CardDescription>
              </CardHeader>{" "}
            </Card>{" "}
            <SupplyChainPlanner
              language={i18n.language as "en" | "es"}
              productData={workflowData.importedData?.extractedData || []}
              analysisResults={workflowData.analysisResults}
              supplierData={workflowData.supplierData}
              importedFileData={workflowData.importedData}
              onDataUpdate={async data => {
                // Combine all previous workflow data with new supply chain data
                const enrichedData = {
                  ...data,
                  sourceData: {
                    importedProducts:
                      workflowData.importedData?.extractedData || [],
                    analysisResults: workflowData.analysisResults,
                    supplierData: workflowData.supplierData,
                  },
                  timestamp: new Date().toISOString(),
                };
                await updateWorkflowData("supplyChainData", enrichedData);
              }}
            />
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  updateWorkflowData("supplyChainData", {
                    planned: true,
                    timestamp: new Date().toISOString(),
                  });
                  // Auto-advance to next step
                  setTimeout(() => nextStep(), 500);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                {t("actions.configureSettings")}
              </Button>
            </div>
          </div>
        );

      case "workforce-planning":
        return (
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("modules.workforcePlanning")}
                </CardTitle>
                <CardDescription>
                  {t("modules.workforcePlanningDesc")}
                </CardDescription>
              </CardHeader>
            </Card>{" "}
            <WorkforcePlanner
              language={i18n.language as "en" | "es"}
              productData={workflowData.importedData?.extractedData || []}
              onDataUpdate={data => {
                // Include all context from previous steps
                const enrichedData = {
                  ...data,
                  sourceData: {
                    importedProducts:
                      workflowData.importedData?.extractedData || [],
                    analysisResults: workflowData.analysisResults,
                    supplierData: workflowData.supplierData,
                    supplyChainData: workflowData.supplyChainData,
                  },
                  timestamp: new Date().toISOString(),
                };
                updateWorkflowData("workforceData", enrichedData);
              }}
            />
          </div>
        );

      case "alerts-setup":
        return (
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t("modules.alertsSetup")}
                </CardTitle>
                <CardDescription>
                  {t("modules.alertsSetupDesc")}
                </CardDescription>
              </CardHeader>
            </Card>{" "}
            <AlertsMonitoring
              language={i18n.language as "en" | "es"}
              productData={workflowData.importedData?.extractedData || []}
              supplierData={workflowData.supplierData?.suppliers || []}
              onDataUpdate={data => {
                // Include comprehensive context for alert configuration
                const enrichedData = {
                  ...data,
                  sourceData: {
                    importedProducts:
                      workflowData.importedData?.extractedData || [],
                    analysisResults: workflowData.analysisResults,
                    supplierData: workflowData.supplierData,
                    supplyChainData: workflowData.supplyChainData,
                    workforceData: workflowData.workforceData,
                  },
                  timestamp: new Date().toISOString(),
                };
                updateWorkflowData("alertsConfig", enrichedData);
              }}
            />
          </div>
        );

      case "ai-recommendations":
        return (
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {t("modules.aiRecommendations")}
                </CardTitle>
                <CardDescription>
                  {t("modules.aiRecommendationsDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
            <AIRecommendations
              language={i18n.language as "en" | "es"}
              productData={workflowData.importedData?.extractedData || []}
              supplierData={workflowData.supplierData?.suppliers || []}
              workflowData={workflowData}
              onDataUpdate={data => updateWorkflowData("recommendations", data)}
            />
          </div>
        );

      case "complete":
        return (
          <Card className="bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                {t("modules.workflowComplete")}
              </CardTitle>
              <CardDescription className="text-lg">
                {t("modules.completeDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold mb-2 text-green-700">
                    ✓ Files Imported
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {workflowData.importedData?.extractedData?.length || 0}{" "}
                    products analyzed
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold mb-2 text-green-700">
                    ✓ Analysis Complete
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Tariff impacts calculated and reviewed
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold mb-2 text-green-700">
                    ✓ Strategy Optimized
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Supply chain and workforce plans updated
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold mb-2 text-green-700">
                    ✓ Monitoring Active
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Alerts configured and AI recommendations ready
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Button
                  onClick={resetWorkflow}
                  variant="outline"
                  className="mr-4"
                >
                  {t("actions.restart")}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavigationBar />

      {/* Main content - Properly centered with consistent margins */}
      <main className="min-h-screen flex items-start justify-center px-4 py-4">
        <div className="w-full max-w-6xl">
          {/* Step Content */}
          <div className="space-y-4">{renderStepContent()}</div>
        </div>
      </main>
    </div>
  );
};

const Home = () => {
  return <HomeContent />;
};

export default Home;
