import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  Star,
  Zap,
  Crown,
  Rocket,
  DollarSign,
  ArrowRight,
  Calculator,
  Shield,
  TrendingUp,
  Users,
  Globe,
  Award
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  nameEs: string;
  price: number;
  priceId: string;
  popular?: boolean;
  features: string[];
  featuresEs: string[];
  description: string;
  descriptionEs: string;
  roiMultiplier: string;
  roiMultiplierEs: string;
  targetUser: string;
  targetUserEs: string;
  valueProposition: string;
  valuePropositionEs: string;
  icon: React.ComponentType<any>;
  color: string;
}

const ENHANCED_PRICING_TIERS: PricingTier[] = [
  {
    id: 'foundation',
    name: 'Foundation Assessment',
    nameEs: 'Evaluación Fundamental',
    price: 0,
    priceId: '',
    icon: Shield,
    color: 'green',
    features: [
      'Instant tariff lookup for your products',
      'Basic HTS code classification with AI assistance',
      'Simple cost impact calculator',
      'Quick risk assessment by supplier country',
      'Basic shipping cost estimates',
      '15-minute setup with immediate insights',
      'Export results to PDF/Excel'
    ],
    featuresEs: [
      'Consulta instantánea de aranceles para tus productos',
      'Clasificación básica de códigos HTS con asistencia IA',
      'Calculadora simple de impacto de costos',
      'Evaluación rápida de riesgo por país proveedor',
      'Estimaciones básicas de costos de envío',
      'Configuración de 15 minutos con insights inmediatos',
      'Exportar resultados a PDF/Excel'
    ],
    description: 'Perfect for SMBs taking their first steps into tariff optimization',
    descriptionEs: 'Perfecto para PYMEs dando sus primeros pasos en optimización arancelaria',
    roiMultiplier: 'Save $5K-15K annually',
    roiMultiplierEs: 'Ahorre $5K-15K anualmente',
    targetUser: 'New importers, $500K-2M revenue',
    targetUserEs: 'Nuevos importadores, $500K-2M ingresos',
    valueProposition: 'Get clarity on your tariff exposure in 15 minutes',
    valuePropositionEs: 'Obtenga claridad sobre su exposición arancelaria en 15 minutos'
  },
  {
    id: 'intelligence',
    name: 'Risk Intelligence & Quick Wins',
    nameEs: 'Inteligencia de Riesgo y Victorias Rápidas',
    price: 99,
    priceId: 'price_intelligence_monthly',
    popular: true,
    icon: Zap,
    color: 'blue',
    features: [
      'Real-time Federal Register policy alerts',
      'Currency exposure analysis with hedging recommendations',
      'Supplier concentration risk scoring',
      'Alternative supplier suggestions (3+ per product)',
      'Basic scenario modeling for different tariff rates',
      'Policy change alerts for your specific products/countries',
      'Monthly risk assessment reports',
      'All Foundation features included'
    ],
    featuresEs: [
      'Alertas de políticas del Registro Federal en tiempo real',
      'Análisis de exposición cambiaria con recomendaciones',
      'Puntuación de riesgo de concentración de proveedores',
      'Sugerencias de proveedores alternativos (3+ por producto)',
      'Modelado básico de escenarios para diferentes tasas arancelarias',
      'Alertas de cambios de política para productos/países específicos',
      'Informes mensuales de evaluación de riesgos',
      'Todas las características Fundamentales incluidas'
    ],
    description: 'For SMBs ready to proactively manage their supply chain risks',
    descriptionEs: 'Para PYMEs listas para gestionar proactivamente los riesgos de su cadena',
    roiMultiplier: 'Save $25K-75K annually',
    roiMultiplierEs: 'Ahorre $25K-75K anualmente',
    targetUser: 'Growing importers, $2M-10M revenue',
    targetUserEs: 'Importadores en crecimiento, $2M-10M ingresos',
    valueProposition: 'Turn tariff risks into competitive advantages',
    valuePropositionEs: 'Convierta los riesgos arancelarios en ventajas competitivas'
  },
  {
    id: 'strategic',
    name: 'Strategic Planning & Market Intelligence',
    nameEs: 'Planificación Estratégica e Inteligencia de Mercado',
    price: 299,
    priceId: 'price_strategic_monthly',
    icon: TrendingUp,
    color: 'purple',
    features: [
      'SAM.gov verified supplier financial stability reports',
      'Port congestion impact analysis and alternative routing',
      'Economic trend analysis for supplier countries',
      'Detailed diversification roadmap with implementation timeline',
      'ROI analysis for each recommended supply chain change',
      'Trade agreement optimization recommendations',
      'Quarterly strategic planning sessions (virtual)',
      'All Intelligence features included'
    ],
    featuresEs: [
      'Informes verificados de estabilidad financiera de proveedores SAM.gov',
      'Análisis de impacto de congestión portuaria y rutas alternativas',
      'Análisis de tendencias económicas para países proveedores',
      'Hoja de ruta de diversificación detallada con cronograma',
      'Análisis de ROI para cada cambio recomendado en cadena de suministro',
      'Recomendaciones de optimización de acuerdos comerciales',
      'Sesiones trimestrales de planificación estratégica (virtuales)',
      'Todas las características de Inteligencia incluidas'
    ],
    description: 'For SMBs planning strategic expansion and long-term optimization',
    descriptionEs: 'Para PYMEs planificando expansión estratégica y optimización a largo plazo',
    roiMultiplier: 'Save $100K-300K annually',
    roiMultiplierEs: 'Ahorre $100K-300K anualmente',
    targetUser: 'Established importers, $10M-50M revenue',
    targetUserEs: 'Importadores establecidos, $10M-50M ingresos',
    valueProposition: 'Build a resilient, cost-optimized supply chain',
    valuePropositionEs: 'Construya una cadena de suministro resistente y optimizada en costos'
  },
  {
    id: 'automation',
    name: 'Enterprise Automation',
    nameEs: 'Automatización Empresarial',
    price: 799,
    priceId: 'price_automation_monthly',
    icon: Crown,
    color: 'gold',
    features: [
      'Predictive analytics for tariff changes (90-day forecasts)',
      'Automated supplier performance tracking and alerts',
      'Real-time cost optimization recommendations',
      'Custom ERP/accounting software integrations',
      'Machine learning models trained on your specific data',
      'Automated compliance monitoring and reporting',
      'Dedicated customer success manager',
      'All Strategic features included'
    ],
    featuresEs: [
      'Análisis predictivo para cambios arancelarios (pronósticos 90 días)',
      'Seguimiento automatizado del rendimiento de proveedores y alertas',
      'Recomendaciones de optimización de costos en tiempo real',
      'Integraciones personalizadas de ERP/software contable',
      'Modelos de aprendizaje automático entrenados con datos específicos',
      'Monitoreo automatizado de cumplimiento e informes',
      'Gerente dedicado de éxito del cliente',
      'Todas las características Estratégicas incluidas'
    ],
    description: 'Enterprise-level automation at SMB-friendly prices',
    descriptionEs: 'Automatización nivel empresarial a precios amigables para PYMEs',
    roiMultiplier: 'Save $500K+ annually',
    roiMultiplierEs: 'Ahorre $500K+ anualmente',
    targetUser: 'Advanced importers, $50M+ revenue',
    targetUserEs: 'Importadores avanzados, $50M+ ingresos',
    valueProposition: 'Complete automation for maximum efficiency and savings',
    valuePropositionEs: 'Automatización completa para máxima eficiencia y ahorros'
  }
];

