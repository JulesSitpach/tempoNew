import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Zap, Crown, Rocket, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PricingTier {
  id: string;
  name: string;
  nameEs: string;
  price: number;
  priceId: string; // Stripe price ID
  popular?: boolean;
  features: string[];
  featuresEs: string[];
  description: string;
  descriptionEs: string;
  roiMultiplier: string;
  targetUser: string;
  targetUserEs: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Foundation Assessment',
    nameEs: 'Evaluación Fundamental',
    price: 0,
    priceId: '', // Free tier
    features: [
      'Immediate tariff lookup for your products',
      'Basic HTS code classification',
      'Simple cost impact calculator',
      'Quick risk assessment by supplier country',
      'Basic shipping estimates',
      '15-minute setup with instant value'
    ],
    featuresEs: [
      'Consulta inmediata de aranceles para tus productos',
      'Clasificación básica de códigos HTS',
      'Calculadora simple de impacto de costos',
      'Evaluación rápida de riesgo por país proveedor',
      'Estimaciones básicas de envío',
      'Configuración de 15 minutos con valor instantáneo'
    ],
    description: 'Perfect for SMBs just starting their tariff optimization journey',
    descriptionEs: 'Perfecto para PYMEs que recién comienzan su optimización arancelaria',
    roiMultiplier: 'Save $5K-15K annually',
    targetUser: 'New importers, $1M-5M revenue',
    targetUserEs: 'Nuevos importadores, $1M-5M ingresos'
  },
  {
    id: 'intelligence',
    name: 'Risk Intelligence & Quick Wins',
    nameEs: 'Inteligencia de Riesgo y Victorias Rápidas',
    price: 99,
    priceId: 'price_intelligence_monthly',
    popular: true,
    features: [
      'Real-time Federal Register policy alerts',
      'Currency exposure analysis with hedging recommendations',
      'Supplier concentration risk scoring',
      'Alternative supplier suggestions (3+ per product)',
      'Basic scenario modeling',
      'Policy change alerts for your products/countries',
      'All Foundation features included'
    ],
    featuresEs: [
      'Alertas de políticas del Registro Federal en tiempo real',
      'Análisis de exposición cambiaria con recomendaciones',
      'Puntuación de riesgo de concentración de proveedores',
      'Sugerencias de proveedores alternativos (3+ por producto)',
      'Modelado básico de escenarios',
      'Alertas de cambios de política para tus productos/países',
      'Todas las características Fundamentales incluidas'
    ],
    description: 'For SMBs ready to take control of their supply chain risks',
    descriptionEs: 'Para PYMEs listas para tomar control de los riesgos de su cadena de suministro',
    roiMultiplier: 'Save $25K-75K annually',
    targetUser: 'Growing importers, $5M-20M revenue',
    targetUserEs: 'Importadores en crecimiento, $5M-20M ingresos'
  },
  {
    id: 'strategic',
    name: 'Strategic Planning & Market Intelligence',
    nameEs: 'Planificación Estratégica e Inteligencia de Mercado',
    price: 299,
    priceId: 'price_strategic_monthly',
    features: [
      'SAM.gov verified supplier financial stability reports',
      'Port congestion impact analysis',
      'Economic trend analysis for supplier countries',
      'Detailed diversification roadmap with timeline',
      'ROI analysis for each recommended change',
      'Trade agreement optimization recommendations',
      'All Intelligence features included'
    ],
    featuresEs: [
      'Informes de estabilidad financiera verificados por SAM.gov',
      'Análisis de impacto de congestión portuaria',
      'Análisis de tendencias económicas para países proveedores',
      'Hoja de ruta de diversificación detallada con cronograma',
      'Análisis de ROI para cada cambio recomendado',
      'Recomendaciones de optimización de acuerdos comerciales',
      'Todas las características de Inteligencia incluidas'
    ],
    description: 'For SMBs planning strategic expansion and optimization',
    descriptionEs: 'Para PYMEs planificando expansión estratégica y optimización',
    roiMultiplier: 'Save $100K-300K annually',
    targetUser: 'Established importers, $20M-50M revenue',
    targetUserEs: 'Importadores establecidos, $20M-50M ingresos'
  },
  {
    id: 'automation',
    name: 'Automation & Continuous Optimization',
    nameEs: 'Automatización y Optimización Continua',
    price: 799,
    priceId: 'price_automation_monthly',
    features: [
      'Predictive analytics for tariff changes (90-day forecasts)',
      'Automated supplier performance tracking',
      'Real-time cost optimization recommendations',
      'Custom ERP/accounting software integrations',
      'Machine learning models trained on your data',
      'Automated compliance monitoring',
      'All Strategic features included'
    ],
    featuresEs: [
      'Análisis predictivo para cambios arancelarios (pronósticos 90 días)',
      'Seguimiento automatizado del rendimiento de proveedores',
      'Recomendaciones de optimización de costos en tiempo real',
      'Integraciones personalizadas de ERP/software contable',
      'Modelos de aprendizaje automático entrenados con tus datos',
      'Monitoreo automatizado de cumplimiento',
      'Todas las características Estratégicas incluidas'
    ],
    description: 'For SMBs ready for enterprise-level automation at SMB prices',
    descriptionEs: 'Para PYMEs listas para automatización nivel empresarial a precios PYME',
    roiMultiplier: 'Save $500K+ annually',
    targetUser: 'Advanced importers, $50M+ revenue',
    targetUserEs: 'Importadores avanzados, $50M+ ingresos'
  }
];

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['common', 'components']);
  const [loading, setLoading] = useState<string | null>(null);
  const isSpanish = i18n.language === 'es';

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.price === 0) {
      // Handle free tier signup
      console.log('Free tier selected');
      return;
    }

    setLoading(tier.id);
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tier.priceId,
          userId: user?.id,
          tierName: tier.name,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?subscription=cancelled`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      await stripe.redirectToCheckout({ sessionId });
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert(isSpanish ? 'Error al procesar suscripción' : 'Error processing subscription');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isSpanish ? 'Precios Transparentes, Valor Inmediato' : 'Transparent Pricing, Immediate Value'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isSpanish 
              ? 'Cada nivel se paga solo a través de ahorros de costos. Comienza gratis, actualiza cuando estés listo.'
              : 'Each tier pays for itself through cost savings. Start free, upgrade when ready.'
            }
          </p>
          
          {/* Value Comparison */}
          <div className="mt-8 inline-flex items-center bg-green-100 rounded-full px-6 py-3">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">
              {isSpanish 
                ? '95% más barato que soluciones empresariales ($5,000+/mes)'
                : '95% cheaper than enterprise solutions ($5,000+/month)'
              }
            </span>
          </div>
        </div>

const PricingPage = () => {
  const plans = [
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
      buttonVariant: "default" as const,
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
      buttonVariant: "default" as const,
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
      buttonVariant: "default" as const,
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
      buttonVariant: "default" as const,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Trading Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Flexible pricing options designed for traders of all levels. Scale
            your trading operations with our modular approach.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary border-2" : "border-border"} bg-card shadow-lg rounded-xl hover:shadow-xl transition-all duration-200`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-orange-500">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 ${
                    plan.popular
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transparent Usage Pricing */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Transparent Usage Pricing
          </h2>
          <p className="text-muted-foreground mb-2">
            API overage: <span className="font-semibold">$0.01 per call</span>{" "}
            above plan limit.
          </p>
          <p className="text-muted-foreground">
            Credits can be used for API calls, reports, or app actions. Monitor
            your usage in real-time through your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
