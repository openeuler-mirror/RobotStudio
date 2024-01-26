const state = {
    loginUser: {
        id: -1,
        username: "",
        password: "",
        role: "",
        activateState: false
    },
    user: [
        {
            id: 1,
            username: "oridinary",
            password: "oridinary",
            role: "oridinary",
            activateState: false
        },
        {
            id: 2,
            username: "admin",
            password: "admin",
            role: "admin",
            activateState: false
        }
    ],
}
  
const getters = {
/**
 * 当前用户
 */
    getCurrentUser: state => {
        return state.loginUser
    },
    getUser: state=> {
        return state.loginUser
    }
}

const mutations = {
    setUser (state, user) {
        state.user.username = user.username
        state.user.password = user.password
        state.user.activateState = user.activateState
    },
    setUserState (state, user) {
        for (const index in state.user) {
            if (state.user[index].id === user.id) {
                state.user[index].activateState = user.userState
            }
        }
    },
    setLoginUser(state, user) {
        state.loginUser.id = user.id
        state.loginUser.username = user.username
        state.loginUser.password = user.password
        state.loginUser.role = user.role
        state.loginUser.activateState = user.activateState
    }
}

export default {
namespaced: true,
state,
getters,
mutations
}
  