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
                :bg-color="item.id && formData.category_id == item.id ? '#71d5a1' : ''"
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
                :bg-color="item.id && formData.category_id == item.id ? '#71d5a1' : ''"
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
            v-if="formData.amount_type"
            :closeable="true"
            :text="formData.amount_type"
            @close="unsetAmountType()"
            @click="unsetAmountType"
        ></u-tag>
        <u-button v-else @click="show_amount_type_list = true" size="mini">选择方式</u-button>
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

        <u-button class="save_btn" type="success" size="medium" @click="submit()">保存</u-button>
      </view>
      <view class="line">
        <text class="popup_type">关联预算：</text>
        <u-tag :closeable="true"
               v-if="formData.budget_id>0"
               :text="formData.budget_title"
               @close="unsetBudget()"
        ></u-tag>

        <u-button @click="show_budget_list = true" size="mini"
                  v-if="budget_list.length>1 && !formData.budget_title">选择预算
        </u-button>
        <u-button @click="goto('/pages/budget/detail',true)" size="mini"
                  v-if="budget_list.length<=1">添加预算
        </u-button>
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
    <u-select v-model="show_budget_list" :list="budget_list" @confirm="confirmBudget"></u-select>
    <u-select v-model="show_amount_type_list" :list="amount_type_list" @confirm="confirmAmountType"></u-select>
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
  data() {
    return {
      showOutList: [],
      showInList: [],
      showInAll: false,
      showOutAll: false,
      show_out_txt: '展开全部',
      show_in_txt: '展开全部',
      type: 0,
      show_budget_list: false,
      show_amount_type_list: false,
      //资金途径（来源、去向）：支付宝、微信、银行卡、现金、其他
      amount_type_list: [],
      list: ['支出', '收入'],
      formData: {
        id: 0,
        budge_id: 0,
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
      cur_cotegry_name: "",

      out_list: [],
      in_list: [],

      img: '',

      iconclear: {
        color: "red",
        size: '20',
        type: 'clear'
      },
      budget_list: [],

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
    unsetBudget() {
      this.formData.budget_id = 0
      this.formData.budget_title = ''
    },
    unsetAmountType() {
      this.formData.amount_type = ''
    },
    setAmountType(item) {
      console.log('t', item)
      this.formData.amount_type = item
    },
    confirmAmountType(item) {
      if (item[0].value === null) {
        this.formData.amount_type = ''
        uni.showModal({
          title: '',
          content: '确定跳到管理收支页面吗？',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/packageA/amount_type/index',
              })
            }
          }
        })
        return
      }
      console.log('选中方式', item[0].label)
      this.formData.amount_type = item[0].label
    },
    confirmBudget(item) {
      if (item[0].value === 0) {
        this.formData.budget_id = 0
        this.formData.budget_title = ''
        uni.showModal({
          title: '',
          content: '确定跳到管理预算页面吗？',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/budget/budget',
              })
            }
          }
        })
        return
      }
      console.log('选中预算', item[0].label)
      this.formData.budget_id = item[0].value
      this.formData.budget_title = item[0].label
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
      this.in_list = []
      this.out_list = []


      this.$u.api.cashflowPre({
        type: this.type,
        id: this.formData.id
      }).then(res => {
        //type10=收入，type20=支出
        if (res.code == 0) {
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
            this.amount_type_list = this.amount_type_list.concat([{
              value: null,
              label: '去管理收支方式',
            }])
          }
          this.budget_list = []
          if (res.data.budget_list.length > 0) {
            this.budget_list = res.data.budget_list
            this.budget_list = this.budget_list.concat([{
              value: 0,
              title: '管理预算',
              amount: 0,
              type: this.type === 0 ? 20 : 10,
              label: '管理预算？',
            }])
          }

          if (res.data.info) {
            this.formData = res.data.info
            this.formData.type = this.type === 0 ? 20 : 10
            if (this.formData.image) {
              this.initialFiles = [{url: this.formData.image}]
            }
          }

          if (!this.formData.id && res.data.default_amount_type) {
            this.formData.amount_type = res.data.default_amount_type
          }

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
      this.formData.type = item.type
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
      return e.detail.value;
    },

    goto(path, auth = true) {
      if (auth && !this.hasLogin) {
        this.$u.toast('请登录后查看');
        return
      }
      if (!path) {
        this.$u.toast('暂未开放')
        return
      }
      uni.navigateTo({
        url: path
      })
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
            if (this.formData.id) {
              this.$u.api.updateCashflow(this.formData).then(res => {
                if (res.code == 0) {
                  uni.navigateBack()
                } else {
                  this.$u.toast(res.msg);
                }
              })
            } else {
              this.$u.api.createCashFlow(this.formData).then(res => {
                console.log(res)
                if (res.code == 0) {
                  uni.showModal({
                    title: '',
                    content: '添加成功,是否继续添加？',
                    success: (res) => {
                      if (res.confirm) {
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
                        uni.switchTab({
                          url: '/pages/index/index'
                        })
                      }
                    }
                  })

                } else {
                  this.$u.toast(res.msg);
                }
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
