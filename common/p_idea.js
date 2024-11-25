import Vue from 'vue';

const get_list = (params) => {
    return Vue.prototype.$u.get('extend/idea/list', params);
};

const get_detail = (params) => {
    return Vue.prototype.$u.get('extend/idea/detail', params);
};

const create = (params) => {
    return Vue.prototype.$u.post('extend/idea/save', params);
};

const update = (params) => {
    return Vue.prototype.$u.put('extend/idea/save', params);
};

const remove = (params) => {
    return Vue.prototype.$u.delete('extend/idea/remove', params);
};

export default {
    get_list,
    get_detail,
    create,
    update,
    remove
};
