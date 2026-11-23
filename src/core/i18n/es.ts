import type { Translation } from './en';

// Neutral Spanish texts of ERAS v3 (formal "usted", no regional words). Same keys as en.ts.
export const es: Translation = {
  app: {
    name: 'ERAS',
  },
  home: {
    loading: 'Cargando…',
    overview: {
      title: 'Resumen',
      error: 'No se pudieron cargar las cifras clave.',
      lastUpdated: 'Última actualización: {{when}}',
      justNow: 'Justo ahora',
      secondsAgo: 'hace {{count}} s',
      minutesAgo: 'hace {{count}} min',
      increase: 'Aumento',
      decrease: 'Disminución',
      students: {
        title: 'Número de estudiantes',
        tooltip:
          'Número de estudiantes matriculados en el período actual de 6 meses, comparado con el mismo período del ciclo anterior.',
      },
      polls: {
        title: 'Encuestas respondidas',
        tooltip:
          'Total de encuestas respondidas por los estudiantes. El % de cambio compara el período actual de 6 meses con el período anterior equivalente.',
      },
      evaluations: {
        title: 'Evaluaciones',
        tooltip:
          'Total de evaluaciones realizadas. El % de cambio compara el período actual de 6 meses con el período anterior equivalente.',
      },
    },
    recentAlerts: {
      title: 'Alertas recientes',
      error: 'No se pudieron cargar las alertas recientes.',
      viewAll: 'Ver todas',
      empty: 'No hay datos disponibles.',
      studentId: 'ID del estudiante',
      studentName: 'Nombre del estudiante',
      riskLevel: 'Nivel de riesgo',
      category: 'Categoría',
      date: 'Fecha',
      status: 'Estado',
      risk: {
        Low: 'Bajo',
        Medium: 'Medio',
        High: 'Alto',
      },
      statuses: {
        Pending: 'Pendiente',
        Ready: 'Lista',
        InProgress: 'En curso',
        Completed: 'Completada',
        Uncompleted: 'Incompleta',
        default: 'Nueva',
      },
    },
    connectedServices: {
      title: 'Servicios conectados',
      error: 'No se pudieron cargar los servicios conectados.',
      provider: 'Servicio: {{name}}',
      createdBy: 'Creado por: {{name}}',
      active: 'ACTIVO',
      inactive: 'INACTIVO',
    },
  },
  accessDenied: {
    title: 'Acceso denegado',
    message: 'No tiene permiso para abrir esta página.',
  },
  notFound: {
    title: 'Página no encontrada',
    message: 'La página que busca no existe.',
  },
  shell: {
    logout: 'Cerrar sesión',
  },
};
