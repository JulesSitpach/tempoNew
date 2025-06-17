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
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  const { t, i18n } = useTranslation(["landing", "common"]);
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
    const newLang = i18n.language === "en" ? "es" : "en";
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

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: t("features.costCalculator.title"),
      description: t("features.costCalculator.description"),
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t("features.supplierDiversification.title"),
      description: t("features.supplierDiversification.description"),
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: t("features.supplyChainPlanner.title"),
      description: t("features.supplyChainPlanner.description"),
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t("features.workforcePlanner.title"),
      description: t("features.workforcePlanner.description"),
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-primary" />,
      title: t("features.alertsMonitoring.title"),
      description: t("features.alertsMonitoring.description"),
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: t("features.aiRecommendations.title"),
      description: t("features.aiRecommendations.description"),
    },
  ];

  const pricingPlans = [
    {
      name: t("pricing.freeTier.name"),
      price: t("pricing.freeTier.price"),
      period: "",
      description: t("pricing.freeTier.description"),
      features: t("pricing.freeTier.features", { returnObjects: true }),
      cta: t("pricing.freeTier.cta"),
      popular: false,
    },
    {
      name: t("pricing.proPlan.name"),
      price: t("pricing.proPlan.price"),
      period: t("pricing.proPlan.period"),
      description: t("pricing.proPlan.description"),
      features: t("pricing.proPlan.features", { returnObjects: true }),
      cta: t("pricing.proPlan.cta"),
      popular: true,
    },
    {
      name: t("pricing.enterprisePlan.name"),
      price: t("pricing.enterprisePlan.price"),
      period: t("pricing.enterprisePlan.period"),
      description: t("pricing.enterprisePlan.description"),
      features: t("pricing.enterprisePlan.features", { returnObjects: true }),
      cta: t("pricing.enterprisePlan.cta"),
      popular: false,
    },
  ];

  const [heroRef, heroInView] = useInView(0.1);
  const [featuresInView] = useInView(0.1);
  const [pricingInView] = useInView(0.1);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-300">
        <div className="container mx-auto px-6 flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              SMB Tariff Suite
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 ml-12">
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              onClick={() => scrollToSection(featuresRef)}
            >
              {t("navigation.features")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              onClick={() => scrollToSection(pricingRef)}
            >
              {t("navigation.pricing")}
              <span className="absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-600 dark:text-gray-300 hover:text-orange-500"
            >
              <Globe className="h-4 w-4 mr-2" />
              {t("navigation.languageSwitch")}
            </Button>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                  Welcome, {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-500"
                >
                  {t("navigation.login")}
                </Button>
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                >
                  {t("navigation.getStarted")}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div
            ref={heroRef}
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
              heroInView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              {t("hero.subtitle")}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              {t("hero.description")}
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex items-center justify-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Zap className="h-6 w-6 text-orange-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("hero.features.realTimeData")}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Brain className="h-6 w-6 text-orange-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("hero.features.aiPowered")}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Globe className="h-6 w-6 text-orange-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("hero.features.supplierNetwork")}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg font-semibold transition-colors duration-300"
              >
                {t("hero.ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("features.sectionTitle")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("features.sectionDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  featuresInView ? "animate-fade-in" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("pricing.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white dark:bg-gray-800 ${
                  plan.popular
                    ? "border-2 border-orange-500 shadow-2xl scale-105"
                    : "border border-gray-200 dark:border-gray-700"
                } hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 dark:text-gray-300">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {(plan.features as string[]).map(
                      (feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    } transition-colors duration-200`}
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t("cta.subtitle")}
          </p>
          <Button
            size="lg"
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("cta.button")}
          </Button>
          <p className="text-sm mt-4 opacity-75">{t("cta.noCredit")}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold">SMB Tariff Suite</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering small businesses to navigate trade complexities with
              confidence.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          // New users will see welcome modal after login
        }}
      />

      {/* Welcome Modal */}
      <Dialog open={isWelcomeModalOpen} onOpenChange={setIsWelcomeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Welcome to SMB Tariff Suite!
            </DialogTitle>
            <DialogDescription className="text-center">
              Let's personalize your experience to help you succeed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                What's your biggest challenge right now?
              </Label>
              <RadioGroup
                value={businessProfile.primaryChallenge}
                onValueChange={value =>
                  setBusinessProfile(prev => ({
                    ...prev,
                    primaryChallenge: value,
                  }))
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rising-costs" id="rising-costs" />
                  <Label htmlFor="rising-costs">
                    Rising import costs due to tariffs
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="supplier-risk" id="supplier-risk" />
                  <Label htmlFor="supplier-risk">
                    Supplier concentration and risk
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compliance" id="compliance" />
                  <Label htmlFor="compliance">
                    Trade compliance and documentation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="forecasting" id="forecasting" />
                  <Label htmlFor="forecasting">
                    Demand forecasting and planning
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">
                What's your business size?
              </Label>
              <Select
                value={businessProfile.businessSize}
                onValueChange={value =>
                  setBusinessProfile(prev => ({
                    ...prev,
                    businessSize: value,
                  }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select business size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1-50 employees)</SelectItem>
                  <SelectItem value="medium">
                    Medium (51-200 employees)
                  </SelectItem>
                  <SelectItem value="large">Large (200+ employees)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">
                What industry are you in?
              </Label>
              <Select
                value={businessProfile.industry}
                onValueChange={value =>
                  setBusinessProfile(prev => ({
                    ...prev,
                    industry: value,
                  }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail/E-commerce</SelectItem>
                  <SelectItem value="distribution">
                    Distribution/Wholesale
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">
                What are your main priorities? (Select all that apply)
              </Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {[
                  { id: "cost-reduction", label: "Reduce costs immediately" },
                  {
                    id: "risk-mitigation",
                    label: "Mitigate supply chain risks",
                  },
                  { id: "compliance", label: "Ensure trade compliance" },
                  { id: "efficiency", label: "Improve operational efficiency" },
                  { id: "growth", label: "Support business growth" },
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

            <Button
              onClick={handleWelcomeComplete}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={
                !businessProfile.primaryChallenge ||
                !businessProfile.businessSize ||
                !businessProfile.industry ||
                businessProfile.priorities.length === 0
              }
            >
              Get Started with Personalized Recommendations
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
