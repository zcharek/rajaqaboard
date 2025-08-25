import axios from "axios";
import { TestCase, TestCaseStats } from "../types/TestCase";

// Configuration QA Touch
const QA_TOUCH_CONFIG = {
  domain: "raja",
  apiToken: "50a8e2bac103aef950ed7ff6ef373fcf448a572b4b2780a0b02ef72da64c66a4",
  projectKey: "bPlV",
};

const headers = {
  domain: QA_TOUCH_CONFIG.domain,
  "api-token": QA_TOUCH_CONFIG.apiToken,
};

// Récupérer tous les cas de tests sans filtre (tous les modules)
export const fetchAllTestCasesWithoutFilter = async (): Promise<TestCase[]> => {
  let allTestCases: TestCase[] = [];
  let currentPage = 1;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const url = `https://api.qatouch.com/api/v1/getAllTestCases/${QA_TOUCH_CONFIG.projectKey}?page=${currentPage}`;

      const response = await axios.get(url, { headers, timeout: 10000 });
      const data = response.data;

      if (data.data && Array.isArray(data.data)) {
        const pageCases = data.data.map(
          (item: any) =>
            ({
              id: item.case_key || item.id,
              caseKey: item.case_key || item.id,
              title:
                item.case_title || item.title || `Test Case ${item.case_key}`,
              description: item.description || item.case_description,
              mode: "unknown", // On va le déterminer plus tard
              moduleKey: item.module_key,
              moduleName: item.module_name,
              sectionKey: item.section_key,
              sectionName: item.section_name,
              status: item.status || "active",
              priority: item.priority || "medium",
              estimate: item.estimate || 0,
              reference: item.reference,
              precondition: item.precondition,
              createdDate: item.created_date || item.created_at,
              updatedDate: item.updated_date || item.updated_at,
              assignedTo: item.assigned_to || item.assigned_user,
              tags: item.tags
                ? item.tags.split(",").map((tag: string) => tag.trim())
                : [],
              customFields: item.custom_fields || {},
              type: item.Type || item.type || "unknown", // Récupérer le Type
            } as TestCase)
        );

        allTestCases.push(...pageCases);

        // Vérifier s'il y a d'autres pages
        // Si l'API dit qu'il n'y a qu'une page mais qu'il y a 487 items,
        // on force la pagination manuellement
        const totalItems = parseInt(data.meta?.total || "0");
        const itemsPerPage = parseInt(data.meta?.per_page || "50");
        const calculatedPages = Math.ceil(totalItems / itemsPerPage);

        if (data.meta && parseInt(data.meta.current_page) < calculatedPages) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false;
      }
    }

    return allTestCases;
  } catch (error: any) {
    throw new Error(`Erreur API: ${error.message}`);
  }
};

// Récupérer tous les cas de tests avec pagination
export const fetchAllTestCases = async (): Promise<TestCase[]> => {
  try {
    // 1. Récupérer tous les cas de tests (comme avant - 487 cas)
    const allTestCases = await fetchAllTestCasesWithoutFilter();

    // 2. Analyser les modes depuis les données récupérées
    try {
      // Pour l'instant, on utilise les données qu'on a récupérées
      // L'endpoint /v1/get/cases a un problème CORS

      // Analyser les modes basés sur les titres/descriptions des cas de tests
      // Logique d'analyse des types

      allTestCases.forEach((testCase) => {
        // Nouvelle logique basée sur le Type
        const type = (testCase.type || "").toLowerCase();

        // Logique basée sur le Type
        if (type === "acceptance") {
          testCase.mode = "automation";
        } else if (type === "functional") {
          testCase.mode = "manual";
        } else {
          // Fallback pour les types inconnus
          testCase.mode = "manual"; // Par défaut: manual
        }
      });
    } catch (modesError: any) {
      // Gestion silencieuse des erreurs

      // Fallback: marquer tous comme manual
      allTestCases.forEach((testCase) => {
        testCase.mode = "manual";
      });
    }

    return allTestCases;
  } catch (error: any) {
    throw new Error(`Erreur API: ${error.message}`);
  }
};

