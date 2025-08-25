// Statuts QA Touch avec leurs IDs et couleurs
export enum QATouchStatus {
  Passed = 'Passed',
  Failed = 'Failed',
  Retest = 'Retest',
  Untested = 'Untested',
  Blocked = 'Blocked',
  InProgress = 'In Progress',
  NotApplicable = 'Not Applicable'
}

// Mapping des statuts avec leurs propriétés d'affichage
export const QA_TOUCH_STATUS_CONFIG = {
  [QATouchStatus.Passed]: {
    id: 1,
    label: 'Réussi',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: '✅',
    description: 'Test passé avec succès'
  },
  [QATouchStatus.Failed]: {
    id: 5,
    label: 'Échoué',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '❌',
    description: 'Test qui a échoué'
  },
  [QATouchStatus.Retest]: {
    id: 4,
    label: 'À Retester',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: '🔄',
    description: 'Test nécessitant un retest'
  },
  [QATouchStatus.Untested]: {
    id: 2,
    label: 'Non Testé',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: '⏸️',
    description: 'Test pas encore exécuté'
  },
  [QATouchStatus.Blocked]: {
    id: 3,
    label: 'Bloqué',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: '⚠️',
    description: 'Test bloqué temporairement'
  },
  [QATouchStatus.InProgress]: {
    id: 6,
    label: 'En Cours',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: '🔄',
    description: 'Test en cours d\'exécution'
  },
  [QATouchStatus.NotApplicable]: {
    id: 7,
    label: 'Non Applicable',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: '⏭️',
    description: 'Test non applicable'
  }
};

// Fonction utilitaire pour obtenir la configuration d'un statut
export const getStatusConfig = (status: string) => {
  const normalizedStatus = status as QATouchStatus;
  return QA_TOUCH_STATUS_CONFIG[normalizedStatus] || QA_TOUCH_STATUS_CONFIG[QATouchStatus.Untested];
};

// Fonction pour normaliser les statuts de l'API
export const normalizeStatus = (apiStatus: string): QATouchStatus => {
  const statusMap: Record<string, QATouchStatus> = {
    'passed': QATouchStatus.Passed,
    'Passed': QATouchStatus.Passed,
    'failed': QATouchStatus.Failed,
    'Failed': QATouchStatus.Failed,
    'retest': QATouchStatus.Retest,
    'Retest': QATouchStatus.Retest,
    'untested': QATouchStatus.Untested,
    'Untested': QATouchStatus.Untested,
    'blocked': QATouchStatus.Blocked,
    'Blocked': QATouchStatus.Blocked,
    'in progress': QATouchStatus.InProgress,
    'In Progress': QATouchStatus.InProgress,
    'not applicable': QATouchStatus.NotApplicable,
    'Not Applicable': QATouchStatus.NotApplicable
  };
  
  return statusMap[apiStatus] || QATouchStatus.Untested;
};
