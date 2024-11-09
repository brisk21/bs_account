
import Vue from 'vue';

const get_list = (params) => {
    return Vue.prototype.$u.get('help/list',params);
};


export default {
   get_list
};
