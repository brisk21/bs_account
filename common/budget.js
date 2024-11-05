
import Vue from 'vue';

const budget_list = (params) => {
    return Vue.prototype.$u.get('budget/list',params);
};

const budget_detail = (params) => {
    return Vue.prototype.$u.get('budget/detail', params);
};

const budget_delete = (params) => {
    return Vue.prototype.$u.delete('budget/delete', params);
};

const budget_add = (params) => {
    return Vue.prototype.$u.post('budget/add', params);
};

const budget_edit = (params) => {
    return Vue.prototype.$u.put('budget/update', params);
};

export default {
    budget_list,
    budget_detail,
    budget_delete,
    budget_add,
    budget_edit
};
