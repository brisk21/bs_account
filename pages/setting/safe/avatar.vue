<template>
  <view class="container category_form">
    <u-form-item label="昵称">
      <u-input placeholder="请输入昵称" border :maxlength="10" type="text" clearable class="category_form_input"
               v-model="form.nick_name"/>
    </u-form-item>
    <u-form-item label="头像">
      <upload-file
          :action="action"
          :header="header"
          :max-size="maxSize"
          :max-count="maxCount"
          :limit-type="limitType"
          :default-files="initialFiles"
          @success="handleFileUploadSuccess"
          @remove="handleFileUploadRemove"
      />
    </u-form-item>


    <!--    <u-select v-model="select_bill_show" :list="bill_list" @confirm="billConfirm"></u-select>-->
    <view class="buttons">
      <u-button class="action-btn" type="success" @click="submit">保存</u-button>

    </view>
  </view>

</template>

<script>
import constConfig from '@/const.js'
import uploadFile from "@/components/UploadFile.vue";

export default {
  components: {
    uploadFile
  },
  data() {
    return {
      user: {},
      form: {
        avatar: '',
        nick_name: ''
      },
      initialFiles: [
        /*{ url: 'http://example.com/image1.jpg' },*/
      ],
      action: constConfig.baseUrl + '/upload/image',
      header: {
        'Authorization': 'Bearer ' + this.$store.getters.user_token,
      },
      maxSize: 2 * 1024 * 1024, // 可以设置不同的大小限制
      maxCount: 1, // 可以设置不同的数量限制
      limitType: ['png', 'jpg', 'jpeg'], // 支持的文件类型

    };
  },
  onLoad(options) {
    this.$nextTick(() => {
      this.getUserInfo()
    })
  },
  mounted() {

  },
  methods: {
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
        this.user = user
        this.form.avatar = user.avatar
        this.form.nick_name = user.nick_name
        this.initialFiles = [{url: user.avatar}]
      })


    },

    handleFileUploadSuccess({url, index, fileList}) {
      // 更新 formData 或者做其他处理
      console.log('文件上传成功:', url);
      this.form.avatar = url
    },
    handleFileUploadRemove({index, fileList}) {
      // 更新状态或者做其他处理
      console.log('文件已被移除:', index);
      this.form.avatar = this.user.avatar || null
    },
    async submit() {
      let that = this
      if (!this.form.nick_name) {
        this.$u.toast('请输入昵称');
        return;
      }

      uni.showModal({
        title: '提示',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.updateProfile({
              nick_name: this.form.nick_name,
              avatar: this.form.avatar
            }).then(res => {
              this.$u.toast(res.msg);

            })

          } else if (res.cancel) {
            this.$u.toast('已取消');
          }
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.category_form {
  width: 100%;
  height: 100%;
  padding: 10px;


  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;

    .action-btn {
      width: 100%;
      border-radius: unset !important;
    }
  }
}

</style>
