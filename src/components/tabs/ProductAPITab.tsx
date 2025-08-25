// @ts-nocheck
import React, { useState } from "react";
import {
  Settings,
  Database,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  RefreshCw,
} from "lucide-react";

const ProductAPITab: React.FC = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");

  // Fonction pour gérer la sélection d'attribut avec validation des channels
  const handleAttributeSelection = (attributeId: string) => {
    setSelectedAttribute(attributeId);

    // Attributs incompatibles avec certains channels
    const incompatibleAttributes = [
      "pdt",
      "new",
      "flashsale",
      "launchprice",
      "anim-promo",
      "destockage",
      "bestPrice",
      "discount",
      "packaging",
      "up-sell",
    ];

    // Si un attribut incompatible est sélectionné et qu'un channel incompatible est sélectionné, le désélectionner
    if (
      incompatibleAttributes.includes(attributeId) &&
      selectedLocal &&
      ["BERNARD BE", "BERNARD FR", "JPG", "MONDOFFICE", "KALAMAZOO"].includes(
        selectedLocal
      )
    ) {
      setSelectedLocal("");
    }
  };

  // Fonction pour gérer la sélection de channel avec validation des attributs
  const handleLocalSelection = (localCode: string) => {
    setSelectedLocal(localCode);

    // Attributs incompatibles avec certains channels
    const incompatibleAttributes = [
      "pdt",
      "new",
      "flashsale",
      "launchprice",
      "anim-promo",
      "destockage",
      "bestPrice",
      "discount",
      "packaging",
      "up-sell",
    ];

    // Si un channel incompatible est sélectionné et qu'un attribut incompatible est sélectionné, le désélectionner
    if (
      ["BERNARD BE", "BERNARD FR", "JPG", "MONDOFFICE", "KALAMAZOO"].includes(
        localCode
      ) &&
      selectedAttribute &&
      incompatibleAttributes.includes(selectedAttribute)
    ) {
      setSelectedAttribute("");
    }
  };
  const [selectedLocal, setSelectedLocal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  // const [expandedSections] = useState<{
  //   [key: string]: boolean;
  // }>({
  //   environments: true,
  //   channels: true,
  //   attributes: false,
  // });

  // Environnements disponibles
  const environments = [
    {
      id: "test-edit1",
      name: "TEST-EDIT1",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "test-edit2",
      name: "TEST-EDIT2",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "test-live",
      name: "TEST-LIVE",
      color: "bg-orange-100 text-orange-800",
    },
    { id: "uat-edit1", name: "UAT-EDIT1", color: "bg-blue-100 text-blue-800" },
    { id: "uat-live", name: "UAT-LIVE", color: "bg-blue-100 text-blue-800" },
    {
      id: "prod-edit2",
      name: "PROD-EDIT2",
      color: "bg-green-100 text-green-800",
    },
    { id: "prod", name: "PROD", color: "bg-red-100 text-red-800" },
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
      category: "Disponibilité",
      icon: "✅",
    },
    {
      id: "new",
      name: "new",
      description: "Renvoie un SKU de type nouveau",
      category: "Disponibilité",
      icon: "🆕",
    },
    {
      id: "unavailable",
      name: "unavailable",
      description: "Renvoie un SKU de type indisponible",
      category: "Disponibilité",
      icon: "❌",
    },
    {
      id: "flashsale",
      name: "flashsale",
      description: "Renvoie un SKU (exclu au RAJAGROUP)",
      category: "Promotions",
      icon: "⚡",
    },
    {
      id: "launchprice",
      name: "launchprice",
      description: "Renvoie un SKU (exclu au RAJAGROUP)",
      category: "Promotions",
      icon: "🚀",
    },
    {
      id: "anim-promo",
      name: "anim-promo",
      description: "Renvoie un SKU (exclu au RAJAGROUP)",
      category: "Promotions",
      icon: "🎯",
    },
    {
      id: "destockage",
      name: "destockage",
      description: "Renvoie un SKU de type DESTOCKAGE",
      category: "Promotions",
      icon: "📦",
    },
    {
      id: "bestPrice",
      name: "bestPrice",
      description: "Renvoie un SKU de type BEST-PRICE",
      category: "Promotions",
      icon: "💰",
    },
    {
      id: "produitPartage",
      name: "produitPartage",
      description: "Renvoie un SKU de type PRODUIT-SOLIDAIRE",
      category: "Promotions",
      icon: "🤝",
    },
    {
      id: "price-degressive",
      name: "price-degressive",
      description: "Renvoie un SKU de type JUSQU'A -xx%",
      category: "Promotions",
      icon: "📉",
    },
    {
      id: "discount",
      name: "discount",
      description: "Renvoie un SKU en promotion (seulement FR)",
      category: "Promotions",
      icon: "🏷️",
    },
    {
      id: "ecotax_conai",
      name: "ecotax_conai",
      description: "La taxe conai est visible dans le panier",
      category: "Taxes",
      icon: "🌱",
    },
    {
      id: "ecotax",
      name: "ecotax",
      description: "Renvoie un SKU avec une taxe écologique",
      category: "Taxes",
      icon: "🌍",
    },
    {
      id: "pdt",
      name: "PDT",
      description: "Renvoie un PDT (exclu au RAJAGROUP)",
      category: "Produits",
      icon: "📋",
    },
    {
      id: "packaging",
      name: "packaging",
      description: "Renvoie un SKU avec son attribut PackagingLineLegacy",
      category: "Produits",
      icon: "📦",
    },
    {
      id: "Cross-sell",
      name: "Cross-sell",
      description:
        "Renvoie une SKU qui a un product link de type ES_CrossSelling",
      category: "Liens",
      icon: "🔗",
    },
    {
      id: "Bundle",
      name: "Bundle",
      description:
        "Renvoie une SKU qui a un product link de type BundlesProduct",
      category: "Liens",
      icon: "📦",
    },
    {
      id: "Unique-price",
      name: "Unique-price",
      description: "Renvoie une SKU qui a un prix unique (un seul break)",
      category: "Prix",
      icon: "💲",
    },
    {
      id: "Non-unique-price",
      name: "Non-unique-price",
      description: "Renvoie une SKU qui a un prix dégressif (plusieurs breaks)",
      category: "Prix",
      icon: "📊",
    },
    {
      id: "InStock",
      name: "InStock",
      description: "Renvoie une SKU qui a une date de restock",
      category: "Stock",
      icon: "📦",
    },
    {
      id: "InStock20",
      name: "InStock20",
      description: "Renvoie une SKU qui a une date de restock",
      category: "Stock",
      icon: "📦",
    },
    {
      id: "InStockRange2060",
      name: "InStockRange2060",
      description: "Renvoie une SKU qui a une date de restock",
      category: "Stock",
      icon: "📦",
    },
    {
      id: "InStock60",
      name: "InStock60",
      description: "Renvoie une SKU qui a une date de restock",
      category: "Stock",
      icon: "📦",
    },
    {
      id: "inDeliveryDays20",
      name: "inDeliveryDays20",
      description: "Renvoie une SKU qui a un jour de livraison",
      category: "Livraison",
      icon: "🚚",
    },
    {
      id: "inDeliveryDaysRange2060",
      name: "inDeliveryDaysRange2060",
      description: "Renvoie une SKU qui a un jour de livraison",
      category: "Livraison",
      icon: "🚚",
    },
    {
      id: "inDeliveryDays60",
      name: "inDeliveryDays60",
      description: "Renvoie une SKU qui a un jour de livraison",
      category: "Livraison",
      icon: "🚚",
    },
    {
      id: "installable_fee",
      name: "installable_fee",
      description: "Renvoie une SKU avec possibilité de frais d'installation",
      category: "Services",
      icon: "🔧",
    },
    {
      id: "up-sell",
      name: "up-sell",
      description: "Renvoie une SKU ajoutable par palette",
      category: "Services",
      icon: "📈",
    },
  ];

  // Grouper les attributs par catégorie
  // const groupedAttributes = attributes.reduce((acc, attr) => {
  //   if (!acc[attr.category]) {
  //     acc[attr.category] = [];
  //   }
  //   acc[attr.category].push(attr);
  //   return acc;
  // }, {} as { [key: string]: typeof attributes });

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
        return `https://www.bernard.be/INTERSHOP/rest/WFS/RAJA-BERNARDBE-Site/-/product?attribute=${selectedAttribute}`;
      } else if (selectedLocal === "BERNARD FR") {
        return `https://www.bernard.fr/INTERSHOP/rest/WFS/RAJA-BERNARDFR-Site/-/product?attribute=${selectedAttribute}`;
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

  // Copier l'URI
  const copyURI = async () => {
    const uri = buildURI();
    if (uri) {
      await navigator.clipboard.writeText(uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Toggle section - Commenté car non utilisé
  // const toggleSection = (section: string) => {
  //   setExpandedSections((prev) => ({
  //     ...prev,
  //     [section]: !prev[section],
  //   }));
  // };

  const uri = buildURI();
  const isFormComplete =
    selectedEnvironment && selectedAttribute && selectedLocal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product API</h1>
              <p className="text-gray-600">
                Testez et explorez les APIs de produits RAJA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Configuration Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Configuration API
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isFormComplete
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isFormComplete ? "✓ Prêt" : "⏳ Configuration requise"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Environnements */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Environnements
              </h3>

              <div className="flex flex-wrap gap-2">
                {environments.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setSelectedEnvironment(env.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedEnvironment === env.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {env.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Attributs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Attributs</h3>

              <div className="flex flex-wrap gap-2">
                {attributes.map((attr) => {
                  // Attributs incompatibles avec certains channels
                  const incompatibleAttributes = [
                    "pdt",
                    "new",
                    "flashsale",
                    "launchprice",
                    "anim-promo",
                    "destockage",
                    "bestPrice",
                    "discount",
                    "packaging",
                    "up-sell",
                  ];

                  // Désactiver certains attributs si un channel incompatible est sélectionné
                  const isDisabled =
                    selectedLocal &&
                    [
                      "BERNARD BE",
                      "BERNARD FR",
                      "JPG",
                      "MONDOFFICE",
                      "KALAMAZOO",
                    ].includes(selectedLocal) &&
                    incompatibleAttributes.includes(attr.id);

                  return (
                    <button
                      key={attr.id}
                      onClick={() =>
                        !isDisabled && handleAttributeSelection(attr.id)
                      }
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isDisabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : selectedAttribute === attr.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      title={
                        isDisabled
                          ? "Non disponible avec ce channel"
                          : attr.description
                      }
                    >
                      {attr.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Channels */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Channels</h3>

              <div className="flex flex-wrap gap-2">
                {locals.map((local) => {
                  // Attributs incompatibles avec certains channels
                  const incompatibleAttributes = [
                    "pdt",
                    "new",
                    "flashsale",
                    "launchprice",
                    "anim-promo",
                    "destockage",
                    "bestPrice",
                    "discount",
                    "packaging",
                    "up-sell",
                  ];

                  // Désactiver certains channels si un attribut incompatible est sélectionné
                  const isDisabled =
                    incompatibleAttributes.includes(selectedAttribute) &&
                    [
                      "BERNARD BE",
                      "BERNARD FR",
                      "JPG",
                      "MONDOFFICE",
                      "KALAMAZOO",
                    ].includes(local.code);

                  return (
                    <button
                      key={local.code}
                      onClick={() =>
                        !isDisabled && handleLocalSelection(local.code)
                      }
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isDisabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : selectedLocal === local.code
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      title={
                        isDisabled ? "Non disponible avec cet attribut" : ""
                      }
                    >
                      {local.code} ({local.country.toUpperCase()})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* URI construite */}
            {uri && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      URI construite
                    </span>
                  </div>
                  <button
                    onClick={copyURI}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-all duration-200 ${
                      copied
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-sm">Copier</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-300">
                  <code className="text-sm text-gray-800 break-all">{uri}</code>
                </div>
              </div>
            )}

            {/* Bouton d'appel */}
            <div className="text-center pt-4">
              <button
                onClick={callAPI}
                disabled={!isFormComplete || isLoading}
                className={`inline-flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                  isFormComplete && !isLoading
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Appel en cours...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Appeler l'API
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="text-lg font-semibold text-red-800">Erreur</h4>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">
                    Résultats ({products.length} produits)
                  </h3>
                </div>
                <button
                  onClick={() => setProducts([])}
                  className="flex items-center space-x-2 px-3 py-1 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Effacer</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, index) => (
                  <div
                    key={
                      product.id || product.sku || product.productId || index
                    }
                    className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-300 hover:-translate-y-1"
                  >
                    {/* Badge de type */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {product.type || "Produit"}
                      </span>
                    </div>

                    {/* Contenu principal */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900 text-base pr-16">
                        {product.sku || product.name || `SKU ${index + 1}`}
                      </h5>

                      {product.sku && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 text-sm">🏷️</span>
                            <code className="text-sm font-mono text-gray-700 break-all">
                              {product.sku}
                            </code>
                          </div>
                        </div>
                      )}

                      {/* Informations supplémentaires */}
                      {product.price && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">💰</span>
                          <span className="font-medium text-gray-900">
                            {product.price}
                          </span>
                        </div>
                      )}

                      {product.availability && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">📦</span>
                          <span className="font-medium text-gray-900">
                            {product.availability}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Overlay au hover */}
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAPITab;
