<template>
  <view class="container">
    <view class="type_selector">
      <u-subsection class="selector" :animation="true" :list="list" @change="typeChange" active-color="#fff"
                    :current="type" mode="subsection">
      </u-subsection>
    </view>
    <view class="category-list">
      <view class="out-list" v-show="type === 0">
        <template v-if="out_list.length > 0">
          <u-grid :col="5" :border="true">
            <!-- 显示前10个项目 -->
            <u-grid-item
                v-for="(item, index) in showOutList"
                :key="item.id"
                :bg-color="item.id && formData.category_id === item.id ? '#71d5a1' : ''"
                @click="setCurCategory(item)"
            >
              <u-icon :name="item.icon" :size="46"></u-icon>
              <view class="grid-text">{{ item.name }}</view>
            </u-grid-item>
          </u-grid>
          <!-- 显示全部按钮 -->
          <view v-if="out_list.length > 10" class="show_btn">
            <u-button size="mini" type="primary" @click="toggleShowAll(20)">{{ show_out_txt }}</u-button>
          </view>
        </template>
      </view>
      <view class="in-list" v-show="type === 1">

        <template v-if="in_list.length > 0">
          <u-grid :col="5" :border="true">
            <!-- 显示前10个项目 -->
            <u-grid-item
                v-for="(item, index) in showInList"
                :key="item.id"
                :bg-color="item.id && formData.category_id === item.id ? '#19a6de' : ''"
                @click="setCurCategory(item)"
            >
              <u-icon :name="item.icon" :size="46"></u-icon>
              <view class="grid-text">{{ item.name }}</view>
            </u-grid-item>
          </u-grid>
          <!-- 显示全部按钮 -->
          <view v-if="in_list.length > 10" class="show_btn">
            <u-button size="mini" type="primary" @click="toggleShowAll(10)">{{ show_in_txt }}</u-button>
          </view>
        </template>
      </view>
    </view>

    <view class="input_box">
      <view class="line">
        <text class="must">*</text>
        <input type="digit" min="0" max="999999999" v-model="formData.amount" class="amount_input" placeholder="0.00"
               @confirm="submit()"/>
      </view>

      <u-line></u-line>
      <view class="line">
        <text class="popup_type">{{ formData.type === 10 ? '收入' : '支出' }}方式：</text>
        <u-tag
            v-show="formData.amount_type"
            :closeable="true"
            :text="formData.amount_type"
            @close="unsetAmountType()"
            @click="openPopup('amount_type')"
        ></u-tag>
        <u-button v-show="!formData.amount_type" @click="openPopup('amount_type')" size="mini">选择方式</u-button>
      </view>

      <view class="line">
        <view class="date">
          <text class="popup_type">
            <text class="must">*</text>
            日期：
          </text>
          <view style="font-size: 28rpx;font-weight: 600;" @click="picker_show = true">
            {{ formData.date }}
            <u-icon name="arrow-right" class="u-icon-wrap u-cell__right-icon-wrap"></u-icon>
          </view>
        </view>

        <u-button class="save_btn" type="success" :disabled="disabled" size="medium" @click="submit()">保存</u-button>
      </view>
      <view class="line">
        <text class="popup_type">关联预算：</text>
        <u-tag :closeable="true"
               v-show="!!formData.budget_id"
               :text="formData.budget_title"
               @click="openPopup('budget_list')"
               @close="unsetBudget()"
        ></u-tag>

        <u-button v-show="!formData.budget_id" @click="openPopup('budget_list')" size="mini">选择预算</u-button>
      </view>
      <view class="line" v-if="diy_action && diy_action.enable_cashbook && diy_action.enable_cashbook.value">
        <text class="popup_type">关联账簿：</text>
        <u-tag :closeable="true"
               v-show="!!formData.cashbook_id"
               :text="formData.cashbook_title"
               @click="openPopup('cashbook')"
               @close="unsetCashbook()"
        ></u-tag>

        <u-button v-show="!formData.cashbook_id" @click="openPopup('cashbook')" size="mini">选择账簿</u-button>
      </view>

      <u-form-item class="form-item" label="备注：" label-width="120">
        <u-input v-model="formData.remark" type="textarea"
                 placeholder="添加备注" maxlength="500"
                 clearable border auto-height/>
      </u-form-item>

      <view class="line">
        <text class="popup_type">附件图片：</text>
        <upload-file
            :action="action"
            :max-size="maxSize"
            :max-count="maxCount"
            :limit-type="limitType"
            :default-files="initialFiles"
            @success="handleFileUploadSuccess"
            @remove="handleFileUploadRemove"
        />
      </view>

      <view class="line">
        <view >
          自定义操作：可以在【我的】》【设置】》【<text class="topath" @click="gotoPath('/pages/packageA/user_setting/gexing',true)">个性化配置</text>】中自定义是否连续添加账单功能、启用账簿功能，开启后添加新账单记录后会清理输入框并保留在当前页面，否则添加后自动返回上一页。
        </view>
      </view>

    </view>
    <type_popup
        ref="type_popup"
        @selected="handleTypeSelected"
        :filtered-list="popup_data_list"
        :path="popup_manager_path"
        :show_type="popup_show_type"

    ></type_popup>
    <u-picker mode="time" v-model="picker_show" :params="pickerOption" :default-time="formData.date"
              @confirm="pickerConfirm"></u-picker>
  </view>
