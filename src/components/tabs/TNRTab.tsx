// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, User, RefreshCw, Loader2 } from "lucide-react";
import {
  fetchTNRTickets,
  TNRTicket,
  IssueLink,
} from "../../services/JiraAPI";

const TNRTab: React.FC = () => {
  const [tickets, setTickets] = useState<TNRTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour obtenir la couleur de la priorité
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "highest":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
      case "moyenne":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      case "lowest":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir la couleur du type d'issue
  const getIssueTypeColor = (issueType: string) => {
    switch (issueType?.toLowerCase()) {
      case "bug":
        return "bg-red-100 text-red-800";
      case "task":
        return "bg-blue-100 text-blue-800";
      case "story":
        return "bg-green-100 text-green-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "done":
      case "closed":
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in progress":
      case "testing":
        return "bg-blue-100 text-blue-800";
      case "to do":
      case "open":
        return "bg-gray-100 text-gray-800";
      case "blocked":
      case "waiting":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour charger les tickets TNR
  const loadTNRTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ticketsData = await fetchTNRTickets();
      setTickets(ticketsData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Erreur lors de la récupération des tickets TNR:", err);
      setError(`Erreur lors de la récupération des tickets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les tickets au montage du composant
  useEffect(() => {
    loadTNRTickets();
  }, [loadTNRTickets]);

  // Fonction pour actualiser les tickets
  const handleRefresh = useCallback(() => {
    loadTNRTickets();
  }, [loadTNRTickets]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  TNR - DF QA Automation
                </h1>
                <p className="text-gray-600">
                  Tickets du board "DF QA Automation" du projet AUT nécessitant
                  une attention particulière
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Dernière mise à jour : {formatDate(lastUpdated.toISOString())}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* État de chargement */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-orange-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chargement des tickets TNR...
              </h3>
              <p className="text-gray-600">
                Récupération des points d'attention du board "DF QA Automation"
              </p>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="text-lg font-semibold text-red-800">Erreur</h4>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Liste des tickets */}
        {!loading && !error && tickets.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900">
                Tickets en point d'attention ({tickets.length})
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white hover:border-orange-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {ticket.key}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getIssueTypeColor(
                              ticket.fields.issuetype?.name
                            )}`}
                          >
                            {ticket.fields.issuetype?.name || "Issue"}
                          </span>
                          {ticket.fields.priority && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                ticket.fields.priority.name
                              )}`}
                            >
                              {ticket.fields.priority.name}
                            </span>
                          )}
                        </div>

                        <h5 className="text-xl font-medium text-gray-900 mb-3">
                          {ticket.fields.summary}
                        </h5>

                        {/* Tickets liés */}
                        {ticket.fields.issuelinks &&
                          ticket.fields.issuelinks.length > 0 && (
                            <div className="mt-4">
                              <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>
                                  Tickets liés (
                                  {ticket.fields.issuelinks.length})
                                </span>
                              </h6>
                              <div className="space-y-2">
                                {ticket.fields.issuelinks.map((link) => (
                                  <LinkedTicket
                                    key={link.id}
                                    link={link}
                                    getIssueTypeColor={getIssueTypeColor}
                                    getPriorityColor={getPriorityColor}
                                    getStatusColor={getStatusColor}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <a
                        href={`https://raja-group.atlassian.net/browse/${ticket.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                      >
                        Voir dans Jira
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aucun ticket */}
        {!loading && !error && tickets.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun ticket en point d'attention
              </h3>
              <p className="text-gray-600">
                Tous les tickets du board "DF QA Automation" ont été traités ou
                ne nécessitent plus d'attention particulière.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant optimisé pour les tickets liés
const LinkedTicket = React.memo(
  ({
    link,
    getIssueTypeColor,
    getPriorityColor,
    getStatusColor,
  }: {
    link: IssueLink;
    getIssueTypeColor: (issueType: string) => string;
    getPriorityColor: (priority: string) => string;
    getStatusColor: (status: string) => string;
  }) => {
    const linkedIssue = link.inwardIssue || link.outwardIssue;
    if (!linkedIssue) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {linkedIssue.key}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getIssueTypeColor(
                  linkedIssue.fields.issuetype.name
                )}`}
              >
                {linkedIssue.fields.issuetype.name}
              </span>
              {linkedIssue.fields.priority && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    linkedIssue.fields.priority.name
                  )}`}
                >
                  {linkedIssue.fields.priority.name}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {linkedIssue.fields.summary}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span
                className={`px-2 py-1 rounded-full ${getStatusColor(
                  linkedIssue.fields.status.name
                )}`}
              >
                {linkedIssue.fields.status.name}
              </span>
              {linkedIssue.fields.assignee && (
                <span className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{linkedIssue.fields.assignee.displayName}</span>
                </span>
              )}
            </div>
          </div>
          <a
            href={`https://raja-group.atlassian.net/browse/${linkedIssue.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
          >
            Voir
          </a>
        </div>
      </div>
    );
  }
);

LinkedTicket.displayName = "LinkedTicket";

export default React.memo(TNRTab);
