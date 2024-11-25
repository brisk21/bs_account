<template>
  <view class="container">
    <view v-if="!hasLogin" class="empty need_login">
      <u-empty text="未登录" mode="permission">
        <button size="mini" slot="bottom" class="go-to-login" @click="goToLoginPage()">请先登录</button>
      </u-empty>
    </view>
    <view v-else>
      <view class="data-list" v-if="list.length > 0">
        <view class="data-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
          <view class="data-item-title">
            <text>{{ item.title || '未设置名称' }}</text>
            <text class="time">{{ item.add_time }}</text>
          </view>

          <view class="data-item-content">
            {{ item.content }}
          </view>
        </view>
        <u-loadmore status="nomore" ></u-loadmore>
      </view>
      <view class="empty" v-else>
        <u-empty text="暂无数据" mode="list"></u-empty>
      </view>
      <fab :is-show="hasLogin" icon_name="plus" :url="'/pages/packageA/idea/detail'"></fab>
    </view>

  </view>
</template>

<script>
import p_idea from "@/common/p_idea";
import fab from "@/my-components/fab/index.vue";

export default {
  components: {
    fab
  },
  data() {
    return {
      list: [],
      form: {
        page: 0,
        limit: 20,
        keyword: ''
      }
    };
  },
  onShow() {
    this.list = []
    this.form.page = 0
    if (this.hasLogin){
      this.get_list()
    }
  },
  onLoad() {

  },
  onReachBottom() {
    this.get_list()
  },
  onPullDownRefresh() {
    this.list = []
    this.form.page = 0
    this.get_list()
    setTimeout(function () {
      uni.stopPullDownRefresh()
    }, 1000)
  },

  methods: {
    get_list() {
      if (!this.hasLogin){
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      this.form.page += 1
      p_idea.get_list(this.form).then((res) => {
        if (res.code === 0) {
         this.list = this.list.concat(res.data.list)
        }
      })
    },

    toDetail(item) {
      uni.navigateTo({
        url: '/pages/packageA/idea/detail?id=' + item.id,
        fail: (re) => {
          console.log(' fail', re)

        }
      })
    },

  }
}
</script>

<style lang="scss">
.container {
  padding: 30rpx;

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
      justify-content: space-between;
      margin-bottom: 30rpx;
      font-weight: 600;
    }

    .data-item-title > text:first-child {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1; /* 让标题占据剩余空间 */
    }

    .time {
      font-weight: normal;
      margin-left: 10px; /* 可以根据需要调整间距 */
    }

    .data-item-content{
      word-break: break-word;
    }
  }
}

</style>
