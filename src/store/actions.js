import * as types from './mutation-types'

export const addWeb3 = ({commit}, web_payload) => {
    commit(types.ADDWEB3, web_payload)
}

export const logIn = ({commit}, account_payload) => {
    commit(types.LOGIN, account_payload)
    return new Promise(resolve => {
        setTimeout(() => {
            localStorage.setItem('token', 'JWT')
            commit(types.LOGIN_SUCCESS)
            resolve()
        }, 1000)
    });
}

export const logOut = ({commit}) => {
    return new Promise(resolve => {
        setTimeout(() => {
            localStorage.removeItem('token')
            commit(types.LOGOUT)
            resolve()
        }, 1000)
    });

}