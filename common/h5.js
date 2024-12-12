import Vue from 'vue';

const check = (params) => {
    return Vue.prototype.$u.get('wap/check', params);
};



export default {
    check,
};
