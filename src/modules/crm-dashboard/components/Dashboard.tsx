import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Target,
  Award,
  BarChart3,
  TrendingUp,
  Building2,
  MapPin
} from 'lucide-react';
import { useCrmDashboardData } from '../hooks/useCrmDashboardData';
import { formatCurrency, formatPercentage } from '../utils/formatters';
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
import { PipelineDetailsModal } from './PipelineDetailsModal';
import { TeamMetrics } from './TeamMetrics';
import { NavigationIndicator } from './NavigationIndicator';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { QuickActions } from './QuickActions';
import { TopCommercialModal } from './TopCommercialModal';
import { TopClientModal } from './TopClientModal';
import { TopServiceModal } from './TopServiceModal';
import TeamRankingModal from './TeamRankingModal';
import { MonthlyRevenueModal } from './MonthlyRevenueModal';
import { DailyRevenueModal } from './DailyRevenueModal';

export const Dashboard: React.FC = () => {
  const {
    metrics,
    salespeople,
    geographicData,
    revenueEvolution, 
    productData,
    customerData,
    loading,
    error 
  } = useCrmDashboardData();

  const topSales = useMemo(() => salespeople?.[0] ?? null, [salespeople]);
  const topCustomer = useMemo(() => customerData?.[0] ?? null, [customerData]);
  const topProduct = useMemo(() => productData?.[0] ?? null, [productData]);
  const topSalesGrowthPct = topSales?.revenue_target
    ? ((topSales.revenue_achieved - topSales.revenue_target) / topSales.revenue_target) * 100
    : 0;

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
  const [isTopCommercialModalOpen, setIsTopCommercialModalOpen] = useState(false);
  const [isTopClientModalOpen, setIsTopClientModalOpen] = useState(false);
  const [isTopServiceModalOpen, setIsTopServiceModalOpen] = useState(false);
  const [isTeamRankingModalOpen, setIsTeamRankingModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [isPipelineDetailsModalOpen, setIsPipelineDetailsModalOpen] = useState(false);
  const [isMonthlyRevenueModalOpen, setIsMonthlyRevenueModalOpen] = useState(false);
  const [isDailyRevenueModalOpen, setIsDailyRevenueModalOpen] = useState(false);

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


  const handleTripsClick = () => {
    setIsTripsModalOpen(true);
  };

  const handleTopCommercialClick = () => {
    setIsTopCommercialModalOpen(true);
  };

  const handleTopClientClick = () => {
    setIsTopClientModalOpen(true);
  };

  const handleTopServiceClick = () => {
    setIsTopServiceModalOpen(true);
  };

  const handleMonthlyRevenueClick = () => {
    setIsMonthlyRevenueModalOpen(true);
  };

  const handleDailyRevenueClick = () => {
    setIsDailyRevenueModalOpen(true);
  };

  const handlePipelineClick = () => {
    setIsPipelineDetailsModalOpen(true);
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
    setIsTopCommercialModalOpen(false);
    setIsTopClientModalOpen(false);
    setIsTopServiceModalOpen(false);
    setIsTeamRankingModalOpen(false);
    setIsTeamModalOpen(false);
    setIsPipelineModalOpen(false);
    setIsPipelineDetailsModalOpen(false);
    setIsMonthlyRevenueModalOpen(false);
    setIsDailyRevenueModalOpen(false);
    setSelectedSalesperson(null);
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setSelectedCountry(null);
    setSelectedPipelineStage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/50 to-cyan-50/60">
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


      <div className="px-8 pb-8">
        {/* Contenu selon la vue active */}
        {activeView === 'overview' && (
          <>
            {/* Vue d'ensemble */}
            <div className="mb-8">
            </div>
            
             {/* Métriques améliorées */}
            <div className="mb-8">
                <EnhancedMetrics 
                  metrics={metrics!} 
                  onMetricsClick={handleMetricsClick} 
                  onTripsClick={handleTripsClick}
                  onMonthlyRevenueClick={handleMonthlyRevenueClick}
                  onDailyRevenueClick={handleDailyRevenueClick}
                  onPipelineClick={handlePipelineClick}
                />
              </div>
             
             {/* TOP PERFORMERS ET ÉVOLUTION DU CHIFFRE D'AFFAIRES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* TOP PERFORMERS - Colonne gauche */}
              <div>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                      <h3 className="text-3xl font-bold text-slate-900">Top Performers</h3>
                      <p className="text-slate-600 font-medium">Les meilleures performances de votre équipe</p>
                      </div>
                    </div>
                  <div className="hidden lg:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-600 font-medium">En temps réel</span>
                      </div>
                      </div>
               
               {/* Cartes Top Performers */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Top Commercial */}
                 <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-2xl border border-sky-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                   <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                       <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center mr-3">
                         <Users className="w-5 h-5 text-white" />
                    </div>
                      <div>
                         <p className="text-sm font-semibold text-sky-800">Top Commercial</p>
                         <p className="text-xs text-sky-700">Meilleure performance de l'équipe</p>
                  </div>
                </div>
                     <div className="bg-sky-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                       #1
                     </div>
                   </div>
                   <div className="mb-4">
                     <p className="text-xl font-bold text-sky-950">{topSales?.name ?? "—"}</p>
                     <p className="text-2xl font-bold text-sky-950 mt-1">
                       {topSales ? formatCurrency(topSales.revenue_achieved) : "—"}
                     </p>
                     <div className="flex items-center mt-2">
                       <TrendingUp className="w-4 h-4 text-teal-600 mr-1" />
                       <span className="text-sm font-bold text-teal-700">
                         {topSales ? `${topSalesGrowthPct >= 0 ? "+" : ""}${formatPercentage(topSalesGrowthPct)}` : "—"} vs objectif
                       </span>
                      </div>
                    </div>
                   <button 
                     onClick={handleTopCommercialClick}
                     className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors"
                   >
                     Voir détails →
                   </button>
              </div>
              
                 {/* Top Client */}
                 <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl border border-teal-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center">
                       <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                         <Target className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <p className="text-sm font-semibold text-teal-900">Top Client</p>
                         <p className="text-xs text-teal-800">Client le plus important</p>
                       </div>
                      </div>
                     <div className="bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                       #1
                      </div>
                    </div>
                   <div className="mb-4">
                     <p className="text-lg font-bold text-teal-950">{topCustomer?.name ?? "—"}</p>
                     <p className="text-sm text-teal-800">{topCustomer?.country ?? ""}</p>
                     <p className="text-sm text-teal-800">{topCustomer?.category ?? ""}</p>
                     <p className="text-2xl font-bold text-teal-950 mt-1">
                       {topCustomer ? formatCurrency(topCustomer.revenue) : "—"}
                     </p>
                     <div className="flex items-center mt-2">
                       <TrendingUp className="w-4 h-4 text-cyan-700 mr-1" />
                       <span className="text-sm font-bold text-cyan-800">
                         {topCustomer ? `+${formatPercentage(topCustomer.revenue_growth)}` : "—"} vs N-1
                       </span>
                  </div>
                </div>
                   <button 
                     onClick={handleTopClientClick}
                     className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                   >
                     Voir détails →
                   </button>
              </div>
            
                 {/* Top Service */}
                 <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center">
                       <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                         <BarChart3 className="w-5 h-5 text-white" />
              </div>
                       <div>
                         <p className="text-sm font-semibold text-amber-900">Top Service</p>
                         <p className="text-xs text-amber-800">Service le plus performant</p>
                       </div>
                     </div>
                     <div className="bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                       #1
                     </div>
                   </div>
                   <div className="mb-4">
                     <p className="text-xl font-bold text-amber-950">{topProduct?.name ?? "—"}</p>
                     <p className="text-2xl font-bold text-amber-950 mt-1">
                       {topProduct ? formatCurrency(topProduct.revenue) : "—"}
                     </p>
                     <div className="flex items-center mt-2">
                       <span className="text-sm font-bold text-amber-800">
                         {topProduct ? `${formatPercentage(topProduct.margin)} marge` : "—"}
                       </span>
                     </div>
                   </div>
                   <button 
                     onClick={handleTopServiceClick}
                     className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
                   >
                     Voir détails →
                   </button>
                 </div>

               </div>
            
              </div>

              {/* ÉVOLUTION DU CHIFFRE D'AFFAIRES - Colonne droite */}
              <div>
            
              {/* Évolution du Chiffre d'Affaires - Graphique avancé et moderne */}
            {revenueEvolution && (
              <div className="mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Évolution du Chiffre d'Affaires</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">2025</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">2024</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-80">
                    <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
                      {/* Définitions pour les gradients et effets */}
                      <defs>
                        {/* Gradient pour la ligne 2025 */}
                        <linearGradient id="gradient2025" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8"/>
                          <stop offset="50%" stopColor="#0f766e" stopOpacity="0.9"/>
                          <stop offset="100%" stopColor="#115e59" stopOpacity="0.8"/>
                        </linearGradient>
                        
                        {/* Gradient pour la zone de remplissage 2025 */}
                        <linearGradient id="areaGradient2025" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05"/>
                        </linearGradient>
                        
                        {/* Grille améliorée */}
                        <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="1,3"/>
                        </pattern>
                        
                        {/* Filtre pour l'effet de brillance */}
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Fond avec grille */}
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Zone de remplissage 2025 */}
                      <polygon
                        fill="url(#areaGradient2025)"
                        points="50,250 120,240 190,220 260,200 330,180 400,190 470,160 540,170 610,140 680,120 750,100 750,280 50,280"
                      />
                      
                      {/* Ligne 2025 avec gradient et effet de brillance */}
                      <polyline
                        fill="none"
                        stroke="url(#gradient2025)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        points="50,250 120,240 190,220 260,200 330,180 400,190 470,160 540,170 610,140 680,120 750,100"
                      />
                      
                      {/* Ligne 2024 améliorée */}
                      <polyline
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="12,6"
                        opacity="0.8"
                        points="50,270 120,265 190,250 260,230 330,220 400,180 470,190 540,180 610,170 680,150 750,130"
                      />
                      
                      {/* Points 2025 améliorés avec cercles concentriques */}
                      <circle cx="50" cy="250" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Jan 2025: 95 000 MAD</title>
                      </circle>
                      <circle cx="50" cy="250" r="4" fill="#0d9488"/>
                      
                      <circle cx="120" cy="240" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Fév 2025: 105 000 MAD</title>
                      </circle>
                      <circle cx="120" cy="240" r="4" fill="#0d9488"/>
                      
                      <circle cx="190" cy="220" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Mar 2025: 120 000 MAD</title>
                      </circle>
                      <circle cx="190" cy="220" r="4" fill="#0d9488"/>
                      
                      <circle cx="260" cy="200" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Avr 2025: 128 000 MAD</title>
                      </circle>
                      <circle cx="260" cy="200" r="4" fill="#0d9488"/>
                      
                      <circle cx="330" cy="180" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Mai 2025: 135 000 MAD</title>
                      </circle>
                      <circle cx="330" cy="180" r="4" fill="#0d9488"/>
                      
                      <circle cx="400" cy="190" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Juin 2025: 130 000 MAD</title>
                      </circle>
                      <circle cx="400" cy="190" r="4" fill="#0d9488"/>
                      
                      <circle cx="470" cy="160" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Juil 2025: 145 000 MAD</title>
                      </circle>
                      <circle cx="470" cy="160" r="4" fill="#0d9488"/>
                      
                      <circle cx="540" cy="170" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Août 2025: 140 000 MAD</title>
                      </circle>
                      <circle cx="540" cy="170" r="4" fill="#0d9488"/>
                      
                      <circle cx="610" cy="140" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Sep 2025: 155 000 MAD</title>
                      </circle>
                      <circle cx="610" cy="140" r="4" fill="#0d9488"/>
                      
                      <circle cx="680" cy="120" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Oct 2025: 165 000 MAD</title>
                      </circle>
                      <circle cx="680" cy="120" r="4" fill="#0d9488"/>
                      
                      <circle cx="750" cy="100" r="8" fill="white" stroke="#0d9488" strokeWidth="3" className="cursor-pointer hover:r-10 transition-all duration-200">
                        <title>Nov 2025: 170 000 MAD</title>
                      </circle>
                      <circle cx="750" cy="100" r="4" fill="#0d9488"/>
                      
                      {/* Points 2024 améliorés */}
                      <circle cx="50" cy="270" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Jan 2024: 85 000 MAD</title>
                      </circle>
                      <circle cx="50" cy="270" r="2" fill="#6b7280"/>
                      
                      <circle cx="120" cy="265" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Fév 2024: 90 000 MAD</title>
                      </circle>
                      <circle cx="120" cy="265" r="2" fill="#6b7280"/>
                      
                      <circle cx="190" cy="250" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Mar 2024: 95 000 MAD</title>
                      </circle>
                      <circle cx="190" cy="250" r="2" fill="#6b7280"/>
                      
                      <circle cx="260" cy="230" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Avr 2024: 100 000 MAD</title>
                      </circle>
                      <circle cx="260" cy="230" r="2" fill="#6b7280"/>
                      
                      <circle cx="330" cy="220" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Mai 2024: 105 000 MAD</title>
                      </circle>
                      <circle cx="330" cy="220" r="2" fill="#6b7280"/>
                      
                      <circle cx="400" cy="180" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Juin 2024: 140 000 MAD</title>
                      </circle>
                      <circle cx="400" cy="180" r="2" fill="#6b7280"/>
                      
                      <circle cx="470" cy="190" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Juil 2024: 115 000 MAD</title>
                      </circle>
                      <circle cx="470" cy="190" r="2" fill="#6b7280"/>
                      
                      <circle cx="540" cy="180" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Août 2024: 120 000 MAD</title>
                      </circle>
                      <circle cx="540" cy="180" r="2" fill="#6b7280"/>
                      
                      <circle cx="610" cy="170" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Sep 2024: 125 000 MAD</title>
                      </circle>
                      <circle cx="610" cy="170" r="2" fill="#6b7280"/>
                      
                      <circle cx="680" cy="150" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Oct 2024: 130 000 MAD</title>
                      </circle>
                      <circle cx="680" cy="150" r="2" fill="#6b7280"/>
                      
                      <circle cx="750" cy="130" r="5" fill="white" stroke="#6b7280" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all duration-200">
                        <title>Nov 2024: 135 000 MAD</title>
                      </circle>
                      <circle cx="750" cy="130" r="2" fill="#6b7280"/>
                      
                      {/* Axes Y avec valeurs */}
                      <text x="30" y="100" textAnchor="middle" className="text-xs fill-gray-400 font-semibold">180k</text>
                      <text x="30" y="140" textAnchor="middle" className="text-xs fill-gray-400 font-semibold">160k</text>
                      <text x="30" y="180" textAnchor="middle" className="text-xs fill-gray-400 font-semibold">140k</text>
                      <text x="30" y="220" textAnchor="middle" className="text-xs fill-gray-400 font-semibold">120k</text>
                      <text x="30" y="260" textAnchor="middle" className="text-xs fill-gray-400 font-semibold">100k</text>
                      <text x="30" y="300" textAnchor="middle" className="text-xs fill-gray-400 font-semibold">80k</text>
                      
                      {/* Lignes horizontales pour les axes Y */}
                      <line x1="40" y1="100" x2="760" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                      <line x1="40" y1="140" x2="760" y2="140" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                      <line x1="40" y1="180" x2="760" y2="180" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                      <line x1="40" y1="220" x2="760" y2="220" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                      <line x1="40" y1="260" x2="760" y2="260" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                      <line x1="40" y1="300" x2="760" y2="300" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                      
                      {/* Labels des mois améliorés */}
                      <text x="50" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Jan</text>
                      <text x="120" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Fév</text>
                      <text x="190" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Mar</text>
                      <text x="260" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Avr</text>
                      <text x="330" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Mai</text>
                      <text x="400" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Juin</text>
                      <text x="470" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Juil</text>
                      <text x="540" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Août</text>
                      <text x="610" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Sep</text>
                      <text x="680" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Oct</text>
                      <text x="750" y="315" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Nov</text>
                      
                      {/* Indicateur de croissance */}
                      <text x="400" y="50" textAnchor="middle" className="text-sm fill-green-600 font-bold">
                        📈 +12.8% de croissance annuelle
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            )}
              </div>
            </div>
          </>
        )}

        {activeView === 'sales' && (
          <>
            {/* TOP COMMERCIAL */}
            <div className="mb-8">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Top Commercial</h3>
                    <p className="text-teal-100 text-lg">Commercial le plus performant</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-teal-100 mb-1">Classement #1</div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Informations Commercial */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Nadia El Mansouri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3" />
                      <span className="text-teal-100">Commercial Senior</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      <span className="text-teal-100">Expérience: 3 ans</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-3" />
                      <span className="text-teal-100">Certifié Vente</span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Performance</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-100">Chiffre d'Affaires</span>
                      <span className="text-2xl font-bold">630 000 €</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-100">Affaires</span>
                      <span className="text-xl font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-100">Croissance</span>
                      <div className="flex items-center text-yellow-300">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">+5.0%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Actions</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={handleTopCommercialClick}
                      className="w-full bg-white text-teal-700 py-3 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                    >
                      Voir Détails Complets
                    </button>
                    <button className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-400 transition-colors">
                      Analyser Performance
                    </button>
                    <button className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                      Nouvelle Affaire
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistiques Avancées */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">85%</div>
                  <div className="text-sm text-teal-100">Taux Conversion</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">126%</div>
                  <div className="text-sm text-teal-100">Objectif Atteint</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">750k€</div>
                  <div className="text-sm text-teal-100">Potentiel</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">Expert</div>
                  <div className="text-sm text-teal-100">Niveau</div>
                </div>
              </div>
            </div>
          </div>

            {/* SECTION VENTES - KPIs avancés, commandes et performance commerciale */}
            <div className="mb-8">
                      
              {/* Tableau de Performance Commerciale */}
              <div className="mb-8">
                <SalespersonTable 
                  salespeople={salespeople} 
                  onSalespersonClick={handleSalespersonClick}
                  onTeamClick={handleTeamClick}
                />
                        </div>
            </div>
          </>
        )}

        {activeView === 'crm' && (
          <>
            {/* TABLEAU DE BORD CRM */}
            <div className="mb-8">
              
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
                   <PipelineOverview 
                     onStageClick={handlePipelineStageClick}
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
            {/* TOP SERVICE */}
            <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Top Service</h3>
                    <p className="text-amber-100 text-lg">Service le plus performant</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-amber-100 mb-1">Classement #1</div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Informations Service */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Transport International</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-3" />
                      <span className="text-amber-100">Service Premium</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      <span className="text-amber-100">Croissance: +25%</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-3" />
                      <span className="text-amber-100">Certifié ISO</span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Performance</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-100">Chiffre d'Affaires</span>
                      <span className="text-2xl font-bold">1 200 000 €</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-100">Commandes</span>
                      <span className="text-xl font-semibold">45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-100">Marge</span>
                      <div className="flex items-center text-yellow-300">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">75.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Actions</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={handleTopServiceClick}
                      className="w-full bg-white text-amber-800 py-3 px-4 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
                    >
                      Voir Détails Complets
                    </button>
                    <button className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
                      Analyser Performance
                    </button>
                    <button className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                      Optimiser Service
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistiques Avancées */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">98%</div>
                  <div className="text-sm text-amber-100">Satisfaction</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">24</div>
                  <div className="text-sm text-amber-100">Pays Desservis</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">1.5M€</div>
                  <div className="text-sm text-amber-100">Potentiel</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">Premium</div>
                  <div className="text-sm text-amber-100">Niveau</div>
                </div>
              </div>
            </div>
          </div>

             {/* PERFORMANCE PRODUITS ET ANALYSE DES VENTES */}
            <div className="mb-8">
              
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            {/* TOP CLIENT */}
            <div className="mb-8">
            <div className="bg-gradient-to-r from-cyan-700 to-teal-800 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Top Client</h3>
                    <p className="text-green-100 text-lg">Client le plus performant</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-100 mb-1">Classement #1</div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Informations Client */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Heavy Works cluster</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 mr-3" />
                      <span className="text-green-100">Atlas Heavy Works SA</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span className="text-green-100">MEKNES, MOROCCO</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3" />
                      <span className="text-green-100">Contact: C. Volkov</span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Performance</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-100">Chiffre d'Affaires</span>
                      <span className="text-2xl font-bold">400 000 €</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-100">Commandes</span>
                      <span className="text-xl font-semibold">15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-100">Croissance</span>
                      <div className="flex items-center text-yellow-300">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">+15.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">Actions</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={handleTopClientClick}
                      className="w-full bg-white text-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                    >
                      Voir Détails Complets
                    </button>
                    <button className="w-full bg-green-400 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-300 transition-colors">
                      Contacter Client
                    </button>
                    <button className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                      Nouvelle Commande
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistiques Avancées */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">95%</div>
                  <div className="text-sm text-green-100">Satisfaction</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">12</div>
                  <div className="text-sm text-green-100">Mois Actif</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">500k€</div>
                  <div className="text-sm text-green-100">Potentiel</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">High</div>
                  <div className="text-sm text-green-100">Priorité</div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLEAU DE BORD CLIENTS */}
          <div className="mb-8">
            
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

        <TopCommercialModal 
          isOpen={isTopCommercialModalOpen} 
          onClose={closeModals} 
        />
        
        <TopClientModal 
          isOpen={isTopClientModalOpen} 
          onClose={closeModals} 
        />
        
        <TopServiceModal 
          isOpen={isTopServiceModalOpen} 
          onClose={closeModals}
        />

        <TeamRankingModal 
          isOpen={isTeamRankingModalOpen} 
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

       <PipelineDetailsModal
         isOpen={isPipelineDetailsModalOpen}
         onClose={closeModals}
       />

       <MonthlyRevenueModal 
         isOpen={isMonthlyRevenueModalOpen} 
         onClose={closeModals}
       />

       <DailyRevenueModal 
         isOpen={isDailyRevenueModalOpen} 
        onClose={closeModals}
      />
    </div>
  );
};
