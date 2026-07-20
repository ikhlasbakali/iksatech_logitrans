/** Types métier du module CRM — alimentés par les entités LogiTrans (opérations, devis, etc.). */

export interface CrmPartner {
  id: number;
  name: string;
  country: string;
  category: string;
  sector: string;
  email?: string;
  phone?: string;
}

export interface CrmSaleOrder {
  id: number;
  partner_id: number;
  partner_name: string;
  amount_total: number;
  amount_untaxed: number;
  margin: number;
  state: "draft" | "sent" | "sale" | "done" | "cancel";
  date_order: string;
  user_id: number;
  salesperson_name: string;
  order_lines: CrmSaleOrderLine[];
}

export interface CrmSaleOrderLine {
  id: number;
  product_id: number;
  product_name: string;
  product_category: string;
  quantity: number;
  price_unit: number;
  price_subtotal: number;
  margin: number;
}

export interface CrmLead {
  id: number;
  name: string;
  partner_name: string;
  expected_revenue: number;
  probability: number;
  stage_id: string;
  user_id: number;
  salesperson_name: string;
  date_deadline: string;
  create_date: string;
  country: string;
}

export interface CrmInvoice {
  id: number;
  partner_id: number;
  partner_name: string;
  amount_total: number;
  state: "draft" | "posted" | "paid" | "cancel";
  invoice_date: string;
  payment_state: "not_paid" | "in_payment" | "paid" | "partial" | "reversed" | "invoicing_legacy";
  amount_residual: number;
}

export interface SalespersonPerformance {
  id: number;
  name: string;
  revenue_achieved: number;
  revenue_target: number;
  deals_closed: number;
  deals_total: number;
  conversion_rate: number;
  avg_deal_time: number;
}

export interface DashboardMetrics {
  total_revenue_ht: number;
  total_revenue_ttc: number;
  total_revenue_dh: number;
  revenue_growth: number;
  revenue_growth_previous_year: number;
  pipeline_value: number;
  pipeline_lost: number;
  conversion_rate: number;
  active_leads: number;
  closed_deals: number;
  avg_deal_value: number;
  total_trips: number;
  import_trips: number;
  export_trips: number;
  objective_evaluation_rate: number;
  current_month_revenue: number;
  previous_month_revenue: number;
  current_year_revenue: number;
  previous_year_revenue: number;
}

export interface GeographicData {
  country: string;
  revenue: number;
  deals: number;
  lat: number;
  lng: number;
}

export interface ProductPerformance {
  id: number;
  name: string;
  category: string;
  revenue: number;
  quantity_sold: number;
  margin: number;
  growth_rate: number;
}

export interface CustomerMetrics {
  id: number;
  name: string;
  revenue: number;
  orders_count: number;
  avg_order_value: number;
  last_order_date: string;
  category: string;
  country: string;
  trips_count: number;
  import_trips: number;
  export_trips: number;
  revenue_growth: number;
  revenue_previous_year: number;
  evaluation_score: number;
}

export interface ServiceDetails {
  transport_international: number;
  transport_national: number;
  stockage: number;
  parking: number;
}

export interface OpportunityDetails {
  id: number;
  client_name: string;
  category: string;
  services: ServiceDetails;
  status: "prospect" | "qualification" | "devis" | "negociation" | "signature" | "perdu";
  value: number;
  probability: number;
  created_date: string;
}

export interface SalespersonDetails {
  id: number;
  name: string;
  total_deals: number;
  prospects: number;
  qualification: number;
  devis: number;
  negociation: number;
  signature: number;
  perdu: number;
  services: ServiceDetails;
  revenue: number;
  revenue_growth: number;
}
