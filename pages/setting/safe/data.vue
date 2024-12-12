<template>
  <view class="container">
    <view class="menu-container">
      <view class="menu-list">
        <u-cell-group>

          <u-cell-item @click="gotoPath('/pages/setting/safe/export_data')" title="导出账单" icon="download">
            <text >导出已有账单数据</text>
          </u-cell-item>
          <u-cell-item @click="gotoPath('/pages/setting/safe/import_data')" :icon-style="{transform: 'rotate(180deg)'}" title="导入账单" icon="download">
            导入微信、支付宝等账单
          </u-cell-item>

        </u-cell-group>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      file_url: ''
    }
  },

  methods: {

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


.menu-list {
  margin-top: 30upx;
  background: #fff;
  border-radius: 10upx;

  switch {
    transform: scale(0.7, 0.7)
  }
}


</style>