interface ROICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [importPercentage, setImportPercentage] = useState('');
  const [currentTariffCosts, setCurrentTariffCosts] = useState('');

  const calculateROI = () => {
    const revenue = parseFloat(annualRevenue) || 0;
    const importPct = parseFloat(importPercentage) || 0;
    const tariffCosts = parseFloat(currentTariffCosts) || 0;
    
    const importValue = revenue * (importPct / 100);
    const potentialSavings = Math.min(tariffCosts * 0.3, importValue * 0.05); // Conservative 30% savings on tariffs or 5% of import value
    
    return {
      potentialSavings: potentialSavings,
      roiMultiplier: potentialSavings / (299 * 12), // Using Strategic tier as example
      breakEvenMonths: (299 * 12) / (potentialSavings / 12)
    };
  };

  const roi = calculateROI();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-600 max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              {isSpanish ? 'Calculadora de ROI' : 'ROI Calculator'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {isSpanish ? 'Ingresos Anuales ($)' : 'Annual Revenue ($)'}
              </label>
              <input
                type="number"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(e.target.value)}
                className="form-input"
                placeholder="5000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {isSpanish ? 'Porcentaje de Importaciones (%)' : 'Import Percentage (%)'}
              </label>
              <input
                type="number"
                value={importPercentage}
                onChange={(e) => setImportPercentage(e.target.value)}
                className="form-input"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {isSpanish ? 'Costos Arancelarios Anuales ($)' : 'Annual Tariff Costs ($)'}
              </label>
              <input
                type="number"
                value={currentTariffCosts}
                onChange={(e) => setCurrentTariffCosts(e.target.value)}
                className="form-input"
                placeholder="150000"
              />
            </div>

            {roi.potentialSavings > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-green-400 mb-3">
                  {isSpanish ? 'Ahorros Proyectados' : 'Projected Savings'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">
                      {isSpanish ? 'Ahorros Anuales:' : 'Annual Savings:'}
                    </span>
                    <span className="text-green-400 font-semibold">
                      ${roi.potentialSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">
                      {isSpanish ? 'ROI (Strategic Plan):' : 'ROI (Strategic Plan):'}
                    </span>
                    <span className="text-green-400 font-semibold">
                      {roi.roiMultiplier.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">
                      {isSpanish ? 'Recuperación:' : 'Break-even:'}
                    </span>
                    <span className="text-green-400 font-semibold">
                      {Math.ceil(roi.breakEvenMonths)} {isSpanish ? 'meses' : 'months'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedPricingPage: React.FC = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const isSpanish = i18n.language === 'es';

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.price === 0) {
      // Handle free tier signup - redirect to onboarding
      window.location.href = '/onboarding';
      return;
    }

    setLoading(tier.id);
    
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch('/api/stripe/create-checkout-session', {
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
          metadata: {
            tierName: tier.name,
            tierId: tier.id,
            userEmail: user?.email
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = (window as any).Stripe(process.env.VITE_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert(isSpanish 
        ? 'Error al procesar suscripción. Intente nuevamente.' 
        : 'Error processing subscription. Please try again.'
      );
    } finally {
      setLoading(null);
    }
  };

  const getColorClasses = (color: string, popular?: boolean) => {
    const colors = {
      green: popular ? 'border-green-500/50 bg-green-500/5' : 'border-green-500/30 hover:border-green-500/50',
      blue: popular ? 'border-blue-500/50 bg-blue-500/5' : 'border-blue-500/30 hover:border-blue-500/50',
      purple: popular ? 'border-purple-500/50 bg-purple-500/5' : 'border-purple-500/30 hover:border-purple-500/50',
      gold: popular ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-yellow-500/30 hover:border-yellow-500/50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {isSpanish ? 'Precios que Crecen con Su Negocio' : 'Pricing That Grows With Your Business'}
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            {isSpanish 
              ? 'Desde evaluaciones básicas hasta automatización completa - encontramos el plan perfecto para su PYME'
              : 'From basic assessments to full automation - find the perfect plan for your SMB'
            }
          </p>
          <button
            onClick={() => setShowROICalculator(true)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            {isSpanish ? 'Calcular Su ROI' : 'Calculate Your ROI'}
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ENHANCED_PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`smb-card relative ${getColorClasses(tier.color, tier.popular)} transition-all duration-200`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {isSpanish ? 'Más Popular' : 'Most Popular'}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <tier.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isSpanish ? tier.nameEs : tier.name}
                </h3>
                <div className="text-3xl font-bold text-white">
                  {tier.price === 0 ? (
                    isSpanish ? 'Gratis' : 'Free'
                  ) : (
                    <>
                      <span className="text-lg">$</span>
                      {tier.price}
                      <span className="text-sm text-gray-400">
                        {isSpanish ? '/mes' : '/month'}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-blue-400 font-medium mt-1">
                  {isSpanish ? tier.roiMultiplierEs : tier.roiMultiplier}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-4">
                  {isSpanish ? tier.descriptionEs : tier.description}
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-blue-400 mb-1">
                    {isSpanish ? 'Propuesta de Valor:' : 'Value Proposition:'}
                  </p>
                  <p className="text-sm text-blue-100">
                    {isSpanish ? tier.valuePropositionEs : tier.valueProposition}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {(isSpanish ? tier.featuresEs : tier.features).slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
                {(isSpanish ? tier.featuresEs : tier.features).length > 4 && (
                  <p className="text-xs text-gray-400 italic">
                    +{(isSpanish ? tier.featuresEs : tier.features).length - 4}{' '}
                    {isSpanish ? 'características más' : 'more features'}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={loading === tier.id}
                  className={`w-full ${
                    tier.price === 0 ? 'btn-secondary' : 'btn-primary'
                  } justify-center ${loading === tier.id ? 'opacity-50' : ''}`}
                >
                  {loading === tier.id ? (
                    isSpanish ? 'Procesando...' : 'Processing...'
                  ) : tier.price === 0 ? (
                    isSpanish ? 'Comenzar Gratis' : 'Start Free'
                  ) : (
                    <>
                      {isSpanish ? 'Suscribirse' : 'Subscribe'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    {isSpanish ? tier.targetUserEs : tier.targetUser}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Value Propositions */}
        <div className="bg-gray-800 rounded-lg border border-gray-600 p-8 mb-12">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            {isSpanish ? '¿Por Qué SMB Tariff Suite?' : 'Why SMB Tariff Suite?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                {isSpanish ? 'ROI Comprobado' : 'Proven ROI'}
              </h3>
              <p className="text-sm text-gray-400">
                {isSpanish 
                  ? 'Nuestros clientes ahorran en promedio 15-30% en costos arancelarios'
                  : 'Our clients save an average of 15-30% on tariff costs'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                {isSpanish ? 'Específico para PYMEs' : 'SMB-Specific'}
              </h3>
              <p className="text-sm text-gray-400">
                {isSpanish 
                  ? 'Diseñado para pequeñas y medianas empresas, no para grandes corporaciones'
                  : 'Built for small and medium businesses, not large corporations'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                {isSpanish ? 'Soporte Experto' : 'Expert Support'}
              </h3>
              <p className="text-sm text-gray-400">
                {isSpanish 
                  ? 'Acceso a expertos en comercio internacional y cumplimiento'
                  : 'Access to international trade and compliance experts'
                }
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {isSpanish ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isSpanish 
              ? '¿Preguntas sobre nuestros planes? Estamos aquí para ayudar.'
              : 'Questions about our plans? We\'re here to help.'
            }
          </p>
          <button className="btn-secondary">
            {isSpanish ? 'Ver Todas las FAQ' : 'View All FAQs'}
          </button>
        </div>
      </div>

      <ROICalculator 
        isOpen={showROICalculator} 
        onClose={() => setShowROICalculator(false)} 
      />
    </div>
  );
};

export default EnhancedPricingPage;
