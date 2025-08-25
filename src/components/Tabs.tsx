// @ts-nocheck
import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-1">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
