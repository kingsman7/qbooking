export default {
  categories: {
    permission: 'ibooking.categories.manage',
    activated: true,
    authenticated: true,
    path: '/booking/categories/index',
    name: 'qbooking.admin.categories',
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
    name: 'qbooking.admin.services',
    crud: import('@imagina/qbooking/_crud/services'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qbooking.sidebar.adminServices',
    icon: 'fas fa-concierge-bell',
    subHeader: {
      refresh: true,
    }
  },
  resources: {
    permission: 'ibooking.resources.manage',
    activated: true,
    authenticated: true,
    path: '/booking/resources/index',
    name: 'qbooking.admin.resources',
    crud: import('@imagina/qbooking/_crud/resources'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qbooking.sidebar.adminResources',
    icon: 'fas fa-chess-knight',
    subHeader: {
      refresh: true,
    }
  }
}
