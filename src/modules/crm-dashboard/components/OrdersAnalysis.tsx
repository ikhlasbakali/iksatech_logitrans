import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  Euro,
  DollarSign as DollarIcon
} from 'lucide-react';

interface Order {
  id: string;
  date: string;
  client: string;
  salesperson: string;
  company: string;
  amount: number;
  currency: string;
  amountDH: number;
}

interface ClientSummary {
  client: string;
  orderCount: number;
  totalAmount: number;
  totalAmountDH: number;
  orders: Order[];
}

interface SalespersonSummary {
  salesperson: string;
  orderCount: number;
  totalAmount: number;
  totalAmountDH: number;
  clients: ClientSummary[];
}

export const OrdersAnalysis: React.FC = () => {
  const [expandedSalesperson, setExpandedSalesperson] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  // Jeu d’exemple commandes — présentation CRM (données live : opérations / devis)
  const ordersData: Order[] = [
    // Nadia Volkov (31 commandes)
    { id: 'S/202502963', date: '23/08/2025', client: 'BEST FESTIVAL', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 48000, currency: 'DH', amountDH: 48000 },
    { id: 'S/202503080', date: '29/08/2025', client: 'CASTANLOGISTIC', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 3600, currency: '€', amountDH: 37887.56 },
    { id: 'S/202503079', date: '29/08/2025', client: 'CASTANLOGISTIC', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 3600, currency: '€', amountDH: 37887.56 },
    { id: 'S/202503073', date: '29/08/2025', client: 'CASTANLOGISTIC', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 3200, currency: '€', amountDH: 33665.43 },
    { id: 'S/202502992', date: '26/08/2025', client: 'CASTANLOGISTIC', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 3500, currency: '€', amountDH: 36856.46 },
    { id: 'S/202502906', date: '19/08/2025', client: 'CERAMEX', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 22200, currency: 'DH', amountDH: 22200 },
    { id: 'S/202503024', date: '27/08/2025', client: 'GEODIS', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 2200, currency: '€', amountDH: 23105.60 },
    { id: 'S/202502997', date: '26/08/2025', client: 'GEODIS', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 2600, currency: '€', amountDH: 27379.08 },
    { id: 'S/202502916', date: '21/08/2025', client: 'GEODIS', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 2600, currency: '€', amountDH: 27370.73 },
    { id: 'S/202503002', date: '26/08/2025', client: 'INFINITY MOVES', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 17000, currency: 'DH', amountDH: 17000 },
    { id: 'S/202502999', date: '26/08/2025', client: 'LUNA CERAME', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 15000, currency: 'DH', amountDH: 15000 },
    { id: 'S/202502917', date: '21/08/2025', client: 'LUNA CERAME', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 15000, currency: 'DH', amountDH: 15000 },
    { id: 'S/202502907', date: '19/08/2025', client: 'LUNA CERAME', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 15000, currency: 'DH', amountDH: 15000 },
    { id: 'S/202502885', date: '18/08/2025', client: 'LUNA CERAME', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 15000, currency: 'DH', amountDH: 15000 },
    { id: 'S/202502831', date: '08/08/2025', client: 'LUNA CERAME', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 15000, currency: 'DH', amountDH: 15000 },
    { id: 'S/202502781', date: '01/08/2025', client: 'LUNA CERAME', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 15000, currency: 'DH', amountDH: 15000 },
    { id: 'S/202503044', date: '28/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 1500, currency: '€', amountDH: 15780.67 },
    { id: 'S/202502982', date: '25/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 1500, currency: '€', amountDH: 15777.02 },
    { id: 'S/202502847', date: '11/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 300, currency: '€', amountDH: 3159.13 },
    { id: 'S/202502849', date: '11/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 600, currency: '€', amountDH: 6318.25 },
    { id: 'S/202502846', date: '11/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 450, currency: '€', amountDH: 4738.69 },
    { id: 'S/202502848', date: '11/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 1500, currency: '€', amountDH: 15769.55 },
    { id: 'S/202502845', date: '11/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 1500, currency: '€', amountDH: 15769.55 },
    { id: 'S/202502844', date: '11/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 1500, currency: '€', amountDH: 15769.55 },
    { id: 'S/202502826', date: '08/08/2025', client: 'Marotrans', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 1500, currency: '€', amountDH: 15821.12 },
    { id: 'S/202503095', date: '30/08/2025', client: 'PORCELANOR', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 20200, currency: 'DH', amountDH: 20200 },
    { id: 'S/202503045', date: '28/08/2025', client: 'PORCELANOR', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 20200, currency: 'DH', amountDH: 20200 },
    { id: 'S/202502965', date: '23/08/2025', client: 'PORCELANOR', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 18200, currency: 'DH', amountDH: 18200 },
    { id: 'S/202502967', date: '23/08/2025', client: 'PORCELANOR', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 18200, currency: 'DH', amountDH: 18200 },
    { id: 'S/202502966', date: '23/08/2025', client: 'PORCELANOR', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 20200, currency: 'DH', amountDH: 20200 },
    { id: 'S/202503023', date: '27/08/2025', client: 'Qingdao JST Logistics Co', salesperson: 'Nadia Volkov', company: 'Orion Flow TMS', amount: 1315, currency: '$', amountDH: 11882.49 },
    
    // James Okoro (17 commandes)
    { id: 'S/202502899', date: '19/08/2025', client: 'CERPA', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 18200, currency: 'DH', amountDH: 18200 },
    { id: 'S/202503068', date: '29/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3181.77, currency: '€', amountDH: 33485.97 },
    { id: 'S/202503051', date: '29/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38103.73 },
    { id: 'S/202503032', date: '28/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38089.70 },
    { id: 'S/202503011', date: '27/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38024.89 },
    { id: 'S/202502990', date: '26/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38080.88 },
    { id: 'S/202502991', date: '26/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3181.77, currency: '€', amountDH: 33505.37 },
    { id: 'S/202502989', date: '26/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38125.80 },
    { id: 'S/202502988', date: '26/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38125.80 },
    { id: 'S/202502975', date: '25/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38045.67 },
    { id: 'S/202502933', date: '22/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38045.67 },
    { id: 'S/202502932', date: '22/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38114.16 },
    { id: 'S/202502901', date: '19/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38114.16 },
    { id: 'S/202502883', date: '18/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3620.54, currency: '€', amountDH: 38129.41 },
    { id: 'S/202502785', date: '01/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 3551.77, currency: '€', amountDH: 37306.55 },
    { id: 'S/202502786', date: '01/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 4026.54, currency: '€', amountDH: 42293.37 },
    { id: 'S/202502779', date: '01/08/2025', client: 'YAZAKI TFZ', salesperson: 'James Okoro', company: 'Orion Flow TMS', amount: 4021.21, currency: '€', amountDH: 42058.03 },
    
    // Kenji Takano (91 commandes) - Exemples représentatifs
    { id: 'S/202503057', date: '29/08/2025', client: 'FRANCO MAROCAINE DE TRANSPORT', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 2900, currency: '€', amountDH: 30509.29 },
    { id: 'S/202503056', date: '29/08/2025', client: 'FRANCO MAROCAINE DE TRANSPORT', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 2900, currency: '€', amountDH: 30509.29 },
    { id: 'S/202502978', date: '25/08/2025', client: 'FRANCO MAROCAINE DE TRANSPORT', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 2600, currency: '€', amountDH: 27321.54 },
    { id: 'S/202502800', date: '04/08/2025', client: 'FRANCO MAROCAINE DE TRANSPORT', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 2900, currency: '€', amountDH: 30325.21 },
    { id: 'S/202503087', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 3700, currency: '€', amountDH: 38939.99 },
    { id: 'S/202503086', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 3700, currency: '€', amountDH: 38939.99 },
    { id: 'S/202503085', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 3700, currency: '€', amountDH: 38939.99 },
    { id: 'S/202503083', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 4150, currency: '€', amountDH: 43675.94 },
    { id: 'S/202503082', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 4150, currency: '€', amountDH: 43675.94 },
    { id: 'S/202503081', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Kenji Takano', company: 'Orion Flow TMS', amount: 4150, currency: '€', amountDH: 43675.94 },
    
    // Yelena Popova (76 commandes) - Exemples représentatifs
    { id: 'S/202502862', date: '13/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 1950, currency: '€', amountDH: 20560.51 },
    { id: 'S/202502817', date: '07/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 1950, currency: '€', amountDH: 20539.07 },
    { id: 'S/202503033', date: '28/08/2025', client: 'Atlas Heavy Works — Meknès', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 210, currency: '€', amountDH: 2210.11 },
    { id: 'S/202503098', date: '30/08/2025', client: 'YAZAKI', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 3340.62, currency: '€', amountDH: 35157.76 },
    { id: 'S/202503097', date: '30/08/2025', client: 'YAZAKI', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 3340.62, currency: '€', amountDH: 35157.76 },
    { id: 'S/202503096', date: '30/08/2025', client: 'YAZAKI', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 3340.62, currency: '€', amountDH: 35157.76 },
    { id: 'S/202503076', date: '29/08/2025', client: 'YAZAKI', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 3340.62, currency: '€', amountDH: 35157.76 },
    { id: 'S/202503075', date: '29/08/2025', client: 'YAZAKI', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 3440.62, currency: '€', amountDH: 36210.19 },
    { id: 'S/202503065', date: '29/08/2025', client: 'YAZAKI', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 3041.46, currency: '€', amountDH: 31997.52 },
    { id: 'S/202503064', date: '29/08/2025', client: 'YAZAKI', salesperson: 'Yelena Popova', company: 'Orion Flow TMS', amount: 3041.46, currency: '€', amountDH: 31997.52 },
    
    // Nicolas Verdier (48 commandes) - Exemples représentatifs
    { id: 'S/202503094', date: '30/08/2025', client: 'JACOB DELAFON', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 2854, currency: '€', amountDH: 30036.41 },
    { id: 'S/202503019', date: '27/08/2025', client: 'JACOB DELAFON', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 2260, currency: '€', amountDH: 23770.71 },
    { id: 'S/202502936', date: '22/08/2025', client: 'JACOB DELAFON', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 2854, currency: '€', amountDH: 30044.64 },
    { id: 'S/202502897', date: '19/08/2025', client: 'JACOB DELAFON', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 1100, currency: '€', amountDH: 11579.92 },
    { id: 'S/202502833', date: '11/08/2025', client: 'JACOB DELAFON', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 2260, currency: '€', amountDH: 23812.79 },
    { id: 'S/202503093', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 5187.27, currency: '€', amountDH: 54592.50 },
    { id: 'S/202503092', date: '30/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 5187.27, currency: '€', amountDH: 54592.50 },
    { id: 'S/202503038', date: '28/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 5187.27, currency: '€', amountDH: 54479.55 },
    { id: 'S/202503037', date: '28/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 5187.27, currency: '€', amountDH: 54479.55 },
    { id: 'S/202502957', date: '23/08/2025', client: 'Atlas Mécanique Maroc', salesperson: 'Nicolas Verdier', company: 'Orion Flow TMS', amount: 5267.27, currency: '€', amountDH: 55349.98 },
  ];

  // Calcul des statistiques
  const totalOrders = ordersData.length;
  const totalAmount = ordersData.reduce((sum, order) => sum + order.amount, 0);
  const totalAmountDH = ordersData.reduce((sum, order) => sum + order.amountDH, 0);

  // Grouper par commercial
  const salespersonData = ordersData.reduce((acc, order) => {
    if (!acc[order.salesperson]) {
      acc[order.salesperson] = {
        salesperson: order.salesperson,
        orderCount: 0,
        totalAmount: 0,
        totalAmountDH: 0,
        clients: {}
      };
    }
    
    acc[order.salesperson].orderCount++;
    acc[order.salesperson].totalAmount += order.amount;
    acc[order.salesperson].totalAmountDH += order.amountDH;
    
    if (!acc[order.salesperson].clients[order.client]) {
      acc[order.salesperson].clients[order.client] = {
        client: order.client,
        orderCount: 0,
        totalAmount: 0,
        totalAmountDH: 0,
        orders: []
      };
    }
    
    acc[order.salesperson].clients[order.client].orderCount++;
    acc[order.salesperson].clients[order.client].totalAmount += order.amount;
    acc[order.salesperson].clients[order.client].totalAmountDH += order.amountDH;
    acc[order.salesperson].clients[order.client].orders.push(order);
    
    return acc;
  }, {} as Record<string, any>);

  const salespersonSummaries: SalespersonSummary[] = Object.values(salespersonData).map((sp: any) => ({
    ...sp,
    clients: Object.values(sp.clients)
  })).sort((a, b) => b.totalAmountDH - a.totalAmountDH);

  const formatCurrency = (amount: number, currency: string = 'DH') => {
    if (currency === '€') return `€${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;
    if (currency === '$') return `$${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analyse des commandes LogiTrans</h2>
            <p className="text-gray-600">Données réelles - Août 2025</p>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Commandes</p>
              <p className="text-2xl font-bold text-blue-900">{formatNumber(totalOrders)}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(totalAmountDH)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Commerciaux Actifs</p>
              <p className="text-2xl font-bold text-purple-900">{salespersonSummaries.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">CA Moyen/Commande</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(totalAmountDH / totalOrders)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tableau des commerciaux */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance par Commercial</h3>
        
        {salespersonSummaries.map((salesperson) => (
          <div key={salesperson.salesperson} className="border border-gray-200 rounded-lg">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedSalesperson(
                expandedSalesperson === salesperson.salesperson ? null : salesperson.salesperson
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">{salesperson.salesperson}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{salesperson.orderCount} commandes</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatCurrency(salesperson.totalAmountDH)}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{salesperson.clients.length} clients</span>
                  {expandedSalesperson === salesperson.salesperson ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            
            {expandedSalesperson === salesperson.salesperson && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-4 space-y-4">
                  {salesperson.clients.map((client) => (
                    <div key={client.client} className="bg-white rounded-lg p-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => setExpandedClient(
                          expandedClient === `${salesperson.salesperson}-${client.client}` 
                            ? null 
                            : `${salesperson.salesperson}-${client.client}`
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{client.client}</span>
                          <span className="text-sm text-gray-500">({client.orderCount} commandes)</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(client.totalAmountDH)}
                          </span>
                          {expandedClient === `${salesperson.salesperson}-${client.client}` ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      {expandedClient === `${salesperson.salesperson}-${client.client}` && (
                        <div className="mt-4 space-y-2">
                          {client.orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm">
                              <div className="flex items-center space-x-4">
                                <span className="font-mono text-gray-600">{order.id}</span>
                                <span className="text-gray-500">{order.date}</span>
                                <span className="flex items-center space-x-1">
                                  {order.currency === '€' ? (
                                    <Euro className="w-3 h-3 text-green-600" />
                                  ) : order.currency === '$' ? (
                                    <DollarIcon className="w-3 h-3 text-blue-600" />
                                  ) : (
                                    <span className="text-gray-600">DH</span>
                                  )}
                                  <span>{formatCurrency(order.amount, order.currency)}</span>
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(order.amountDH)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
