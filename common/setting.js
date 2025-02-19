import Vue from 'vue';

const detail = (key) => {
    return Vue.prototype.$u.get(`setting/detail/${key}`);
}

const update = (params) => {
    return Vue.prototype.$u.put('setting/update', params);
}

const base_info  = (params) => {
    return Vue.prototype.$u.get('setting/base_info', params);
}

export default {
    detail,
    update,
    base_info
};
