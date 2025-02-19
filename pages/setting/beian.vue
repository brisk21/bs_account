<template>
  <view class="container">
    <view class="menu-container">
      <view class="menu-list">
        <u-cell-group>
          <u-cell-item title="备案号" :arrow="false">
            {{ beian_no }}
          </u-cell-item>
          <u-cell-item title="查询链接">
            <u-link :href="beian_url"
                    :under-line="false">{{beian_url}}
            </u-link>
          </u-cell-item>
        </u-cell-group>
      </view>
    </view>


  </view>
</template>

<script>

import api from "@/common/setting";
export default {
  components: {},
  data() {
    return {
      beian_no: '',
      beian_no_xcx: '',
      beian_url: ''
    }
  },

  methods: {
    base_info(){
      api.base_info().then(res=>{
        if (res.code==0){
          this.beian_no = res.data.beian_no;
          this.beian_no_xcx = res.data.beian_no_xcx;
          this.beian_url = res.data.beian_url
        }
      })
    }
  },
  onLoad(options) {
    this.base_info();
    // #ifdef MP-WEIXIN
    this.beian_no = this.beian_no_xcx
    // #endif
  },
  onShow() {

  }
}
</script>

<style lang="scss">
.container {
  background-color: #f5f5f5;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 10upx;
}


.menu-list {
  margin-top: 30upx;
  background: #fff;
  border-radius: 10upx;

  switch {
    transform: scale(0.7, 0.7)
  }
}

.list-item {
  width: 100%;
  padding: 0rpx;
  background-color: #FFFFFF !important;
  border: initial;
  text-align: initial;
}

.list-item::after {
  border: initial;
}
</style>
