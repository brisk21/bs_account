<template>
  <view class="charts-box">
    <qiun-data-charts type="pie" :opts="opts" :loading-type="loadingType" :chartData="chartData" @error="error"/>
  </view>
</template>

<script>
// 类型饼图
export default {
  props: {
    loadingType: {
      type: Number,
      default: 3
    },
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      opts: {
        "legend": {
          "show": true,
          "position": "bottom",
        },
        "extra": {
          "pie": {
            "activeOpacity": 1,
            "border": false,
          },
        }
      }
    }
  },


  computed: {
    chartData() {
      let data = {
        series: []
      }
      if (this.list.length !== 0) {
        data.series = [{
          "data": this.list
        }]
      } else {
        data.series = []
      }
      return data
    }
  },
  methods: {
    error(err) {
      console.log(err)
    }
  }
}
</script>

<style>
.charts-box {
  width: 100%;
  height: 100%;
}
</style>
