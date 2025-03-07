module.exports = {
    computed: {
        hasLogin() {
            // console.log(this.$store.getters)
            if (this.$store.getters.user === undefined) {
                return false
            }
            return !!this.$store.getters.user.user_code
        }
    },
    methods: {
        goToLoginPage() {
            uni.navigateTo({
                url: "/pages/login/index"
            })
        },
        gotoPath(path, auth = true, param = null, jump_type = 'navigateTo') {
            // 如果需要授权且用户未登录，则提示用户登录
            if (auth && !this.hasLogin) {
                this.$u.toast('请登录后查看');
                return;
            }
            // 如果路径为空，则提示暂未开放
            if (!path) {
                this.$u.toast('暂未开放');
                return;
            }

            if (path.indexOf('http') === 0) {
                uni.navigateTo({
                    url: '/pages/packageA/h5/web?url=' + path,
                    success: () => {
                    },
                    fail: (err) => {
                        console.log(err)
                    }
                })
                return;
            }

            // 如果提供了参数param，则将其拼接到path中
            if (param) {
                path += (path.indexOf('?') === -1 ? '?' : '&') + this.serializeParam(param);
            }
            // 根据type执行不同的页面跳转操作
            if (jump_type !== 'tab') {
                uni.navigateTo({
                    url: path
                });
            } else {
                uni.switchTab({
                    url: path
                });
            }
        },
        serializeParam(param) {
            // 将参数对象序列化为URL查询字符串
            const params = [];
            for (const key in param) {
                if (param.hasOwnProperty(key)) {
                    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`);
                }
            }
            return params.join('&');
        }
    }

}
