<template>
  <view class="calendar-container">
    <picker mode="selector" :range="options" :value="currentOptionIndex" @change="bindMonthChange">
      <button size="mini">{{ currentOption }}</button>
    </picker>


    <!-- 按年显示的视图 -->
    <view class="year-view">
      <view v-for="(month, index) in months" :key="index" class="month-box">
        <text>{{ currentYear }}年{{ month }}月</text>
        <text class="income">收入：￥{{ monthData[`${currentYear}-${padZero(month)}`].income || '0.00' }}</text>
        <text class="expense">支出：￥{{ monthData[`${currentYear}-${padZero(month)}`].expense || '0.00' }}</text>
        <view class="dates">
          <view v-for="(date,index1) in getDaysInMonth(currentYear, month)" :key="index1" class="income-expense-day">
            <view class="date-number">{{ getDate(date) }}</view>
            <view class="amounts">
              <!-- 收入 -->
              <view v-if="income[`${currentYear}-${padZero(month)}-${padZero(date)}`]" :style="{color: 'red'}">
                +{{ income[`${currentYear}-${padZero(month)}-${padZero(date)}`] }}
              </view>
              <!-- 支出 -->
              <view v-if="expense[`${currentYear}-${padZero(month)}-${padZero(date)}`]" :style="{color: 'green'}">
                -{{ expense[`${currentYear}-${padZero(month)}-${padZero(date)}`] }}
              </view>
              <!-- 如果既没有收入也没有支出，则显示提示信息 -->
              <view
                  v-if="!income[`${currentYear}-${padZero(month)}-${padZero(date)}`] && !expense[`${currentYear}-${padZero(month)}-${padZero(date)}`]"
                  style="color: #888;">
                <u-icon name="rmb-circle" size="20" color="#888"></u-icon>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {get_list, ready} from "@/pages/packageA/statistics/p_calendar";

export default {
  data() {
    return {
      income: { /* 示例数据  '2025-01-05': 300, '2025-01-14': 60000 */},
      expense: { /* 示例数据  '2025-01-07': 200, '2025-01-14': 40000 */},
      options: [],
      currentYear: new Date().getFullYear(),
      currentOption: '',
      currentOptionIndex: '',
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      monthData: [],
    }
  },
  mounted() {
    this.getReady()
    let that = this
    setTimeout(function () {
      that.get_list();
    }, 500)

  },
  methods: {
    async getReady() {
      const res = await ready();
      if (res.code === 0) {

        if (res.data.options) {
          this.options = res.data.options;
        }
        if (res.data.currentMonth) {
          this.currentOption = res.data.currentMonth;
        }

      }
    },
    async get_list() {
      this.months = [];
      const res = await get_list({
        current_option: this.currentOption
      });
      if (res.code === 0) {
        this.income = res.data.income;
        this.expense = res.data.expense;
        if (res.data.monthData) {
          this.monthData = res.data.monthData;
        }
        if (res.data.months) {
          this.months = res.data.months;
        }
        if (res.data.currentYear) {
          this.currentYear = res.data.currentYear;
        }
      }
    },
    bindMonthChange(e) {
      this.currentOption = this.options[e.detail.value];
      this.get_list();
    },
    //兼容微信小程序从0开始的问题
    getDate(date) {
      //#ifdef MP-WEIXIN
      date++;
      //#endif
      return date;
    },
    getDaysInMonth(year, month) {
      let days = new Date(year, month, 0).getDate();
      console.log('days', days)
      return days;
    },

    padZero(num) {
      return num < 10 ? `0${num}` : `${num}`;
    }
  }
};
</script>

<style scoped>
.calendar-container {
  padding: 10px;
}

.year-view {
  overflow-x: scroll;
}

.month-box {
  margin-bottom: 20px;
}

.dates {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
}

.dates > view {
  border: 1px solid #ddd;
  padding: 5px 0 5px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /* width: 40px;  固定宽度 */
  height: 80px; /* 固定高度 */
}

.date-number {
  font-weight: bold;
  margin-bottom: auto; /* 确保日期始终位于顶部 */
}

.amounts {
  display: flex;
  flex-direction: column;
  margin-top: auto; /* 确保金额始终位于底部 */
}

.amounts > view {
  margin-top: 2px;
}

/* 可以为无数据的情况添加特殊样式 */
.amounts > view:nth-child(1) {
  color: #888;
}

.income,.expense{
  margin-left: 10rpx;
}
.income{
  color:red;
}
.expense{
  color:green;
}
</style>
