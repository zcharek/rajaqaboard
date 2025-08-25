// @ts-nocheck
import React from "react";
import { Construction } from "lucide-react";

const TNRTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Onglet TNR
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Cet onglet est en cours de développement. Le contenu sera ajouté prochainement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TNRTab;
