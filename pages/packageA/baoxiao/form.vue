<template>
  <view class="container">
    <!-- 步骤条 -->
    <u-steps mode="dot" :list="numList" :current="currentStep"></u-steps>

    <!-- 根据当前步骤显示不同的内容 -->
    <view v-show="currentStep === 0">
      <view>
        <view class="search-box">
          <u-dropdown>
            <u-dropdown-item v-model="form.cashbook_id" title="选择账本"
                             :value="form.cashbook_id"
                             :options="cashbook_list"
                             @change="set_cashbook"
            ></u-dropdown-item>
          </u-dropdown>
          <view class="search-box-left">
            <u-search :clearable="true" :show-action="true" :show-action-icon="true"
                      input-align="left" placeholder="分类、收支类型、备注查询"
                      v-model="form.keywords"
                      action-text="搜索"
                      @search="toSearch" @custom="toSearch"></u-search>
          </view>
        </view>
        <view v-if="list.length > 0" class="scroll data-list">

          <view class="list-box-children" v-for="(item, index) in list" :key="index">
            <label class="u-flex item-checkbox">
              <u-checkbox :disabled="item.disable || false" v-model="selectedItems[item.id]" :name="item.id"
                          @change="updateSelected"></u-checkbox>
            </label>
            <view class="u-flex-1  box-left box-left">
              <u-icon :name="item.category.icon" color="#42b479" size="32"></u-icon>
              {{ item.category.name }}
            </view>

            <view class="u-flex-1  box-right amount-green" v-if="item.type===20">
              -￥{{ item.amount }}
            </view>
            <view class="u-flex-1  box-right amount-red" v-else>
              +￥{{ item.amount }}
            </view>
            <view class="u-flex-1 box-right item-date">
              {{ item.date }}
            </view>
          </view>
          <u-loadmore v-if="list.length >= form.limit" @loadmore="loadMore"></u-loadmore>

        </view>
      </view>
    </view>
    <view v-show="currentStep === 1">
      <view>
        <u-form label-width="150">

          <u-form-item label="附件">
            <upload-file
                :action="action"
                :max-size="maxSize"
                :max-count="maxCount"
                :limit-type="limitType"
                :default-files="initialFiles"
                @success="handleFileUploadSuccess"
                @remove="handleFileUploadRemove"
            />
          </u-form-item>
          <u-form-item label="备注">
            <u-input type="textarea" v-model="formData.remark" placeholder="请输入备注" style="height: 100px"
                     auto-height></u-input>
          </u-form-item>
        </u-form>
      </view>
    </view>


    <!-- 按钮操作 -->
    <view class="button-group">
      <u-button class="buttons" @click="prevStep" size="medium " :disabled="currentStep == 0"
                v-if="currentStep>0">上一步
      </u-button>
      <u-button class="buttons" @click="nextStep" size="medium " v-if="currentStep == 0">下一步</u-button>
      <u-button class="buttons" @click="submit" size="medium " type="primary" v-if="currentStep == 1">提交
      </u-button>
    </view>
  </view>
</template>
<script>

import constConfig from "@/const";
import uploadFile from "@/components/UploadFile.vue";
import {create, update, get_detail, remove} from "@/common/p_reimbursement"

