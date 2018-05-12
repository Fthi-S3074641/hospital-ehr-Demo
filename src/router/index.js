import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from './../components/Register'
import Dashboard from './../components/Dashboard'
import Login from './../components/Login'

import Permissions from './../components/Medical/Permissions'
import Billing from './../components/Medical/Billing'
import Data from './../components/Medical/Data'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            children: [
                {
                path: 'permissions',
                name: 'permissions',
                component: Permissions
                },
                {
                    path: 'billing',
                    name: 'billing',
                    component: Billing
                },
                {
                    path: 'data',
                    name: 'data',
                    component: Data
                }
        ]
        }
    ]
})