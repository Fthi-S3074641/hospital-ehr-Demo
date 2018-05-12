import * as types from './mutation-types'

export const mutations = {
    [types.ADDWEB3] (state, web_payload) {
        state.web3 = web_payload
    },
    [types.LOGIN] (state, account_payload) {
        state.pending = true
        state.primaryAccount.address = account_payload[0]
        state.primaryAccount.role = account_payload[1]
        state.primaryAccount.balance = account_payload[2]
    },
    [types.LOGIN_SUCCESS] (state) {
        state.pending = false
        state.isLoggedIn = true
    },
    [types.LOGOUT] (state) {
        state.isLoggedIn = false
    }
}
