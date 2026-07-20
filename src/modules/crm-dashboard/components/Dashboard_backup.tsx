import React, { useState } from 'react';
import { 
  Euro, 
  Users, 
  Target,
  Award,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useCrmDashboardData } from '../hooks/useCrmDashboardData';
import { formatCurrency } from '../utils/formatters';
import { Chart } from './Chart';
import { SalespersonTable } from './SalespersonTable';
import { GeographicMap } from './GeographicMap';
import { TopProducts } from './TopProducts';
import { TopCustomers } from './TopCustomers';
import { PipelineOverview } from './PipelineOverview';
import { LoadingSpinner } from './LoadingSpinner';
import { EnhancedMetrics } from './EnhancedMetrics';
import { SalespersonModal } from './SalespersonModal';
import { CustomerModal } from './CustomerModal';
import { ProductModal } from './ProductModal';
import { GeographicModal } from './GeographicModal';
import { MetricsModal } from './MetricsModal';
import { TripsModal } from './TripsModal';
import { TeamPerformanceModal } from './TeamPerformanceModal';
import { PipelineModal } from './PipelineModal';
import { OrdersAnalysis } from './OrdersAnalysis';
import { TeamMetrics } from './TeamMetrics';
import { RevenueEvaluation } from './RevenueEvaluation';
import { NavigationIndicator } from './NavigationIndicator';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { QuickActions } from './QuickActions';

