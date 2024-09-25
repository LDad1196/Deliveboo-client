import { createRouter, createWebHistory } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppHome from './views/AppHome.vue';
import AppMenu from './views/AppMenu.vue';
import AppCart from './views/AppCart.vue';
import AppThankYouPage from './views/AppThankYouPage.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [

        {
            path: '/',
            name: 'home',
            component: AppHome
        },
        {
            path: '/restaurants/:restaurant_slug/menu',
            name: 'menu',
            component: AppMenu
        },
        {
            path: '/http://127.0.0.1:8000/register',
            name: 'login',
            component: AppHeader
        },
        {
            path: '/cart',
            name: 'AppCart',
            component: AppCart,
        },
        {
            path: '/thank-you',
            name: 'thank-you',
            component: AppThankYouPage, 
        },

    ]
});

export { router };