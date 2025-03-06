<template>
  <view class="calendar-container">
    <!-- 年份选择 -->
    <picker mode="selector" :range="yearOptions" :value="currentYearIndex" @change="bindYearChange">
      <button size="mini">{{ currentYear }}年</button>
    </picker>

    <!-- 按年显示的视图 -->
    <view class="year-view">
      <view v-for="(month, index) in 12" :key="index" class="month-box">
        <text>{{ currentYear }}年{{ month }}月</text>
        <view class="dates">
          <view v-for="date in getDaysInMonth(currentYear, month)" :key="date" class="income-expense-day">
            <view class="date-number">{{ date }}</view>
            <view class="amounts">
              <!-- 收入 -->
              <view v-if="income[`${currentYear}-${padZero(month)}-${padZero(date)}`]" :style="{color: 'red'}">+{{ income[`${currentYear}-${padZero(month)}-${padZero(date)}`] }}</view>
              <!-- 支出 -->
              <view v-if="expense[`${currentYear}-${padZero(month)}-${padZero(date)}`]" :style="{color: 'green'}">-{{ expense[`${currentYear}-${padZero(month)}-${padZero(date)}`] }}</view>
              <!-- 如果既没有收入也没有支出，则显示提示信息 -->
              <view v-if="!income[`${currentYear}-${padZero(month)}-${padZero(date)}`] && !expense[`${currentYear}-${padZero(month)}-${padZero(date)}`]" style="color: #888;">无</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {get_list} from "@/pages/packageA/statistics/p_calendar";

export default {
  data() {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({length: 20}, (_, i) => currentYear - 10 + i);
    const currentYearIndex = yearOptions.indexOf(currentYear);
    return {
      currentYear,
      income: { /* 示例数据 */ '2025-01-05': 300, '2025-01-14': 60000 },
      expense: { /* 示例数据 */ '2025-01-07': 200, '2025-01-14': 40000 },
      yearOptions,
      currentYearIndex
    }
  },
  mounted() {
    this.get_list();
  },
  methods: {
    async get_list() {
      const res = await get_list({
        year: this.currentYear
      });
      if (res.code === 0) {
        this.income = res.data.income;
        this.expense = res.data.expense;
      }
    },
   bindYearChange(e) {
      this.currentYear = this.yearOptions[e.detail.value];
      this.get_list();
    },
    getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
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
.year-view{
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
</style>
