const Home = () => import('../views/home');
const About = () => import('../views/about');
const NotFound = () => import('../views/not-found');

let baseRoutes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    alias: '/'
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '*',
    component: NotFound
  }
];

export default baseRoutes;
