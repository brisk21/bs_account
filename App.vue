<style lang="scss">
@import "uview-ui/index.scss";
</style>

<script>
// #ifdef APP-PLUS || MP-WEIXIN
import checkappupdate from 'js_sdk/wonyes-checkappupdate/wonyes/checkappupdate.js'
// #endif
import constConfig from '@/const.js'
import wgt from "@/common/wgt";
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState('network', ['isConnected']),
  },
  onLaunch: function () {
    // #ifdef APP-PLUS
    console.log('update')
    checkappupdate.check({
      title: "检测到有新版本！",
      content: "请升级app到最新版本！",
      canceltext: "暂不升级",
      oktext: "立即升级",
      api: constConfig.baseUrl + '/update',
      barbackground: "rgba(50,50,50,0.8)",//进度条背景色，默认灰色，可自定义rgba形式色值
      barbackgroundactive: "rgba(32,165,58,1)"//进度条前景色色，默认绿色，可自定义rgba形式色值
    })
    this.wgt_check()
    // #endif

    // #ifdef MP-WEIXIN
    checkappupdate.wx_check_update()
    // #endif

  },
  onShow: function () {
    // 如果需要，在应用每次显示时检查网络状态
    this.checkNetwork();
    uni.onNetworkStatusChange(this.handleNetworkChange);
    let token = uni.getStorageSync('UserToken')
    if (token) {
      this.$store.dispatch('getUserInfo')
    }
  },
  onHide: function () {
    uni.offNetworkStatusChange(this.handleNetworkChange);
  },
  beforeDestroy() {
    uni.offNetworkStatusChange(this.handleNetworkChange);
  },
  methods: {
     ...mapActions('network', ['checkNetwork', 'handleNetworkChange']),
    wgt_check() {
      let info = uni.getSystemInfoSync();
      plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
        //console.log(widgetInfo)
        info.appVersion = widgetInfo.version
        info.appVersionCode = widgetInfo.versionCode
        info.app_current_wgt_version = uni.getStorageSync('app_current_wgt_versions') || []
        console.log(info)
        info.bsfrom = 'app';
        wgt.check({
          platform: info.platform || '',
          bsfrom: info.bsfrom || '',
          app_current_wgt_version: info.app_current_wgt_version,
          appVersion: info.appVersion || '',
          appVersionCode: info.appVersionCode || '',
          appWgtVersion: info.appWgtVersion || '',
          osVersion: info.osVersion || '',
          system: info.system || '',
        }).then(res => {
          console.log('wgt-get', res)
          if (res.code === 0 && res.data.info_list.length > 0) {
            uni.showLoading({
              title: '资源更新中，请勿关闭',
            })
            for (let i = 0; i < res.data.info_list.length; i++) {
              wgt.start(res.data.info_list[i])
            }
            uni.hideLoading()
            uni.showToast({
              title: '更新完成，下次重启应用生效',
              icon: 'none',
            })
          }
        }).cath(err => {
          console.log(err)
        })
      })
    }
  }
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
  font-family: uniicons;
  src: url('/static/uni.ttf');
}

/* #endif */
</style>
<style lang='scss'>
view,
scroll-view,
swiper,
swiper-item,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox,
form,
input,
label,
radio,
slider,
switch,
textarea,
navigator,
audio,
camera,
image,
video {
  box-sizing: border-box;
}
</style>
