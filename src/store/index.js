import Vue from 'vue'
import Vuex from 'vuex'
import { mutations } from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const state = {
    web3: null,
    isLoggedIn: !!localStorage.getItem('token'),
    primaryAccount: {
        address: null,
        role: null,
        balance: null
    }
}

const getters = {
    isLoggedIn: state => {
        return state.isLoggedIn
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})