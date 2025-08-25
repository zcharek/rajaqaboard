// @ts-nocheck
import React from "react";

const AccesRapideTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Boards Jira  */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Boards Jira
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://raja-group.atlassian.net/jira/software/projects/AUT/boards/349"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md w-48 h-32"
          >
            <div className="text-center">
              <div className="mb-2">
                <img
                  src="https://raja-group.atlassian.net/favicon.ico"
                  alt="Jira"
                  className="w-8 h-8 mx-auto"
                  onError={(e) => {
                    // Fallback vers le logo Jira officiel
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cdefs%3E%3ClinearGradient id='jira-a' x1='98.031%25' x2='58.888%25' y1='40.512%25' y2='74.227%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='jira-b' x1='100.665%25' x2='55.402%25' y1='45.016%25' y2='77.287%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none'%3E%3Cpath fill='%232684FF' d='M244.658 128.004c0 2.016-1.584 3.6-3.6 3.6H131.602c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-a)' d='M185.058 128.004c0 2.016-1.584 3.6-3.6 3.6H72.002c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-b)' d='M125.458 128.004c0 2.016-1.584 3.6-3.6 3.6H12.402c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3C/g%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="font-medium text-gray-900">
                Board Automation
              </span>
              <div className="text-xs text-gray-600 mt-1">Projet AUT</div>
            </div>
          </a>

          <a
            href="https://raja-group.atlassian.net/jira/software/c/projects/SPC/boards/344"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md w-48 h-32"
          >
            <div className="text-center">
              <div className="mb-2">
                <img
                  src="https://raja-group.atlassian.net/favicon.ico"
                  alt="Jira"
                  className="w-8 h-8 mx-auto"
                  onError={(e) => {
                    // Fallback vers le logo Jira officiel
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cdefs%3E%3ClinearGradient id='jira-a' x1='98.031%25' x2='58.888%25' y1='40.512%25' y2='74.227%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='jira-b' x1='100.665%25' x2='55.402%25' y1='45.016%25' y2='77.287%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none'%3E%3Cpath fill='%232684FF' d='M244.658 128.004c0 2.016-1.584 3.6-3.6 3.6H131.602c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-a)' d='M185.058 128.004c0 2.016-1.584 3.6-3.6 3.6H72.002c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-b)' d='M125.458 128.004c0 2.016-1.584 3.6-3.6 3.6H12.402c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3C/g%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="font-medium text-gray-900">Board SPC</span>
              <div className="text-xs text-gray-600 mt-1">Projet SPC</div>
            </div>
          </a>

          <a
            href="https://raja-group.atlassian.net/jira/software/c/projects/SP/boards/341"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md w-48 h-32"
          >
            <div className="text-center">
              <div className="mb-2">
                <img
                  src="https://raja-group.atlassian.net/favicon.ico"
                  alt="Jira"
                  className="w-8 h-8 mx-auto"
                  onError={(e) => {
                    // Fallback vers le logo Jira officiel
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cdefs%3E%3ClinearGradient id='jira-a' x1='98.031%25' x2='58.888%25' y1='40.512%25' y2='74.227%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='jira-b' x1='100.665%25' x2='55.402%25' y1='45.016%25' y2='77.287%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none'%3E%3Cpath fill='%232684FF' d='M244.658 128.004c0 2.016-1.584 3.6-3.6 3.6H131.602c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-a)' d='M185.058 128.004c0 2.016-1.584 3.6-3.6 3.6H72.002c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-b)' d='M125.458 128.004c0 2.016-1.584 3.6-3.6 3.6H12.402c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3C/g%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="font-medium text-gray-900">Board SP</span>
              <div className="text-xs text-gray-600 mt-1">Projet SP</div>
            </div>
          </a>

          <a
            href="https://raja-group.atlassian.net/jira/software/c/projects/NEXT/boards/974"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md w-48 h-32"
          >
            <div className="text-center">
              <div className="mb-2">
                <img
                  src="https://raja-group.atlassian.net/favicon.ico"
                  alt="Jira"
                  className="w-8 h-8 mx-auto"
                  onError={(e) => {
                    // Fallback vers le logo Jira officiel
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cdefs%3E%3ClinearGradient id='jira-a' x1='98.031%25' x2='58.888%25' y1='40.512%25' y2='74.227%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='jira-b' x1='100.665%25' x2='55.402%25' y1='45.016%25' y2='77.287%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none'%3E%3Cpath fill='%232684FF' d='M244.658 128.004c0 2.016-1.584 3.6-3.6 3.6H131.602c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-a)' d='M185.058 128.004c0 2.016-1.584 3.6-3.6 3.6H72.002c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-b)' d='M125.458 128.004c0 2.016-1.584 3.6-3.6 3.6H12.402c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3C/g%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="font-medium text-gray-900">Board NEXT</span>
              <div className="text-xs text-gray-600 mt-1">Projet NEXT</div>
            </div>
          </a>

          <a
            href="https://raja-group.atlassian.net/jira/software/c/projects/GOG/boards/505?search=1337"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md w-48 h-32"
          >
            <div className="text-center">
              <div className="mb-2">
                <img
                  src="https://raja-group.atlassian.net/favicon.ico"
                  alt="Jira"
                  className="w-8 h-8 mx-auto"
                  onError={(e) => {
                    // Fallback vers le logo Jira officiel
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cdefs%3E%3ClinearGradient id='jira-a' x1='98.031%25' x2='58.888%25' y1='40.512%25' y2='74.227%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='jira-b' x1='100.665%25' x2='55.402%25' y1='45.016%25' y2='77.287%25'%3E%3Cstop offset='18%25' stop-color='%230052CC'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none'%3E%3Cpath fill='%232684FF' d='M244.658 128.004c0 2.016-1.584 3.6-3.6 3.6H131.602c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-a)' d='M185.058 128.004c0 2.016-1.584 3.6-3.6 3.6H72.002c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3Cpath fill='url(%23jira-b)' d='M125.458 128.004c0 2.016-1.584 3.6-3.6 3.6H12.402c-21.168 0-38.304-17.136-38.304-38.304V14.346c0-2.016 1.584-3.6 3.6-3.6c2.016 0 3.6 1.584 3.6 3.6V93.3c0 17.136 13.968 31.104 31.104 31.104h109.056c2.016 0 3.6 1.584 3.6 3.6z'/%3E%3C/g%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="font-medium text-gray-900">Board GOG</span>
              <div className="text-xs text-gray-600 mt-1">Projet GOG</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccesRapideTab;