export default {
  components: {
    uploadFile
  },
  data() {
    return {
      cashbook_list: [
        {label: '全部', value: ''},
      ],
      list: [],
      currentStep: 0, // 当前步骤索引从0开始
      numList: [{
        name: '选择账单'
      }, {
        name: '备注和附件'
      }],
      selectAll: false,
      selectedItems: {}, // 使用对象来存储每个项目的选中状态
      form: {
        from: 'reimbursement',
        keywords: '',
        category_id: 0,
        type: 0,
        type_name: '',
        budget_id: 0,
        budget_title: '',
        cashbook_id: 0,
        cashbook_title: '',
        month: '',
        year: '',
        time_type: '',
        amount_type: '',
        sort: '',
        page: 0,
        limit: 10,
      },
      formData: {
        id: 0,
        ids: '',
        remark: '',
        images: [],
      },

      initialFiles: [],
      action: constConfig.baseUrl + '/upload/image',

      maxSize: 2 * 1024 * 1024, // 可以设置不同的大小限制
      maxCount: 4, // 可以设置不同的数量限制
      limitType: ['png', 'jpg', 'jpeg'], // 支持的文件类型
    }
  },
  onShow() {
    if (this.hasLogin) {
      this.$store.dispatch('getUserInfo')
    }
  },
  onLoad(options) {
    this.get_search_config()
    if (options.id) {
      this.formData.id = options.id
      this.info()
    } else {
      this.getList(true)
    }
  },
  methods: {
    async info() {
      let that = this
      await get_detail({id: this.formData.id}).then(res => {
        if (res.code === 0) {
          this.formData = res.data.info
          this.form.cashbook_id = res.data.info.cashbook_id
          this.getList(true)
          res.data.cashflows.forEach(item => {
            //this.selectedItems[item.id] = true
            this.$set(this.selectedItems, item.id, true);
          })
          if (res.data.info.files.length > 0) {
            that.initialFiles = res.data.info.files
          }
        }
      }).finally(() => {

      })
    },

    loadMore() {
      this.form.page = this.form.page + 1
      this.getList()
    },
    get_search_config() {
      let that = this
      this.$u.api.bill_list_search({from: 'list_option'}).then(res => {
        console.log(res)
        let data = res.data
        if (res.code == 0) {
          /*if (data.budget_list.length > 0) {
            that.budget_list = that.budget_list.concat(data.budget_list)
          }*/
          if (data.cashbook_list.length > 0) {
            that.cashbook_list = that.cashbook_list.concat(data.cashbook_list)
          }
          /*if (data.amount_type.length > 0) {
            that.amount_type = that.amount_type.concat(data.amount_type)
          }
          if (data.type.length > 0) {
            that.type = data.type
          }
          if (data.time_type.length > 0) {
            that.time_type = data.time_type
          }
          if (data.sort_list.length > 0) {
            that.sort_list = data.sort_list
          }
          if (data.category_list.length > 0){
            that.category_list = data.category_list
          }*/
        }

      })
    },
    set_cashbook(item) {
      // this.form.cashbook_id = item.value
      this.form.cashbook_title = item.label
      this.getList(true)
    },
    toSearch() {
      this.form.page = 0
      this.getList(true)
    },
    handleFileUploadSuccess({url, index, fileList, res}) {
      console.log('文件上传成功:', url);
      if (res.code == 0) {
        this.formData.images.push(res.data.full_url)
      } else {
        this.$u.toast(res.msg)
        //移除文件
        this.$refs.upload.remove(index)
      }
    },
    handleFileUploadRemove({index, fileList}) {
      // 更新状态或者做其他处理
      console.log('文件已被移除:', index);
      //移除对应的文件
      this.formData.images.splice(index, 1)
    },
    beforeUpload(index, list) {
      return true;
    },
    updateSelected(event) {
      console.log(event)
      const {name, checked} = event;
      //this.selectedItems[name] = !checked;
      console.log(this.selectedItems)
      this.$set(this.selectedItems, name, checked);
    },
    async getList(is_init) {
      if (!this.hasLogin) {
        return
      }
      if (this.is_pulling) {
        return;
      }
      let that = this;
      if (is_init) {
        this.form.page = 0
        this.list = []
        this.no_more = false
      }
      this.is_pulling = true
      this.form.page += 1
      uni.showLoading({
        title: '数据加载中...',
      })
      this.form.reimbursement_id = this.formData.id
      await this.$u.api.bill_list_options(this.form).then(res => {
        if (res.code == 0) {
          this.total_income = res.data.total_income
          this.total_outcome = res.data.total_outcome
          this.total = res.data.total
          this.diff_amount = res.data.diff_amount
          if (res.data.list.length > 0) {
            this.list = this.list.concat(res.data.list)
          } else {
            this.no_more = true
            this.$u.toast('没有更多数据了')
          }

        }

      }).catch(() => {
      }).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(function () {
          that.is_fresh = false;
          that.is_pulling = false
          uni.hideLoading()
        }, 1000)
      })
    },
    // 上一步
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    // 下一步
    nextStep() {
      if (this.currentStep < this.numList.length - 1) {
        this.currentStep++;
      }
    },
    submit() {
      if (!this.selectedItems) {
        this.$u.toast('请选择账单')
        return
      }
      //查询选中的账单
      let ids = []
      for (let i in this.selectedItems) {
        if (this.selectedItems[i]) {
          ids.push(i)
        }
      }
      if (ids.length <= 0) {
        this.$u.toast('请选择账单')
        return
      }

      this.formData.ids = ids.join(',')
      this.formData.cashbook_id = this.form.cashbook_id
      let that = this
      uni.showModal({
        title: '',
        content: '确定提交保存数据吗',
        success: (res) => {
          if (res.confirm) {
            if (this.formData.id) {
              update(that.formData).then(res => {
                that.$u.toast(res.msg);
                if (res.code == 0) {
                  setTimeout(function () {
                    uni.navigateBack()
                  }, 1000)
                }
              })
            } else {
              create(that.formData).then(res => {
                that.$u.toast(res.msg);
                if (res.code == 0) {
                  setTimeout(function () {
                    uni.navigateBack()
                  }, 1000)
                }
              })
            }
          } else if (res.cancel) {
            this.$u.toast('已取消');
          }
        }
      })
    },
  }
}
</script>
<style lang="scss">
.container {
  padding: 30rpx;
  margin-top: 10px;
  background-color: white;

  // scroll-view 通过flex 布局 自适应
  /* height: 100vh;*/
  display: flex;
  flex-direction: column;

  .scroll {
    flex: 1;
    overflow: scroll;
  }

  .need_login {
    margin-top: 45%;
    background: white;
  }

  .search-popup {
    padding-top: 20px;
    padding-left: 10px;
    height: 100%;

    .line {
      display: flex;
      flex-direction: row;
      margin-top: 10px;

    }

    .btn-list {
      display: flex;
      justify-content: space-evenly;
      margin-top: 50rpx;
      padding-right: 10px;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      align-items: center;

      .action-btn {
        width: 100%;
        border-radius: unset !important;
      }
    }
  }

  // 自适应结束


  .header-icon {
    padding: 15rpx;
  }

  .search-box {
    margin: 10rpx;
  }

  .list-box {
    padding: 18rpx 18rpx 18rpx 40rpx;
  }

  .no-more {
    text-align: center;
    color: rgb(200, 196, 196);
    margin-top: 10rpx;
    margin-bottom: 10rpx;
  }

  .list-box-children {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 26rpx 32rpx;
    font-size: 28rpx;
    line-height: 50rpx;
    color: #606266;
    background-color: #fff;
    text-align: left;

    .icon {
      font-size: 50rpx;
      padding-right: 10rpx;
    }

    .box-icon {
      width: 50rpx;
      height: 50rpx;
      margin-right: 35rpx;
    }

    .box-left {
      width: auto;
      font-weight: 500;
      font-size: 28rpx;
    }

    .box-right {
      overflow: hidden;
      text-align: right;
      vertical-align: middle;
      color: #909399;
      font-size: 26rpx;

    }

    .amount-green {
      color: #42b479;
    }

    .amount-red {
      color: #ff0000;
    }

    .box-remark {
      font-weight: 500;
      width: 100rpx;
      margin-left: 50rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      -ms-text-overflow: ellipsis;
      display: -webkit-box;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      color: #c8c4c4;
    }

    .item-date {

    }
  }

  .data-list {
    position: relative;
    top: 0px;
    width: 100%;
  }

  .empty {
    margin-top: 200px;
  }
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;

  .buttons {
    width: 48%;
    padding: 10px;
    border-radius: 5px;
    border: none;
    color: white;
    font-size: 16px;
    background-color: #089c08;
    /* #ifdef MP-WEIXIN */
    background-color: unset !important;
    /* #endif */


    &:disabled {
      background-color: #d3d3d3;
    }
  }
}
</style>
