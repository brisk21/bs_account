<template>
  <view class="container">
    <web-view v-if="webViewSrc"
      :src="webViewSrc"
      :fullscreen="fullscreen"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      webViewSrc: '',
      fullscreen: true,
    };
  },
  onLoad(options) {
   // console.log(options);
    //拼接其他参数
    let url = options.url;
    for (let key in options){
      if (key !== 'url'){
        url += `&${key}=${options[key]}`
      }
    }
    console.log(url)

    this.webViewSrc = url;
    //设置标题
    uni.setNavigationBarTitle({
      title: options.title ||　'BS网页',
    });
  },
}
</script>

<style lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
