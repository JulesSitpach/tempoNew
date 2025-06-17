# Professional Dashboard Design System

## Overview

A sophisticated, mature design system for professional applications that emphasizes clean aesthetics, proper hierarchy, and excellent user experience.

## Color Palette

### Primary Palette

- **Slate 900**: `#0f172a` - Primary text, headers
- **Slate 700**: `#334155` - Secondary text
- **Slate 500**: `#64748b` - Muted text, placeholders
- **Slate 200**: `#e2e8f0` - Borders, dividers
- **Slate 100**: `#f1f5f9` - Background accents
- **Slate 50**: `#f8fafc` - Page backgrounds

### Accent Colors

- **Primary Blue**: `#2563eb` - Primary actions, links
- **Success Green**: `#10b981` - Success states, positive metrics
- **Warning Amber**: `#f59e0b` - Warnings, pending states
- **Error Red**: `#ef4444` - Errors, negative metrics

### Gradient Palette

```css
/* Primary Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success Gradient */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Warning Gradient */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);

/* Secondary Gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

## Typography

### Font Hierarchy

- **H1**: `text-4xl font-bold` (36px, Bold) - Main page titles
- **H2**: `text-2xl font-semibold` (24px, Semibold) - Section titles
- **H3**: `text-lg font-medium` (18px, Medium) - Subsection titles
- **Body**: `text-base text-slate-700` (16px, Regular) - General content
- **Small**: `text-sm text-slate-600` (14px, Regular) - Captions, labels

### Usage Guidelines

- Use `font-sans` for all text (system font stack)
- Maintain consistent line heights with Tailwind defaults
- Use appropriate text colors from the slate palette

## Components

### Metric Cards

#### Standard Card

```tsx
<div className="bg-white rounded-xl p-6 shadow-subtle border border-slate-100">
  <div className="flex items-start justify-between mb-3">
    <h4 className="text-sm font-medium text-slate-600">Total Revenue</h4>
    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
      +12.5%
    </span>
  </div>
  <div className="text-3xl font-bold text-slate-900 mb-1">$847,293</div>
  <div className="text-sm text-slate-500">vs. last month</div>
</div>
```

#### Gradient Card

```tsx
<div className="gradient-primary rounded-xl p-6 text-white shadow-elegant">
  <div className="flex items-start justify-between mb-3">
    <h4 className="text-sm font-medium opacity-90">Active Users</h4>
    <span className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full font-medium">
      +8.2%
    </span>
  </div>
  <div className="text-3xl font-bold mb-1">24,891</div>
  <div className="text-sm opacity-80">Currently online</div>
</div>
```

### Buttons

#### Primary Button

```tsx
<button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-subtle">
  Primary Action
</button>
```

#### Secondary Button

```tsx
<button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
  Secondary Action
</button>
```

#### Gradient Button

```tsx
<button className="px-6 py-3 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-elegant">
  Featured Action
</button>
```

#### Text Button

```tsx
<button className="px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
  Text Action
</button>
```

### Navigation

#### Tab Navigation

```tsx
<nav className="flex space-x-1">
  <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-medium">
    Active Tab
  </button>
  <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium transition-colors">
    Inactive Tab
  </button>
</nav>
```

### Form Elements

#### Input Field

```tsx
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Field Label
  </label>
  <input
    type="text"
    placeholder="Enter your text..."
    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
  />
</div>
```

#### Select Dropdown

```tsx
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Select Label
  </label>
  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
    <option>Choose an option...</option>
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
</div>
```

## Spacing & Layout

### Spacing Scale

- **2px** (`spacing-0.5`): Hairline spacing
- **4px** (`spacing-1`): Tight spacing
- **6px** (`spacing-1.5`): Small spacing
- **8px** (`spacing-2`): Medium spacing
- **12px** (`spacing-3`): Large spacing
- **16px** (`spacing-4`): Extra large spacing
- **24px** (`spacing-6`): Section spacing
- **32px** (`spacing-8`): Component spacing

### Border Radius

- **4px** (`rounded`): Small radius - buttons, inputs
- **8px** (`rounded-lg`): Medium radius - cards, modals
- **12px** (`rounded-xl`): Large radius - featured elements

## Shadow System

### CSS Classes to Add

```css
.shadow-subtle {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.shadow-elegant {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.8);
}

.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}
```

## Implementation Plan

### Phase 1: Foundation

1. Add custom CSS classes to global styles
2. Update color variables in Tailwind config
3. Create reusable component library

### Phase 2: Component Updates

1. Refactor existing cards to use new metric card styles
2. Update button components with new styles
3. Implement new form element styles

### Phase 3: Layout Enhancement

1. Apply consistent spacing throughout application
2. Implement shadow system across components
3. Add gradient accents to key elements

### Phase 4: Polish

1. Add hover states and transitions
2. Implement glass effects for overlays
3. Fine-tune typography hierarchy

## Best Practices

### Do's

- Use consistent spacing from the defined scale
- Apply shadows appropriately (subtle for most elements)
- Maintain proper typography hierarchy
- Use gradients sparingly for accent elements
- Ensure proper contrast ratios

### Don'ts

- Don't mix different shadow styles inconsistently
- Avoid overusing gradients
- Don't break the established spacing scale
- Avoid using colors outside the defined palette
- Don't neglect hover and focus states

## Integration with SMB Tariff Suite

### Key Areas for Implementation

1. **Dashboard Cards**: Apply metric card styles to revenue, cost, and supplier data
2. **Navigation**: Update workflow step navigation with new tab styles
3. **Forms**: Enhance file upload and data input forms
4. **Buttons**: Implement throughout workflow (Import, Analyze, Export)
5. **Status Indicators**: Use gradient cards for key metrics and alerts

### Specific Components to Update

- `WorkflowSteps` navigation
- `FileUpload` component
- `TariffImpactDashboard` cards
- `SupplierDiversification` cards
- `SupplyChainPlanner` interface
- Modal dialogs and overlays

This design system will significantly enhance the professional appearance and user experience of the SMB Tariff Suite while maintaining excellent usability and accessibility standards.
