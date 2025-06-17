# SMB Tariff Management Suite

A comprehensive web application for small and medium-sized businesses to manage tariff impacts, analyze supply chains, and diversify supplier networks.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smb-tariff-suite-20250616
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Database Setup**

   ```bash
   # Run the migration to create workflow tables
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📖 Documentation

**📋 [Complete Documentation](./docs/MASTER_DOCUMENTATION.md)** - Start here for comprehensive system overview

### Key Documentation Files

- **[Master Documentation](./docs/MASTER_DOCUMENTATION.md)** - Complete system guide
- **[Database Workflow](./docs/DATABASE_POWERED_WORKFLOW.md)** - Technical implementation details
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Design Principles](./docs/DESIGN_PRINCIPLES.md)** - UI/UX guidelines

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Database persistence
- **API Integration**: Real-time tariff and trade data

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🗃️ Key Features

- **File Import & Processing** - Excel/CSV trade data import
- **Tariff Impact Analysis** - Real-time tariff calculations
- **Supplier Diversification** - Alternative supplier recommendations
- **Supply Chain Planning** - Comprehensive supply chain optimization
- **Database-Powered Workflows** - Persistent session and caching
- **Bilingual Support** - English and Spanish localization

## 📁 Project Structure

```
src/
├── components/         # React components
├── contexts/          # React context providers
├── services/          # API and database services
├── lib/              # Utilities and configurations
├── types/            # TypeScript type definitions
└── utils/            # Helper functions

docs/                 # Documentation
supabase/            # Database migrations and config
```

## 🤝 Contributing

1. Read the [Master Documentation](./docs/MASTER_DOCUMENTATION.md)
2. Follow the coding standards outlined in the docs
3. Ensure all changes are properly tested
4. Update documentation as needed

## 📝 License

[License information here]
