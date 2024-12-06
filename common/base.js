// 实际上 如果不用Xbuild意义不大了 没有自动补全~
// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
const indexUrl = 'mp/';
import {encrypt} from './crypto.js';
// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
    const code2token = (code) => {
        return vm.$u.post('code_login', {
            code,
            // #ifdef MP-WEIXIN
            platform: 'wx',
            // #endif
        });
    }

    const me = () => {
        return vm.$u.get('me');
    }

    const getCategory = (type) => {
        return vm.$u.get('category/list', {
            type
        });
    }

    const cashflowPre = (data) => {
        return vm.$u.get('cashflow-pre', data);
    }

    const getCategoryInfo = (type) => {
        return vm.$u.get('category/info/' + type);
    }

    const createCashFlow = (data) => {
        return vm.$u.post('cashflow', data);
    }
    const getCashflowList = (cashbook_id, year, month) => {
        return vm.$u.get('cashflow-list', {
            cashbook_id,
            year,
            month
        });
    }

    const bill_list = (data) => {
        return vm.$u.get('cashflow-list-all', data);
    }

    const bill_list_search = (data) => {
        return vm.$u.get('cashflow-list-search', data);
    }

    const getCashflowInfo = (id) => {
        return vm.$u.get(`cashflow/${id}`);
    }

    const updateProfile = (data) => {
        return vm.$u.put('profile', data);
    }

    const updateAccount = (data) => {
        return vm.$u.put('updateAccount', encrypt(data));
    }
    const updatePwd = (data) => {
        return vm.$u.put('updatePwd ', encrypt(data));
    }

    const delCashflow = (id) => {
        return vm.$u.delete(`cashflow/${id}`);
    }
    const updateCashflow = (data) => {
        return vm.$u.put('cashflow', data);
    }
    const getCaptcha = () => {
        return vm.$u.get('captcha');
    }

    const login = (data) => {
        return vm.$u.post('login', encrypt(data));
    }
    const register = (data) => {
        return vm.$u.post('register', encrypt(data));
    }

    const readNotification = (id) => {
        return vm.$u.put(`notification/${id}`);
    }

    const delNotification = (id) => {
        return vm.$u.delete(`notification/${id}`);
    }

    const delCategory = (id) => {
        return vm.$u.delete(`category/${id}`);
    }

    const updateCategory = (params) => {
        return vm.$u.put('category', params);
    }
    const icon_list = () => {
        return vm.$u.get('icon-list');
    }

    const createCategory = (params) => {
        return vm.$u.post('category', params);
    }


    //检查更新
    const checkAppVersion = (params) => {
        return vm.$u.get('update', params);
    }

    //留言反馈
    const feedback = (params) => {
        return vm.$u.post('feedback', params);
    }

    const feedback_list = (params) => {
        return vm.$u.get('feedback-list', params);
    }

    const setDisplay = (params) => {
        return vm.$u.post('cashflow-display', params);
    }

    //推送设置
    const setPush = (params) => {
        return vm.$u.put('push_setting', params);
    }
    const getPush = (params) => {
        return vm.$u.get('push_setting', params);
    }

    //邮箱验证码发送
    const send_code = (params) => {
        return vm.$u.get('code/send', params);
    }

    const send_forget_code = (params) => {
        return vm.$u.post('code/find_pwd', encrypt(params));
    }

    const forget_pwd = (params) => {
        return vm.$u.post('user/forget_pwd', encrypt(params));
    }

    //保存邮箱
    const updateEmail = (params) => {
        return vm.$u.put('update-email', params);
    }

    //账号列表
    const getAccountList = () => {
        return vm.$u.get('account-list');
    }
    //关联账号
    const bindAccount = (params) => {
        return vm.$u.post('bind-account', encrypt(params));
    }
    //切换登录
    const switchAccount = (params) => {
        return vm.$u.post('switch-account', params);
    }

    //移除关联
    const unbindAccount = (params) => {
        return vm.$u.post('unbind-account', params);
    }

    //导出账单
    const export_data = (params) => {
        return vm.$u.get('cashflow-export', encrypt(params));
    }


    //导入账单数据
    const import_data = (params) => {
        return vm.$u.post('cashflow-import', encrypt(params));
    }
    //下载导入模板
    const import_tpl = (params) => {
        return vm.$u.get('cashflow-import-tpl', params);
    }

    //更新日志
    const updateLog = (params) => {
        return vm.$u.get('update-log', params);
    }



    //注销
    const cancelAccount = (params) => {
        return vm.$u.post('cancel-account', encrypt(params));
    }

    // 取消注销
    const regretCancelAccount = (params) => {
        return vm.$u.post('regret-cancel', encrypt(params));
    }

    //公告列表
    const getNotice = (params) => {
        return vm.$u.get('notice-list', params);
    }

    vm.$u.api = {
        code2token,
        me,
        updateAccount,
        updatePwd,
        getCategory,
        cashflowPre,
        createCashFlow,
        bill_list,
        bill_list_search,
        getCashflowList,
        getCashflowInfo,
        updateProfile,
        delCashflow,
        updateCashflow,
        getCaptcha,
        login,
        register,
        readNotification,
        delNotification,
        createCategory,
        delCategory,
        updateCategory,
        icon_list,
        getCategoryInfo,
        checkAppVersion,
        feedback,
        feedback_list,
        setDisplay,
        setPush,
        getPush,
        send_code,
        send_forget_code,
        forget_pwd,
        updateEmail,
        getAccountList,
        bindAccount,
        switchAccount,
        unbindAccount,
        export_data,
        import_data,
        import_tpl,
        updateLog,
        cancelAccount,
        regretCancelAccount,
        getNotice
    };
}

export default {
    install
}
