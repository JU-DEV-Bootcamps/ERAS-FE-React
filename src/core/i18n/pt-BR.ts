import type { Translation } from './en';

// Brazilian Portuguese texts of ERAS v3. Same keys as en.ts.
export const ptBR: Translation = {
  app: {
    name: 'ERAS',
  },
  home: {
    loading: 'Carregando…',
    overview: {
      title: 'Visão geral',
      error: 'Não foi possível carregar os números principais.',
      lastUpdated: 'Última atualização: {{when}}',
      justNow: 'Agora mesmo',
      secondsAgo: 'há {{count}} s',
      minutesAgo: 'há {{count}} min',
      increase: 'Aumento',
      decrease: 'Diminuição',
      students: {
        title: 'Número de estudantes',
        tooltip:
          'Número de estudantes matriculados no período atual de 6 meses, comparado com o mesmo período do ciclo anterior.',
      },
      polls: {
        title: 'Pesquisas respondidas',
        tooltip:
          'Total de pesquisas respondidas pelos estudantes. A % de variação compara o período atual de 6 meses com o período anterior equivalente.',
      },
      evaluations: {
        title: 'Avaliações',
        tooltip:
          'Total de avaliações realizadas. A % de variação compara o período atual de 6 meses com o período anterior equivalente.',
      },
    },
    recentAlerts: {
      title: 'Alertas recentes',
      error: 'Não foi possível carregar os alertas recentes.',
      viewAll: 'Ver todos',
      empty: 'Nenhum dado disponível.',
      studentId: 'ID do estudante',
      studentName: 'Nome do estudante',
      riskLevel: 'Nível de risco',
      category: 'Categoria',
      date: 'Data',
      status: 'Status',
      risk: {
        Low: 'Baixo',
        Medium: 'Médio',
        High: 'Alto',
      },
      statuses: {
        Pending: 'Pendente',
        Ready: 'Pronta',
        InProgress: 'Em andamento',
        Completed: 'Concluída',
        Uncompleted: 'Incompleta',
        default: 'Nova',
      },
    },
    connectedServices: {
      title: 'Serviços conectados',
      error: 'Não foi possível carregar os serviços conectados.',
      provider: 'Serviço: {{name}}',
      createdBy: 'Criado por: {{name}}',
      active: 'ATIVO',
      inactive: 'INATIVO',
    },
  },
  accessDenied: {
    title: 'Acesso negado',
    message: 'Você não tem permissão para abrir esta página.',
  },
  notFound: {
    title: 'Página não encontrada',
    message: 'A página que você procura não existe.',
  },
  shell: {
    logout: 'Sair',
    logoAlt: 'ERAS',
    menuLabel: 'Menu principal',
    openMenu: 'Abrir menu',
    userMenu: 'Menu do usuário',
    menu: {
      home: 'Início',
    },
    titles: {
      home: 'Início',
    },
    roles: {
      administrator: 'Administrador do ERAS',
      officer: 'Oficial de Serviços Estudantis do ERAS',
      professional: 'Profissional do ERAS',
      guest: 'Convidado',
    },
  },
};
