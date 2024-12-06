<template>
  <view class="content">
    <mp-html :content="html"/>

    <view v-if="info.path_info"
          class="u-padding-10 u-line-height-40 u-border-bottom u-border-top u-bg-grey quick-link">
      <text @click="goto(info.path_info)" class="u-text-center">{{ info.path_info.title }}</text>
    </view>
    <!-- #ifdef MP-->
    <view class="ad-container" v-if="userInfo && userInfo.position.msg_info_page">
      <ad-custom unit-id="adunit-30666b45697904b1" bindload="adLoad" binderror="adError"
                 bindclose="adClose"></ad-custom>

    </view>
    <!-- #endif -->

  </view>
</template>

<script>
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
import api from "@/common/msg";
export default {
  components: {
    mpHtml
  },
  data() {
    return {
      id: null,
      info: {}
    };
  },
  computed: {
    html() {
      return this.info.msg_id ? this.info.content : ''
    },
    userInfo() {
      return this.$store.getters.user
    },
  },
  methods: {
    goto(pathInfo) {
      if (pathInfo.jump_type == 'inner') {
        this.$u.route(pathInfo.path)
      } else if (pathInfo.jump_type == 'link') {
        window.location.href = pathInfo.path
      } else if (pathInfo.jump_type == 'tab') {
        this.$u.route({
          type: 'tab',
          url: pathInfo.path
        })
      }
    },
    getData() {
      api.get_detail(this.id).then(res => {
        if (res.code == 1) {
          this.$u.toast(res.msg);
          return
        }
        //console.log(res.data)
        this.info = res.data
      })
    }
  },
  onLoad(opt) {
    if (opt.id) {
      this.id = opt.id
      this.getData()
    }
  }
}
</script>

<style lang="scss">
.content {
  padding: 30rpx;
}
.quick-link{
  margin-top: 30rpx;
  color: #00A7EA;
  text-underline: #00A7EA;
}

.ad-container {
  margin-top: 60rpx;
}
</style>
