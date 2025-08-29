import axios from "axios";

// Configuration Jira
const JIRA_CONFIG = {
  apiToken: process.env.REACT_APP_JIRA_QA_DASHBOARD || "",
  email: process.env.REACT_APP_JIRA_EMAIL || "",
};

// Headers d'authentification pour Jira
const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const auth = {
  username: JIRA_CONFIG.email,
  password: JIRA_CONFIG.apiToken
}

// Interface pour les tickets avec version
export interface TicketWithVersion {
  key: string;
  summary: string;
  status: string;
  fixVersions: string[];
}

// Interface pour les tickets TNR
export interface TNRTicket {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
    };
    priority?: {
      name: string;
    };
    created: string;
    updated: string;
    issuetype: {
      name: string;
    };
    description?: string;
    issuelinks?: IssueLink[];
  };
}

// Interface pour les tickets liés
export interface LinkedIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    issuetype: {
      name: string;
    };
    priority?: {
      name: string;
    };
    assignee?: {
      displayName: string;
    };
  };
}

// Interface pour les liens entre tickets
export interface IssueLink {
  id: string;
  type: {
    id: string;
    name: string;
    inward: string;
    outward: string;
  };
  inwardIssue?: LinkedIssue;
  outwardIssue?: LinkedIssue;
}

// Interface pour les boards Jira
export interface JiraBoard {
  id: number;
  name: string;
  type: string;
  self: string;
  currentSprint?: JiraSprint;
  ticketCount?: number;
  completedTicketCount?: number;
  sprintProgress?: number;
  ticketsWithFixVersion?: number;
  completedTicketsWithFixVersion?: number;
  pendingTicketsWithFixVersion?: string[];
  ticketsWithFixVersionDetails?: TicketWithVersion[];
  location?: {
    projectId: number;
    displayName: string;
    projectNameKey: string;
    projectKey: string;
    projectTypeKey: string;
    avatarURI: string;
    name: string;
  };
}

// Boards autorisés (par nom et clé de projet)
const ALLOWED_BOARDS = [
  { name: "SPC Board", projectKey: "SPC" },
  { name: "SP board", projectKey: "SP" },
  { name: "GOGETA board", projectKey: "GOG" },
  { name: "NEXT", projectKey: "NEXT" },
];

// Interface pour la réponse de l'API boards
export interface JiraBoardsResponse {
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: JiraBoard[];
}

