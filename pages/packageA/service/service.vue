<template>
  <view class="container bs_form">
    <u-form label-width="150" label-position="top">
      <u-form-item label="是否启用">
        <u-switch v-model="is_private" ></u-switch>
      </u-form-item>
      <u-form-item label="接口API" v-if="is_private">
        <u-input placeholder="私有化aip地址"  border :maxlength="128" type="text" clearable
                 class="bs_form_input"
                 v-model="form.api"/>
      </u-form-item>
      <u-form-item label="加密秘钥" v-if="is_private">
        <u-input placeholder="请输入加密秘钥" border :maxlength="32" type="password" clearable class="bs_form_input"
                 v-model="form.key"/>
      </u-form-item>
      <u-form-item label="授权TOKEN" v-if="is_private">
        <u-input placeholder="请输入授权TOKEN" border :maxlength="128" type="password" clearable class="bs_form_input"
                 v-model="form.token"/>
      </u-form-item>
    </u-form>
    <view class="buttons">
      <u-button v class="action-btn" type="warning" @click="submit">保存</u-button>

    </view>
    <view class="tips">
      <view>
        <text class="title">配置请认真阅读以下说明：</text>
      </view>
      <view class="item">私有化部署是将后端代码部署到自己服务器上，然后通过接口调用来使用。</view>
      <view class="item"><text class="title bs-red">接口API</text>： 填写自己服务器部署的接口地址，如：https://127.0.0.1:8080/api，<text class="bs-red">末尾要用/api结尾，小程序接口地址必须为https(微信小程序后台自己配置)，极力推荐用https协议。</text></view>
      <view class="item"><text class="title bs-red">加密秘钥</text>： 填写自己的接口秘钥，32位字符串，用于敏感数据传输加密。</view>
      <view class="item"><text class="title bs-red">TOKEN</text>： 填写自己的接口授权token，用于私有化授权鉴定。</view>
      <view class="item"><text class="title bs-red">重置</text>： 想使用回官方的接口，可以关闭上方的开关，即可恢复官方接口使用，也可以长按应用清理数据，上面的配置是保存在自己的手机系统，清理后即可恢复官方接口。<text class="bs-red">私有化数据和官方数据不互通，请谨慎操作。</text></view>
      <view class="item">私有化部署需要<text class="bs-red">先购买授权</text>，详情请咨询客服（提交反馈）或者发送邮箱到jz@alipay168.cn。</view>
      <view class="item">请尊重版权，勿用于商业用途。</view>

    </view>
  </view>

</template>

<script>
export default {
  data() {
    return {
      is_private: false,
      form: {
        api: '',
        key: '',
        token: ''
      }
    };
  },
  onLoad(options) {

  },
  mounted() {

  },
  methods: {



    submit() {
      if (!this.form.password) {
        this.$u.toast('请输入加密秘钥');
        return;
      }
      uni.showModal({
        title: '',
        content: '确定保存吗,保存后将改变原有模式？',
        success: (res) => {
          if (res.confirm) {

          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bs_form {
  width: 100%;
  height: 100%;
  padding: 10px;


  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 160rpx;

    .action-btn {
      width: 100%;
      border-radius: unset !important;
    }
  }

  .tips {
    margin-top: 60rpx;
    .bs-red{
      color: red;
    }
    .title {
      font-size: 28rpx;
      font-weight: bold;
    }

    .item {
      margin-top: 15rpx;
    }

    .link {
      color: #007AFF;
    }
  }
}

</style>
