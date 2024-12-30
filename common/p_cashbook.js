import Vue from 'vue';

export const get_list = (params) => {
    return Vue.prototype.$u.get('extend/cashbook/list', params);
};

export const get_detail = (params) => {
    return Vue.prototype.$u.get('extend/cashbook/detail', params);
};

export const create = (params) => {
    return Vue.prototype.$u.post('extend/cashbook/save', params);
};

export const update = (params) => {
    return Vue.prototype.$u.put('extend/cashbook/save', params);
};

export const remove = (params) => {
    return Vue.prototype.$u.delete('extend/cashbook/remove', params);
};

export const join = (params) => {
    return Vue.prototype.$u.post('extend/cashbook/join', params);
};

export const fetch = (params) => {
    return Vue.prototype.$u.get('extend/cashbook/fetch', params);
};

export const user_list = (params) => {
    return Vue.prototype.$u.get('extend/cashbook/user_list', params);
};

export const unbind_user = (params) => {
    return Vue.prototype.$u.delete('extend/cashbook/unbind_user', params);
};
