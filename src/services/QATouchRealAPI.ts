import axios from "axios";
import { TestRun, QA_TOUCH_CONFIG } from "../types/TestRun";

// Headers d'authentification selon la documentation officielle QA Touch
const headers = {
  domain: QA_TOUCH_CONFIG.domain,
  "api-token": QA_TOUCH_CONFIG.apiToken,
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Fonction pour extraire le contexte du nom du test run
const extractContext = (name: string) => {
  if (!name) return "Unknown";

  // Chercher [XXX] ou (XXX) - extraire tout le contenu entre crochets
  const bracketsMatch = name.match(/[[(]([^[\]()]+)[\])]/i);
  if (bracketsMatch) return bracketsMatch[1].trim().toUpperCase();

  // Chercher des mots-clés spécifiques avec leurs logos
  if (name.toLowerCase().includes("jpg")) return "JPG";
  if (name.toLowerCase().includes("raja")) return "Raja";
  if (name.toLowerCase().includes("kalamazoo")) return "KALAMAZOO";
  if (name.toLowerCase().includes("bernard")) return "BERNARD";
  if (name.toLowerCase().includes("mondoffice")) return "MONDOFFICE";
  if (name.toLowerCase().includes("template")) return "TEMPLATE";

  // Chercher le premier mot en majuscules
  const wordMatch = name.match(/\b([A-Z]{2,10})\b/);
  if (wordMatch) return wordMatch[1];

  // Par défaut, prendre les 3 premiers caractères du nom
  return name.substring(0, 3).toUpperCase();
};

// Fonction principale pour récupérer tous les Test Runs
export const fetchAllTestRuns = async (): Promise<TestRun[]> => {
  try {
    // Récupérer toutes les pages de Test Runs
    let allTestRuns: any[] = [];
    let totalItems = 0;
    let perPage = 20;

    // Première page pour obtenir le total
    const firstPageUrl = `https://api.qatouch.com/api/v1/getAllTestRuns/${QA_TOUCH_CONFIG.projectKey}?page=1`;

    const firstResponse = await axios.get(firstPageUrl, {
      headers,
      timeout: 15000,
    });

    if (!firstResponse.data || !firstResponse.data.data) {
      return [];
    }

    // Récupérer les métadonnées
    const firstMeta = firstResponse.data.meta;
    totalItems = parseInt(firstMeta.total);
    perPage = parseInt(firstMeta.per_page);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalItems / perPage);

    // Ajouter la première page
    allTestRuns = [...firstResponse.data.data];

    // Récupérer les pages suivantes si nécessaire
    for (let page = 2; page <= totalPages; page++) {
      const pageUrl = `https://api.qatouch.com/api/v1/getAllTestRuns/${QA_TOUCH_CONFIG.projectKey}?page=${page}`;

      const pageResponse = await axios.get(pageUrl, {
        headers,
        timeout: 15000,
      });

      if (pageResponse.data && pageResponse.data.data) {
        allTestRuns = [...allTestRuns, ...pageResponse.data.data];
      }
    }

    // Maintenant récupérer les détails de chaque Test Run pour avoir les statistiques
    const detailedTestRuns: TestRun[] = [];
    const batchSize = 3; // Traiter par petits groupes pour éviter la surcharge

    for (let i = 0; i < allTestRuns.length; i += batchSize) {
      const batch = allTestRuns.slice(i, i + batchSize);

      const batchPromises = batch.map(async (item: any) => {
        try {
          const detailUrl = `https://api.qatouch.com/api/v1/getTestRundetails/${QA_TOUCH_CONFIG.projectKey}/${item.testrun_key}`;
          const testResultsUrl = `https://api.qatouch.com/api/v1/testRunResults/${QA_TOUCH_CONFIG.projectKey}/${item.testrun_key}`;

          const detailResponse = await axios.get(detailUrl, {
            headers,
            timeout: 10000,
          });

          // Essayer de récupérer les résultats de tests pour avoir des dates d'exécution
          let testResults = null;
          try {
            const testResultsResponse = await axios.get(testResultsUrl, {
              headers,
              timeout: 10000,
            });
            testResults = testResultsResponse.data;
          } catch (error: any) {
            // Gestion silencieuse des erreurs
          }

          if (
            detailResponse.data &&
            detailResponse.data.testrun_details_count
          ) {
            const details = detailResponse.data;
            const stats = details.testrun_details_count;

            // Traitement des données du TestRun

            // Essayer de trouver une vraie date d'exécution
            let lastExecutedDate =
              item["Updated Date"] || new Date().toISOString();

            if (
              testResults &&
              testResults.data &&
              testResults.data.length > 0
            ) {
              // Chercher la date la plus récente dans les résultats de tests
              const executionDates = testResults.data
                .filter(
                  (result: any) =>
                    result.executed_date ||
                    result.updated_at ||
                    result.created_at
                )
                .map(
                  (result: any) =>
                    result.executed_date ||
                    result.updated_at ||
                    result.created_at
                )
                .filter(Boolean);

              if (executionDates.length > 0) {
                // Prendre la date la plus récente
                const latestExecutionDate = executionDates.sort().pop();
                if (latestExecutionDate) {
                  lastExecutedDate = latestExecutionDate;
                }
              }
            }

            const testRun: TestRun = {
              id: item.testrun_key,
              context: extractContext(item.Name),
              name: item.Name || `Test Run ${item.testrun_key}`,
              status: item.Status || "not_run",
              totalTests: stats.Case_Count || 0,
              passedTests: stats.passed || 0,
              failedTests: stats.Failed || 0,
              skippedTests: stats["Not Applicable"] || 0,
              blockedTests: stats.Blocked || 0,
              retestTests: stats.retest || 0,
              notRunTests: stats.Untested || 0,
              inProgressTests: stats["In Progress"] || 0,
              automatedTests:
                item.Type === "specific" ? stats.Case_Count || 0 : 0,
              manualTests: item.Type === "manual" ? stats.Case_Count || 0 : 0,
              executionTime: 0, // Pas disponible dans l'API
              lastExecuted: lastExecutedDate,
              createdAt: item["Created Date"] || new Date().toISOString(),
              updatedAt: item["Updated Date"] || new Date().toISOString(),
            };

            return testRun;
          } else {
            // Retourner un TestRun basique si les détails ne sont pas disponibles
            return {
              id: item.testrun_key,
              context: extractContext(item.Name),
              name: item.Name || `Test Run ${item.testrun_key}`,
              status: item.Status || "not_run",
              totalTests: 0,
              passedTests: 0,
              failedTests: 0,
              skippedTests: 0,
              blockedTests: 0,
              retestTests: 0,
              notRunTests: 0,
              inProgressTests: 0,
              automatedTests: 0,
              manualTests: 0,
              executionTime: 0,
              lastExecuted: item["Updated Date"] || new Date().toISOString(),
              createdAt: item["Created Date"] || new Date().toISOString(),
              updatedAt: item["Updated Date"] || new Date().toISOString(),
            } as TestRun;
          }
        } catch (error: any) {
          // Retourner un TestRun basique en cas d'erreur
          return {
            id: item.testrun_key,
            context: extractContext(item.Name),
            name: item.Name || `Test Run ${item.testrun_key}`,
            status: item.Status || "not_run",
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            blockedTests: 0,
            retestTests: 0,
            notRunTests: 0,
            inProgressTests: 0,
            automatedTests: 0,
            manualTests: 0,
            executionTime: 0,
            lastExecuted: item["Updated Date"] || new Date().toISOString(),
            createdAt: item["Created Date"] || new Date().toISOString(),
            updatedAt: item["Updated Date"] || new Date().toISOString(),
          } as TestRun;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      detailedTestRuns.push(...batchResults);

      // Attendre un peu entre les batches pour éviter la surcharge
      if (i + batchSize < allTestRuns.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return detailedTestRuns;
  } catch (error: any) {
    throw new Error(`Erreur API: ${error.message}`);
  }
};

// Fonction pour vérifier la connectivité de l'API
export const testAPIConnectivity = async (): Promise<{
  success: boolean;
  message: string;
  workingUrl?: string;
}> => {
  // Tester l'endpoint officiel pour lister tous les Test Runs
  const testUrl = `https://api.qatouch.com/api/v1/getAllTestRuns/${QA_TOUCH_CONFIG.projectKey}`;

  try {
    await axios.get(testUrl, {
      headers,
      timeout: 10000,
    });

    return {
      success: true,
      message: "API QA Touch accessible",
      workingUrl: testUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Erreur de connectivité: ${error.message}`,
    };
  }
};
