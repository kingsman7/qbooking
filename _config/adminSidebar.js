const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'qbooking.sidebar.adminGroup',
    icon: 'fas fa-vote-yea',
    children: [
      pages.mainqbooking.categories,
      pages.mainqbooking.services,
      pages.qbooking.resources,
      pages.mainqbooking.reservations
    ]
  },
]
