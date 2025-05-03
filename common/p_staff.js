import Vue from 'vue';

export const get_list = (params) => {
    return Vue.prototype.$u.get('extend/staff/list', params);
};

export const get_detail = (params) => {
    return Vue.prototype.$u.get('extend/staff/detail', params);
};

export const create = (params) => {
    return Vue.prototype.$u.post('extend/staff/save', params);
};

export const update = (params) => {
    return Vue.prototype.$u.put('extend/staff/save', params);
};

export const remove = (params) => {
    return Vue.prototype.$u.delete('extend/staff/remove', params);
};
