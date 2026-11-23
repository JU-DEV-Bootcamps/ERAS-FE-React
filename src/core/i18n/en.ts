// English texts of ERAS v3, the reference language: es.ts and pt-BR.ts have exactly the same keys.
// Keys are grouped by the screen or piece that shows them.
export const en = {
  app: {
    name: 'ERAS',
  },
  home: {
    loading: 'Loading…',
    overview: {
      title: 'Overview',
      error: 'The key figures could not be loaded.',
      lastUpdated: 'Last Updated: {{when}}',
      justNow: 'Just Now',
      secondsAgo: '{{count}}s ago',
      minutesAgo: '{{count}}m ago',
      increase: 'Increase',
      decrease: 'Decrease',
      students: {
        title: 'Number of Students',
        tooltip:
          'Number of students enrolled during the current 6-month period, compared to the same period last cycle.',
      },
      polls: {
        title: 'Polls Answered',
        tooltip:
          'Total polls answered by students. % Change compares the current 6-month period vs. the equivalent previous period.',
      },
      evaluations: {
        title: 'Evaluations',
        tooltip:
          'Total evaluations conducted. % Change compares the current 6-month period vs. the equivalent previous period.',
      },
    },
    recentAlerts: {
      title: 'Recent Alerts',
      error: 'The recent alerts could not be loaded.',
      viewAll: 'View All',
      empty: 'No data available.',
      studentId: 'Student Id',
      studentName: 'Student name',
      riskLevel: 'Risk Level',
      category: 'Category',
      date: 'Date',
      status: 'Status',
      risk: {
        Low: 'Low',
        Medium: 'Medium',
        High: 'High',
      },
      statuses: {
        Pending: 'Pending',
        Ready: 'Ready',
        InProgress: 'In Progress',
        Completed: 'Completed',
        Uncompleted: 'Uncompleted',
        default: 'New',
      },
    },
    connectedServices: {
      title: 'Connected Services',
      error: 'The connected services could not be loaded.',
      provider: 'Service: {{name}}',
      createdBy: 'Created by: {{name}}',
      active: 'ACTIVE',
      inactive: 'INACTIVE',
    },
  },
  accessDenied: {
    title: 'Access denied',
    message: 'You do not have permission to open this page.',
  },
  notFound: {
    title: 'Page not found',
    message: 'The page you are looking for does not exist.',
  },
  shell: {
    logout: 'Log out',
  },
};

/** The shape every language resource must have. */
export type Translation = typeof en;
