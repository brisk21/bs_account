<template>
  <view class="container">
    <u-form :model="form"  label-width="100rpx" label-position="top" :label-style="{fontWeight:'bold',color:'black'}">
      <u-form-item label="反馈类型">
			<u-radio-group v-model="form.type">
				<u-radio v-for="(item, index) in radioList" :key="index" :name="item.name" :disabled="item.disabled">
					{{ item.name }}
				</u-radio>
			</u-radio-group>
		</u-form-item>
		<u-form-item label="留言内容"><u-input v-model="form.content" type="textarea"  /></u-form-item>
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
  </view>

</template>

<script>
import constConfig from '@/const.js'
export default {
	data() {
	  return {
			form: {
				type:'',
        content:'',
        image:[]
			},

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
	onload(){

	},
	methods:{

    submit(){
      let that = this
      let data = this.form

      if (!data.type){
        this.$u.toast('请选择反馈类型')
        return
      }
      if (!data.content){
        this.$u.toast('请输入反馈内容')
        return
      }else if (data.content.length < 5){
        this.$u.toast('反馈内容不能少于5个字')
        return
      }

      console.log(data)


      this.$u.api.feedback(data).then(res => {
        if (res.code == 0){
          that.$u.toast('提交成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1000);
        }else{
          that.$u.toast(res.msg)
        }
      })
    },



    handleRemove(index, lists, name){
       this.$refs.upload.remove(index)
       this.form.image.splice(index,1)
      },
      uploadSuccess(res, index, lists, name){
        //console.log('uploadSuccess', lists);
        if (res.code == 0){
          //this.formData.image = res.data.full_url
         this.form.image.push(res.data.full_url)
          console.log(this.fileList)
        }else{
          this.$u.toast(res.msg)
          //移除文件
          this.$refs.upload.remove(index)
        }
      },
      handleError(data, index, lists, name){
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
