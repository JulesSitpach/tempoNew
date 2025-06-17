import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  X,
  ChevronRight,
  Play,
  Book,
  MessageSquare,
  Lightbulb,
  Calculator,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const SMBTooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg border border-gray-600 max-w-xs">
            {content}
            <div className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 left-1/2 transform -translate-x-1/2 top-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

interface BusinessContextProps {
  value: string | number;
  context: string;
  actionableInsight: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export const BusinessContextCard: React.FC<BusinessContextProps> = ({
  value,
  context,
  actionableInsight,
  riskLevel = 'low'
}) => {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return 'border-red-500/30 bg-red-500/5';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/5';
      default: return 'border-green-500/30 bg-green-500/5';
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  return (
    <div className={`smb-card ${getRiskColor()} border`}>
      <div className="flex items-start gap-3">
        {getRiskIcon()}
        <div className="flex-1">
          <div className="text-lg font-semibold text-white mb-2">{value}</div>
          <p className="text-sm text-gray-300 mb-3">{context}</p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-400 mb-1">
                  {isSpanish ? 'Lo que esto significa para su negocio:' : 'What this means for your business:'}
                </p>
                <p className="text-sm text-blue-100">{actionableInsight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
}

export const SMBHelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, topic = 'general' }) => {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';

  const helpContent = {
    general: {
      title: isSpanish ? 'Ayuda General' : 'General Help',
      sections: [
        {
          title: isSpanish ? 'Primeros Pasos' : 'Getting Started',
          icon: Play,
          content: isSpanish 
            ? 'Comience completando su perfil empresarial. Esto nos ayuda a proporcionar recomendaciones personalizadas para su industria y tamaño de empresa.'
            : 'Start by completing your business profile. This helps us provide personalized recommendations for your industry and company size.'
        },
        {
          title: isSpanish ? 'Comprensión de Aranceles' : 'Understanding Tariffs',
          icon: Book,
          content: isSpanish
            ? 'Los aranceles son impuestos sobre bienes importados. Pueden impactar significativamente sus costos de productos. Nuestra plataforma le ayuda a identificar y mitigar estos costos.'
            : 'Tariffs are taxes on imported goods. They can significantly impact your product costs. Our platform helps you identify and mitigate these costs.'
        },
        {
          title: isSpanish ? 'Calculadora de ROI' : 'ROI Calculator',
          icon: Calculator,
          content: isSpanish
            ? 'Use nuestra calculadora para entender el retorno potencial de la inversión de optimizar su cadena de suministro y estrategia arancelaria.'
            : 'Use our calculator to understand the potential return on investment of optimizing your supply chain and tariff strategy.'
        }
      ]
    },
    tariffs: {
      title: isSpanish ? 'Ayuda de Aranceles' : 'Tariff Help',
      sections: [
        {
          title: isSpanish ? '¿Qué son los Códigos HS?' : 'What are HS Codes?',
          icon: Shield,
          content: isSpanish
            ? 'Los códigos del Sistema Armonizado (HS) clasifican productos comerciados internacionalmente. Cada producto tiene un código específico que determina las tasas arancelarias.'
            : 'Harmonized System (HS) codes classify internationally traded products. Each product has a specific code that determines tariff rates.'
        },
        {
          title: isSpanish ? 'Impacto en Costos' : 'Cost Impact',
          icon: TrendingUp,
          content: isSpanish
            ? 'Los aranceles se agregan al costo de sus bienes importados. Un arancel del 10% en un producto de $1000 añade $100 a su costo.'
            : 'Tariffs are added to the cost of your imported goods. A 10% tariff on a $1000 product adds $100 to your cost.'
        }
      ]
    }
  };

  const currentContent = helpContent[topic] || helpContent.general;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-600 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            {currentContent.title}
          </h2>          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title={isSpanish ? 'Cerrar ayuda' : 'Close help'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {currentContent.sections.map((section, index) => (
            <div key={index} className="smb-card">
              <div className="flex items-start gap-3">
                <section.icon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-2">{section.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                {isSpanish ? '¿Necesita más ayuda?' : 'Need more help?'}
              </span>
            </div>
            <p className="text-sm text-blue-100">
              {isSpanish 
                ? 'Contáctenos en support@smbtariffsuite.com o use el chat en vivo para asistencia inmediata.'
                : 'Contact us at support@smbtariffsuite.com or use live chat for immediate assistance.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GuidedOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GuidedOnboarding: React.FC<GuidedOnboardingProps> = ({ isOpen, onClose, onComplete }) => {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: isSpanish ? 'Bienvenido a SMB Tariff Suite' : 'Welcome to SMB Tariff Suite',
      content: isSpanish
        ? 'Somos su plataforma todo en uno para navegar desafíos arancelarios. Le ayudaremos a optimizar costos y reducir riesgos de cumplimiento.'
        : 'We\'re your all-in-one platform for navigating tariff challenges. We\'ll help you optimize costs and reduce compliance risks.',
      icon: Shield
    },
    {
      title: isSpanish ? 'Comience con Su Perfil' : 'Start with Your Profile',
      content: isSpanish
        ? 'Complete su perfil empresarial para recibir recomendaciones personalizadas basadas en su industria, tamaño y mercados objetivo.'
        : 'Complete your business profile to receive personalized recommendations based on your industry, size, and target markets.',
      icon: User
    },
    {
      title: isSpanish ? 'Identifique Impactos Arancelarios' : 'Identify Tariff Impacts',
      content: isSpanish
        ? 'Use nuestras herramientas de IA para clasificar automáticamente sus productos y identificar posibles impactos arancelarios.'
        : 'Use our AI tools to automatically classify your products and identify potential tariff impacts.',
      icon: TrendingUp
    },
    {
      title: isSpanish ? 'Tome Acción' : 'Take Action',
      content: isSpanish
        ? 'Implemente nuestras recomendaciones para optimizar su cadena de suministro y reducir costos arancelarios.'
        : 'Implement our recommendations to optimize your supply chain and reduce tariff costs.',
      icon: CheckCircle
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-600 max-w-lg w-full">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{currentStepData.title}</h2>
            <p className="text-gray-300">{currentStepData.content}</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={currentStep === 0 ? onClose : handlePrevious}
              className="btn-secondary"
            >
              {currentStep === 0 ? (isSpanish ? 'Saltar' : 'Skip') : (isSpanish ? 'Anterior' : 'Previous')}
            </button>
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentStep === steps.length - 1 
                ? (isSpanish ? 'Comenzar' : 'Get Started')
                : (isSpanish ? 'Siguiente' : 'Next')
              }
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContextualHelpProps {
  context: string;
  children: React.ReactNode;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({ context, children }) => {
  const [showHelp, setShowHelp] = useState(false);
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';

  return (
    <div className="relative">
      {children}      <button
        onClick={() => setShowHelp(!showHelp)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
        title={isSpanish ? 'Mostrar ayuda contextual' : 'Show contextual help'}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      <SMBHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        topic={context}
      />
    </div>
  );
};
