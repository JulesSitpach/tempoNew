import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Globe,
  LogOut,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthModal from "./AuthModal";

// Custom hook for intersection observer animations
const useInView = (threshold = 0.1) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
};

const LandingPage = () => {
  const { t, i18n } = useTranslation(['landing', 'common']);
  const [language, setLanguage] = useState<"en" | "es">(i18n.language as "en" | "es");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [businessProfile, setBusinessProfile] = useState({
    primaryChallenge: "",
    businessSize: "",
    industry: "",
    priorities: [] as string[],
  });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  // Language switching handler
  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    if (user) {
      // Show personalized welcome for new users
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (!hasSeenWelcome) {
        setIsWelcomeModalOpen(true);
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleWelcomeComplete = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    localStorage.setItem("businessProfile", JSON.stringify(businessProfile));
    setIsWelcomeModalOpen(false);
    navigate("/dashboard");
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setBusinessProfile(prev => ({
      ...prev,
      priorities: checked
        ? [...prev.priorities, priority]
        : prev.priorities.filter(p => p !== priority),
    }));
  };

  const translations = {
    en: {
      brand: "TradeNavigatorPro",
      features: "Features",
      pricing: "Pricing",
      documentation: "Documentation",
      help: "Help",
      signIn: "Sign In",
      getStarted: "Get Started",
      signOut: "Sign Out",
      welcome: "Welcome back",
      heroTitle: "Master the Markets with",
      heroSubtitle: "TradeNavigatorPro",
      heroDescription:
        "Advanced trading platform with real-time analytics, risk management, and professional-grade tools for serious traders.",
      realTimeData: "Real-time Market Data",
      advancedAnalytics: "Advanced Analytics",
      riskManagement: "Risk Management",
      startTrading: "Start Trading Now",
      viewDemo: "View Demo",
      sectionTitle: "All-in-One Trade Intelligence for SMBs",
      sectionDescription:
        "Unlock five powerful, AI-driven tools to navigate US trade policy, tariffs, and supply chain challenges with confidence.",
      costCalculator: "Cost Calculator",
      costCalculatorDesc:
        "Analyze tariff impacts on your product costs with real-time calculations and multi-format exports.",
      supplierDiversification: "Supplier Diversification",
      supplierDiversificationDesc:
        "Compare suppliers, assess risks, and get AI-powered recommendations for optimal sourcing.",
      supplyChainPlanner: "Supply Chain Planner",
      supplyChainPlannerDesc:
        "Model scenarios, simulate supplier changes, and optimize inventory based on tariff timing.",
      workforcePlanner: "Workforce Planner",
      workforcePlannerDesc:
        "Adjust staffing plans based on changing costs and forecast workforce needs under different conditions.",
      alertsMonitoring: "Alerts & Monitoring",
      alertsMonitoringDesc:
        "Get real-time tariff updates and supplier news with customizable alert settings.",
      aiRecommendations: "AI Recommendations",
      aiRecommendationsDesc:
        "Receive personalized cost savings suggestions and predictive analytics for market trends.",
      // Dashboard preview section
      tradingDashboard: "Trading Dashboard",
      portfolio: "Portfolio",
      profit: "Profit",
      trades: "Trades",
      // Pricing section
      chooseTradingPlan: "Choose Your Trading Plan",
      pricingDescription:
        "Flexible pricing options designed for traders of all levels. Scale your trading operations with our modular approach.",
      payPerApp: "Pay-Per-App",
      payPerAppDesc: "Choose only the apps you need",
      allAppsBundle: "All Apps Bundle",
      allAppsBundleDesc: "Access to all core trading apps",
      creditPack: "Credit Pack",
      creditPackDesc: "Flexible pay-as-you-go option",
      enterprise: "Enterprise",
      enterpriseDesc: "Tailored solution for large teams",
      mostPopular: "Most Popular",
      selectApps: "Select Apps",
      startBundle: "Start Bundle",
      buyCredits: "Buy Credits",
      contactSales: "Contact Sales",
      // Pricing features
      chooseAppsYouNeed: "Choose only the apps you need",
      includesApiCalls: "Includes 1,000 API calls/app/mo",
      addRemoveApps: "Add/remove apps anytime",
      emailSupport: "Email support",
      accessAllApps: "Access to all core apps",
      apiCallsIncluded: "5,000 API calls/mo included",
      bundleDiscount: "Bundle discount",
      prioritySupport: "Priority support",
      advancedAnalyticsFeature: "Advanced analytics",
      customAlerts: "Custom alerts",
      useCreditsForApps: "Use credits for any app or extra API calls",
      noMonthlyCommitment: "No monthly commitment",
      buyMoreCredits: "Buy more credits anytime",
      creditsNeverExpire: "Credits never expire",
      unlimitedAppsCredits: "Unlimited apps & credits",
      customIntegrations: "Custom integrations",
      dedicatedSupport: "Dedicated support",
      slaGuarantee: "SLA guarantee",
      whiteLabelOptions: "White-label options",
      advancedSecurity: "Advanced security",
      // Pricing transparency
      transparentUsagePricing: "Transparent Usage Pricing",
      apiOverage: "API overage:",
      perCall: "$0.01 per call",
      abovePlanLimit: "above plan limit.",
      creditsUsage:
        "Credits can be used for API calls, reports, or app actions. Monitor your usage in real-time through your dashboard.",
      // CTA section
      readyToTransform: "Ready to Transform Your Trade Operations?",
      joinThousands:
        "Join thousands of SMBs already using TradeNavigatorPro to navigate the complex world of international trade.",
      goToDashboard: "Go to Dashboard",
      scheduleDemo: "Schedule a Demo",
      // Welcome Modal
      welcomeTitle: "Welcome to TradeNavigatorPro!",
      welcomeSubtitle: "Let's personalize your experience to help you succeed",
      primaryChallenge: "What's your biggest challenge right now?",
      businessSize: "What's your business size?",
      industry: "What industry are you in?",
      priorities: "What are your top priorities? (Select all that apply)",
      getStartedPersonalized: "Get Started with Personalized Recommendations",
      // Challenge options
      challengeRisingCosts: "Rising import costs due to tariffs",
      challengeSupplierRisk: "Supplier concentration and risk",
      challengeCompliance: "Trade compliance and documentation",
      challengeForecasting: "Demand forecasting and planning",
      // Business size options
      sizeSmall: "Small (1-50 employees)",
      sizeMedium: "Medium (51-200 employees)",
      sizeLarge: "Large (200+ employees)",
      // Industry options
      industryManufacturing: "Manufacturing",
      industryRetail: "Retail/E-commerce",
      industryDistribution: "Distribution/Wholesale",
      industryOther: "Other",
      // Priority options
      priorityCostReduction: "Reduce costs immediately",
      priorityRiskMitigation: "Mitigate supply chain risks",
      priorityCompliance: "Ensure trade compliance",
      priorityEfficiency: "Improve operational efficiency",
      priorityGrowth: "Support business growth",
    },
    es: {
      brand: "TradeNavigatorPro",
      features: "Características",
      pricing: "Precios",
      documentation: "Documentación",
      help: "Ayuda",
      signIn: "Iniciar Sesión",
      getStarted: "Comenzar",
      signOut: "Cerrar Sesión",
      welcome: "Bienvenido de vuelta",
      heroTitle: "Domina los Mercados con",
      heroSubtitle: "TradeNavigatorPro",
      heroDescription:
        "Plataforma de trading avanzada con análisis en tiempo real, gestión de riesgos y herramientas de grado profesional para traders serios.",
      realTimeData: "Datos de Mercado en Tiempo Real",
      advancedAnalytics: "Análisis Avanzado",
      riskManagement: "Gestión de Riesgos",
      startTrading: "Comenzar a Operar",
      viewDemo: "Ver Demo",
      sectionTitle: "Inteligencia Comercial Todo-en-Uno para PYMES",
      sectionDescription:
        "Desbloquea cinco herramientas poderosas impulsadas por IA para navegar la política comercial de EE.UU., aranceles y desafíos de la cadena de suministro con confianza.",
      costCalculator: "Calculadora de Costos",
      costCalculatorDesc:
        "Analiza el impacto de aranceles en los costos de tus productos con cálculos en tiempo real y exportaciones multi-formato.",
      supplierDiversification: "Diversificación de Proveedores",
      supplierDiversificationDesc:
        "Compara proveedores, evalúa riesgos y obtén recomendaciones impulsadas por IA para un abastecimiento óptimo.",
      supplyChainPlanner: "Planificador de Cadena de Suministro",
      supplyChainPlannerDesc:
        "Modela escenarios, simula cambios de proveedores y optimiza inventario basado en el tiempo de aranceles.",
      workforcePlanner: "Planificador de Personal",
      workforcePlannerDesc:
        "Ajusta planes de personal basado en costos cambiantes y pronostica necesidades de fuerza laboral bajo diferentes condiciones.",
      alertsMonitoring: "Alertas y Monitoreo",
      alertsMonitoringDesc:
        "Obtén actualizaciones de aranceles en tiempo real y noticias de proveedores con configuraciones de alerta personalizables.",
      aiRecommendations: "Recomendaciones IA",
      aiRecommendationsDesc:
        "Recibe sugerencias personalizadas de ahorro de costos y análisis predictivo para tendencias del mercado.",
      // Dashboard preview section
      tradingDashboard: "Panel de Trading",
      portfolio: "Portafolio",
      profit: "Ganancia",
      trades: "Operaciones",
      // Pricing section
      chooseTradingPlan: "Elige Tu Plan de Trading",
      pricingDescription:
        "Opciones de precios flexibles diseñadas para traders de todos los niveles. Escala tus operaciones de trading con nuestro enfoque modular.",
      payPerApp: "Pago por App",
      payPerAppDesc: "Elige solo las apps que necesitas",
      allAppsBundle: "Paquete de Todas las Apps",
      allAppsBundleDesc: "Acceso a todas las apps principales de trading",
      creditPack: "Paquete de Créditos",
      creditPackDesc: "Opción flexible de pago por uso",
      enterprise: "Empresarial",
      enterpriseDesc: "Solución personalizada para equipos grandes",
      mostPopular: "Más Popular",
      selectApps: "Seleccionar Apps",
      startBundle: "Iniciar Paquete",
      buyCredits: "Comprar Créditos",
      contactSales: "Contactar Ventas",
      // Pricing features
      chooseAppsYouNeed: "Elige solo las apps que necesitas",
      includesApiCalls: "Incluye 1,000 llamadas API/app/mes",
      addRemoveApps: "Agregar/quitar apps en cualquier momento",
      emailSupport: "Soporte por email",
      accessAllApps: "Acceso a todas las apps principales",
      apiCallsIncluded: "5,000 llamadas API/mes incluidas",
      bundleDiscount: "Descuento por paquete",
      prioritySupport: "Soporte prioritario",
      advancedAnalyticsFeature: "Análisis avanzado",
      customAlerts: "Alertas personalizadas",
      useCreditsForApps:
        "Usa créditos para cualquier app o llamadas API adicionales",
      noMonthlyCommitment: "Sin compromiso mensual",
      buyMoreCredits: "Compra más créditos en cualquier momento",
      creditsNeverExpire: "Los créditos nunca expiran",
      unlimitedAppsCredits: "Apps y créditos ilimitados",
      customIntegrations: "Integraciones personalizadas",
      dedicatedSupport: "Soporte dedicado",
      slaGuarantee: "Garantía SLA",
      whiteLabelOptions: "Opciones de marca blanca",
      advancedSecurity: "Seguridad avanzada",
      // Pricing transparency
      transparentUsagePricing: "Precios de Uso Transparentes",
      apiOverage: "Exceso de API:",
      perCall: "$0.01 por llamada",
      abovePlanLimit: "por encima del límite del plan.",
      creditsUsage:
        "Los créditos se pueden usar para llamadas API, reportes o acciones de apps. Monitorea tu uso en tiempo real a través de tu panel.",
      // CTA section
      readyToTransform: "¿Listo para Transformar Tus Operaciones Comerciales?",
      joinThousands:
        "Únete a miles de PYMES que ya usan TradeNavigatorPro para navegar el complejo mundo del comercio internacional.",
      goToDashboard: "Ir al Panel",
      scheduleDemo: "Programar una Demo",
      // Welcome Modal
      welcomeTitle: "¡Bienvenido a TradeNavigatorPro!",
      welcomeSubtitle:
        "Personalicemos tu experiencia para ayudarte a tener éxito",
      primaryChallenge: "¿Cuál es tu mayor desafío en este momento?",
      businessSize: "¿Cuál es el tamaño de tu negocio?",
      industry: "¿En qué industria te encuentras?",
      priorities:
        "¿Cuáles son tus principales prioridades? (Selecciona todas las que apliquen)",
      getStartedPersonalized: "Comenzar con Recomendaciones Personalizadas",
      // Challenge options
      challengeRisingCosts:
        "Costos de importación crecientes debido a aranceles",
      challengeSupplierRisk: "Concentración y riesgo de proveedores",
      challengeCompliance: "Cumplimiento comercial y documentación",
      challengeForecasting: "Pronóstico de demanda y planificación",
      // Business size options
      sizeSmall: "Pequeño (1-50 empleados)",
      sizeMedium: "Mediano (51-200 empleados)",
      sizeLarge: "Grande (200+ empleados)",
      // Industry options
      industryManufacturing: "Manufactura",
      industryRetail: "Retail/E-commerce",
      industryDistribution: "Distribución/Mayoreo",
      industryOther: "Otro",
      // Priority options
      priorityCostReduction: "Reducir costos inmediatamente",
      priorityRiskMitigation: "Mitigar riesgos de cadena de suministro",
      priorityCompliance: "Asegurar cumplimiento comercial",
      priorityEfficiency: "Mejorar eficiencia operacional",
      priorityGrowth: "Apoyar crecimiento del negocio",
    },
  };

  const t = translations[language];

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: t.costCalculator,
      description: t.costCalculatorDesc,
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t.supplierDiversification,
      description: t.supplierDiversificationDesc,
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: t.supplyChainPlanner,
      description: t.supplyChainPlannerDesc,
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t.workforcePlanner,
      description: t.workforcePlannerDesc,
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-primary" />,
      title: t.alertsMonitoring,
      description: t.alertsMonitoringDesc,
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: t.aiRecommendations,
      description: t.aiRecommendationsDesc,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-300">
        <div className="container mx-auto px-6 flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t.brand}
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 ml-12">
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              onClick={() => scrollToSection(featuresRef)}
            >
              {t.features}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              onClick={() => scrollToSection(pricingRef)}
            >
              {t.pricing}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <Select
              value={language}
              onValueChange={(value: "en" | "es") => setLanguage(value)}
            >
              <SelectTrigger className="w-20 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors duration-200">
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
              </SelectContent>
            </Select>

            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {t.welcome}, {user.email}
                </span>
                <Button
                  variant="ghost"
                  className="font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.signOut}
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 transition-all duration-200 hover:scale-105"
                  onClick={() => navigate("/dashboard")}
                >
                  {t.goToDashboard}
                </Button>
              </>
            ) : (
              <>
                <button
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors duration-200"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  {t.signIn}
                </button>

                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  {t.getStarted}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8">
              {/* Badge with animation */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium animate-fade-in-up opacity-0 animation-delay-200">
                <Zap className="h-4 w-4 mr-2" />
                Launching Q2 2025 - Join Early Access
              </div>

              {/* Main headline with staggered animation */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white animate-fade-in-up opacity-0 animation-delay-400">
                  Navigate Trade Complexity
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 animate-fade-in-up opacity-0 animation-delay-600">
                    with AI-Powered Intelligence
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-0 animation-delay-800">
                  Reduce trade research time by 80%. Make informed decisions
                  about tariffs, suppliers, and supply chains.
                  <span className="text-orange-600 font-semibold">
                    Built specifically for SMBs.
                  </span>
                </p>
              </div>

              {/* Value proposition stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in-up opacity-0 animation-delay-1000">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-orange-500">80%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Time Saved
                  </div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-orange-500">6</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    AI-Powered Tools
                  </div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-orange-500">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Trade Monitoring
                  </div>
                </div>
              </div>

              {/* CTA Buttons with enhanced styling */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up opacity-0 animation-delay-1200">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() =>
                    user ? navigate("/dashboard") : setIsAuthModalOpen(true)
                  }
                >
                  {user ? "Go to Dashboard" : "Join Early Access - Free"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold h-14 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 group"
                >
                  Watch 3-Min Demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Feature highlights with improved messaging */}
              <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up opacity-0 animation-delay-1400">
                <div className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Setup in 5 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
              <Target className="h-4 w-4 mr-2" />
              Six AI-Powered Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Navigate
              <br />
              <span className="text-orange-500">International Trade</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From tariff calculations to supplier diversification, our AI
              handles the complexity so you can focus on growing your business.
            </p>
          </div>

          {/* Primary Features - Larger Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
                title: "Tariff Impact Calculator",
                description:
                  "Instantly calculate how tariff changes affect your product costs. Real-time data, multi-scenario analysis, and export-ready reports.",
                benefit: "Save 10+ hours per analysis",
                isPrimary: true,
              },
              {
                icon: <Brain className="h-8 w-8 text-orange-500" />,
                title: "AI Supplier Intelligence",
                description:
                  "Get AI-powered recommendations for supplier diversification. Risk assessment, performance scoring, and alternative sourcing options.",
                benefit: "Reduce supplier risk by 60%",
                isPrimary: true,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-orange-200 dark:hover:border-orange-800 group hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="mb-4 p-4 w-fit rounded-xl bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                  <div className="text-sm text-orange-600 font-medium">
                    {feature.benefit}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary Features - Compact Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
                title: "Supply Chain Planner",
                description:
                  "Model scenarios and optimize inventory based on tariff timing.",
              },
              {
                icon: <Users className="h-6 w-6 text-orange-500" />,
                title: "Workforce Planner",
                description:
                  "Adjust staffing plans based on changing costs and forecasts.",
              },
              {
                icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
                title: "Real-time Alerts",
                description:
                  "Get instant notifications on tariff changes and supplier news.",
              },
              {
                icon: <Shield className="h-6 w-6 text-orange-500" />,
                title: "Compliance Tracker",
                description:
                  "Stay compliant with trade regulations and documentation requirements.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-md group"
              >
                <CardHeader className="pb-2">
                  <div className="mb-3 p-2 w-fit rounded-lg bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to See It in Action?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join our early access program and be among the first to
                experience the future of trade intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Request Early Access
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-3 font-semibold border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-all duration-300"
                >
                  Schedule Demo Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Trading Plan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Flexible pricing options designed for traders of all levels. Scale
              your trading operations with our modular approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-7xl mx-auto">
            {[
              {
                name: "Pay-Per-App",
                description: "Choose only the apps you need",
                price: "$15",
                period: "/app/mo",
                features: [
                  "Choose only the apps you need",
                  "Includes 1,000 API calls/app/mo",
                  "Add/remove apps anytime",
                  "Email support",
                ],
                buttonText: "Select Apps",
                popular: false,
              },
              {
                name: "All Apps Bundle",
                description: "Access to all core trading apps",
                price: "$49",
                period: "/mo",
                features: [
                  "Access to all core apps",
                  "5,000 API calls/mo included",
                  "Bundle discount",
                  "Priority support",
                  "Advanced analytics",
                  "Custom alerts",
                ],
                buttonText: "Start Bundle",
                popular: true,
              },
              {
                name: "Credit Pack",
                description: "Flexible pay-as-you-go option",
                price: "$25",
                period: "/2,500 credits",
                features: [
                  "Use credits for any app or extra API calls",
                  "No monthly commitment",
                  "Buy more credits anytime",
                  "Credits never expire",
                ],
                buttonText: "Buy Credits",
                popular: false,
              },
              {
                name: "Enterprise",
                description: "Tailored solution for large teams",
                price: "Custom",
                period: "",
                features: [
                  "Unlimited apps & credits",
                  "Custom integrations",
                  "Dedicated support",
                  "SLA guarantee",
                  "White-label options",
                  "Advanced security",
                ],
                buttonText: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-orange-500 dark:border-orange-400"
                    : "border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-orange-500">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <TrendingUp className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-6 ${
                      plan.popular
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
                    }`}
                    onClick={() =>
                      user ? navigate("/dashboard") : setIsAuthModalOpen(true)
                    }
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              Transparent Usage Pricing
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              API overage: <span className="font-semibold">$0.01 per call</span>{" "}
              above plan limit.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Credits can be used for API calls, reports, or app actions.
              Monitor your usage in real-time through your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your Trade Operations?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Join thousands of SMBs using TradeNavigatorPro to navigate
              international trade with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold h-14 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() =>
                  user ? navigate("/dashboard") : setIsAuthModalOpen(true)
                }
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold h-14 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />

      {/* Personalized Welcome Modal */}
      <Dialog open={isWelcomeModalOpen} onOpenChange={setIsWelcomeModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {t.welcomeTitle}
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              {t.welcomeSubtitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Primary Challenge */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {t.primaryChallenge}
              </Label>
              <RadioGroup
                value={businessProfile.primaryChallenge}
                onValueChange={value =>
                  setBusinessProfile(prev => ({
                    ...prev,
                    primaryChallenge: value,
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rising-costs" id="rising-costs" />
                  <Label htmlFor="rising-costs">{t.challengeRisingCosts}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="supplier-risk" id="supplier-risk" />
                  <Label htmlFor="supplier-risk">
                    {t.challengeSupplierRisk}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compliance" id="compliance" />
                  <Label htmlFor="compliance">{t.challengeCompliance}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="forecasting" id="forecasting" />
                  <Label htmlFor="forecasting">{t.challengeForecasting}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Business Size */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {t.businessSize}
              </Label>
              <RadioGroup
                value={businessProfile.businessSize}
                onValueChange={value =>
                  setBusinessProfile(prev => ({
                    ...prev,
                    businessSize: value,
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">{t.sizeSmall}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">{t.sizeMedium}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">{t.sizeLarge}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Priorities */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t.priorities}</Label>
              <div className="space-y-2">
                {[
                  { id: "cost-reduction", label: t.priorityCostReduction },
                  { id: "risk-mitigation", label: t.priorityRiskMitigation },
                  { id: "compliance", label: t.priorityCompliance },
                  { id: "efficiency", label: t.priorityEfficiency },
                  { id: "growth", label: t.priorityGrowth },
                ].map(priority => (
                  <div
                    key={priority.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={priority.id}
                      checked={businessProfile.priorities.includes(priority.id)}
                      onCheckedChange={checked =>
                        handlePriorityChange(priority.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={priority.id}>{priority.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleWelcomeComplete}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
              size="lg"
              disabled={
                !businessProfile.primaryChallenge ||
                !businessProfile.businessSize
              }
            >
              <Star className="mr-2 h-5 w-5" />
              {t.getStartedPersonalized}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
