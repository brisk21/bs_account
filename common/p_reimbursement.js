import Vue from 'vue';

export const get_list = (params) => {
    return Vue.prototype.$u.get('extend/reimbursement/list', params);
};

export const get_detail = (params) => {
    return Vue.prototype.$u.get('extend/reimbursement/detail', params);
};

export const create = (params) => {
    return Vue.prototype.$u.post('extend/reimbursement/save', params);
};

export const update = (params) => {
    return Vue.prototype.$u.put('extend/reimbursement/save', params);
};

export const remove = (params) => {
    return Vue.prototype.$u.delete('extend/reimbursement/remove', params);
};

export const check = (params) => {
    return Vue.prototype.$u.put('extend/reimbursement/check', params);
}
