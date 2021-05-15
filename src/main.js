import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import Home from './components/Home.vue';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';
import Search from './components/Search.vue';

import axios from 'axios';

const routes = [
    {
        path: '/',
        component: Home,
        name: 'home',
    },
    {
        path: '/register',
        component: Register,
        name: 'register',
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
    },
    {
        path: '/profile/:userId(\\d+)',
        component: Profile,
        name: 'profile',
        props: (route) => {
            return {viewingUserId: parseInt(route.params.userId, 10)}
        },
    },
    {
        path: '/search/:queryString',
        component: Search,
        name: 'search',
        props: (route) => {
            return {queryString: route.params.queryString}
        },
    },
    {
        path: '/search',
        component: Search,
        name: 'searchEmpty',
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.axios = axios;
app.mount('#app');
