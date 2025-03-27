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
      <view class="line" v-if="diy_action && diy_action.enable_amount_type && diy_action.enable_amount_type.value">
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
      <view class="line" v-if="diy_action && diy_action.enable_budget && diy_action.enable_budget.value">
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

      <u-form-item v-if="diy_action && diy_action.enable_bill_cycle && diy_action.enable_bill_cycle.value"
                   class="form-item" label="周期循环：" label-width="150">
        <u-radio-group v-model="formData.cycle_type" @change="cycleChange">
          <u-radio name="">不循环</u-radio>
          <u-radio name="daily">每日</u-radio>
          <u-radio name="weekly">每周</u-radio>
          <u-radio name="monthly">每月</u-radio>
          <u-radio name="quarterly">每季度</u-radio>
          <u-radio name="yearly">每年</u-radio>
          <u-radio name="custom">自定义</u-radio>
        </u-radio-group>
      </u-form-item>
      <u-form-item v-if="diy_action && formData.cycle_type && formData.cycle_type === 'custom'" class="form-item"
                   label="循环天数：" label-width="150">
        <u-input v-model="formData.cycle_days" type="digit"
                 placeholder="请输入天数" maxlength="500"
                 clearable border auto-height/>
      </u-form-item>

      <view class="line">
        <text class="popup_type">附件图片：</text>
        <upload-file
            :auto-upload="true"
            :unique_id="1"
            ref="upload"
            :default-files="initialFiles"
            :action="action"
            :max-size="maxSize"
            :max-count="maxCount"
            :limit-type="limitType"
            @success="handleFileUploadSuccess"
            @remove="handleFileUploadRemove"
            @error="handleError"
            @choose-ok="handleChooseOK"
        />
      </view>

      <view class="line">
        <view>
          自定义操作：可以在【我的】》【设置】》【
          <text class="topath" @click="gotoPath('/pages/packageA/user_setting/gexing',true)">个性化配置</text>
          】中自定义
          <text style="color: red">是否连续添加账单功能、启用账簿、启用循环周期、收支方式、预算管理</text>
          等功能，开启相关功能后，可以有【选择收支方式】、【关联预算】、【关联账簿】等按钮，可以进行自定义操作。
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
        image: [],
        is_cycle: false,
        cycle_type: '', // 新增字段
        cycle_days: '',
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
      maxCount: 5, // 可以设置不同的数量限制
      limitType: ['png', 'jpg', 'jpeg'], // 支持的文件类型

      imageCount: 0,
      uploadCount: 0,
      image_list: []
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
    if (this.hasLogin) {
      this.$store.dispatch('getUserInfo')
    }
    this.get_ready()
  },
  created() {

  },

  methods: {

    cycleChange(val) {
      this.formData.is_cycle = true
      if (!val) {
        this.formData.is_cycle = false
        this.formData.cycle_type = ''
        this.formData.cycle_days = ''
      }
      if (val !== 'custom') {
        this.formData.cycle_days = ''
      }
    },

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
      } else if (type === 'cashbook') {
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
        } else if (this.popup_current === 'budget_list') {
          this.formData.budget_id = item.value
          this.formData.budget_title = item.label || 'xxx'
          console.log(this.formData.budget_title)
        } else if (this.popup_current === 'cashbook') {
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
    handleChooseOK(res) {
      let {fileList, index, unique_id} = res
      console.log('handleChooseOK', [fileList, index, unique_id])
      //this.formData[unique_id].image_list = fileList
      this.imageCount++;
    },
    handleError(data, index, lists, name) {
      this.$u.toast('文件上传失败')
      this.handleRemove(index, lists, name)
    },
    handleFileUploadSuccess({url, index, fileList, res, unique_id}) {
      console.log('文件上传成功:', fileList);
      if (res.code == 0) {
        this.formData.image.push(res.data.full_url)
        console.log(this.formData.image)
        // this.formData.image = this.formData.image
        this.uploadCount++;
      } else {
        this.$u.toast(res.msg)
        //移除文件
        this.$refs.upload.remove(index)

        this.formData.image.splice(index, 1)
      }
    },
    handleFileUploadRemove({index, fileList, unique_id}) {
      // 更新状态或者做其他处理
      console.log('文件已被移除:', index);
      console.log('fileList', fileList);
      this.formData.image.splice(index, 1)
      this.imageCount--;
      return true
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
          if (res.data.max_image_count) {
            this.maxCount = res.data.max_image_count
          }

          if (res.data.info) {
            this.formData = res.data.info
            this.formData.type = this.type === 0 ? 20 : 10
            this.formData.image = [];
            if (this.formData.image_list.length > 0) {
              this.formData.image = this.formData.image_list
              console.log(this.formData.image)
              //this.imageCount = this.formData.image.length
              //this.initialFiles = [{url: this.formData.image}]
              let initialFiles = []
              for (let i = 0; i < this.formData.image_list.length; i++) {
                initialFiles.push({
                  url: this.formData.image[i],
                  //unique_id: this.formData.image[i]
                })
              }
              console.log(initialFiles)
              this.initialFiles = initialFiles
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


    async submit() {
      let that = this;
      if (that.disabled === true) {
        return false;
      }

      if (!this.formData.category_id) {
        this.$u.toast('请选择分类')
        return
      }
      if (!this.formData.date) {
        this.$u.toast('请选择日期')
        return
      }


      //todo 多图上传被异步的问题，目前用了while 循环，但可能存在问题，需要优化
      /*let pollCount = 0; // 新增：用于记录轮询次数
      const maxPollAttempts = 60; // 设置最大轮询次数（例如60次，即最多等待60秒）
      console.log('imageCount', that.imageCount)
      // 遍历所有的upload组件并调用startUpload
      await that.$refs.upload.startUpload();
      // 等待所有图片上传完成
      while (that.imageCount > that.uploadCount) {
        uni.showLoading({
          title: '正在上传...',
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        pollCount++; // 每次轮询后增加计数器
        uni.hideLoading();

        // 可选：在每次轮询时检查是否已经完成上传，提前退出
        if (that.imageCount === that.uploadCount || pollCount >= maxPollAttempts) {
          break;
        }
      }
      if (pollCount >= maxPollAttempts) {
        console.warn('达到最大轮询次数，可能有上传任务未完成');
        // 在这里可以添加一些额外的逻辑，比如提示用户上传可能失败了
      }*/
      console.log('uploadedCount', that.uploadCount)
      console.log('formData', that.formData)

      let submitAction = function (formData) {
        uni.showModal({
          title: '',
          content: '确定保存吗？',
          success: (res) => {
            if (res.confirm) {
              that.disabled = true
              if (that.formData.id) {
                that.$u.api.updateCashflow(that.formData).then(res => {
                  uni.showToast({
                    icon: 'none',
                    title: res.msg,
                    duration: 1500
                  })
                  if (res.code == 0) {
                    setTimeout(() => {
                      uni.navigateBack()
                    }, 1000)
                  }
                  that.disabled = false
                }).catch(() => {
                  that.disabled = false
                })
              } else {
                that.$u.api.createCashFlow(that.formData).then(res => {
                  if (res.code == 0) {
                    //开启了连续添加模式
                    if (that.diy_action && that.diy_action.bill_action_continue.value) {
                      uni.showToast({
                        icon: 'none',
                        title: '添加成功，您可以继续添加新记录',
                        duration: 2000,
                        fail: function(err) {
                          console.log('msg_err', err)
                        }
                      })
                      that.formData = {
                        id: 0,
                        budge_id: 0,
                        //cashbook_id: 0,
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
                      uni.showToast({
                        icon:  'none',
                        title: res.msg,
                        duration: 1500,
                        fail: function(err) {
                          console.log('msg_err', err)
                        }
                      })
                      setTimeout(function () {
                        uni.switchTab({
                          url: '/pages/index/index'
                        })
                      }, 1000)
                    }

                  } else {
                    uni.showToast({
                      icon: 'none',
                      title: res.msg,
                      duration: 2000
                    })
                  }
                  this.disabled = false
                }).catch(() => {
                  that.disabled = false
                })
              }
            } else if (res.cancel) {
              //that.$u.toast('已取消');
            }
          }
        })
      }
      await submitAction(that.formData)

    },


  }

}
</script>

<style lang="scss">
.container {
  background-color: #ffffff;

  .topath {
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
