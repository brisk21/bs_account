<template>
  <view class="container">
    <u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
    <u-form v-show="current===0" :model="form" label-width="100rpx" label-position="top"
            :label-style="{fontWeight:'bold',color:'black'}">
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
        <upload-file
            ref="upload"
            :action="action"
            :max-size="maxSize"
            :max-count="maxCount"
            :limit-type="limitType"
            @success="handleFileUploadSuccess"
            @remove="handleFileUploadRemove"
            @error="handleError"
        />
      </u-form-item>
      <u-form-item label="操作">
        <u-button type="primary" @click="submit">提交</u-button>
      </u-form-item>

    </u-form>


    <view class="history-list" v-show="current!==0">

      <view v-if="historyList.length <= 0" class="empty">
        <u-empty text="暂无数据" mode="message"></u-empty>
      </view>
      <view v-else>
        <u-cell-group>
          <u-cell-item icon="map" :title="item.title" v-for="(item, index) in historyList" :key="index"
                       @click="open(index,item)"
                       :value="item.status_text"
          ></u-cell-item>
        </u-cell-group>

        <u-popup v-model="show" mode="bottom" border-radius="15" length="60%" safe-area-inset-bottom closeable>
          <view class="content">
            <u-parse :html="content" :selectable="true"></u-parse>
          </view>
        </u-popup>
      </view>


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
      show: false,
      content: '',
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
      historyList: [],

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
      maxSize: 2 * 1024 * 1024, // 可以设置不同的大小限制
      maxCount: 3, // 可以设置不同的数量限制
      limitType: ['png', 'jpg', 'jpeg'], // 支持的文件类型
    };

  },
  onShow() {
    this.getFeedbackList()
  },
  methods: {
    open(index, item) {
      this.content = item.content
      this.show = true
    },
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

      uni.showLoading({
        title: '提交中...'
      })

      this.$u.api.feedback(data).then(res => {
        if (res.code == 0) {
          that.$u.toast('提交成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1000);
        } else {
          that.$u.toast(res.msg)
        }
        uni.hideLoading()
      }).catch(() => {
        uni.hideLoading()
      })
    },

    handleError(data, index, lists, name) {
      this.$u.toast('文件上传失败')
      this.handleRemove(index, lists, name)
    },

    handleFileUploadSuccess({url, index, fileList, res}) {
      console.log('文件上传成功:', fileList);
      if (res.code == 0) {
        this.form.image.push(res.data.full_url)
        console.log(this.form.image)
      } else {
        this.$u.toast(res.msg)
        //移除文件
        this.$refs.upload.remove(index)
        // this.$refs.upload.fileList = this.form.image
      }
    },
    handleFileUploadRemove({index, fileList}) {
      // 更新状态或者做其他处理
      console.log('文件已被移除:', index);
      this.form.image.splice(index, 1)
      //this.$refs.upload.fileList = this.form.image
      return true
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

  .content {
    min-height: 600rpx;
    padding: 80rpx 10px 10px;
  }
}

</style>
