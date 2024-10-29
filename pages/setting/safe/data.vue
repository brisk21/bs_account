<template>
  <view class="container">
    <view class="menu-container">
      <view class="menu-list">
        <u-cell-group>

          <u-cell-item @click="export_data()" title="数据导出" icon="download">

            <u-link v-if="file_url"
                    :href="file_url"
                    @click="copy(file_url)"
                    :under-line="false"
                    :copy="true"
            >点击复制到浏览器打开，5分钟有效</u-link>
            <text v-else>导出已有账单数据</text>
          </u-cell-item>
          <u-cell-item @click="goto('/pages/setting/safe/import_data')" :icon-style="{transform: 'rotate(180deg)'}" title="数据导入" icon="download">
            导入其它数据
          </u-cell-item>

        </u-cell-group>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      file_url: ''
    }
  },

  methods: {
    // 查看文件
    readFile(e) {
      uni.showLoading({
        title:'请求中...'
      })
      // #ifdef APP-PLUS
      uni.downloadFile({
        url: e,
        success: function(res) {
          console.log(res)
          var filePath = res.tempFilePath;
          uni.openDocument({
            filePath: filePath,
            success: function(res) {
              console.log('打开文档成功');
              uni.hideLoading();
            },
            fail(err) {
              console.log(err)
              uni.hideLoading();
              uni.showToast({
                title: err,
                icon: 'none'
              });
            }
          });
        },
        fail(err) {
          console.log(err)
          uni.hideLoading();
          uni.showToast({
            title: err,
            icon: 'none'
          });
        },
        complete() {
          uni.hideLoading();
        }
      });
      // #endif
      // #ifndef APP-PLUS
      let that = this
      setTimeout(function (){
        that.file_url = e
        uni.hideLoading()
      },2000)

      // #endif
    },
    copy(e) {
      uni.setClipboardData({
        data: e,
        success: function() {
          uni.showToast({
            title: '复制成功'
          })
        }
      })
    },

    export_data(){
      if (this.file_url){
        this.copy(this.file_url)
        return this.$u.toast('已生成，请复制到浏览器打开')
      }
      this.$u.api.export_data().then(res => {
        if (res.code !== 0) {
          this.$u.toast(res.msg)
        } else {
          this.readFile(res.data.url)
        }
      })
    },
    goto(path, auth = true) {
      if (auth && !this.hasLogin) {
        this.$u.toast('请登录后查看');
        return
      }
      if (!path){
        this.$u.toast('暂未开放')
        return
      }
      uni.navigateTo({
        url: path
      })
    }
  },
  onShow() {

  }
}
</script>

<style lang="scss">
.container {
  background-color: #f5f5f5;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}


.menu-list {
  margin-top: 30upx;
  background: #fff;
  border-radius: 10upx;

  switch {
    transform: scale(0.7, 0.7)
  }
}


</style>
