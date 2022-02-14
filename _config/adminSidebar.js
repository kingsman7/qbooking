const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'ibooking.cms.sidebar.adminGroup',
    icon: 'fas fa-vote-yea',
    children: [
      pages.mainqbooking.categories,
      pages.mainqbooking.services,
      pages.qbooking.resources,
      pages.mainqbooking.reservations
    ]
  },
]
