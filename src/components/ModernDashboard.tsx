import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessData } from '@/contexts/BusinessDataContext';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Bell,
  CheckCircle,
  DollarSign,
  Globe,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  TrendingUp,
  User,
  Zap,
  ArrowRight,
  AlertTriangle,
  Target,
  Truck,
  FileText,
  Activity
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  status: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, status, icon: Icon }) => {
  const statusColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-blue-400'
  };

  return (
    <div className="smb-metric-card hover:border-blue-500/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="smb-metric-label">{title}</h3>
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div className={`smb-metric-value ${statusColors[status]}`}>
        {value}
      </div>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
};

interface WorkflowStepProps {
  number: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  onLaunch?: () => void;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ number, title, description, status, onLaunch }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'active':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getNumberStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'active':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className={`smb-card border ${getStatusStyles()} cursor-pointer hover:border-blue-500/50 transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getNumberStyles()}`}>
            {status === 'completed' ? <CheckCircle className="w-4 h-4" /> : number}
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {status === 'active' && onLaunch && (
          <button 
            onClick={onLaunch}
            className="btn-primary text-sm py-2 px-4"
          >
            Launch App <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

const ModernDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, getCompletionPercentage } = useBusinessData();
  const { t, i18n } = useTranslation();
  const [activeNotifications] = useState(3);
  const currentLanguage = (i18n.language || 'en') as 'en' | 'es';
  const isSpanish = currentLanguage === 'es';

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Mock KPI data - in real app, this would come from your data context
  const kpiData = [
    {
      title: isSpanish ? 'Productos Afectados' : 'Products Affected',
      value: '0',
      subtitle: isSpanish ? 'Productos con impactos arancelarios' : 'Products with tariff impacts',
      status: 'neutral' as const,
      icon: Target
    },
    {
      title: isSpanish ? 'Ahorros Potenciales' : 'Potential Savings',
      value: '$0.00',
      subtitle: isSpanish ? 'A través de optimización arancelaria' : 'Through tariff optimization',
      status: 'positive' as const,
      icon: DollarSign
    },
    {
      title: isSpanish ? 'Puntuación de Cumplimiento' : 'Compliance Score',
      value: '100%',
      subtitle: isSpanish ? 'Cumplimiento de documentación comercial' : 'Trade documentation compliance',
      status: 'positive' as const,
      icon: Shield
    }
  ];

  const workflowSteps = [
    {
      number: 1,
      title: isSpanish ? 'Evaluación y Descubrimiento' : 'Assessment & Discovery',
      description: isSpanish ? 'Comience aquí para entender su situación arancelaria actual e identificar impactos potenciales' : 'Start here to understand your current tariff situation and identify potential impacts',
      status: 'active' as const,
      tools: [
        {
          name: isSpanish ? 'Clasificador de Aranceles IA' : 'AI Tariff Classifier',
          description: isSpanish ? 'Use IA para sugerir automáticamente códigos HS para sus productos' : 'Use AI to automatically suggest HS codes for your products',
          features: [
            isSpanish ? 'Clasificación impulsada por IA' : 'AI-powered classification',
            isSpanish ? 'Puntuación de confianza' : 'Confidence scoring',
            isSpanish ? 'Aprende de correcciones' : 'Learns from corrections',
            isSpanish ? 'Explicaciones detalladas' : 'Detailed explanations'
          ],
          status: 'active' as const
        },
        {
          name: isSpanish ? 'Escáner de Impacto Arancelario' : 'Tariff Impact Scanner',
          description: isSpanish ? 'Analice su catálogo de productos para identificar impactos arancelarios' : 'Analyze your product catalog to identify tariff impacts',
          features: [
            isSpanish ? 'Validación de códigos HS' : 'HS code validation',
            isSpanish ? 'Cálculo de impacto arancelario' : 'Tariff impact calculation',
            isSpanish ? 'Informes visuales' : 'Visual reporting'
          ],
          status: 'active' as const
        }
      ]
    },
    {
      number: 2,
      title: isSpanish ? 'Acción y Optimización' : 'Action & Optimization',
      description: isSpanish ? 'Tome medidas para mitigar impactos arancelarios y optimizar su cadena de suministro' : 'Take action to mitigate tariff impacts and optimize your supply chain',
      status: 'pending' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <nav className="smb-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="smb-nav-brand flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                SMB Tariff Suite
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="smb-nav-link flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {currentLanguage.toUpperCase()}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="smb-nav-link p-2">
                  <Bell className="w-5 h-5" />
                  {activeNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {activeNotifications}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  {user?.email || 'Guest User'}
                </span>
                <button
                  onClick={signOut}
                  className="smb-nav-link p-2"
                  title={isSpanish ? 'Cerrar Sesión' : 'Sign Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSpanish ? 'Panel de Control' : 'Dashboard'}
          </h1>
          <p className="text-gray-400">
            {isSpanish 
              ? 'Bienvenido a SMB Tariff Suite, su plataforma todo en uno para navegar desafíos arancelarios y optimizar las operaciones comerciales globales de su pequeña empresa.'
              : 'Welcome to SMB Tariff Suite, your all-in-one platform for navigating tariff challenges and optimizing your small business\'s global trade operations.'
            }
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              status={kpi.status}
              icon={kpi.icon}
            />
          ))}
        </div>

        {/* SMB Trade Journey */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {isSpanish ? 'Su Jornada Comercial PYME' : 'Your SMB Trade Journey'}
          </h2>

          {/* Step 1: Assessment & Discovery */}
          <div className="mb-8">
            <WorkflowStep
              number={1}
              title={workflowSteps[0].title}
              description={workflowSteps[0].description}
              status={workflowSteps[0].status}
            />

            {/* Tools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 ml-12">
              {workflowSteps[0].tools?.map((tool, index) => (
                <div key={index} className="smb-card border-gray-600">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        {tool.name}
                        {tool.status === 'active' && (
                          <span className="status-active text-xs px-2 py-1">
                            {isSpanish ? 'Activo' : 'Active'}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">{tool.description}</p>
                      
                      {/* Features */}
                      <div className="space-y-1 mb-4">
                        <p className="text-xs font-medium text-gray-300 mb-2">
                          {isSpanish ? 'Características:' : 'Features:'}
                        </p>
                        {tool.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {isSpanish ? 'Herramientas IA' : 'AI Tools'}
                    </span>
                    <button className="btn-primary text-sm py-2 px-4">
                      {isSpanish ? 'Iniciar App' : 'Launch App'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Action & Optimization */}
          <WorkflowStep
            number={2}
            title={workflowSteps[1].title}
            description={workflowSteps[1].description}
            status={workflowSteps[1].status}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="smb-card hover:border-blue-500/30 text-left transition-all duration-200">
            <FileText className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">
              {isSpanish ? 'Documentación' : 'Documentation'}
            </h3>
            <p className="text-sm text-gray-400">
              {isSpanish ? 'Acceder a guías y tutoriales' : 'Access guides and tutorials'}
            </p>
          </button>

          <button className="smb-card hover:border-blue-500/30 text-left transition-all duration-200">
            <Settings className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">
              {isSpanish ? 'Configuración' : 'Settings'}
            </h3>
            <p className="text-sm text-gray-400">
              {isSpanish ? 'Configurar su cuenta' : 'Configure your account'}
            </p>
          </button>

          <button className="smb-card hover:border-blue-500/30 text-left transition-all duration-200">
            <Activity className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">
              {isSpanish ? 'Estado API' : 'API Status'}
            </h3>
            <p className="text-sm text-gray-400">
              {isSpanish ? 'Verificar servicios' : 'Check service status'}
            </p>
          </button>

          <button className="smb-card hover:border-blue-500/30 text-left transition-all duration-200">
            <HelpCircle className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">
              {isSpanish ? 'Ayuda' : 'Help'}
            </h3>
            <p className="text-sm text-gray-400">
              {isSpanish ? 'Obtener soporte' : 'Get support'}
            </p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ModernDashboard;
