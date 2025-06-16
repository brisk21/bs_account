import Vue from 'vue';

const get_list = (params) => {
    return Vue.prototype.$u.get('amount_platform/list', params);
};

const get_detail = (params) => {
    return Vue.prototype.$u.get('amount_platform/detail', params);
};

const create = (params) => {
    return Vue.prototype.$u.post('amount_platform/save', params);
};

const update = (params) => {
    return Vue.prototype.$u.put('amount_platform/save', params);
};

const remove = (params) => {
    return Vue.prototype.$u.delete('amount_platform/remove', params);
};

export default {
    get_list,
    get_detail,
    create,
    update,
    remove
};