export const Dashboard: React.FC = () => {
  const { 
    metrics, 
    salespeople, 
    customers, 
    products, 
    geographicData, 
    revenueEvolution, 
    revenueEvaluation,
    productData,
    customerData,
    loading, 
    error 
  } = useCrmDashboardData();

  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedSalesperson, setSelectedSalesperson] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<any>(null);
  const [isSalespersonModalOpen, setIsSalespersonModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isGeographicModalOpen, setIsGeographicModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'DH'>('EUR');
  const [isTripsModalOpen, setIsTripsModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Erreur de chargement</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSalespersonClick = (salesperson: any) => {
    setSelectedSalesperson(salesperson);
    setIsSalespersonModalOpen(true);
  };

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCountryClick = (country: any) => {
    setSelectedCountry(country);
    setIsGeographicModalOpen(true);
  };

  const handleMetricsClick = (currency: 'EUR' | 'DH') => {
    setIsMetricsModalOpen(true);
    setSelectedCurrency(currency);
  };

  const handleRevenueDetailsClick = () => {
    setIsMetricsModalOpen(true);
    setSelectedCurrency('EUR');
  };

  const handleTripsClick = () => {
    setIsTripsModalOpen(true);
  };

  const handleTeamClick = () => {
    setIsTeamModalOpen(true);
  };

  const handlePipelineStageClick = (stage: any) => {
    setSelectedPipelineStage(stage);
    setIsPipelineModalOpen(true);
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

  const refreshData = () => {
    console.log('Refresh clicked');
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handleSearch = () => {
    console.log('Search clicked');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
  };

  const closeModals = () => {
    setIsSalespersonModalOpen(false);
    setIsCustomerModalOpen(false);
    setIsProductModalOpen(false);
    setIsGeographicModalOpen(false);
    setIsMetricsModalOpen(false);
    setIsTripsModalOpen(false);
    setIsTeamModalOpen(false);
    setIsPipelineModalOpen(false);
    setSelectedSalesperson(null);
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setSelectedCountry(null);
    setSelectedPipelineStage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation améliorée */}
      <NavigationIndicator
        activeView={activeView}
        onViewChange={(view) => setActiveView(view as any)}
      />

      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation
        activeView={activeView}
        onNavigate={(view) => setActiveView(view as any)}
      />

      {/* Actions Rapides */}
      <QuickActions
        onExport={handleExport}
        onRefresh={refreshData}
        onFilter={handleFilter}
        onSearch={handleSearch}
        onSettings={handleSettings}
        onNotifications={handleNotifications}
      />

      <div className="px-8 pb-8">
        {/* Contenu selon la vue active */}
        {activeView === 'overview' && (
          <>
            {/* Métriques améliorées */}
            <div className="mb-8">
              <EnhancedMetrics metrics={metrics} onMetricsClick={handleMetricsClick} onTripsClick={handleTripsClick} />
            </div>
            
            {/* TOP PERFORMERS INTÉGRÉS */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900">Top Performers</h3>
                    <p className="text-slate-600 font-medium">Les meilleures performances de votre équipe</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 font-medium">En temps réel</span>
                </div>
              </div>
            
              {/* Évaluation du chiffre d'affaires */}
              {revenueEvaluation && (
                <div className="mb-8">
                  <RevenueEvaluation 
                    currentYearData={revenueEvaluation.currentYearData}
                    previousYearData={revenueEvaluation.previousYearData}
                    onDetailsClick={handleRevenueDetailsClick}
                  />
                </div>
              )}
              
              {/* Évolution du Chiffre d'Affaires - Graphique exact */}
              {revenueEvolution && (
                <div className="mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Évolution du Chiffre d'Affaires</h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">2025</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">2024</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative h-80">
                      <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                        {/* Grille horizontale */}
                        <defs>
                          <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Ligne 2025 (bleue) */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="50,250 120,240 190,220 260,200 330,180 400,190 470,160 540,170 610,140 680,120 750,100"
                        />
                        
                        {/* Ligne 2024 (gris pointillé) */}
                        <polyline
                          fill="none"
                          stroke="#9ca3af"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="8,4"
                          points="50,270 120,265 190,250 260,230 330,220 400,200 470,190 540,180 610,170 680,150 750,130"
                        />
                        
                        {/* Points 2025 avec tooltip */}
                        <circle cx="50" cy="250" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Jan 2025: 95 000 MAD</title>
                        </circle>
                        <circle cx="120" cy="240" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Fév 2025: 105 000 MAD</title>
                        </circle>
                        <circle cx="190" cy="220" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Mar 2025: 120 000 MAD</title>
                        </circle>
                        <circle cx="260" cy="200" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Avr 2025: 128 000 MAD</title>
                        </circle>
                        <circle cx="330" cy="180" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Mai 2025: 135 000 MAD</title>
                        </circle>
                        <circle cx="400" cy="190" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Juin 2025: 130 000 MAD</title>
                        </circle>
                        <circle cx="470" cy="160" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Juil 2025: 145 000 MAD</title>
                        </circle>
                        <circle cx="540" cy="170" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Août 2025: 140 000 MAD</title>
                        </circle>
                        <circle cx="610" cy="140" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Sep 2025: 155 000 MAD</title>
                        </circle>
                        <circle cx="680" cy="120" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Oct 2025: 165 000 MAD</title>
                        </circle>
                        <circle cx="750" cy="100" r="6" fill="#3b82f6" className="cursor-pointer hover:r-8 transition-all duration-200">
                          <title>Nov 2025: 170 000 MAD</title>
                        </circle>
                        
                        {/* Points 2024 avec tooltip */}
                        <circle cx="50" cy="270" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Jan 2024: 85 000 MAD</title>
                        </circle>
                        <circle cx="120" cy="265" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Fév 2024: 90 000 MAD</title>
                        </circle>
                        <circle cx="190" cy="250" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Mar 2024: 95 000 MAD</title>
                        </circle>
                        <circle cx="260" cy="230" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Avr 2024: 100 000 MAD</title>
                        </circle>
                        <circle cx="330" cy="220" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Mai 2024: 105 000 MAD</title>
                        </circle>
                        <circle cx="400" cy="200" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Juin 2024: 110 000 MAD</title>
                        </circle>
                        <circle cx="470" cy="190" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Juil 2024: 115 000 MAD</title>
                        </circle>
                        <circle cx="540" cy="180" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Août 2024: 120 000 MAD</title>
                        </circle>
                        <circle cx="610" cy="170" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Sep 2024: 125 000 MAD</title>
                        </circle>
                        <circle cx="680" cy="150" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Oct 2024: 130 000 MAD</title>
                        </circle>
                        <circle cx="750" cy="130" r="4" fill="#9ca3af" className="cursor-pointer hover:r-6 transition-all duration-200">
                          <title>Nov 2024: 135 000 MAD</title>
                        </circle>
                        
                        {/* Labels des mois */}
                        <text x="50" y="295" textAnchor="middle" className="text-xs fill-gray-500">Jan</text>
                        <text x="120" y="295" textAnchor="middle" className="text-xs fill-gray-500">Fév</text>
                        <text x="190" y="295" textAnchor="middle" className="text-xs fill-gray-500">Mar</text>
                        <text x="260" y="295" textAnchor="middle" className="text-xs fill-gray-500">Avr</text>
                        <text x="330" y="295" textAnchor="middle" className="text-xs fill-gray-500">Mai</text>
                        <text x="400" y="295" textAnchor="middle" className="text-xs fill-gray-500">Juin</text>
                        <text x="470" y="295" textAnchor="middle" className="text-xs fill-gray-500">Juil</text>
                        <text x="540" y="295" textAnchor="middle" className="text-xs fill-gray-500">Août</text>
                        <text x="610" y="295" textAnchor="middle" className="text-xs fill-gray-500">Sep</text>
                        <text x="680" y="295" textAnchor="middle" className="text-xs fill-gray-500">Oct</text>
                        <text x="750" y="295" textAnchor="middle" className="text-xs fill-gray-500">Nov</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeView === 'sales' && (
          <>
            {/* TABLEAU DE BORD PRINCIPAL - VENTES */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <Euro className="w-8 h-8 mr-3 text-green-600" />
                Tableau de Bord Ventes
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <TeamMetrics />
                </div>
                <div className="lg:col-span-2">
                  <SalespersonTable 
                    salespeople={salespeople} 
                    onSalespersonClick={handleSalespersonClick}
                    onTeamClick={handleTeamClick}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'crm' && (
          <>
            {/* TABLEAU DE BORD CRM */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <Target className="w-8 h-8 mr-3 text-blue-600" />
                Tableau de Bord CRM
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <PipelineOverview 
                    onStageClick={handlePipelineStageClick}
                    geographicData={geographicData}
                    onCountryClick={handleCountryClick}
                  />
                </div>
                <div className="lg:col-span-2">
                  <GeographicMap 
                    data={geographicData} 
                    onCountryClick={handleCountryClick}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'products' && (
          <>
            {/* TABLEAU DE BORD PRODUITS */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
                Tableau de Bord Produits
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <Chart data={revenueEvolution} />
                </div>
                <div className="lg:col-span-2">
                  <TopProducts 
                    products={productData} 
                    onProductClick={handleProductClick}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'customers' && (
          <>
            {/* TABLEAU DE BORD CLIENTS */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <Users className="w-8 h-8 mr-3 text-indigo-600" />
                Tableau de Bord Clients
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <GeographicMap 
                    data={geographicData} 
                    onCountryClick={handleCountryClick}
                  />
                </div>
                <div className="lg:col-span-2">
                  <TopCustomers 
                    customers={customerData} 
                    onCustomerClick={handleCustomerClick}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <SalespersonModal
        salesperson={selectedSalesperson}
        isOpen={isSalespersonModalOpen}
        onClose={closeModals}
      />

      <CustomerModal
        customer={selectedCustomer}
        isOpen={isCustomerModalOpen}
        onClose={closeModals}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeModals}
      />

      <GeographicModal
        country={selectedCountry}
        isOpen={isGeographicModalOpen}
        onClose={closeModals}
      />

      <MetricsModal
        metrics={metrics}
        isOpen={isMetricsModalOpen}
        onClose={closeModals}
        currency={selectedCurrency}
      />

      <TripsModal
        isOpen={isTripsModalOpen}
        onClose={closeModals}
      />

      <TeamPerformanceModal
        salespeople={salespeople}
        isOpen={isTeamModalOpen}
        onClose={closeModals}
      />

      <PipelineModal
        stage={selectedPipelineStage}
        isOpen={isPipelineModalOpen}
        onClose={closeModals}
      />
    </div>
  );
};
