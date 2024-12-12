<template>
  <view class="container">
    <view class="u-content">
      <u-parse :html="content"></u-parse>
    </view>
    <view class="download">
      <u-button v-if="version" type="success" size="medium" @click="download()">立即下载{{ version }}</u-button>
      <view v-else>
        <u-button type="primary" size="medium" disabled>仅支持安卓设备</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/common/h5";

export default {
  data() {
    return {
      content: '',
      version: '',
      download_url: ''
    };
  }
  ,
  created() {
    this.check_version()
  },
  methods: {
    download() {
      location.href = this.download_url
    },
    check_version() {
      api.check({
        platform: uni.getSystemInfoSync().platform,
        ffff: 'index',
        format: 'json'
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.content = res.data.html
          if (res.data.app) {
            this.version = res.data.app.version
            this.download_url = res.data.app.url
          }
        }
      })
    },
  },
}
</script>

<style lang="scss">
.container {
  padding: 30rpx;

  .download {
    margin-top: 60rpx;
    text-align: center;
  }

}

</style>
