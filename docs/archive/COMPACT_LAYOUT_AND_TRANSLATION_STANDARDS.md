# Compact Layout and Translation Standards

## SMB Tariff Suite - Cohesive App Experience Guide

### June 16, 2025

## Overview

This document outlines the design and translation standards implemented to create a cohesive, professional experience across all 7 applications in the SMB Tariff Suite. The focus is on optimal screen real estate usage, consistent visual hierarchy, and seamless bilingual support.

## Layout Philosophy

### Core Principles

1. **Screen Real Estate Optimization**: No unnecessary scrolling on standard screens
2. **Professional Density**: Maximum information with maintained readability
3. **Consistent Visual Language**: Same design patterns across all apps
4. **Guided but Flexible**: Clear workflow recommendation with user choice preserved

### Compact Layout Specifications

#### Vertical Space Reduction

- **Header Section**: Reduced from 120px (`py-8`) to 64px (`py-4`)
- **Total Dashboard Height**: ~600px (from ~1200px)
- **Card Spacing**: 12px gaps (`gap-3`) instead of 16px (`gap-4`)
- **Above-fold Content**: All critical information visible on 1024px+ screens

#### Card Optimization

```css
/* Standard Card Dimensions */
.dashboard-card {
  padding-top: 16px; /* pt-4 (reduced from pt-6) */
  padding-bottom: 8px; /* pb-2 (reduced from pb-3) */
  min-height: 180px; /* Consistent across all modules */
  border-radius: 8px; /* rounded-lg */
}

/* Icon Sizing */
.step-number-icon {
  width: 24px; /* h-6 w-6 (reduced from h-8 w-8) */
  height: 24px;
  font-size: 12px; /* text-xs (reduced from text-sm) */
}

/* Typography Scale */
.card-title {
  font-size: 18px; /* text-lg (reduced from text-xl) */
  line-height: 1.25;
}

.card-description {
  font-size: 14px; /* text-sm */
  line-height: 1.4;
}

.button-text {
  font-size: 14px; /* text-sm */
  padding: 8px 16px; /* py-2 px-4 */
}
```

## Visual Hierarchy System

### Color Palette Standards

#### Primary Action (Step 1)

```css
.primary-action-card {
  background: linear-gradient(to bottom right, #fff7ed, #fef2f2);
  border: 2px solid #fed7aa;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.primary-button {
  background: #f97316; /* Orange-500 */
  color: white;
  font-weight: 600;
}
```

#### Secondary Actions (Steps 2-7)

```css
.secondary-action-card {
  background: #f8fafc; /* Slate-50 */
  border: 1px solid #e2e8f0; /* Slate-200 */
  transition: all 200ms ease;
}

.secondary-action-card:hover {
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.secondary-button {
  border: 1px solid #cbd5e1; /* Slate-300 */
  color: #374151; /* Slate-700 */
  background: transparent;
}
```

#### Success/Completion States

```css
.completion-card {
  background: linear-gradient(to right, #f0fdf4, #ecfdf5);
  border: 1px solid #bbf7d0;
  color: #15803d;
}
```

### Grid System Standards

#### Responsive Breakpoints

```css
/* Mobile First Approach */
.module-grid {
  grid-template-columns: 1fr; /* Mobile: 1 column */
}

@media (min-width: 768px) {
  .module-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .module-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}

/* Special Cases */
.completion-card {
  grid-column: 1 / -1; /* Full width on all screens */
}

@media (min-width: 768px) {
  .ai-recommendations-card {
    grid-column: span 2; /* 2 columns on tablet */
  }
}

@media (min-width: 1024px) {
  .ai-recommendations-card {
    grid-column: span 1; /* 1 column on desktop */
  }
}
```

## Translation System Architecture

### i18n Configuration Standards

#### File Structure

```
src/locales/
├── en/
│   ├── common.json          # Shared across all apps
│   ├── landing.json         # Landing page specific
│   ├── dashboard.json       # Dashboard and modules
│   ├── auth.json           # Authentication flows
│   └── components.json     # Reusable component text
├── es/
│   ├── common.json
│   ├── landing.json
│   ├── dashboard.json
│   ├── auth.json
│   └── components.json
```

#### Translation Key Naming Convention

```json
{
  "dashboard": {
    "title": "Dashboard title",
    "workflow": {
      "guidance": "Workflow guidance text",
      "recommendedStart": "Start recommendation"
    }
  },
  "navigation": {
    "title": "App title in navigation",
    "languageToggle": "Language switch button text",
    "steps": {
      "import": "Step name",
      "analysis": "Step name"
    }
  },
  "modules": {
    "fileImport": "Module name",
    "fileImportDesc": "Module description"
  },
  "actions": {
    "getStarted": "Button text",
    "reviewAndProceed": "Button text"
  }
}
```

