import { useState, useEffect } from "react";
import { crmAppStoreService } from "../services/crmAppStoreService";
import type {
  DashboardMetrics,
  SalespersonPerformance,
  GeographicData,
  ProductPerformance,
  CustomerMetrics,
  OpportunityDetails,
  SalespersonDetails,
} from "../types/crm";

export const useCrmDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [salespeople, setSalespeople] = useState<SalespersonPerformance[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [productData, setProductData] = useState<ProductPerformance[]>([]);
  const [customerData, setCustomerData] = useState<CustomerMetrics[]>([]);
  const [revenueEvolution, setRevenueEvolution] = useState<
    Array<{ date: string; revenue: number; forecast: number }>
  >([]);
  const [revenueEvaluation, setRevenueEvaluation] = useState<{
    currentYearData: Array<{
      month: string;
      revenue: number;
      target: number;
    }>;
    previousYearData: Array<{
      month: string;
      revenue: number;
    }>;
  } | null>(null);
  const [opportunityDetails, setOpportunityDetails] = useState<OpportunityDetails[]>([]);
  const [salespersonDetails, setSalespersonDetails] = useState<SalespersonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          metricsData,
          salesData,
          geoData,
          prodData,
          custData,
          revenueData,
          revenueEvalData,
          oppDetails,
          salesDetails,
        ] = await Promise.all([
          crmAppStoreService.getDashboardMetrics(),
          crmAppStoreService.getSalespersonPerformance(),
          crmAppStoreService.getGeographicData(),
          crmAppStoreService.getProductPerformance(),
          crmAppStoreService.getCustomerMetrics(),
          crmAppStoreService.getRevenueEvolution(),
          crmAppStoreService.getRevenueEvaluation(),
          crmAppStoreService.getOpportunityDetails(),
          crmAppStoreService.getSalespersonDetails(),
        ]);

        setMetrics(metricsData);
        setSalespeople(salesData);
        setGeographicData(geoData);
        setProductData(prodData);
        setCustomerData(custData);
        setRevenueEvolution(revenueData);
        setRevenueEvaluation(revenueEvalData);
        setOpportunityDetails(oppDetails);
        setSalespersonDetails(salesDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return crmAppStoreService.subscribeToUpdates(() => {});
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [
        metricsData,
        salesData,
        geoData,
        prodData,
        custData,
        revenueData,
        revenueEvalData,
        oppDetails,
        salesDetails,
      ] = await Promise.all([
        crmAppStoreService.getDashboardMetrics(),
        crmAppStoreService.getSalespersonPerformance(),
        crmAppStoreService.getGeographicData(),
        crmAppStoreService.getProductPerformance(),
        crmAppStoreService.getCustomerMetrics(),
        crmAppStoreService.getRevenueEvolution(),
        crmAppStoreService.getRevenueEvaluation(),
        crmAppStoreService.getOpportunityDetails(),
        crmAppStoreService.getSalespersonDetails(),
      ]);
      setMetrics(metricsData);
      setSalespeople(salesData);
      setGeographicData(geoData);
      setProductData(prodData);
      setCustomerData(custData);
      setRevenueEvolution(revenueData);
      setRevenueEvaluation(revenueEvalData);
      setOpportunityDetails(oppDetails);
      setSalespersonDetails(salesDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de rafraîchissement");
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    salespeople,
    geographicData,
    productData,
    customerData,
    revenueEvolution,
    revenueEvaluation,
    opportunityDetails,
    salespersonDetails,
    loading,
    error,
    refreshData,
  };
};
