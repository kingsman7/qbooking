export default {
  reservations: {
    permission: 'ibooking.reservations.manage',
    activated: true,
    authenticated: true,
    path: '/booking/reservations/index',
    name: 'qbooking.panel.reservations.index',
    crud: import('@imagina/qbooking/_crud/reservations'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
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