// Fonction pour récupérer tous les boards Jira
export const fetchJiraBoards = async (): Promise<JiraBoard[]> => {
  try {
    // Récupérer tous les boards avec pagination
    let allBoards: JiraBoard[] = [];
    let startAt = 0;
    const maxResults = 50;
    let total = 0;
    let isLast = false;

    do {
      const response = await axios.get<JiraBoardsResponse>(
        `/rest/agile/1.0/board?startAt=${startAt}&maxResults=${maxResults}`,
        {
          headers,
          auth,
          timeout: 15000,
        }
      );

      if (response.data && response.data.values) {
        allBoards = [...allBoards, ...response.data.values];
        total = response.data.total;
        isLast = response.data.isLast;
        startAt += maxResults;
      } else {
        break;
      }
    } while (!isLast && startAt < total);

    // Filtrer les boards pour ne garder que ceux autorisés
    const filteredBoards = allBoards.filter((board: JiraBoard) => {
      // La clé du projet est dans board.location.projectKey
      if (!board.location || !board.location.projectKey) {
        return false;
      }

      const projectKey = board.location.projectKey.toUpperCase();
      const boardName = board.name;

      // Vérifier si le board est dans la liste autorisée
      const isAllowed = ALLOWED_BOARDS.some(
        (allowedBoard) =>
          allowedBoard.name === boardName &&
          allowedBoard.projectKey.toUpperCase() === projectKey
      );

      return isAllowed;
    });

    // Récupérer les informations détaillées pour chaque board

    const boardsWithDetails = await Promise.all(
      filteredBoards.map(async (board) => {
        try {
          // const projectKey = board.location?.projectKey; // Variable non utilisée

          // Récupérer le sprint actif
          const sprints = await fetchJiraBoardSprints(board.id);
          const currentSprint = sprints.find(
            (sprint) => sprint.state === "active"
          );

          // Récupérer le nombre de tickets du sprint actif et calculer la progression
          let ticketCount = 0;
          let completedTicketCount = 0;
          let sprintProgress = 0;
          let ticketsWithFixVersion = 0;
          let completedTicketsWithFixVersion = 0;
          let pendingTicketsWithFixVersion: string[] = [];
          let ticketsWithFixVersionDetails: TicketWithVersion[] = [];
          if (currentSprint) {
            const sprintIssues = await fetchSprintIssues(currentSprint.id);
            ticketCount = sprintIssues.length;

            // Calculer la progression basée sur les tickets terminés
            const completedIssues = sprintIssues.filter((issue: any) => {
              const statusName = issue.fields.status.name;
              return ["FERMÉ", "RÉSOLU"].includes(statusName);
            });

            completedTicketCount = completedIssues.length;
            sprintProgress =
              ticketCount > 0
                ? Math.round((completedTicketCount / ticketCount) * 100)
                : 0;

            // Calculer les tickets avec fix version
            const ticketsWithFixVersionList = sprintIssues.filter(
              (issue: any) => {
                return (
                  issue.fields.fixVersions &&
                  issue.fields.fixVersions.length > 0
                );
              }
            );

            const completedTicketsWithFixVersionList =
              ticketsWithFixVersionList.filter((issue: any) => {
                const statusName = issue.fields.status.name;
                return ["FERMÉ", "RÉSOLU"].includes(statusName);
              });

            // Récupérer les IDs des tickets non terminés avec fix version
            const pendingTicketsWithFixVersionList = ticketsWithFixVersionList
              .filter((issue: any) => {
                const statusName = issue.fields.status.name;
                return !["FERMÉ", "RÉSOLU"].includes(statusName);
              })
              .map((issue: any) => issue.key);

            ticketsWithFixVersion = ticketsWithFixVersionList.length;
            completedTicketsWithFixVersion =
              completedTicketsWithFixVersionList.length;
            pendingTicketsWithFixVersion = pendingTicketsWithFixVersionList;

            // Récupérer les détails des tickets avec fix version correspondant au sprint
            ticketsWithFixVersionDetails = ticketsWithFixVersionList.map(
              (issue: any) => ({
                key: issue.key,
                summary: issue.fields.summary,
                status: issue.fields.status.name,
                fixVersions: issue.fields.fixVersions.map((v: any) => v.name),
              })
            );
          }

          return {
            ...board,
            currentSprint,
            ticketCount,
            completedTicketCount,
            sprintProgress,
            ticketsWithFixVersion,
            completedTicketsWithFixVersion,
            pendingTicketsWithFixVersion,
            ticketsWithFixVersionDetails,
          };
        } catch (error) {
          console.error(
            `Error fetching details for board ${board.name}:`,
            error
          );
          return {
            ...board,
            currentSprint: undefined,
            ticketCount: 0,
            completedTicketCount: 0,
            sprintProgress: 0,
            ticketsWithFixVersion: 0,
            completedTicketsWithFixVersion: 0,
            pendingTicketsWithFixVersion: [],
            ticketsWithFixVersionDetails: [],
          };
        }
      })
    );

    return boardsWithDetails;
  } catch (error) {
    console.error("Error fetching Jira boards:", error);

    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }

    throw new Error(`Failed to fetch Jira boards: ${error}`);
  }
};

// Fonction pour récupérer les détails d'un board spécifique
export const fetchJiraBoardDetails = async (boardId: number): Promise<any> => {
  try {
    const response = await axios.get(
      `/rest/agile/1.0/board/${boardId}`,
      {
        headers,
        auth,
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching Jira board details for board ${boardId}:`,
      error
    );
    throw new Error(`Failed to fetch Jira board details: ${error}`);
  }
};

// Interface pour les sprints Jira
export interface JiraSprint {
  id: number;
  name: string;
  state: "future" | "active" | "closed";
  startDate?: string;
  endDate?: string;
  goal?: string;
  completeDate?: string;
  sequence: number;
  rapidViewId: number;
}

// Interface pour les versions Jira
export interface JiraVersion {
  id: number;
  name: string;
  description?: string;
  archived: boolean;
  released: boolean;
  releaseDate?: string;
  userReleaseDate?: string;
  projectId: number;
  startDate?: string;
  project: string;
  self: string;
}

// Fonction pour récupérer les sprints d'un board
export const fetchJiraBoardSprints = async (
  boardId: number
): Promise<JiraSprint[]> => {
  try {
    const response = await axios.get(
      `/rest/agile/1.0/board/${boardId}/sprint`,
      {
        headers,
        auth,
        params: {
          state: "active,future", // Récupérer les sprints actifs et futurs
          maxResults: 50,
        },
        timeout: 15000,
      }
    );

    return response.data.values || [];
  } catch (error) {
    console.error(
      `Error fetching Jira board sprints for board ${boardId}:`,
      error
    );
    return [];
  }
};

// Fonction pour récupérer les détails d'un sprint spécifique
export const fetchSprintDetails = async (sprintId: number): Promise<any> => {
  try {
    const response = await axios.get(
      `/rest/agile/1.0/sprint/${sprintId}`,
      {
        headers,
        auth,
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching sprint details for sprint ${sprintId}:`,
      error
    );
    return null;
  }
};

// Fonction pour récupérer les issues d'un sprint
export const fetchSprintIssues = async (sprintId: number): Promise<any[]> => {
  try {
    const response = await axios.get(
      `/rest/agile/1.0/sprint/${sprintId}/issue`,
      {
        headers,
        auth,
        params: {
          maxResults: 1000,
          fields:
            "summary,status,issuetype,assignee,priority,storypoints,fixVersions",
        },
        timeout: 15000,
      }
    );

    return response.data.issues || [];
  } catch (error) {
    console.error(
      `Error fetching sprint issues for sprint ${sprintId}:`,
      error
    );
    return [];
  }
};

// Fonction pour récupérer les versions d'un projet
export const fetchProjectVersions = async (
  projectKey: string
): Promise<JiraVersion[]> => {
  try {
    const response = await axios.get(
      `/rest/api/3/project/${projectKey}/versions`,
      {
        headers,
        auth,
        timeout: 15000,
      }
    );

    return response.data || [];
  } catch (error) {
    console.error(`Error fetching versions for project ${projectKey}:`, error);
    return [];
  }
};

// Fonction pour récupérer les issues avec une version spécifique
export const fetchIssuesByVersion = async (
  projectKey: string,
  versionName: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `/rest/api/3/search`,
      {
        headers,
        auth,
        params: {
          jql: `project = ${projectKey} AND fixVersion = "${versionName}"`,
          maxResults: 1000,
          fields:
            "summary,status,issuetype,assignee,priority,storypoints,fixVersions",
        },
        timeout: 15000,
      }
    );

    return response.data.issues || [];
  } catch (error) {
    console.error(
      `Error fetching issues for version ${versionName} in project ${projectKey}:`,
      error
    );
    return [];
  }
};

