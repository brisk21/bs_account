import Vue from 'vue';

const read_all = (params) => {
    return Vue.prototype.$u.get('notification-read-all', params);
};

const get_list = (params) => {
    return Vue.prototype.$u.get('notifications', params);
};

const get_detail = (id) => {
    return Vue.prototype.$u.get(`notification/${id}`);
};


export default {
    get_list,
    get_detail,
    read_all
};
