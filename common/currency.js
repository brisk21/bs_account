import Vue from 'vue';

const get_list = (params) => {
    return Vue.prototype.$u.get('currency/list', params);
};

const get_detail = (params) => {
    return Vue.prototype.$u.get('currency/detail', params);
};

const create = (params) => {
    return Vue.prototype.$u.post('currency/save', params);
};

const update = (params) => {
    return Vue.prototype.$u.put('currency/save', params);
};

const remove = (params) => {
    return Vue.prototype.$u.delete('currency/remove', params);
};

export default {
    get_list,
    get_detail,
    create,
    update,
    remove
};
