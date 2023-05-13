import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

import Movies from '../views/Movies.vue';
import Login from '../views/Login.vue';
import Movie from '../views/Movie.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/movie/:id',
    name: 'Movie',
    component: Movie,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
