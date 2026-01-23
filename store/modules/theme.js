const state = {
	currentTheme: uni.getStorageSync('currentTheme') || 'default'
}

const mutations = {
	SET_THEME(state, theme) {
		state.currentTheme = theme
		uni.setStorageSync('currentTheme', theme)
	}
}

const getters = {
	currentTheme: state => state.currentTheme
}

const actions = {
	setTheme({ commit }, theme) {
		commit('SET_THEME', theme)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	getters,
	actions
}