// @ts-nocheck
import React, { useState } from "react";
import { Search } from "lucide-react";

const ProductAPITab: React.FC = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [selectedLocal, setSelectedLocal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Environnements disponibles
  const environments = [
    { id: "test-edit1", name: "TEST-EDIT1" },
    { id: "test-edit2", name: "TEST-EDIT2" },
    { id: "test-live", name: "TEST-LIVE" },
    { id: "uat-edit1", name: "UAT-EDIT1" },
    { id: "uat-live", name: "UAT-LIVE" },
    { id: "prod-edit2", name: "PROD-EDIT2" },
    { id: "prod", name: "PROD" },
  ];

  // Locaux disponibles avec leurs pays correspondants (seulement ceux avec URLs réelles)
  const locals = [
    { code: "MONDOFFICE", country: "it" },
    { code: "KALAMAZOO", country: "es" },
    { code: "BERNARD BE", country: "be" },
    { code: "BERNARD FR", country: "fr" },
    { code: "JPG", country: "fr" },
    { code: "FR", country: "fr" },
    { code: "BE", country: "be" },
    { code: "NL", country: "nl" },
    { code: "DE", country: "de" },
    { code: "IT", country: "it" },
    { code: "ES", country: "es" },
    { code: "UK", country: "uk" },
    { code: "PL", country: "pl" },
    { code: "CZ", country: "cz" },
    { code: "SK", country: "sk" },
    { code: "HU", country: "hu" },
    { code: "CH", country: "ch" },
    { code: "SE", country: "se" },
    { code: "PT", country: "pt" },
    { code: "NO", country: "no" },
    { code: "AT", country: "at" },
    { code: "DK", country: "dk" },
  ];

  // Attributs disponibles
  const attributes = [
    {
      id: "available",
      name: "available",
      description: "Renvoie un SKU de type disponible",
    },
    {
      id: "new",
      name: "new",
      description: "Renvoie un SKU de type nouveau",
    },
    {
      id: "unavailable",
      name: "unavailable",
      description: "Renvoie un SKU de type indisponible",
    },
    {
      id: "flashsale",
      name: "flashsale",
      description: "Renvoie un SKU (exclu au RAJAGROUP)",
    },
    {
      id: "launchprice",
      name: "launchprice",
      description: "Renvoie un SKU (exclu au RAJAGROUP)",
    },
    {
      id: "anim-promo",
      name: "anim-promo",
      description: "Renvoie un SKU (exclu au RAJAGROUP)",
    },
    {
      id: "destockage",
      name: "destockage",
      description: "Renvoie un SKU de type DESTOCKAGE",
    },
    {
      id: "bestPrice",
      name: "bestPrice",
      description: "Renvoie un SKU de type BEST-PRICE",
    },
    {
      id: "produitPartage",
      name: "produitPartage",
      description: "Renvoie un SKU de type PRODUIT-SOLIDAIRE",
    },
    {
      id: "price-degressive",
      name: "price-degressive",
      description: "Renvoie un SKU de type JUSQU'A -xx%",
    },
    {
      id: "discount",
      name: "discount",
      description: "Renvoie un SKU en promotion (seulement FR)",
    },
    {
      id: "ecotax_conai",
      name: "ecotax_conai",
      description: "La taxe conai est visible dans le panier",
    },
    {
      id: "ecotax",
      name: "ecotax",
      description: "Renvoie un SKU avec une taxe écologique",
    },
    {
      id: "pdt",
      name: "PDT",
      description: "Renvoie un PDT (exclu au RAJAGROUP)",
    },
    {
      id: "packaging",
      name: "packaging",
      description: "Renvoie un SKU avec son attribut PackagingLineLegacy",
    },
    {
      id: "Cross-sell",
      name: "Cross-sell",
      description:
        "Renvoie une SKU qui a un product link de type ES_CrossSelling",
    },
    {
      id: "Bundle",
      name: "Bundle",
      description:
        "Renvoie une SKU qui a un product link de type BundlesProduct",
    },
    {
      id: "Unique-price",
      name: "Unique-price",
      description: "Renvoie une SKU qui a un prix unique (un seul break)",
    },
    {
      id: "Non-unique-price",
      name: "Non-unique-price",
      description: "Renvoie une SKU qui a un prix dégressif (plusieurs breaks)",
    },
    {
      id: "InStock",
      name: "InStock",
      description: "Renvoie une SKU qui a une date de restock",
    },
    {
      id: "InStock20",
      name: "InStock20",
      description: "Renvoie une SKU qui a une date de restock",
    },
    {
      id: "InStockRange2060",
      name: "InStockRange2060",
      description: "Renvoie une SKU qui a une date de restock",
    },
    {
      id: "InStock60",
      name: "InStock60",
      description: "Renvoie une SKU qui a une date de restock",
    },
    {
      id: "inDeliveryDays20",
      name: "inDeliveryDays20",
      description: "Renvoie une SKU qui a un jour de livraison",
    },
    {
      id: "inDeliveryDaysRange2060",
      name: "inDeliveryDaysRange2060",
      description: "Renvoie une SKU qui a un jour de livraison",
    },
    {
      id: "inDeliveryDays60",
      name: "inDeliveryDays60",
      description: "Renvoie une SKU qui a un jour de livraison",
    },
    {
      id: "installable_fee",
      name: "installable_fee",
      description: "Renvoie une SKU avec possibilité de frais d'installation",
    },
    {
      id: "up-sell",
      name: "up-sell",
      description: "Renvoie une SKU ajoutable par palette",
    },
  ];

  // Construire l'URI
  const buildURI = () => {
    if (!selectedEnvironment || !selectedAttribute || !selectedLocal) {
      return "";
    }

    const env = environments.find((e) => e.id === selectedEnvironment);
    const local = locals.find((l) => l.code === selectedLocal);

    if (!env || !local) return "";

    // Format spécial pour PROD
    if (selectedEnvironment === "prod") {
      // URLs PROD spéciales selon le local
      if (selectedLocal === "KALAMAZOO") {
        return `https://kalamazoo.es/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
      } else if (selectedLocal === "MONDOFFICE") {
        return `https://mondoffice.it/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
      } else if (selectedLocal === "BERNARD BE") {
        return `https://bernard.be/INTERSHOP/rest/WFS/RAJA-BERNARDBE-Site/-/product?attribute=${selectedAttribute}`;
      } else if (selectedLocal === "BERNARD FR") {
        return `https://bernard.fr/INTERSHOP/rest/WFS/RAJA-BERNARDFR-Site/-/product?attribute=${selectedAttribute}`;
      } else if (selectedLocal === "JPG") {
        return `https://www.jpg.fr/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
      } else {
        // Fallback pour les autres locaux - Sites RAJA selon le pays
        if (local.country === "be") {
          return `https://www.rajapack.be/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "nl") {
          return `https://www.rajapack.nl/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "de") {
          return `https://www.rajapack.de/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "it") {
          return `https://www.rajapack.it/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "es") {
          return `https://www.rajapack.es/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "uk") {
          return `https://www.rajapack.co.uk/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "pl") {
          return `https://www.rajapack.pl/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "cz") {
          return `https://www.rajapack.cz/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "sk") {
          return `https://www.rajapack.sk/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "hu") {
          return `https://www.rajapack.hu/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "ch") {
          return `https://www.rajapack.ch/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "se") {
          return `https://www.rajapack.se/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "pt") {
          return `https://www.rajapack.pt/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "no") {
          return `https://www.rajapack.no/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "at") {
          return `https://www.rajapack.at/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else if (local.country === "dk") {
          return `https://www.rajapack.dk/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        } else {
          // Fallback par défaut pour la France
          return `https://www.raja.fr/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
        }
      }
    }

    // Format spécial pour les locaux qui ont leur propre nom de domaine
    if (
      ["MONDOFFICE", "KALAMAZOO", "BERNARD BE", "BERNARD FR", "JPG"].includes(
        selectedLocal
      )
    ) {
      // Gérer les espaces dans les noms de locaux
      let localForURL = selectedLocal;
      let localForPath = selectedLocal;

      if (selectedLocal === "BERNARD BE") {
        localForURL = "bernard"; // Sans espace et sans BE
        localForPath = "BERNARDBE"; // Sans espace pour le path
      } else if (selectedLocal === "BERNARD FR") {
        localForURL = "bernard"; // Sans espace et sans FR
        localForPath = "BERNARDFR"; // Sans espace pour le path
      } else {
        localForURL = selectedLocal.toLowerCase();
        localForPath = selectedLocal;
      }

      const country = local.country;
      const environment = selectedEnvironment;
      return `https://www-${localForURL}-${country}-${environment}.raja-group.com/INTERSHOP/rest/WFS/RAJA-${localForPath}-Site/-/product?attribute=${selectedAttribute}`;
    }

    // Format général: https://www-raja-{country}-{environment}.raja-group.com
    const country = local.country;
    const environment = selectedEnvironment;

    return `https://www-raja-${country}-${environment}.raja-group.com/INTERSHOP/rest/WFS/RAJA-${selectedLocal}-Site/-/product?attribute=${selectedAttribute}`;
  };

  // Appeler l'API
  const callAPI = async () => {
    if (!selectedEnvironment || !selectedAttribute || !selectedLocal) {
      setError("Veuillez sélectionner tous les paramètres");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProducts([]);

    // Variables pour le timeout - déclarées ici pour être accessibles partout
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      const uri = buildURI();

      // Vrai appel API avec timeout pour éviter les boucles infinies
      timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes max

      const response = await fetch(uri, {
        method: "GET",
        signal: controller.signal,
        // Pas de headers personnalisés pour éviter les problèmes CORS
      });

      if (timeoutId) {
        clearTimeout(timeoutId); // Annuler le timeout si la réponse arrive
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erreur HTTP: ${response.status} - ${response.statusText}\nDétails: ${errorText}`
        );
      }

      // Vérifier le content-type avant de parser en JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textData = await response.text();

        // Essayer de parser en JSON quand même
        try {
          data = JSON.parse(textData);
        } catch (e) {
          data = { rawContent: textData, type: "text" };
        }
      }

      // Traitement de la réponse selon le format retourné
      let productsList = [];

      if (Array.isArray(data)) {
        // Vérifier si c'est un tableau de SKUs (chaînes) ou d'objets
        if (data.length > 0 && typeof data[0] === "string") {
          // Convertir les SKUs en objets produits
          productsList = data.map((sku, index) => ({
            id: index + 1,
            sku: sku,
            type: "SKU",
            source: "API Directe",
          }));
        } else {
          productsList = data;
        }
      } else if (data.products && Array.isArray(data.products)) {
        productsList = data.products;
      } else if (data.items && Array.isArray(data.items)) {
        productsList = data.items;
      } else if (data.data && Array.isArray(data.data)) {
        productsList = data.data;
      } else {
        productsList = [data];
      }

      setProducts(productsList);

      if (productsList.length === 0) {
        setError("Aucun produit trouvé pour ces critères");
      }
    } catch (err: any) {
      console.error("Erreur API:", err);

      if (err.name === "AbortError") {
        setError(
          "⏰ Timeout: L'API ne répond pas après 30 secondes. L'attribut 'unavailable' peut être trop lourd à traiter."
        );
      } else {
        setError(`Erreur lors de l'appel API: ${err.message}`);
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId); // Nettoyer le timeout
      }
      setIsLoading(false);
    }
  };

  const uri = buildURI();

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {/* Environnements - Chips cliquables */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Environnement
          </label>
          <div className="flex flex-wrap gap-2">
            {environments.map((env) => (
              <button
                key={env.id}
                onClick={() => setSelectedEnvironment(env.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedEnvironment === env.id
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {env.name}
              </button>
            ))}
          </div>
        </div>

        {/* Locaux - Chips cliquables */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Channel
          </label>
          <div className="flex flex-wrap gap-2">
            {locals.map((local) => (
              <button
                key={local.code}
                onClick={() => setSelectedLocal(local.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedLocal === local.code
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {local.code} ({local.country.toUpperCase()})
              </button>
            ))}
          </div>
        </div>

        {/* Attributs - Chips cliquables */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Attribute
          </label>
          <div className="flex flex-wrap gap-2">
            {attributes.map((attr) => (
              <button
                key={attr.id}
                onClick={() => setSelectedAttribute(attr.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedAttribute === attr.id
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={attr.description}
              >
                {attr.name}
              </button>
            ))}
          </div>
        </div>

        {/* URI construite */}
        {uri && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔗 URI construite
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={uri}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => navigator.clipboard.writeText(uri)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                title="Copier l'URI"
              >
                📋
              </button>
            </div>
          </div>
        )}

        {/* Bouton d'appel */}
        <div className="text-center">
          <button
            onClick={callAPI}
            disabled={
              !selectedEnvironment ||
              !selectedAttribute ||
              !selectedLocal ||
              isLoading
            }
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Appel en cours...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Appeler l'API
              </>
            )}
          </button>
        </div>
      </div>

      {/* Résultats */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-red-800 mb-2">
              ❌ Erreur
            </h4>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            📦 Produits retournés ({products.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div
                key={product.id || product.sku || product.productId || index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white hover:border-blue-300 group"
              >
                {/* En-tête de la carte */}
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-900 text-base">
                    {product.sku || product.name || `SKU ${index + 1}`}
                  </h5>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {product.type || "Produit"}
                  </span>
                </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-4">
                  {product.sku && (
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">🏷️</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </div>
                  )}

                  {/* Source supprimée pour simplifier l'interface */}
                </div>

                {/* Pas de boutons d'action - Interface simplifiée */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAPITab;
