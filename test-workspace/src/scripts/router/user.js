const UserIndex = () => import('../views/user/index');
const UserList = () => import('../views/user/list');
const UserCreate = () => import('../views/user/create');
const UserDetail = () => import('../views/user/detail');

let userRoutes = [
  {
    path: '/user',
    name: 'user',
    component: UserIndex,
    redirect: '/user/list',
    children: [
      {
        path: 'list',
        name: 'user.list',
        component: UserList
      },
      {
        path: 'create',
        name: 'user.create',
        component: UserCreate
      },
      {
        path: ':id/edit',
        name: 'user.edit',
        component: UserDetail
      }
    ]
  }
];

export default userRoutes;
