<template>
  <view class="content">
    <button type="default" size="mini" @tap="uploadFilesFun">{{ buttonText }}</button>
  </view>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      default: '上传文件'
    },
    fileType: {
      type: String,
      default: '*/*' // 默认接受所有文件类型
    },
    uploadApi: {
      type: String,
      default: '' // 上传接口
    },
    header:{
      type: Object,
      default () {
        return {}
      }
    },
    success: {
      type: Function,
      default: () => {}
    },
    fail: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    uploadFilesFun() {
      this.chooseFile(this.fileType).then(file => {
        console.log(file,'choose')
        this.uploadFile(file).then(res => {
          this.success(res);
        }).catch(err => {
          this.fail(err);
        });
      }).catch(err => {
        this.fail(err);
      });
    },
    chooseFile(type) {
      return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        const REQUESTCODE = 1;
        const main = plus.android.runtimeMainActivity();
        const Intent = plus.android.importClass('android.content.Intent');
        const intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType(type);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        main.startActivityForResult(intent, REQUESTCODE);

        main.onActivityResult = function(requestCode, resultCode, data) {
          if (REQUESTCODE === requestCode) {
            const fileData = data.getData();
            const path = plus.android.invoke(fileData, 'getPath');
            resolve({ path, name: fileData.toString() });
          }
        };
        // #endif

        // #ifdef H5
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', type);
        input.click();
        input.onchange = function() {
          console.log('input.files',this.files)
          if (this.files[0]) {
            resolve({ path: this.files[0].path, name: this.files[0].name });
          } else {
            reject(new Error('No file chosen'));
          }
        };
        // #endif
      });
    },
    uploadFile(file) {
      return new Promise((resolve, reject) => {
        if (!this.uploadApi) {
          reject(new Error('Upload API is required'));
          return;
        }
        console.log(file)
        const formData = new FormData();
        formData.append('file', file);
        fetch(this.uploadApi, {
          method: 'POST',
          body: formData,
          headers: this.header
        }).then(response => response.json())
            .then(data => {
              resolve(data);
            }).catch(error => {
          reject(error);
        });
      });
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  margin-top: 50rpx;
}
</style>
