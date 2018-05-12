import Vue from 'vue'
import App from './App.vue'
import Hospital from './orcale/hospital'
import store from './store'
import router from './router'
import socketio from 'socket.io-client';
import VueSocketio from 'vue-socket.io';

export const socketInstance = socketio('http://localhost:4000');
Vue.use(VueSocketio, socketInstance);

Object.defineProperty(Vue.prototype, '$Hospital', {value: Hospital})

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})


