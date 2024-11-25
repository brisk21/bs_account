<template>
  <view class="container">
    <view v-if="!hasLogin" class="empty need_login">
        <u-empty text="未登录" mode="permission">
          <button size="mini" slot="bottom" class="go-to-login" @click="goToLoginPage()">请先登录</button>
        </u-empty>
      </view>
    <view class="extend" v-else>
      <view class="u-search-box">
        <u-search :shape="'round'" clearable :show-action="true" :placeholder="'搜索'"
                  :shape-radius="'30rpx'" :background-color="'#f5f5f5'" :action-text="'搜索'"
                  @search="search"
                  @custom="search"
                  @clear="search_clear"
                  v-model="form.keywords"
        ></u-search>
      </view>

      <view class="data-list">
        <view class="data-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
          <view class="data-item-title">
            <u-icon :name="item.icon" :size="36"></u-icon>
            <text class="name">{{ item.name }}</text>
          </view>
          <view class="data-item-content remark">
            {{ item.remark }}
          </view>
          <view class="data-item-content action-list">
            <u-button size="mini" shape="circle" :type="item.buttons.add?'primary':'default'"
                      @click.stop="action(item, 'add')"
                      :disabled="item.added">
              {{ item.buttons.add ? '添加' : '已添加' }}
            </u-button>
            <u-button size="mini" shape="circle" type="default" @click.stop="action(item, 'remove')"
                      :disabled="!item.added">
              {{ item.buttons.remove ? '移除' : '待添加' }}
            </u-button>
            <u-button v-if="item.added" size="mini" shape="circle" type="default" @click.stop="action(item, 'top')"
                      >
              {{ item.buttons.top ? '置顶' : '取消置顶' }}
            </u-button>

          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import extend from "@/common/extend";

export default {
  data() {
    return {
      list: [],
      form: {
        page: 1,
        limit: 20,
        keyword: ''
      }
    };
  },
  onLoad() {
    this.getList()
  },
  methods: {
    getList() {
      extend.get_list(this.form).then((res) => {
        if (res.code === 0) {
          this.list = res.data.list
        }
      });
    },

    search(value) {
      console.log(value);
      this.form.keyword = value || ''
      this.getList()
    },
    search_clear() {
      this.form.keyword = ''
      this.getList()
    },


    action(item, action) {
      // 这里可以添加调用后端API的代码来启用、禁用或置顶项目
      console.log(`Action: ${action}, Item: `, item);
      if (action === 'add') {

        uni.showModal({
          title: '',
          content: '确定要启用插件吗？启用后在用户中心可看到',
          success: (res) => {
            if (res.confirm) {
              extend.save({plugin_id: item.plugin_id, action: 'add'}).then((res) => {
                this.$u.toast(res.msg)
                if (res.code === 0) {
                  this.getList()
                }
              })
            }
          }
        })


      } else if (action === 'remove') {

        uni.showModal({
          title: '',
          content: '确定要移除插件吗，移除后自定义数据将被清空？',
          success: (res) => {
            if (res.confirm) {
              extend.remove({plugin_id: item.plugin_id}).then((res) => {
                this.$u.toast(res.msg)
                if (res.code === 0) {
                  this.getList()
                }
              })
            }
          }
        })


      } else if (action === 'top') {
        extend.save({plugin_id: item.plugin_id, action: 'top'}).then((res) => {
          this.$u.toast(res.msg)
          if (res.code === 0) {
            this.getList()
          }
        })
      }
  },
  toDetail(item) {
    uni.navigateTo({
      url: `/pages/extend/detail?id=${item.plugin_id}`,
      fail: (err) => {
        console.log(' fail', err)
      }
    })
    return
  },
}
}
</script>

<style lang="scss">
.container {

  height: 100%;
  overflow: hidden;

  .extend {
    padding: 8rpx;
    margin-top: 20rpx;

    .u-search-box {
      margin-bottom: 20rpx;
    }

    .data-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 20rpx;
      border: 1px solid #eee;
      border-radius: 10rpx;
      padding: 20rpx;

      .data-item-title {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .data-item-title-text {
          font-size: 36rpx;
          color: #999;
          margin-right: 10rpx;

        }
        .name{
          margin-left: 10rpx;
          line-height: 38rpx;
        }
      }

      .data-item-content {
        margin-top: 10rpx;
      }

      .remark {
        color: #999;
      }

      .action-list {
        button {
          margin-left: 10rpx;
        }
      }
    }
  }
}
</style>
