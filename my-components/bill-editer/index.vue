<template>
  <view class="container">
    <view class="type_selector">
      <u-subsection class="selector" :animation="true" :list="list" @change="typeChange" active-color="#fff"
                    :current="type" mode="subsection">
      </u-subsection>
    </view>
    <view class="category-list">
      <view class="out-list" v-show="formData.type == 20">
        <template v-if="out_list.length>0">
          <u-grid :col="5" :border="true">
            <u-grid-item
                v-for="(item,index) in out_list"
                :key="item.id"
                :bg-color="item.id && formData.category_id==item.id?'#71d5a1':''"
                @click="setCurCategory(item)"
            >
              <u-icon :name="item.icon" :size="46"></u-icon>
              <view class="grid-text">{{ item.name }}</view>
            </u-grid-item>
          </u-grid>
        </template>
      </view>
      <view class="in-list" v-show="formData.type == 10">

        <template v-if="in_list.length>0">
          <u-grid :col="5" :border="true">
            <u-grid-item
                v-for="(item,index) in in_list"
                :key="item.id"
                :bg-color="item.id && formData.category_id==item.id?'#71d5a1':''"
                @click="setCurCategory(item)"
            >
              <u-icon :name="item.icon" :size="46"></u-icon>
              <view class="grid-text">{{ item.name }}</view>
            </u-grid-item>
          </u-grid>
        </template>
      </view>
    </view>

    <view class="input_box">
      <view class="line">
        <input type="digit" min="0" max="999999999" v-model="formData.amount" class="amount_input" placeholder="0.00"
               @confirm="submit()"/>
      </view>

      <u-line></u-line>
      <view class="line">
        <text class="popup_type">{{formData.type===10?'收入':'支出'}}方式：</text>
        <u-tag class="amount_type"  v-for="(item,index) in amount_type" :text="item" :type="formData.amount_type===item?'primary':'info'"
                @click="setAmountType(item)"
                border-color="e5e5e5"
                mode="plain"
               size="mini"
        ></u-tag>
      </view>
      <view class="line">
        <view class="date">
          <text class="popup_type">日期：</text>
          <view style="font-size: 28rpx;font-weight: 600;" @click="picker_show = true">
            {{ formData.date }}
            <u-icon name="arrow-right" class="u-icon-wrap u-cell__right-icon-wrap"></u-icon>
          </view>
        </view>

        <u-button class="save_btn" type="success" size="medium" @click="submit()">保存</u-button>
      </view>
      <view class="line">
        <text class="popup_type">备注：</text>
        <input type="textarea" v-model="formData.remark" @input="onRemarkInput" placeholder="添加备注"
               style="font-size: 28rpx;width: 70%;" clearable border border-color="gray" auto-height />
      </view>

      <view class="line">
        <text class="popup_type">附件图片：</text>
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
      </view>

    </view>

    <u-picker mode="time" v-model="picker_show" :params="pickerOption" :default-time="formData.date"
              @confirm="pickerConfirm"></u-picker>
  </view>
</template>

