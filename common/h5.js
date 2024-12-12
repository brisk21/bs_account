import Vue from 'vue';

const check = (params) => {
    return Vue.prototype.$u.get('wap/check', params);
};
const detail = (params) => {
    return Vue.prototype.$u.get('wap/detail', params);
};


export default {
    check,
    detail
};
