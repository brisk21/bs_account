<template>
  <view class="container">
    <u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
    <u-form v-if="current==0" :model="form" label-width="100rpx" label-position="top" :label-style="{fontWeight:'bold',color:'black'}">
      <u-form-item label="反馈类型">
        <u-radio-group v-model="form.type">
          <u-radio v-for="(item, index) in radioList" :key="index" :name="item.name" :disabled="item.disabled">
            {{ item.name }}
          </u-radio>
        </u-radio-group>
      </u-form-item>
      <u-form-item label="留言内容">
        <u-input v-model="form.content" type="textarea"/>
      </u-form-item>
      <u-form-item label="附件图片">
        <u-upload
            ref="upload"
            :action="action"
            :auto-upload="true"
            :file-list="fileList"
            :max-size="2 * 1024 * 1024"
            :max-count="3"
            :before-upload="beforeUpload"
            :header="header"
            :limit-type="['png', 'jpg', 'jpeg']"
            :preview-full-image="true"
            @on-error="handleError"
            @on-success="uploadSuccess"
            @on-remove="handleRemove"
        ></u-upload>
      </u-form-item>
      <u-form-item label="操作">
        <u-button type="primary" @click="submit">提交</u-button>
      </u-form-item>

    </u-form>


    <view class="history-list" v-else>

      <view v-if="historyList.length <= 0" class="empty">
      <u-empty text="暂无数据" mode="message"></u-empty>
      </view>
      <view>
        <u-collapse>
          <u-collapse-item :title="item.title" v-for="(item, index) in historyList" :key="index">
            <rich-text :nodes="item.content"></rich-text>
          </u-collapse-item>
        </u-collapse>
        </view>


    </view>
  </view>

</template>

<script>
import constConfig from '@/const.js'

export default {
  data() {
    return {
      list: [{
        name: '提交反馈'
      }, {
        name: '历史反馈'
      }],
      current: 0,
      form: {
        type: '',
        content: '',
        image: []
      },
      historyList: [

      ],

      radioList: [
        {
          name: '优化建议',
          disabled: false
        },
        {
          name: '问题反馈',
          disabled: false
        },
        {
          name: '其他',
          disabled: false
        }
      ],

      action: constConfig.baseUrl + '/upload/image',
      header: {
        'Authorization': 'Bearer ' + (uni.getStorageSync('UserToken') || '')
      },
      fileList: []
    };

  },
  onShow() {
    this.getFeedbackList()
  },
  methods: {
    change(index) {
      this.current = index;
    },
    getFeedbackList() {
      this.$u.api.feedback_list().then(res => {
        if (res.code == 0) {
          this.historyList = res.data.list
        }
      })
    },
    submit() {
      let that = this
      let data = this.form

      if (!data.type) {
        this.$u.toast('请选择反馈类型')
        return
      }
      if (!data.content) {
        this.$u.toast('请输入反馈内容')
        return
      } else if (data.content.length < 5) {
        this.$u.toast('反馈内容不能少于5个字')
        return
      }


      this.$u.api.feedback(data).then(res => {
        if (res.code == 0) {
          that.$u.toast('提交成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1000);
        } else {
          that.$u.toast(res.msg)
        }
      })
    },


    handleRemove(index, lists, name) {
      this.$refs.upload.remove(index)
      this.form.image.splice(index, 1)
    },
    uploadSuccess(res, index, lists, name) {
      //console.log('uploadSuccess', lists);
      if (res.code == 0) {
        //this.formData.image = res.data.full_url
        this.form.image.push(res.data.full_url)
        console.log(this.fileList)
      } else {
        this.$u.toast(res.msg)
        //移除文件
        this.$refs.upload.remove(index)
      }
    },
    handleError(data, index, lists, name) {
      console.log('handleError', index);
      //移除文件
      this.$refs.upload.remove(index)

    },
    beforeUpload(index, list) {
      return true;
    },
  }
}


</script>


<style lang="scss">
.container {

  padding: 30rpx;
}

</style>