<script>
import dayjs from '@/dayjs.min.js'
import constConfig from '@/const.js'
import uploadFile from "@/components/UploadFile.vue";
export default {
  components: {
    uploadFile
  },
  props: {
    value: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      type: 0,
      //资金途径（来源、去向）：支付宝、微信、银行卡、现金、其他
      amount_type: ['微信','支付宝','银行卡', '现金', '其他'],
      list: ['支出', '收入'],
      formData: {
        id: 0,
        type: 20,
        amount: '',
        category_id: 0,
        date: '',
        remark: '',
        amount_type:'',
        image: null
      },
      pickerOption: {
        year: true,
        month: true,
        day: true,
        hour: false,
        minute: false,
        second: false
      },
      picker_show: false,

      desc: "",
      cur_cotegry_name: "",

      out_list: [],
      in_list: [],

      img: '',

      iconclear: {
        color: "red",
        size: '20',
        type: 'clear'
      },

      initialFiles: [],
      action: constConfig.baseUrl + '/upload/image',
      header: {
        'Authorization': 'Bearer ' + (uni.getStorageSync('UserToken') || ''),
      },
      maxSize: 2 * 1024 * 1024, // 可以设置不同的大小限制
      maxCount: 1, // 可以设置不同的数量限制
      limitType: ['png', 'jpg', 'jpeg'], // 支持的文件类型
    }
  },
  watch: {
    value(id) {
      if (id !== null) {
        this.getCashflowInfo(id)
      }
      console.log(id)
    }
  },
  methods: {

    setAmountType(item) {
      console.log('t',item)
      this.formData.amount_type = item
    },

    handleFileUploadSuccess({url, index, fileList,res}) {
      console.log('文件上传成功:', url);
       if (res.code == 0) {
        this.formData.image = res.data.full_url
      } else {
        this.$u.toast(res.msg)
        //移除文件
        this.$refs.upload.remove(index)
      }
    },
    handleFileUploadRemove({index, fileList}) {
      // 更新状态或者做其他处理
      console.log('文件已被移除:', index);
      this.formData.image = null
    },
    beforeUpload(index, list) {
      return true;
    },

    typeChange(index) {
      this.type = index
      this.formData.type = index === 0 ? 20 : 10;
      this.formData.category_id = null
    },
    getCategory() {
      this.$u.api.getCategory(0).then(res => {
        //type10=收入，type20=支出
        if (res.code == 0 && res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].type === 10) {
              this.in_list.push(res.data[i])
            } else {
              this.out_list.push(res.data[i])
            }
          }
          this.in_list = this.listSet(this.in_list)
          this.out_list = this.listSet(this.out_list)
        }
      }).catch(err => {
        console.log(err)
      })

    },
    setCurCategory(item) {
      console.log(item, 'click')
      if (item.is_set) {
        return this.openSet()
      }
      this.formData.category_id = item.id
    },
    openSet() {
      console.log('打开设置页面')
      uni.navigateTo({
        url: "/pages/setting/category"
      })
    },
    listSet(list = []) {
      list.push({
        icon: "setting",
        name: "设置",
        is_set: true,
        id: null
      })
      return list
    },
    categoryChange(id) {
      console.log(id, 'categoryChange')
      this.formData.category_id = id
    },
    pickerConfirm(e) {
      this.formData.date = e.year + '-' + e.month + "-" + e.day;
    },
    onInput(e) {
      console.log(e)
      /*let v = e.detail.value;
      v = v.replace(/^\D*([1-9]\d{0,6}\.?\d{0,2})?.*$/, '$1');//输入数字
      this.formData.amount = v;*/
      return e.detail.value;
    },
    onRemarkInput(e) {
      this.formData.remark = e.detail.value;
    },
    submit() {
      console.log(this.$store.getters, 'getters')
      if (!this.formData.category_id) {
        this.$u.toast('请选择分类')
        return
      }
      /*if (this.formData.amount <= 0){
        this.$u.toast('请输入金额')
        return
      }*/
      if (!this.formData.date) {
        this.$u.toast('请选择日期')
        return
      }


      this.$emit('submit', this.formData)
    },

    getCashflowInfo(id) {
      this.$u.api.getCashflowInfo(id).then(res => {
        let data = res.data
        this.formData = data
        this.type = data.type === 20 ? 0 : 1
        if (data.image) {
          this.initialFiles = [{url: data.image}]
        }
      })
    },
  },
  created() {
    this.getCategory()
    this.formData.date = dayjs().format('YYYY-MM-DD')
  }
}
</script>

<style lang="scss">
.container {
  background-color: #ffffff;

  .type_selector {
    width: 100%;
    background-color: $uni-theme-color;
    display: flex;
    justify-content: center;
    padding-bottom: 30rpx;

    .selector {
      width: 80%;
    }
  }

  .amount_type{
    margin: 5px;
  }

  .category-item {
    margin-left: 8rpx;
    margin-top: 8rpx;
    font-size: 36rpx;
  }
}

.input_box {
  padding: 30rpx;

  .del-btn {
    position: absolute;
    top: 5rpx;
    left: 645rpx;
    z-index: 10;

    border-radius: 100rpx;
    width: 44rpx;
    height: 44rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;

  }
}

.line {
  display: flex;
  align-items: center;
  padding: 26rpx 32rpx;
  font-size: 28rpx;
  line-height: 54rpx;
  color: #606266;
  background-color: #fff;

  .date {
    flex: 1;
    display: flex;
  }

  .save_btn {
    text-align: right;
  }

  .amount_input {
    font-size: 50rpx;
    min-height: 100rpx;
    height: 100rpx;
    width: 100%;
  }
}


.popup_type {
  font-size: 28rpx;
  padding-right: 0rpx;
}

.u-cell__right-icon-wrap {
  display: inline-flex;
  align-items: center;
  padding-left: 10rpx;
}

.photo_icon {
  width: 100rpx;
  height: 100rpx;
  margin-left: auto;
}

.category-list {
  padding-top: 50rpx;

  .swiper {
    width: 100%;
  }
}
</style>
