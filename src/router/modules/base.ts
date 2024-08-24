export default [
  {
		path: '',
		name: '',
    redirect: 'index',
		// component: () => import('@/layout/index.vue'),
		children: [
      {
        path: 'baseList',
        name: 'baseList',
        component: () => import('@/views/baseList.vue'),
      },
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/index.vue'),
      },
      {
        path: 'heatMap',
        name: 'heatMap',
        component: () => import('@/views/heatMap.vue'),
      },
    ]
  }
]

