import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useDataContext } from "@/contexts/DataContext";
import { DataSourceType } from "@/types/data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  UserPlus,
  BookOpen,
  Download,
  RefreshCw,
  TrendingDown,
  Activity,
} from "lucide-react";

interface WorkforcePlannerProps {
  language?: "en" | "es";
  productData?: any[];
  onDataUpdate?: (data: any) => void;
}

const WorkforcePlanner = ({
  language = "en",
  productData = [],
  onDataUpdate,
}: WorkforcePlannerProps) => {
  // Connect to data context for real data
  let dataContext;
  try {
    dataContext = useDataContext();
  } catch (error) {
    dataContext = null;
  }

  const [activeTab, setActiveTab] = useState("staffing");
  const [isLoading, setIsLoading] = useState(false);
  const [forecastInputs, setForecastInputs] = useState({
    revenueGrowth: 0,
    costIncrease: 0,
    newHires: 0,
    productivityTarget: 0,
    automationBudget: 0,
    trainingBudget: 0,
  });
  const [useSmartDefaults, setUseSmartDefaults] = useState(true);
  const [companyProfile, setCompanyProfile] = useState({
    size: "",
    industry: "",
    currentHeadcount: 0,
    avgSalary: 0,
  });

  // Update local state when DataContext changes
  useEffect(() => {
    if (dataContext) {
      const headCount = dataContext.businessData?.currentHeadCount?.value;
      const avgWage = dataContext.businessData?.averageWage?.value;
      const deptBreakdown =
        dataContext.businessData?.departmentBreakdown?.value;

      if (headCount !== undefined) {
        setCompanyProfile(prev => ({
          ...prev,
          currentHeadcount: headCount,
          avgSalary: avgWage || prev.avgSalary,
        }));
        setWorkforceInputs(prev => ({
          ...prev,
          currentHeadcount: headCount,
          avgSalary: avgWage || prev.avgSalary,
          departments: deptBreakdown || prev.departments,
        }));
      }
    }
  }, [
    dataContext?.businessData?.currentHeadCount?.value,
    dataContext?.businessData?.averageWage?.value,
    dataContext?.businessData?.departmentBreakdown?.value,
  ]);
  const [showInputForm, setShowInputForm] = useState(false);
  const [workforceInputs, setWorkforceInputs] = useState({
    currentHeadcount: 0,
    avgSalary: 0,
    departments: {
      supplyChain: 0,
      procurement: 0,
      operations: 0,
      qualityControl: 0,
    },
  });
  const [scenarioResults, setScenarioResults] = useState<any>(null);
  const [staffingAnalysis, setStaffingAnalysis] = useState<any>(null);
  const [budgetAnalysis, setBudgetAnalysis] = useState<any>(null);

  const translations = {
    en: {
      title: "Workforce Planner",
      subtitle:
        "Strategic workforce planning based on changing business conditions",
      staffing: "Staffing Analysis",
      forecasting: "Scenario Forecasting",
      skills: "Skills Gap Analysis",
      budget: "Budget Impact",
      currentHeadcount: "Current Headcount",
      plannedHires: "Planned Hires",
      budgetUtilization: "Budget Utilization",
      skillsReadiness: "Skills Readiness",
      costBasedStaffing: "Cost-Based Staffing Analysis",
      scenarioForecasting: "Scenario-Based Forecasting",
      skillsGapAnalysis: "Skills Gap Analysis",
      budgetImpactCalculator: "Budget Impact Calculator",
      revenueGrowth: "Revenue Growth (%)",
      costIncrease: "Cost Increase (%)",
      newHires: "New Hires Needed",
      calculateImpact: "Calculate Impact",
      productivityTarget: "Productivity Target (%)",
      automationBudget: "Automation Budget ($)",
      trainingBudget: "Training Budget ($)",
      runScenario: "Run Scenario Analysis",
      exportResults: "Export Results",
      passThroughRate: "Pass-Through Rate",
      absorptionRate: "Cost Absorption Rate",
      roiCalculation: "ROI Calculation",
      trainingPlan: "Training Plan",
      automationROI: "Automation ROI",
      marginsImpact: "Margins Impact",
      competitiveAdvantage: "Competitive Advantage",
      loading: "Calculating...",
    },
    es: {
      title: "Planificador de Personal",
      subtitle:
        "Planificación estratégica de personal basada en condiciones comerciales cambiantes",
      staffing: "Análisis de Personal",
      forecasting: "Pronóstico de Escenarios",
      skills: "Análisis de Brecha de Habilidades",
      budget: "Impacto Presupuestario",
      currentHeadcount: "Personal Actual",
      plannedHires: "Contrataciones Planificadas",
      budgetUtilization: "Utilización del Presupuesto",
      skillsReadiness: "Preparación de Habilidades",
      costBasedStaffing: "Análisis de Personal Basado en Costos",
      scenarioForecasting: "Pronóstico Basado en Escenarios",
      skillsGapAnalysis: "Análisis de Brecha de Habilidades",
      budgetImpactCalculator: "Calculadora de Impacto Presupuestario",
      revenueGrowth: "Crecimiento de Ingresos (%)",
      costIncrease: "Aumento de Costos (%)",
      newHires: "Nuevas Contrataciones Necesarias",
      calculateImpact: "Calcular Impacto",
      productivityTarget: "Objetivo de Productividad (%)",
      automationBudget: "Presupuesto de Automatización ($)",
      trainingBudget: "Presupuesto de Capacitación ($)",
      runScenario: "Ejecutar Análisis de Escenario",
      exportResults: "Exportar Resultados",
      passThroughRate: "Tasa de Transferencia",
      absorptionRate: "Tasa de Absorción de Costos",
      roiCalculation: "Cálculo de ROI",
      trainingPlan: "Plan de Capacitación",
      automationROI: "ROI de Automatización",
      marginsImpact: "Impacto en Márgenes",
      competitiveAdvantage: "Ventaja Competitiva",
      loading: "Calculando...",
    },
  };

  const t = translations[language];

  // Save workforce inputs to data context
  const saveWorkforceInputs = () => {
    if (dataContext) {
      dataContext.updateData("currentHeadCount", {
        value: workforceInputs.currentHeadcount,
        source: DataSourceType.USER_INPUT,
        timestamp: new Date().toISOString(),
        validated: true,
        requiresValidation: false,
        lastUpdated: new Date().toISOString(),
      });
      dataContext.updateData("averageWage", {
        value: workforceInputs.avgSalary,
        source: DataSourceType.USER_INPUT,
        timestamp: new Date().toISOString(),
        validated: true,
        requiresValidation: false,
        lastUpdated: new Date().toISOString(),
      });
      dataContext.updateData("departmentBreakdown", {
        value: workforceInputs.departments,
        source: DataSourceType.USER_INPUT,
        timestamp: new Date().toISOString(),
        validated: true,
        requiresValidation: false,
        lastUpdated: new Date().toISOString(),
      });

      // Also update the workforceMetrics with the new data
      dataContext.updateData("workforceMetrics", {
        value: {
          totalHeadCount: workforceInputs.currentHeadcount,
          departmentBreakdown: workforceInputs.departments,
          averageWage: workforceInputs.avgSalary,
          skillsGapAreas: [],
          trainingNeeds: [],
        },
        source: DataSourceType.CALCULATED,
        timestamp: new Date().toISOString(),
        validated: true,
        requiresValidation: false,
        lastUpdated: new Date().toISOString(),
        derivedFromUserData: true,
      });
    }

    // Update local state
    setCompanyProfile({
      ...companyProfile,
      currentHeadcount: workforceInputs.currentHeadcount,
      avgSalary: workforceInputs.avgSalary,
    });

    setShowInputForm(false);

    // Show success message or trigger re-calculation
    console.log("Workforce data saved successfully", {
      headcount: workforceInputs.currentHeadcount,
      salary: workforceInputs.avgSalary,
      departments: workforceInputs.departments,
    });
  };

  // Calculate dynamic metrics based on product data from Cost Calculator
  const calculateMetrics = () => {
    // Get real data from context if available - prioritize Cost Calculator data
    const realProductData =
      dataContext?.businessData?.importedProducts?.value || productData;
    const totalImpact =
      dataContext?.businessData?.totalAnnualImpact?.value || null;
    const avgTariffRate =
      dataContext?.businessData?.averageTariffRate?.value || null;
    const totalOriginalValue =
      dataContext?.businessData?.totalOriginalValue?.value || null;
    const totalNewValue =
      dataContext?.businessData?.totalNewValue?.value || null;

    // Calculate from uploaded product data if context data not available
    let calculatedTotalImpact = totalImpact;
    let calculatedAvgTariffRate = avgTariffRate;

    if (
      !calculatedTotalImpact &&
      realProductData &&
      realProductData.length > 0
    ) {
      calculatedTotalImpact = realProductData.reduce(
        (sum: number, product: any) => {
          const originalCost = parseFloat(product.originalCost) || 0;
          const newCost = parseFloat(product.newCost) || originalCost;
          const quantity = parseInt(product.quantity) || 1;
          return sum + (newCost - originalCost) * quantity;
        },
        0
      );
    }

    if (
      !calculatedAvgTariffRate &&
      realProductData &&
      realProductData.length > 0
    ) {
      calculatedAvgTariffRate =
        realProductData.reduce((sum: number, product: any) => {
          return sum + (parseFloat(product.tariffRate) || 0);
        }, 0) / realProductData.length;
    }

    // Return empty state if no real data from Cost Calculator
    if (!realProductData || realProductData.length === 0) {
      return {
        totalCostImpact: null,
        averageTariffRate: null,
        productsAffected: null,
        currentHeadcount:
          dataContext?.businessData?.currentHeadCount?.value || null,
        plannedHires: null,
        budgetUtilization: null,
        skillsReadiness: null,
      };
    }

    const totalCostImpact = calculatedTotalImpact;
    const averageTariffRate = calculatedAvgTariffRate;

    const productsAffected = realProductData.filter(
      product => parseFloat(product.tariffRate) > 0
    ).length;

    // Calculate workforce needs based on cost impact
    const impactSeverity = Math.min(totalCostImpact / 100000, 3); // Scale factor
    const baseHeadcount =
      dataContext?.businessData?.currentHeadCount?.value || null;
    const additionalHires =
      totalCostImpact > 0 && baseHeadcount
        ? Math.ceil(impactSeverity * 4)
        : null;
    const budgetStrain =
      totalCostImpact > 0
        ? Math.min((totalCostImpact / 500000) * 100, 100)
        : null;
    const skillsGap =
      totalCostImpact > 0
        ? Math.max(30, Math.min(85, averageTariffRate * 2))
        : null;

    return {
      totalCostImpact,
      averageTariffRate,
      productsAffected,
      currentHeadcount: baseHeadcount,
      plannedHires: additionalHires,
      budgetUtilization:
        totalCostImpact > 0 && budgetStrain
          ? Math.min(95, 60 + budgetStrain)
          : null,
      skillsReadiness:
        totalCostImpact > 0 && skillsGap ? 100 - skillsGap : null,
    };
  };

  const metrics = calculateMetrics();

  // Calculate staffing analysis based on actual data
  const calculateStaffingAnalysis = () => {
    // Return null if no real data available
    if (!metrics.totalCostImpact || !metrics.currentHeadcount) {
      return null;
    }

    const costImpactPerEmployee =
      metrics.totalCostImpact / metrics.currentHeadcount;
    const productivityNeeded = Math.max(
      0,
      (costImpactPerEmployee / 50000) * 100
    );

    return {
      costImpactPerEmployee,
      productivityNeeded,
      departments: [
        {
          name: "Supply Chain",
          current: Math.ceil(metrics.currentHeadcount * 0.24),
          planned: Math.ceil(
            (metrics.currentHeadcount + (metrics.plannedHires || 0)) * 0.26
          ),
          skillsGap:
            productivityNeeded > 15
              ? "High"
              : productivityNeeded > 8
                ? "Medium"
                : "Low",
          budgetImpact: `+${Math.round((metrics.plannedHires || 0) * 0.3 * 60000).toLocaleString()}`,
        },
        {
          name: "Procurement",
          current: Math.ceil(metrics.currentHeadcount * 0.16),
          planned: Math.ceil(
            (metrics.currentHeadcount + (metrics.plannedHires || 0)) * 0.18
          ),
          skillsGap:
            (metrics.averageTariffRate || 0) > 20 ? "Critical" : "High",
          budgetImpact: `+${Math.round((metrics.plannedHires || 0) * 0.25 * 65000).toLocaleString()}`,
        },
        {
          name: "Operations",
          current: Math.ceil(metrics.currentHeadcount * 0.49),
          planned: Math.ceil(
            (metrics.currentHeadcount + (metrics.plannedHires || 0)) * 0.46
          ),
          skillsGap: "Medium",
          budgetImpact: `+${Math.round((metrics.plannedHires || 0) * 0.35 * 55000).toLocaleString()}`,
        },
        {
          name: "Quality Control",
          current: Math.ceil(metrics.currentHeadcount * 0.11),
          planned: Math.ceil(
            (metrics.currentHeadcount + (metrics.plannedHires || 0)) * 0.1
          ),
          skillsGap: "Low",
          budgetImpact: `+${Math.round((metrics.plannedHires || 0) * 0.1 * 58000).toLocaleString()}`,
        },
      ],
    };
  };

  const staffingData = calculateStaffingAnalysis();

  // Calculate skills gap based on tariff complexity
  const calculateSkillsGap = () => {
    // Return empty array if no real data available
    if (!metrics.averageTariffRate || !metrics.productsAffected) {
      return [];
    }

    const tariffComplexity = metrics.averageTariffRate;
    const diversificationNeed = Math.min(metrics.productsAffected / 10, 5);

    return [
      {
        skill: "Supply Chain Analytics",
        currentLevel: Math.max(40, 85 - tariffComplexity),
        requiredLevel: Math.min(95, 70 + tariffComplexity),
        gap: Math.max(
          0,
          Math.min(95, 70 + tariffComplexity) -
            Math.max(40, 85 - tariffComplexity)
        ),
        priority:
          tariffComplexity > 25
            ? "Critical"
            : tariffComplexity > 15
              ? "High"
              : "Medium",
      },
      {
        skill: "Tariff Management",
        currentLevel: Math.max(30, 70 - tariffComplexity * 1.5),
        requiredLevel: Math.min(95, 60 + tariffComplexity * 1.2),
        gap: Math.max(
          0,
          Math.min(95, 60 + tariffComplexity * 1.2) -
            Math.max(30, 70 - tariffComplexity * 1.5)
        ),
        priority: "Critical",
      },
      {
        skill: "Supplier Relations",
        currentLevel: Math.max(60, 90 - diversificationNeed * 5),
        requiredLevel: Math.min(95, 75 + diversificationNeed * 3),
        gap: Math.max(
          0,
          Math.min(95, 75 + diversificationNeed * 3) -
            Math.max(60, 90 - diversificationNeed * 5)
        ),
        priority: diversificationNeed > 3 ? "High" : "Medium",
      },
      {
        skill: "Risk Assessment",
        currentLevel: Math.max(45, 80 - metrics.productsAffected / 5),
        requiredLevel: Math.min(90, 65 + metrics.productsAffected / 3),
        gap: Math.max(
          0,
          Math.min(90, 65 + metrics.productsAffected / 3) -
            Math.max(45, 80 - metrics.productsAffected / 5)
        ),
        priority: metrics.productsAffected > 15 ? "High" : "Medium",
      },
    ];
  };

  const skillsGapData = calculateSkillsGap();

  // Run scenario analysis
  const runScenarioAnalysis = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const baseCost = metrics.totalCostImpact;
    const passThroughRate = Math.min(
      0.8,
      Math.max(0.3, (100 - forecastInputs.costIncrease) / 100)
    );
    const absorptionRate = 1 - passThroughRate;

    const productivityGain = forecastInputs.productivityTarget / 100;
    const costOffset = baseCost * productivityGain * 0.6;

    const automationROI =
      (forecastInputs.automationBudget * 0.25) /
      forecastInputs.automationBudget;
    const trainingROI =
      (forecastInputs.trainingBudget * 0.35) / forecastInputs.trainingBudget;

    const results = {
      passThroughAmount: baseCost * passThroughRate,
      absorptionAmount: baseCost * absorptionRate,
      productivityOffset: costOffset,
      netImpact: baseCost * absorptionRate - costOffset,
      automationROI: automationROI * 100,
      trainingROI: trainingROI * 100,
      marginsImpact:
        ((baseCost * absorptionRate - costOffset) / (baseCost * 10)) * 100,
      competitiveAdvantage: productivityGain * 15,
      recommendedActions: [
        `Implement ${forecastInputs.productivityTarget}% productivity improvements`,
        `Invest ${forecastInputs.automationBudget.toLocaleString()} in automation`,
        `Allocate ${forecastInputs.trainingBudget.toLocaleString()} for skills training`,
        `Pass through ${(passThroughRate * 100).toFixed(1)}% of cost increases`,
      ],
    };

    setScenarioResults(results);
    setIsLoading(false);

    if (onDataUpdate) {
      onDataUpdate({
        scenarioResults: results,
        staffingAnalysis: staffingData,
        skillsGap: skillsGapData,
        metrics,
        workforcePlanningComplete: true,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Export functionality
  const exportResults = () => {
    const exportData = {
      workforcePlanning: {
        generatedDate: new Date().toISOString(),
        metrics,
        staffingAnalysis: staffingData,
        skillsGap: skillsGapData,
        scenarioResults,
        recommendations: scenarioResults?.recommendedActions || [],
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workforce-planning-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getGapColor = (gap: string) => {
    switch (gap) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      case "Critical":
        return "text-red-700";
      default:
        return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive";
      case "High":
        return "secondary";
      case "Medium":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-muted-foreground mt-2">{t.subtitle}</p>
            </div>
            <Button
              onClick={() => setShowInputForm(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Update Workforce Data
            </Button>
          </div>
        </div>

        {/* Workforce Input Modal */}
        {showInputForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4">
              <CardHeader>
                <CardTitle>Workforce Information</CardTitle>
                <CardDescription>
                  Provide your current workforce details for accurate planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headcount">Current Headcount</Label>
                    <Input
                      id="headcount"
                      type="number"
                      value={workforceInputs.currentHeadcount}
                      onChange={e =>
                        setWorkforceInputs({
                          ...workforceInputs,
                          currentHeadcount: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Enter current headcount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary">Average Annual Salary ($)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={workforceInputs.avgSalary}
                      onChange={e =>
                        setWorkforceInputs({
                          ...workforceInputs,
                          avgSalary: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Enter average salary"
                    />
                  </div>
                </div>
                <div>
                  <Label>Department Breakdown</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="supplyChain" className="text-sm">
                        Supply Chain
                      </Label>
                      <Input
                        id="supplyChain"
                        type="number"
                        value={workforceInputs.departments.supplyChain}
                        onChange={e =>
                          setWorkforceInputs({
                            ...workforceInputs,
                            departments: {
                              ...workforceInputs.departments,
                              supplyChain: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="procurement" className="text-sm">
                        Procurement
                      </Label>
                      <Input
                        id="procurement"
                        type="number"
                        value={workforceInputs.departments.procurement}
                        onChange={e =>
                          setWorkforceInputs({
                            ...workforceInputs,
                            departments: {
                              ...workforceInputs.departments,
                              procurement: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="operations" className="text-sm">
                        Operations
                      </Label>
                      <Input
                        id="operations"
                        type="number"
                        value={workforceInputs.departments.operations}
                        onChange={e =>
                          setWorkforceInputs({
                            ...workforceInputs,
                            departments: {
                              ...workforceInputs.departments,
                              operations: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="qualityControl" className="text-sm">
                        Quality Control
                      </Label>
                      <Input
                        id="qualityControl"
                        type="number"
                        value={workforceInputs.departments.qualityControl}
                        onChange={e =>
                          setWorkforceInputs({
                            ...workforceInputs,
                            departments: {
                              ...workforceInputs.departments,
                              qualityControl: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowInputForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveWorkforceInputs}>
                    Save Workforce Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Key Metrics - Clean Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="metric-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.currentHeadcount}
                  </p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {metrics.currentHeadcount !== null
                      ? metrics.currentHeadcount
                      : "--"}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.plannedHires}
                  </p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {metrics.plannedHires !== null
                      ? metrics.plannedHires
                      : "--"}
                  </p>
                </div>
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.budgetUtilization}
                  </p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {metrics.budgetUtilization !== null
                      ? `${Math.round(metrics.budgetUtilization)}%`
                      : "--"}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.skillsReadiness}
                  </p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {metrics.skillsReadiness !== null
                      ? `${Math.round(metrics.skillsReadiness)}%`
                      : "--"}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-card/50 border border-border/30">
            <TabsTrigger value="staffing">{t.staffing}</TabsTrigger>
            <TabsTrigger value="forecasting">{t.forecasting}</TabsTrigger>
            <TabsTrigger value="skills">{t.skills}</TabsTrigger>
            <TabsTrigger value="budget">{t.budget}</TabsTrigger>
          </TabsList>

          <TabsContent value="staffing" className="space-y-6">
            <Card className="dashboard-card border-border/30">
              <CardHeader>
                <CardTitle>{t.costBasedStaffing}</CardTitle>
                <CardDescription>
                  Adjust hiring plans based on changing product costs and
                  margins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {staffingData ? (
                  <div className="space-y-4">
                    {staffingData.departments.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{dept.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Current: {dept.current} | Planned: {dept.planned}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              Skills Gap
                            </p>
                            <span
                              className={`font-medium ${getGapColor(dept.skillsGap)}`}
                            >
                              {dept.skillsGap}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              Budget Impact
                            </p>
                            <span className="font-medium text-green-600">
                              {dept.budgetImpact}
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Target className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No workforce data available
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Import product data and enter workforce information to
                        see analysis
                      </p>
                    </div>
                  </div>
                )}
                {staffingData && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-700" />
                      <span className="font-semibold text-blue-900">
                        Productivity Analysis
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Cost impact per employee:{" "}
                      <span className="font-semibold text-blue-900">
                        $
                        {Math.round(
                          staffingData.costImpactPerEmployee || 0
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-sm text-blue-800">
                      Required productivity improvement:{" "}
                      <span className="font-semibold text-blue-900">
                        {(staffingData.productivityNeeded || 0).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dashboard-card border-border/30">
                <CardHeader>
                  <CardTitle>{t.scenarioForecasting}</CardTitle>
                  <CardDescription>
                    Smart defaults based on your company profile - adjust only
                    if needed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Smart Defaults Toggle */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-700" />
                        <span className="text-sm font-medium text-blue-900">
                          Use Industry Benchmarks
                        </span>
                      </div>
                      <Button
                        variant={useSmartDefaults ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseSmartDefaults(!useSmartDefaults)}
                      >
                        {useSmartDefaults ? "Enabled" : "Customize"}
                      </Button>
                    </div>
                    <p className="text-xs text-blue-800">
                      {useSmartDefaults
                        ? "Using industry benchmarks - values will be calculated based on your data"
                        : "Manual input mode - adjust all parameters below"}
                    </p>
                  </div>

                  {/* Progressive Disclosure - Only show inputs if not using smart defaults */}
                  {!useSmartDefaults && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="revenue">{t.revenueGrowth}</Label>
                          <Input
                            id="revenue"
                            type="number"
                            value={forecastInputs.revenueGrowth}
                            onChange={e =>
                              setForecastInputs({
                                ...forecastInputs,
                                revenueGrowth: parseInt(e.target.value) || 0,
                              })
                            }
                            className="mt-1"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cost">{t.costIncrease}</Label>
                          <Input
                            id="cost"
                            type="number"
                            value={forecastInputs.costIncrease}
                            onChange={e =>
                              setForecastInputs({
                                ...forecastInputs,
                                costIncrease: parseInt(e.target.value) || 0,
                              })
                            }
                            className="mt-1"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="productivity">
                          {t.productivityTarget}:{" "}
                          {forecastInputs.productivityTarget}%
                        </Label>
                        <div className="mt-2">
                          <Slider
                            value={[forecastInputs.productivityTarget]}
                            onValueChange={value =>
                              setForecastInputs({
                                ...forecastInputs,
                                productivityTarget: value[0],
                              })
                            }
                            max={50}
                            min={5}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Conservative</span>
                            <span>Aggressive</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Always visible summary */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 text-gray-900">
                      Current Assumptions:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                      <div>
                        Revenue Growth:{" "}
                        <span className="font-medium text-gray-900">
                          {forecastInputs.revenueGrowth}%
                        </span>
                      </div>
                      <div>
                        Cost Increase:{" "}
                        <span className="font-medium text-gray-900">
                          {forecastInputs.costIncrease}%
                        </span>
                      </div>
                      <div>
                        Productivity Target:{" "}
                        <span className="font-medium text-gray-900">
                          {forecastInputs.productivityTarget}%
                        </span>
                      </div>
                      <div>
                        Training Budget:{" "}
                        <span className="font-medium text-gray-900">
                          ${(forecastInputs.trainingBudget / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={runScenarioAnalysis}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Calculator className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? t.loading : t.runScenario}
                  </Button>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-border/30">
                <CardHeader>
                  <CardTitle>Scenario Results</CardTitle>
                  <CardDescription>
                    Analysis results and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scenarioResults ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">
                            {t.passThroughRate}
                          </p>
                          <p className="text-lg font-bold text-green-800">
                            $
                            {Math.round(
                              scenarioResults.passThroughAmount
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-600 font-medium">
                            {t.absorptionRate}
                          </p>
                          <p className="text-lg font-bold text-red-800">
                            $
                            {Math.round(
                              scenarioResults.absorptionAmount
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">
                            Productivity Offset
                          </p>
                          <p className="text-lg font-bold text-blue-800">
                            $
                            {Math.round(
                              scenarioResults.productivityOffset
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">
                            Net Impact
                          </p>
                          <p className="text-lg font-bold text-purple-800">
                            $
                            {Math.round(
                              scenarioResults.netImpact
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Recommended Actions:</h4>
                        {scenarioResults.recommendedActions.map(
                          (action: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{action}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-16 w-16 mx-auto text-primary mb-4" />
                        <p className="text-muted-foreground">
                          Run scenario analysis to see results
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="dashboard-card border-border/30">
              <CardHeader>
                <CardTitle>{t.skillsGapAnalysis}</CardTitle>
                <CardDescription>
                  Identify training needs for supply chain diversification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {skillsGapData.length > 0 ? (
                  <div className="space-y-4">
                    {skillsGapData.map((skill, index) => (
                      <div
                        key={index}
                        className="p-4 border border-border/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{skill.skill}</span>
                          </div>
                          <Badge variant={getPriorityColor(skill.priority)}>
                            {skill.priority}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Current Level
                            </p>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={skill.currentLevel}
                                className="flex-1"
                              />
                              <span className="text-sm font-medium">
                                {skill.currentLevel}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Required Level
                            </p>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={skill.requiredLevel}
                                className="flex-1"
                              />
                              <span className="text-sm font-medium">
                                {skill.requiredLevel}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Gap</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={skill.gap} className="flex-1" />
                              <span className="text-sm font-medium text-red-400">
                                {skill.gap}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No skills gap analysis available
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Import product data and run cost analysis to identify
                        training needs
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dashboard-card border-border/30">
                <CardHeader>
                  <CardTitle>{t.budgetImpactCalculator}</CardTitle>
                  <CardDescription>
                    Labor cost projections based on business model changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scenarioResults ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-border/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <span className="font-semibold">
                              {t.automationROI}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {scenarioResults.automationROI.toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Annual return on automation investment
                          </p>
                        </div>
                        <div className="p-4 border border-border/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-5 w-5 text-blue-500" />
                            <span className="font-semibold">Training ROI</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            {scenarioResults.trainingROI.toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Return on training investment
                          </p>
                        </div>
                        <div className="p-4 border border-border/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                            <span className="font-semibold">
                              {t.marginsImpact}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-red-600">
                            {scenarioResults.marginsImpact.toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Impact on profit margins
                          </p>
                        </div>
                        <div className="p-4 border border-border/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-5 w-5 text-purple-500" />
                            <span className="font-semibold">
                              {t.competitiveAdvantage}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">
                            {scenarioResults.competitiveAdvantage.toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Operational efficiency gain
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <DollarSign className="h-16 w-16 mx-auto text-primary mb-4" />
                        <p className="text-muted-foreground">
                          Run scenario analysis to see budget impact
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="dashboard-card border-border/30">
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis of workforce costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metrics.currentHeadcount !== null &&
                  companyProfile.avgSalary > 0 ? (
                    <>
                      <div className="p-4 border border-border/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            Current Annual Cost
                          </span>
                          <span className="text-lg font-bold">
                            $
                            {(
                              metrics.currentHeadcount *
                              companyProfile.avgSalary
                            ).toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={metrics.budgetUtilization || 0}
                          className="h-2"
                        />
                      </div>
                      <div className="p-4 border border-border/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            Projected Cost (with hires)
                          </span>
                          <span className="text-lg font-bold text-green-400">
                            $
                            {(
                              (metrics.currentHeadcount +
                                (metrics.plannedHires || 0)) *
                              companyProfile.avgSalary
                            ).toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            100,
                            (metrics.budgetUtilization || 0) + 15
                          )}
                          className="h-2"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="p-4 border border-border/30 rounded-lg text-center">
                      <p className="text-muted-foreground">
                        Enter workforce data to see cost breakdown
                      </p>
                    </div>
                  )}
                  <div className="p-4 border border-green-400/20 rounded-lg bg-green-400/10">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-400">
                        Projected ROI from investments
                      </span>
                      <span className="text-lg font-bold text-green-400">
                        +$
                        {Math.round(
                          (forecastInputs.automationBudget +
                            forecastInputs.trainingBudget) *
                            0.3
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={exportResults}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t.exportResults}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Fixed Complete Planning Button - Always Visible */}
        <div className="mt-8 flex justify-center">
          <Card className="w-full max-w-2xl border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">Ready to Proceed</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete your workforce planning to continue to Alerts &
                  Monitoring
                </p>
                <Button
                  onClick={() => {
                    if (onDataUpdate) {
                      onDataUpdate({
                        scenarioResults,
                        staffingAnalysis: staffingData,
                        skillsGap: skillsGapData,
                        metrics,
                        workforcePlanningComplete: true,
                        timestamp: new Date().toISOString(),
                      });
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 px-8 py-2"
                  size="lg"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Complete Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkforcePlanner;
