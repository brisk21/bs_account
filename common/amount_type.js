import Vue from 'vue';

const get_list = (params) => {
    return Vue.prototype.$u.get('amount_type/list', params);
};

const get_detail = (params) => {
    return Vue.prototype.$u.get('amount_type/detail', params);
};

const create = (params) => {
    return Vue.prototype.$u.post('amount_type/save', params);
};

const update = (params) => {
    return Vue.prototype.$u.put('amount_type/save', params);
};

const remove = (params) => {
    return Vue.prototype.$u.delete('amount_type/remove', params);
};

export default {
    get_list,
    get_detail,
    create,
    update,
    remove
};
