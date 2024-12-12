<template>
  <view class="container">
    <view class="u-content">
      <u-parse :html="content"></u-parse>
    </view>
  </view>
</template>

<script>
import api from "@/common/h5";

export default {
  data() {
    return {
      content: ''
    };
  }
  ,
  onLoad(option) {
    let key = option.key || 'about';
    if (key === 'about'){
      uni.setNavigationBarTitle({
        title: '关于我们'
      })
    }else if (key === 'privacy'){
      uni.setNavigationBarTitle({
        title: '隐私政策'
      })
    } else if (key === 'service'){
      uni.setNavigationBarTitle({
        title: '服务协议'
      })
    } else if (key === 'register'){
      uni.setNavigationBarTitle({
        title: '注册协议'
      })
    }
    this.getData(key)
  },
  methods: {
    getData(key) {
      api.detail({
        key : key
      }).then(res => {
        if (res.code === 0 && res.data.info) {
          this.content = res.data.info.value
        }
      })
    },
  },
}
</script>

<style lang="scss">
.container {
  padding: 30rpx;
  img{
   max-width: 100%;
 }

}

</style>