### Implementation Standards

#### Proper i18n Usage

```typescript
// ✅ CORRECT: Function call with key path
const { t } = useTranslation('dashboard');
<h1>{t('dashboard.title')}</h1>
<p>{t('modules.fileImportDesc')}</p>

// ❌ INCORRECT: Direct property access
<h1>{t.title}</h1>
<p>{t.description}</p>
```

#### Language Persistence Configuration

```typescript
// i18n.ts configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    fallbackLng: "en",
    // ... other config
  });
```

### Cross-App Consistency Requirements

#### Navigation Component Standards

Every app must include:

```typescript
// Language toggle button
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
```

#### Module Card Template

```typescript
<Card className="border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-200">
  <CardHeader className="pb-2">
    <CardTitle className="flex items-center gap-2 text-slate-700 text-lg">
      <div className="h-6 w-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold">
        {stepNumber}
      </div>
      {t(`modules.${moduleName}`)}
    </CardTitle>
    <CardDescription className="text-slate-600 text-sm">
      {t(`modules.${moduleName}Desc`)}
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-0 pb-3">
    <Button
      variant="outline"
      className="w-full py-2 text-sm border-slate-300 text-slate-700 hover:bg-slate-100"
    >
      {t("actions.getStarted")}
    </Button>
  </CardContent>
</Card>
```

## Business Messaging Standards

### Workflow Guidance Language

#### English Messaging

- **Flexibility**: "While you can use individual modules, the best results come from following the complete workflow"
- **Value Proposition**: "Each step builds on insights from the previous one to create a comprehensive view of your business"
- **Business Focus**: Emphasize business insights over technical features

#### Spanish Messaging

- **Consistency**: Maintain same tone and business focus in Spanish
- **Professional Terms**: Use business terminology appropriate for SMB context
- **Cultural Adaptation**: Adapt phrasing while maintaining meaning

### Button Text Standards

#### Primary Actions

- English: "Start Your Analysis", "Begin Assessment"
- Spanish: "Comenzar Su Análisis", "Iniciar Evaluación"

#### Secondary Actions

- English: "Get Started", "Review & Proceed", "Configure Settings"
- Spanish: "Comenzar", "Revisar y Proceder", "Configurar Ajustes"

## Performance Optimization

### CSS Efficiency

```css
/* Shared utility classes reduce bundle size */
.module-card-base {
  @apply border border-slate-200 bg-slate-50 transition-all duration-200;
}

.module-card-hover {
  @apply hover:bg-white hover:shadow-md;
}

.compact-spacing {
  @apply space-y-6 gap-3 py-4;
}
```

### Translation Bundle Optimization

- Lazy load translation files by route
- Use namespace separation to reduce initial bundle
- Implement fallback strategies for missing translations

## Quality Assurance Checklist

### Layout Standards

- [ ] All content fits on 1024px+ screens without scrolling
- [ ] Cards use consistent spacing (gap-3, pb-2, pt-4)
- [ ] Icons are 24x24px (h-6 w-6)
- [ ] Typography follows size hierarchy (text-lg, text-sm)
- [ ] Hover states are consistent across all interactive elements

### Translation Standards

- [ ] All text uses proper t('key.path') function calls
- [ ] No direct property access (t.property)
- [ ] Both English and Spanish translations are complete
- [ ] Business terminology is consistent across modules
- [ ] Language toggle works immediately without refresh

### Visual Consistency

- [ ] Orange highlight for Step 1 (primary action)
- [ ] Slate colors for Steps 2-7 (secondary actions)
- [ ] Green accent for completion states
- [ ] Consistent button sizing and spacing
- [ ] Professional hover transitions (200ms ease)

### Cross-App Integration

- [ ] Same navigation pattern in all modules
- [ ] Consistent card styling throughout suite
- [ ] Language choice persists across app navigation
- [ ] Same typography and color system
- [ ] Uniform user experience flow

## Future Expansion Guidelines

### Adding New Modules

1. Use the standard card template provided above
2. Follow the translation key naming convention
3. Implement the same hover and transition effects
4. Maintain the compact spacing standards
5. Test on multiple screen sizes

### Adding New Languages

1. Create new locale folder (e.g., `/fr` for French)
2. Copy the JSON structure from English files
3. Translate maintaining business focus and terminology
4. Update i18n configuration to include new language
5. Add language option to toggle button

### Maintaining Consistency

- Regular design system audits
- Automated translation key validation
- Performance monitoring for layout efficiency
- User testing across different screen sizes and languages

---

This compact layout and translation system creates a professional, cohesive experience that maximizes screen real estate while providing seamless bilingual support across all SMB Tariff Suite applications.
