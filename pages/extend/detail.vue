<template>
  <view class="content">
    <mp-html :content="html"/>
    <view class="pages-list" v-if="path_list.length > 0">
      <view v-for="(item, index) in path_list" :key="index"
          class="u-padding-10 u-line-height-40 u-border-bottom u-border-top u-bg-grey quick-link">
        <text @click="goto(item)" class="u-text-center">{{ item.title }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
import extend from "@/common/extend";
export default {
  components: {
    mpHtml
  },
  data() {
    return {
      id: null,
      info: {},
      path_list: []
    };
  },
  computed: {
    html() {
      return this.info ? this.info.content : ''
    },
    userInfo() {
      return this.$store.getters.user
    },
  },
  methods: {
    goto(pathInfo) {
      if (pathInfo.jump_type == 'inner') {
        this.$u.route(pathInfo.path)
      } else if (pathInfo.jump_type == 'link') {
        window.location.href = pathInfo.path
      } else if (pathInfo.jump_type == 'tab') {
        this.$u.route({
          type: 'tab',
          url: pathInfo.path
        })
      }
    },
    getData() {
      extend.get_detail({id:this.id}).then(res => {
        if (res.code == 1) {
          this.$u.toast(res.msg);
          return
        }
        this.info = res.data.info
        this.path_list = res.data.path_list || []
      })
    }
  },
  onLoad(opt) {
    if (opt.id) {
      this.id = opt.id
      this.getData()
    }
  }
}
</script>

<style lang="scss">
.content {
  padding: 30rpx;
}
.pages-list{
  margin-top: 30rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: normal;
  align-items: center;

  .quick-link{
    background: #f5f5f5;
    border-radius: 10rpx;
    padding: 20rpx;
    color: #1f5cd7;
    margin-left: 10rpx;
  }
}



</style>
