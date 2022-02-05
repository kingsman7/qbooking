export default {
  categories: {
    permission: 'ibooking.categories.manage',
    activated: true,
    authenticated: true,
    path: '/booking/categories/index',
    name: 'qbooking.main.categories',
    crud: import('@imagina/qbooking/_crud/categories'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qbooking.sidebar.adminCategories',
    icon: 'fas fa-layer-group',
    subHeader: {
      refresh: true,
    }
  },
  services: {
    permission: 'ibooking.services.manage',
    activated: true,
    authenticated: true,
    path: '/booking/services/index',
    name: 'qbooking.main.services',
    crud: import('@imagina/qbooking/_crud/services'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qbooking.sidebar.adminServices',
    icon: 'fas fa-concierge-bell',
    subHeader: {
      refresh: true,
    }
  },
  reservations: {
    permission: 'ibooking.reservations.manage',
    activated: true,
    authenticated: true,
    path: '/booking/reservations/index',
    name: 'qbooking.panel.reservations.index',
    page: () => import('@imagina/qbooking/_pages/main/reservations'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qbooking.sidebar.panelReservations',
    icon: 'fas fa-tasks',
    subHeader: {
      refresh: true,
    }
  },
  newReservation: {
    permission: 'ibooking.reservations.create',
    activated: true,
    authenticated: true,
    path: '/booking/reservations/create',
    name: 'qbooking.panel.reservations.create',
    page: () => import('@imagina/qbooking/_pages/panel/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qbooking.sidebar.panelNewReservation',
    icon: 'fas fa-tasks',
    subHeader: {
      refresh: true,
    }
  }
}
