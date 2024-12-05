import Vue from 'vue';

const table_list = (params) => {
    return Vue.prototype.$u.get('statistic/table_list', params);
};


// 按类型统计饼图
const charts_data = (params) => {
    return Vue.prototype.$u.get('statistic/type', params);
}

//统计设置
const statistic_get = (params) => {
    return Vue.prototype.$u.get('statistic/setting', params);
}

const statistic_set = (params) => {
    return Vue.prototype.$u.put('statistic/setting', params);
}

export default {
    table_list,
    charts_data,
    statistic_get,
    statistic_set
};
