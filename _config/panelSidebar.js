const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'qbooking.sidebar.adminGroup',
    icon: 'fas fa-vote-yea',
    children: [
      pages.qbooking.reservations
    ]
  },
]
