import Vue from 'vue';
//扩展插件列表
const get_list = (params) => {
    return Vue.prototype.$u.get('extend/list', params);
};

const get_detail = (params) => {
    return Vue.prototype.$u.get('extend/detail', params);
};

const save = (params) => {
    return Vue.prototype.$u.post('extend/save', params);
};

const remove = (params) => {
    return Vue.prototype.$u.delete('extend/remove', params);
};

const my_list = (params) => {
    return Vue.prototype.$u.get('extend/my_list', params);
};


export default {
    get_list,
    get_detail,
    save,
    remove,
    my_list,
};
