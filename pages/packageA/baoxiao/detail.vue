<template>
  <view class="container">


    <view>
      <u-form label-width="100" label-position="top">
        <u-form-item label="账单:">
          <view v-if="list.length > 0" class="scroll data-list">

            <view class="list-box-children" v-for="(item, index) in list" :key="index" @click="toDetail(item.id)">
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
          </view>
        </u-form-item>
        <u-form-item label="附件:">
          <u-image v-for="(item, index) in formData.images" :key="index"
                   @click="previewImg(index)"
                   height="150rpx" width="150rpx" :src="item"></u-image>

        </u-form-item>
        <u-form-item label="备注:">
          <text style="color: rgb(111,108,108)">{{ formData.remark }}</text>

        </u-form-item>
        <u-form-item label="状态:">
          <u-tag v-if="formData.status==1" type="success" :text="formData.status_desc"/>
          <u-tag v-if="formData.status==-1" type="error" :text="formData.status_desc"/>
          <u-tag v-if="formData.status==0" type="primary" :text="formData.status_desc"/>
        </u-form-item>
        <u-form-item v-if="formData.check_time" label="审核时间:">
          <text style="color: rgb(111,108,108)">{{ formData.check_time }}</text>
        </u-form-item>
        <u-form-item v-if="formData.check_fail_reason" label="驳回理由:">
          <text style="color: rgb(233,8,8)">{{ formData.check_fail_reason }}</text>
        </u-form-item>
        <u-form-item label="提交时间:">
          <text style="color: rgb(111,108,108)">{{ formData.created_at }}</text>
        </u-form-item>
        <u-form-item label="审核状态:" v-if="formData.buttons && formData.buttons.check===1">
          <u-radio-group v-model="form.status">
            <u-radio name="1">通过</u-radio>
            <u-radio name="-1">驳回</u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item label="审核不通过原因:" v-if=" formData.buttons && formData.buttons.check==1 && form.status==-1">
          <u-input v-model="form.check_fail_reason" placeholder="请输入驳回理由" placeholder-style="color: #c8c4c4"
                   :border="false"
                   :clearable="false"
                   :maxlength="200"
                   :autofocus="false"
                   :focus="false"
                   :show-word-limit="true"
                   :auto-height="false"></u-input>
        </u-form-item>

      </u-form>
    </view>
    <view class="button-group">

      <u-button class="buttons" @click="goBack" size="medium " plain type="primary">返回
      </u-button>
      <u-button v-if="formData.buttons && formData.buttons.check==1" class="buttons" type="warning" @click="check"
                size="medium " plain>
        提交审核结果
      </u-button>
    </view>

  </view>
</template>
<script>
import {get_detail, check} from "@/common/p_reimbursement"

export default {
  components: {},
  data() {
    return {

      list: [],
      formData: {
        id: 0,
        ids: '',
        remark: '',
        images: [],
      },
      form: {
        id: 0,
        status: 1,
        check_fail_reason: '',
      }
    }
  },
  onShow() {

  },
  onLoad(options) {
    if (options.id) {
      this.formData.id = options.id
      this.info()
    }
  },
  methods: {
    toDetail(id) {
      uni.navigateTo({
        url: `/pages/index/detail?id=${id}`
      });
    },
    async info() {
      let that = this
      await get_detail({id: this.formData.id})
          .then(res => {
            if (res.code === 0) {
              this.formData = res.data.info
              this.list = res.data.cashflows
            }
          })
          .finally(() => {

          })
    },
    previewImg(index) {
      uni.previewImage({
        urls: this.formData.images,
        current: index
      })
    },
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    },
    check() {
      this.form.id = this.formData.id
      if (!this.form.status) {
        uni.showToast({
          title: '请选择审核状态',
          icon: 'none'
        })
        return
      }
      if (this.form.status === -1 && !this.form.check_fail_reason) {
        uni.showToast({
          title: '请填写驳回理由',
          icon: 'none'
        })
        return
      }
      uni.showModal({
        title: '确定提交审核吗？',
        content: '请确认信息无误',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '正在提交'
            })
            check(this.form).then(res => {
              uni.showToast({
                title: res.msg,
                icon: 'none'
              })
              if (res.code === 0) {

                setTimeout(() => {
                  uni.hideLoading()
                  uni.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            })
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
    background-color: #42b983;
    color: white;
    font-size: 16px;

    &:disabled {
      background-color: #d3d3d3;
    }
  }
}
</style>
