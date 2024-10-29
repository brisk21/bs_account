<template>
  <view class="container category_form">
    <u-form-item label="下载模板" label-width="200">
      <u-button type="primary" size="mini" @click="export_data">导出</u-button>
    </u-form-item>
    <u-form-item label="上传excel" label-width="200">
      <bs_upload
          v-if="ready"
          :button-text="'选择文件'"
          file-type=".xls,.xlsx"
          :upload-api="action"
          :header = "header"
          :success="handleSuccess"
          :fail="handleFail"
      ></bs_upload>
    </u-form-item>
    <u-form-item label="密码">
      <u-input placeholder="请输入登录密码" border :maxlength="32" type="password" clearable class="category_form_input"
               v-model="form.password"/>
    </u-form-item>

    <view class="buttons">
      <u-button class="action-btn" type="success" @click="submit">保存</u-button>

    </view>
  </view>

</template>

<script>
import constConfig from "@/const";
import bs_upload from "@/components/bs_upload.vue";
export default {
  components: {
    bs_upload
  },
  data() {
    return {
      ready:false,
      filesList: [],
      form: {
        password: ''
      },
      initialFiles: [],
      action: constConfig.baseUrl + '/upload/image',
      header: {
        'Authorization': 'Bearer ' + this.$store.getters.user_token,
      },
      maxSize: 2 * 1024 * 1024, // 可以设置不同的大小限制
      maxCount: 1, // 可以设置不同的数量限制
      limitType: ['xls', 'xlsx'], // 支持的文件类型
    };
  },
  onLoad(options) {
    this.getUserInfo()
    this.$nextTick(() => {
      this.ready = true
    })
  },
  mounted() {

  },
  methods: {
    handleSuccess(res) {
      console.log('Upload success:', res);
    },
    handleFail(err) {
      console.error('Upload failed:', err);
    },


    getUserInfo() {
      let user = this.$store.getters.user
      if (!user) {
        //跳到登录
        uni.navigateTo({
          url: '/pages/login/login'
        })
        return;
      }
      this.$nextTick(() => {
        this.form.account = user.account
      })
    },

    submit() {
      if (!this.form.account){
        this.$u.toast('请输入账号');
        return;
      }
      uni.showModal({
        title: '提示',
        content: '确定提交吗,每个月只能修改一次哦？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.updateAccount({
              account: this.form.account,
              password: this.form.password
            }).then(res => {
              this.$u.toast(res.msg);
              if (res.code !== 0) {
                return
              }
              setTimeout(function () {
                uni.navigateBack({
                  delta: 1
                })
              },500)
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.category_form {
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
}

</style>