</template>

<script>
import dayjs from '@/dayjs.min.js'
import constConfig from '@/const.js'
import uploadFile from "@/components/UploadFile.vue";
import type_popup from "@/my-components/popup/type_popup.vue";

export default {
  components: {
    uploadFile, type_popup
  },
  data() {
    return {
      disabled: false,
      popup_manager_path: '',
      popup_data_list: [],
      popup_show_type: 'grid',
      popup_current: '',
      showOutList: [],
      showInList: [],
      showInAll: false,
      showOutAll: false,
      show_out_txt: '展开全部',
      show_in_txt: '展开全部',
      type: 0,
      amount_type_list: [],
      list: ['支出', '收入'],
      formData: {
        id: 0,
        budge_id: 0,
        cashbook_id: 0,
        type: 20,
        amount: '',
        category_id: 0,
        budget_title: '',
        date: '',
        remark: '',
        amount_type: '',
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

      diy_action: null,
      out_list: [],
      in_list: [],

      img: '',


      budget_list: [],
      cashbook_list: [],

      initialFiles: [],
      action: constConfig.baseUrl + '/upload/image',

      maxSize: 2 * 1024 * 1024, // 可以设置不同的大小限制
      maxCount: 1, // 可以设置不同的数量限制
      limitType: ['png', 'jpg', 'jpeg'], // 支持的文件类型
    }
  },
  mounted() {

  },
  onLoad(option) {
    if (option.id) {
      this.formData.id = option.id
    }
    if (option.type) {
      this.formData.type = option.type
      this.type = option.type == 20 ? 0 : 1
    }
    //this.get_ready()
    this.formData.date = dayjs().format('YYYY-MM-DD')
  },
  onShow() {
    this.get_ready()
  },
  created() {

  },

  methods: {
    openPopup(type) {
      this.popup_current = type
      if (type === 'amount_type') {
        this.popup_manager_path = '/pages/packageA/amount_type/index'
        this.popup_data_list = this.amount_type_list
        this.popup_show_type = 'list'
      } else if (type === 'budget_list') {
        this.popup_manager_path = '/pages/budget/budget'
        this.popup_data_list = this.budget_list
        this.popup_show_type = 'list'
      }else if (type === 'cashbook'){
        this.popup_manager_path = '/pages/packageA/cashbook/index'
        this.popup_data_list = this.cashbook_list
        this.popup_show_type = 'list'
      }

      this.$refs.type_popup.togglePopup();
    },
    handleTypeSelected(item) {
      //console.log(this.popup_current + '父组件接收到了:', item);
      try {
        if (this.popup_current === 'amount_type') {
          this.formData.amount_type = item.value
        }else if(this.popup_current === 'budget_list') {
          this.formData.budget_id = item.value
          this.formData.budget_title = item.label || 'xxx'
          console.log(this.formData.budget_title)
        }else if(this.popup_current === 'cashbook') {
          this.formData.cashbook_id = item.value
          this.formData.cashbook_title = item.label || 'xxx'
        }
      } catch (e) {
        console.log('err', e)
      }


    },
    unsetBudget() {
      this.formData.budget_id = 0
      this.formData.budget_title = ''
    },
    unsetCashbook() {
      this.formData.cashbook_id = 0
      this.formData.cashbook_title = ''
    },
    unsetAmountType() {
      this.formData.amount_type = ''
    },
    setAmountType(item) {
      this.formData.amount_type = item
    },
    handleFileUploadSuccess({url, index, fileList, res}) {
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
      this.get_ready()
    },
    toggleShowAll(type) {
      let status = type === 10 ? this.showInAll : this.showOutAll
      let text = ''
      if (!status) {
        if (type === 20) {
          this.showOutList = this.out_list;
        } else {
          this.showInList = this.in_list;
        }
        text = '收起'
      } else {
        if (type === 20) {
          this.showOutList = this.out_list.slice(0, 10);
        } else {
          this.showInList = this.in_list.slice(0, 10);
        }
        text = '展开全部'
      }
      type === 20 ? this.showOutAll = !this.showOutAll : this.showInAll = !this.showInAll
      if (type === 10) {
        this.show_in_txt = text
      } else {
        this.show_out_txt = text
      }
      this.$forceUpdate()


    },
    get_ready() {

      // if (this.$refs.type_popup && this.$refs.type_popup.showPopup) {
      //this.$refs.type_popup.closePopup();
      // }
      this.showInAll = false
      this.showOutAll = false
      this.show_out_txt = '展开全部'
      this.show_in_txt = '展开全部'
      this.in_list = []
      this.out_list = []
      this.$u.api.cashflowPre({
        type: this.type,
        id: this.formData.id
      }).then(res => {
        //type10=收入，type20=支出
        if (res.code === 0) {
          let category = res.data.category
          if (category.length > 0) {
            for (let i = 0; i < category.length; i++) {
              if (category[i].type === 10) {
                this.in_list.push(category[i])
              } else {
                this.out_list.push(category[i])
              }
            }
            this.in_list = this.listSet(this.in_list)
            this.out_list = this.listSet(this.out_list)
            this.showOutList = this.out_list.slice(0, 10);
            this.showInList = this.in_list.slice(0, 10);
          }
          this.amount_type_list = []
          if (res.data.accountTypes.length > 0) {
            this.amount_type_list = res.data.accountTypes
          }
          this.budget_list = []
          if (res.data.budget_list.length > 0) {
            this.budget_list = res.data.budget_list
          }

          this.cashbook_list = []
          if (res.data.cashbook_list.length > 0) {
            this.cashbook_list = res.data.cashbook_list
          }

          if (res.data.info) {
            this.formData = res.data.info
            this.formData.type = this.type === 0 ? 20 : 10
            if (this.formData.image) {
              this.initialFiles = [{url: this.formData.image}]
            }
          }
          if (res.data.diy_action) {
            this.diy_action = res.data.diy_action
          }

          if (!this.formData.id && res.data.default_amount_type) {
            this.formData.amount_type = res.data.default_amount_type
          }
          if (!this.formData.id && res.data.default_cashbook) {
            this.formData.cashbook_id = res.data.default_cashbook.cashbook_id
            this.formData.cashbook_title = res.data.default_cashbook.name
          }

        }
      }).catch(err => {
        console.log(err)
      })

    },
    setCurCategory(item) {
      //console.log(item, 'click')
      if (item.is_set) {
        return this.openSet()
      }
      this.formData.category_id = item.id
      this.formData.type = item.type
    },
    openSet() {
      //console.log('打开设置页面')
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
      return e.detail.value;
    },


    submit() {
      console.log(this.$store.getters, 'getters')
      if (!this.formData.category_id) {
        this.$u.toast('请选择分类')
        return
      }
      if (!this.formData.date) {
        this.$u.toast('请选择日期')
        return
      }

      uni.showModal({
        title: '',
        content: '确定保存吗？',
        success: (res) => {
          if (res.confirm) {
            this.disabled = true
            uni.showLoading({
              title: '保存中...'
            })
            if (this.formData.id) {
              this.$u.api.updateCashflow(this.formData).then(res => {
                this.$u.toast(res.msg, 1000);
                if (res.code == 0) {
                  setTimeout(() => {
                    uni.navigateBack()
                  }, 1000)
                }
                uni.hideLoading()
                this.disabled = false
              }).catch(() => {
                uni.hideLoading()
                this.disabled = false
              })
            } else {
              this.$u.api.createCashFlow(this.formData).then(res => {
                if (res.code == 0) {
                  //开启了连续添加模式
                  if (this.diy_action && this.diy_action.bill_action_continue.value) {
                    this.$u.toast('添加成功，您可以继续添加新记录', 3000)
                    this.formData = {
                      id: 0,
                      budge_id: 0,
                      type: this.formData.type,
                      amount: '',
                      category_id: 0,
                      budget_title: '',
                      date: this.formData.date,
                      remark: '',
                      amount_type: '',
                      image: null
                    }
                  } else {
                    this.$u.toast(res.msg)
                    setTimeout(function () {
                      uni.switchTab({
                        url: '/pages/index/index'
                      })
                    }, 1000)
                  }

                } else {
                  this.$u.toast(res.msg);
                }
                uni.hideLoading()
                this.disabled = false
              }).catch(() => {
                uni.hideLoading()
                this.disabled = false
              })
            }
          } else if (res.cancel) {
            //this.$u.toast('已取消');
          }
        }
      })
    },


  }

}
</script>

<style lang="scss">
.container {
  background-color: #ffffff;

  .topath{
    color: #2b85e4;
    text-underline: #2b85e4;
  }
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

  .must {
    color: $uni-color-error;
  }

  .show_btn {
    margin-top: 25rpx;
    text-align: center;
  }

  .amount_type {
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

.form-item {
  padding: 26rpx 32rpx;
  font-size: 28rpx;
  color: #606266;
  background-color: #fff;
  display: flex;
  flex-direction: column;
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