// Récupérer d'abord les modes disponibles
export const fetchAvailableModes = async (): Promise<string[]> => {
  try {
    const url = `https://raja.qatouch.com/v1/get/cases`;

    const response = await axios.get(url, {
      headers: {
        domain: QA_TOUCH_CONFIG.domain,
        "api-token": QA_TOUCH_CONFIG.apiToken,
      },
      timeout: 10000,
    });

    const data = response.data;

    // Extraire les modes de la réponse
    if (data.modes && Array.isArray(data.modes)) {
      return data.modes;
    } else if (data.data && Array.isArray(data.data)) {
      // Essayer d'extraire les modes des données
      const modeArray = data.data.map((item: any) => item.mode).filter(Boolean);
      const modes = modeArray.filter(
        (mode: string, index: number) => modeArray.indexOf(mode) === index
      );
      return modes;
    }

    return [];
  } catch (error: any) {
    return [];
  }
};

// Récupérer les cas de tests par mode (automation/manual)
export const fetchTestCasesByMode = async (
  mode: string
): Promise<TestCase[]> => {
  try {
    // Essayer différentes variations de mode
    let apiMode: string = mode;
    if (mode === "automation") {
      apiMode = "Automation"; // Avec majuscule
    } else if (mode === "manual") {
      apiMode = "Manual"; // Avec majuscule
    }

    const url = `/getAllTestCases/${QA_TOUCH_CONFIG.projectKey}?mode=${apiMode}`;
    const response = await axios.get(url, { headers, timeout: 10000 });

    const data = response.data;

    if (data.data && Array.isArray(data.data)) {
      return data.data.map(
        (item: any) =>
          ({
            id: item.case_key || item.id,
            caseKey: item.case_key || item.id,
            title:
              item.case_title || item.title || `Test Case ${item.case_key}`,
            description: item.description || item.case_description,
            mode: mode,
            moduleKey: item.module_key,
            moduleName: item.module_name,
            sectionKey: item.section_key,
            sectionName: item.section_name,
            status: item.status || "active",
            priority: item.priority || "medium",
            estimate: item.estimate || 0,
            reference: item.reference,
            precondition: item.precondition,
            createdDate: item.created_date || item.created_at,
            updatedDate: item.updated_date || item.updated_at,
            assignedTo: item.assigned_to || item.assigned_user,
            tags: item.tags
              ? item.tags.split(",").map((tag: string) => tag.trim())
              : [],
            customFields: item.custom_fields || {},
          } as TestCase)
      );
    }

    return [];
  } catch (error: any) {
    throw new Error(`Erreur API: ${error.message}`);
  }
};

// Calculer les statistiques des cas de tests
export const calculateTestCaseStats = (
  testCases: TestCase[]
): TestCaseStats => {
  const stats: TestCaseStats = {
    total: testCases.length,
    automated: testCases.filter((tc) => tc.mode === "automation").length,
    manual: testCases.filter((tc) => tc.mode === "manual").length,
    byModule: {},
    byStatus: {},
    byPriority: {},
  };

  // Statistiques par module
  testCases.forEach((tc) => {
    const moduleName = tc.moduleName || "Sans module";
    if (!stats.byModule[moduleName]) {
      stats.byModule[moduleName] = { total: 0, automated: 0, manual: 0 };
    }
    stats.byModule[moduleName].total++;
    if (tc.mode === "automation") {
      stats.byModule[moduleName].automated++;
    } else {
      stats.byModule[moduleName].manual++;
    }
  });

  // Statistiques par statut
  testCases.forEach((tc) => {
    const status = tc.status || "unknown";
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
  });

  // Statistiques par priorité
  testCases.forEach((tc) => {
    const priority = tc.priority || "unknown";
    stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
  });

  return stats;
};

// Test de connectivité de l'API
export const testAPIConnectivity = async (): Promise<{
  success: boolean;
  message: string;
  workingUrl?: string;
}> => {
  const testUrl = `/getAllTestCases/${QA_TOUCH_CONFIG.projectKey}`;

  try {
    await axios.get(testUrl, {
      headers,
      timeout: 10000,
    });

    return {
      success: true,
      message: "API QA Touch accessible pour les cas de tests",
      workingUrl: testUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Erreur de connectivité: ${error.message}`,
    };
  }
};