// Fonction pour récupérer toutes les issues d'un board
export const fetchBoardIssues = async (boardId: number): Promise<any[]> => {
  try {
    // Récupérer toutes les issues avec pagination
    let allIssues: any[] = [];
    let startAt = 0;
    const maxResults = 1000;
    let total = 0;
    let isLast = false;

    do {
      const response = await axios.get(
        `/rest/agile/1.0/board/${boardId}/issue`,
        {
          headers,
          auth,
          params: {
            startAt: startAt,
            maxResults: maxResults,
            fields: "summary,status,issuetype",
          },
          timeout: 15000,
        }
      );

      if (response.data && response.data.issues) {
        allIssues = [...allIssues, ...response.data.issues];
        total = response.data.total;
        isLast = response.data.isLast;
        startAt += maxResults;
      } else {
        break;
      }
    } while (!isLast && startAt < total);

    return allIssues;
  } catch (error) {
    console.error(`Error fetching board issues for board ${boardId}:`, error);
    return [];
  }
};

// Fonction pour récupérer les versions non publiées (en cours de développement)
export const fetchUnreleasedVersions = async (
  projectKey: string
): Promise<JiraVersion[]> => {
  try {
    const response = await axios.get(
      `/rest/api/3/project/${projectKey}/versions`,
      {
        headers,
        auth,
        params: {
          status: "unreleased",
        },
        timeout: 15000,
      }
    );

    return response.data || [];
  } catch (error) {
    console.error(
      `Error fetching unreleased versions for project ${projectKey}:`,
      error
    );
    return [];
  }
};

// Fonction pour récupérer les tickets TNR du board "DF QA Automation"
export const fetchTNRTickets = async (): Promise<TNRTicket[]> => {
  try {
    // Récupérer les tickets du board 349 avec le statut "Point d'attention"
    const response = await axios.get<{ issues: TNRTicket[] }>(
      `/rest/agile/1.0/board/349/issue`,
      {
        headers,
        auth,
        params: {
          jql: 'project = AUT AND status = "Point d\'attention"',
          maxResults: 100,
          fields:
            "summary,status,assignee,priority,created,updated,issuetype,description,issuelinks",
        },
      }
    );

    if (response.data && response.data.issues) {
      // Récupérer les tickets liés pour chaque ticket TNR
      const ticketsWithLinks = await Promise.all(
        response.data.issues.map(async (ticket) => {
          try {
            const linksResponse = await axios.get<{
              fields: { issuelinks: IssueLink[] };
            }>(
              `/rest/api/3/issue/${ticket.key}?fields=issuelinks`,
              {
                headers,
              }
            );

            if (
              linksResponse.data &&
              linksResponse.data.fields &&
              linksResponse.data.fields.issuelinks
            ) {
              ticket.fields.issuelinks = linksResponse.data.fields.issuelinks;
            }
          } catch (linkError) {}

          return ticket;
        })
      );

      return ticketsWithLinks;
    }

    return [];
  } catch (error: any) {
    console.error("Erreur lors de la récupération des tickets TNR:", error);
    throw new Error(
      `Erreur lors de la récupération des tickets TNR: ${error.message}`
    );
  }
};
