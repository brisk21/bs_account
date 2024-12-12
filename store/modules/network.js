const state = {
    isConnected: true, // 默认假设有网络连接
};

const mutations = {
    SET_IS_CONNECTED(state, isConnected) {
        state.isConnected = isConnected;
    },
};

const actions = {
    checkNetwork({commit}) {
        uni.getNetworkType({
            success: (res) => {
                const isConnected = res.networkType !== 'none';
                console.log('当前网络状态：', res.networkType);
                commit('SET_IS_CONNECTED', isConnected);
                if (!isConnected) {
                    // 处理无网络的情况，如显示提示信息等
                    uni.showToast({
                        title: '请检查网络是否连接正常',
                        icon: 'none'
                    });
                }
            }
        });
    },
    handleNetworkChange({commit}, res) {
        console.log('网络状态变化：', res);
        const isConnected = res.isConnected;

        if (isConnected && !state.isConnected) {
            // 网络恢复时的操作，比如重新加载数据、清除错误提示等
            uni.showToast({
                title: '网络已恢复',
                icon: 'none'
            });
        } else if (!isConnected) {
            // 网络断开时的操作，比如保存未完成的数据、显示错误提示等
            uni.showToast({
                title: '网络连接已断开',
                icon: 'none'
            });
        }
        commit('SET_IS_CONNECTED', isConnected);
    }
};

const getters = {
    isConnected: state => state.isConnected,
};

export default {
    namespaced: true, // 使用命名空间，避免不同模块间的冲突
    state,
    mutations,
    actions,
    getters,
};
