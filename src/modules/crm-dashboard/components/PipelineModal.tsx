import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Users, DollarSign, Calendar, Building, Phone, Mail } from "lucide-react";
import { appApi } from "@/api/appApi";
import { formatCurrency, formatPercentage } from "../utils/formatters";

interface Opportunity {
  id: string;
  name: string;
  company: string;
  value: number;
  probability: number;
  expectedClose: string;
  salesperson: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
}

interface PipelineModalProps {
  stage: PipelineStage | null;
  isOpen: boolean;
  onClose: () => void;
}

function statusMatchesStage(stageName: string, status: string) {
  const s = String(status || "");
  switch (stageName) {
    case "Prospects":
      return s === "draft";
    case "Qualification":
      return false;
    case "Devis":
      return s === "sent";
    case "Négociation":
      return false;
    case "Signature":
      return s === "accepted" || s === "invoiced";
    case "Perdu":
      return s === "rejected" || s === "expired";
    default:
      return false;
  }
}

function probabilityForStatus(status: string): number {
  switch (String(status)) {
    case "draft":
      return 20;
    case "sent":
      return 55;
    case "accepted":
    case "invoiced":
      return 100;
    case "rejected":
    case "expired":
      return 0;
    default:
      return 35;
  }
}

function mapQuoteToOpportunity(q: Record<string, unknown>): Opportunity {
  const vu = q.valid_until ? String(q.valid_until).slice(0, 10) : "";
  let expectedClose = vu;
  try {
    if (vu) expectedClose = new Date(vu).toISOString().slice(0, 10);
  } catch {
    /* ignore */
  }
  return {
    id: String(q.id),
    name: String(q.title || "Devis"),
    company: String(q.client_company || "—"),
    value: Number(q.amount_ht) || 0,
    probability: probabilityForStatus(String(q.status)),
    expectedClose: expectedClose || new Date().toISOString().slice(0, 10),
    salesperson: String(q.commercial_owner || "—"),
    contact: {
      name: String(q.contact_name || "—"),
      email: String(q.contact_email || "—"),
      phone: "—",
    },
  };
}

export const PipelineModal: React.FC<PipelineModalProps> = ({ stage, isOpen, onClose }) => {
  const { data: rawQuotes = [] } = useQuery({
    queryKey: ["salesQuotes", "pipelineModal", stage?.name],
    queryFn: () => appApi.entities.SalesQuote.list("-created_date", 400),
    enabled: Boolean(isOpen && stage),
  });

  const opportunities = useMemo(() => {
    if (!stage) return [];
    return (rawQuotes as Record<string, unknown>[])
      .filter((q) => statusMatchesStage(stage.name, String(q.status)))
      .map(mapQuoteToOpportunity);
  }, [rawQuotes, stage]);

  if (!stage || !isOpen) return null;

  const listValue = opportunities.reduce((s, o) => s + o.value, 0);
  const avgValue = opportunities.length > 0 ? listValue / opportunities.length : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${stage.color} mr-3`}></div>
            <h2 className="text-xl font-semibold text-gray-900">Détails — {stage.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{opportunities.length}</div>
              <div className="text-sm text-gray-600">Devis (stockage app)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(listValue)}</div>
              <div className="text-sm text-gray-600">Montant HT (liste)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(avgValue)}
              </div>
              <div className="text-sm text-gray-600">Montant HT moyen</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 text-center">
            Données issues des devis enregistrés. Les étapes « Qualification » et « Négociation »
            s&apos;activent lorsque vous ajouterez des statuts ou champs dédiés côté devis.
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {opportunities.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                Aucun devis à ce stade pour l&apos;instant.
              </p>
            ) : (
              opportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900 mr-3">{opportunity.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {formatPercentage(opportunity.probability)} probabilité
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          {opportunity.company}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {opportunity.salesperson}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Valable jusqu&apos;au{" "}
                          {new Date(opportunity.expectedClose).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {formatCurrency(opportunity.value)}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Contact (devis)</div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap gap-2">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {opportunity.contact.name}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {opportunity.contact.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {opportunity.contact.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Pipeline agrégé (vue principale) : {stage.count} • {formatCurrency(stage.value)} — liste
              ci-dessus : {opportunities.length} • {formatCurrency(listValue)}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
