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
import CreateEvent from './components/CreateEvent';

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
        path: '/profile',
        component: Profile,
        name: 'profile',
    },
    {
        path: '/search/:queryString',
        component: Search,
        name: 'search',
        props: (route) => {
            return { queryString: route.params.queryString };
        },
    },
    {
        path: '/search',
        component: Search,
        name: 'searchEmpty',
    },
    {
        path: '/search',
        component: Search,
        name: 'searchMyEvents',
    },
    {
        path: '/createEvent',
        component: CreateEvent,
        name: 'createEvent',
        props: true,
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
axios.defaults.baseURL = "http://152.67.96.30:4941/api/v1"
app.config.globalProperties.axios = axios;
app.mount('#app');
