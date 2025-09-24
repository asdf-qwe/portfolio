import React from "react";

interface TabNavigationProps {
  tabsLoading: boolean;
  allTabs: Array<{ id: string; label: string; isCustom: boolean }>;
  activeTab: string | null;
  setActiveTab: (tabId: string) => void;
  canEdit: boolean | null;
  newTabName: string;
  setNewTabName: (name: string) => void;
  handleAddTab: () => void;
  isAddingTab: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabsLoading,
  allTabs,
  activeTab,
  setActiveTab,
  canEdit,
  newTabName,
  setNewTabName,
  handleAddTab,
  isAddingTab,
}) => {
  return (
    <div className="border-b mb-8">
      <div className="flex justify-between items-center mb-4">
        <nav className="flex gap-4 flex-wrap">
          {tabsLoading
            ? // 탭 로딩 중
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-20 bg-gray-200 rounded animate-pulse"
                ></div>
              ))
            : allTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "text-blue-500 border-blue-500"
                      : "text-gray-500 border-transparent hover:text-blue-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
        </nav>

        {/* 탭 추가 기능 */}
        {canEdit && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="새 탭 이름"
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTab();
                }
              }}
            />
            <button
              onClick={handleAddTab}
              disabled={isAddingTab || !newTabName.trim()}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingTab ? "추가 중..." : "탭 추가"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
