import Vue from 'vue';

export const get_list = (params) => {
    return Vue.prototype.$u.get('statistic/calendar', params);
};

