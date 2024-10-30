<template>
  <view class="container category_form">
    <u-form-item label="下载模板" label-width="200">
      <u-link :href="tpl_file_url" :under-line="false" title="下载模板"></u-link>
      <u-link v-if="tpl_file_url"
              :href="tpl_file_url"
              @click="copy(tpl_file_url)"
              :under-line="false"
              :copy="true"
      >点击复制到浏览器打开
      </u-link>
    </u-form-item>
    <u-form-item label="选择文件" label-width="200">
      <yt-upload
          :accept="'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
          :debug='false'
          instantly
          :count="1"
          ref="ytUpload"
          childId="upload1"
          formats="xls,xlsx"
          width="100rpx"
          height="100rpx"
          :option="option"
          :size="2"
          wxFileType="file"
          @progress="onprogress"
          @change="onChange">
        <u-button  class="choose-file" type="primary" size="mini">选择</u-button>
      </yt-upload>
    </u-form-item>
    <u-form-item label="已选择文件" label-width="200">
      <!-- #ifndef MP-WEIXIN -->
      <view v-for="(item,index) in files.values()" :key="index" class="file-list">
        <text>{{ item.name }}</text>
        <br>
        <text @click="clear(item.name)" style="margin-left: 10rpx;padding: 0 10rpx;border: 1rpx solid #007AFF;">删除
        </text>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <view v-for="(item,index) in wxFiles" :key="index" class="file-list">
        <text>{{ item.name }}</text>
        <view>
          <button @click="clear(item.name)">删除</button>
        </view>
      </view>
      <!-- #endif -->
    </u-form-item>


    <view class="result-list" v-if="result_list.length > 0">
      <u-table>
        <u-tr>
          <u-th>金额</u-th>
          <u-th>类型</u-th>
          <u-th>日期</u-th>
          <u-th>分类</u-th>
        </u-tr>
        <u-tr v-for="(item,index) in result_list" :key="index">
          <u-td>{{ item.amount }}</u-td>
          <u-td>{{ item.type === 10 ? '收入' : '支出' }}</u-td>
          <u-td>{{ item.date }}</u-td>
          <u-td>{{ item.category_name }}</u-td>
        </u-tr>

      </u-table>
    </view>

    <u-form-item label="密码" v-if="result_list.length > 0">
      <u-input placeholder="请输入登录密码" border :maxlength="32" type="password" clearable class="category_form_input"
               v-model="form.password"/>
    </u-form-item>
    <view class="buttons">
      <u-button class="action-btn" type="success" @click="submit">确定导入</u-button>

    </view>
    <view class="warning">

      <p>1、导入文件必须为excel文件，且为xls或xlsx格式。</p>
      <p>2、导入文件必须为当前登录用户的账单文件。</p>
      <p>3、上传文件后,识别到结果请认真查看，然后点击【确定导入】即可导入到您的账单中。</p>
      <p>4、如果识别结果不正确，请修改excel文件按模板格式填写，重新上传。</p>
      <p>5、为了保证数据安全，请勿将密码告知他人。</p>
      <!-- #ifdef MP -->
      <p>6、注意：微信小程序如果导入不成功（点击没反应或者未授权）请使用H5或者APP导入。</p>
      <!-- #endif -->

    </view>
  </view>

</template>

<script>
import constConfig from "@/const";
import ytUpload from "@/uni_modules/yt-upload/components/yt-upload/yt-upload.vue";

export default {
  components: {
    ytUpload
  },
  data() {
    return {
      result_list: [],
      option: {
        // 上传服务器地址，需要替换为你的接口地址
        url: constConfig.baseUrl + '/cashflow-import-file',
        // 上传附件的key
        name: 'file',
        // 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
        header: {
          // 示例参数可删除
          'Authorization': 'Bearer ' + this.$store.getters.user_token,
        },
        // 根据你接口需求自定义body参数
        formData: {
          // 'orderId': 1000
        }
      },
      tpl_file_url: '',
      ready: false,
      filesList: [],
      files: new Map(),
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      wxFiles: [],
      // 是否打印日志
      debug: true,

      list: [],
      form: {
        password: '',
        file_key: ''
      },
    };
  },
  onLoad(options) {
    this.getUserInfo()
    this.getTpl()
  },
  mounted() {

  },
  methods: {

    getTpl() {
      this.$u.api.import_tpl().then(res => {
        if (res.code !== 0) {
          this.$u.toast(res.msg)
        } else {
          this.tpl_file_url = res.data.url
        }
      })
    },

    copy(e) {
      uni.setClipboardData({
        data: e,
        success: function () {
          uni.showToast({
            title: '复制成功'
          })
        }
      })
    },
    // 移除某个文件
    clear(name) {
      // name=指定文件名，不传name默认移除所有文件
      this.$refs['ytUpload'].clear(name);
      this.result_list = []
      this.form.file_key = ''
    },
    // 上传进度回调
    onprogress(item) {
      // 更新当前状态变化的文件
      this.files.set(item.name, item);
      if (item.responseText) {
        try {
          let result = JSON.parse(item.responseText)
          if (result.code === 0) {
            this.result_list = result.data.list
            this.form.file_key = result.data.file_key
            //console.log('responseText', this.result_list)
          } else {
            this.$u.toast(result.msg)
          }
        } catch (e) {
          console.log('解析失败')
        }
      }

      //console.log('打印对象', JSON.stringify(this.files.get(item.name)));
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      // #ifdef MP-WEIXIN
      this.wxFiles = [...this.files.values()];
      // #endif

      // 强制更新视图
      this.$forceUpdate();

    },
    // 文件选择回调
    onChange(files) {
      //console.log('当前选择的文件列表：', JSON.stringify([...files.values()]));
      // 更新选择的文件
      this.files = files;

      // 强制更新视图
      this.$forceUpdate();

      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      // #ifdef MP-WEIXIN
      this.wxFiles = [...this.files.values()];
      // #endif
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
      if (!this.form.password) {
        this.$u.toast('请输入账号登录密码');
        return;
      }
      uni.showModal({
        title: '导入提示',
        content: '确定提交吗，上面的数据将导入到账单记录中？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.import_data(this.form).then(res => {
              this.$u.toast(res.msg);
              if (res.code !== 0) {
                return
              }
              setTimeout(function () {
                 //去首页
                uni.switchTab({
                  url: '/pages/index/index'
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

  .file-list {
    overflow: hidden;
    width: 98%;

  }

  .warning{
    padding: 10px;
    background-color: #fff;
    color: red;
  }
  .choose-file {
    width: 100rpx;
    vertical-align: center;
    height: 60rpx;
    line-height: 100rpx;
  }

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
