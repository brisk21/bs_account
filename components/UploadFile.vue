<template>
  <view class="container">
    <u-upload
       ref="upload"
      :action="action"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :max-size="maxSize"
      :max-count="maxCount"
      :before-upload="beforeUpload"
      :header="header"
      :limit-type="limitType"
      :preview-full-image="previewFullImage"
       :show-progress="false"
      @on-error="handleError"
      @on-success="uploadSuccess"
      @on-remove="handleRemove"
    ></u-upload>
  </view>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    action: {
      type: String,
      required: true,
    },
    header: {
      type: Object,
      default() {
        return {
          'Authorization': 'Bearer ' + (uni.getStorageSync('UserToken') || ''),
          'platform': uni.getSystemInfoSync().platform || '',
          'version': uni.getSystemInfoSync().version || '',
          'appVersion': uni.getSystemInfoSync().appVersion || '',
          'appVersionCode': uni.getSystemInfoSync().appVersionCode || '',
          'uniRuntimeVersion': uni.getSystemInfoSync().uniRuntimeVersion || '',
          'appWgtVersion': uni.getSystemInfoSync().appWgtVersion || '',
          // #ifdef APP-PLUS
          'bsfrom': 'app',
          // #endif
          // #ifdef H5
          'bsfrom': 'h5',
          // #endif
          // #ifdef MP-WEIXIN
          'bsfrom': 'xcx',
          // #endif
        };
      },
    },
    maxSize: {
      type: Number,
      default: 2 * 1024 * 1024, // 默认最大2MB
    },
    maxCount: {
      type: Number,
      default: 1, // 默认最多选一个文件
    },
    limitType: {
      type: Array,
      default() {
        return ['png', 'jpg', 'jpeg']; // 默认限制为图片格式
      },
    },
    previewFullImage: {
      type: Boolean,
      default: true,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    defaultFiles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    defaultFiles(newVal) {
      this.fileList = newVal;
    },
  },
  methods: {
    handleRemove(index, lists, name) {
      this.$emit('remove', { index, fileList: lists });
      this.fileList = lists;
    },
    uploadSuccess(res, index, lists, name) {
      if (res.code === 0) {
        this.$emit('success', { url: res.data.full_url, index, fileList: lists ,res});
      } else {
        this.$u.toast(res.msg);
        this.handleRemove(index, lists, name);
      }
    },
    handleError(data, index, lists, name) {
      this.handleRemove(index, lists, name);
    },
    beforeUpload(file) {
      	return true;
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #ffffff;
}
</style>
