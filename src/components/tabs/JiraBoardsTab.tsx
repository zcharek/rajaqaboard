import React, { useState, useEffect } from "react";
import { fetchJiraBoards, JiraBoard } from "../../services/JiraAPI";
import {
  AlertCircle,
  RefreshCw,
  Trello,
  Play,
  Tag,
  Hash,
  Eye,
  Target,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface JiraBoardsTabProps {
  refreshData?: () => void;
}

const JiraBoardsTab: React.FC<JiraBoardsTabProps> = ({ refreshData }) => {
  const [boards, setBoards] = useState<JiraBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBoard, setExpandedBoard] = useState<number | null>(null);

  const loadBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const boardsData = await fetchJiraBoards();
      setBoards(boardsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des boards"
      );
      console.error("Error loading Jira boards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleRefresh = () => {
    loadBoards();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-red-200 p-12 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <RefreshCw className="h-5 w-5 mr-3" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Liste des boards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-8 animate-pulse"
              >
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {boards.map((board) => (
              <div
                key={board.id}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
              >
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {board.name}
                    </h3>
                  </div>
                </div>

                {/* Sprint en cours */}
                {board.currentSprint && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Play className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-green-800">
                        Sprint Actuel
                      </span>
                    </div>
                    <p className="text-green-700 font-medium text-sm">
                      {board.currentSprint.name}
                      {board.ticketCount && (
                        <span className="text-gray-500 ml-2">
                          ({board.ticketCount} tickets)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Progression du sprint */}
                {board.currentSprint && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Progression du sprint
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        ({board.completedTicketCount || 0}/
                        {board.ticketCount || 0} tickets)
                      </span>
                    </div>

                    {/* Barre de progression améliorée */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${board.sprintProgress || 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        {board.sprintProgress || 0}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Tickets avec fix version */}
                {board.ticketsWithFixVersion &&
                  board.ticketsWithFixVersion > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-orange-600" />
                          <span className="font-semibold text-orange-800">
                            Tickets de release
                          </span>
                        </div>
                        <span className="text-lg font-bold text-orange-700">
                          {board.ticketsWithFixVersion}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-700">
                            {board.completedTicketsWithFixVersion || 0} terminés
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="text-orange-700">
                            {board.pendingTicketsWithFixVersion?.length || 0} en
                            attente
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Bouton pour voir les détails */}
                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={() => {
                      setExpandedBoard(
                        expandedBoard === board.id ? null : board.id
                      );
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 hover:bg-blue-50 rounded-xl group"
                  >
                    <Eye className="h-4 w-4" />
                    <span>
                      {expandedBoard === board.id
                        ? "Masquer les détails"
                        : "Voir les détails"}
                    </span>
                  </button>
                </div>

                {/* Section dépliée avec les détails des tickets */}
                {expandedBoard === board.id &&
                  board.ticketsWithFixVersionDetails && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Tag className="h-5 w-5 text-blue-600" />
                        <span>Tickets assignée à la release</span>
                      </h4>
                      <div className="space-y-4">
                        {board.ticketsWithFixVersionDetails.map((ticket) => (
                          <div
                            key={ticket.key}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <span className="font-mono text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold">
                                    {ticket.key}
                                  </span>
                                  <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                      ticket.status === "FERMÉ" ||
                                      ticket.status === "RÉSOLU"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {ticket.status}
                                  </span>
                                </div>
                                <p className="text-gray-900 font-medium mb-3 text-sm leading-relaxed">
                                  {ticket.summary}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <Tag className="h-4 w-4 text-blue-600" />
                                  <span className="text-xs text-gray-600 font-medium">
                                    Versions: {ticket.fixVersions.join(", ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Message si aucun board */}
        {!loading && boards.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-12 text-center max-w-md">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Trello className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Aucun sprint trouvé
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Aucun sprint Jira n'est accessible avec les permissions
                actuelles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JiraBoardsTab;
