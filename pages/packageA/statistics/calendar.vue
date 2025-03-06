<template>
  <view class="calendar-container">
    <!-- 年份选择 -->
    <picker mode="selector" :range="yearOptions" :value="currentYearIndex" @change="bindYearChange">
      <button>{{ currentYear }}年</button>
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
              <view v-if="income[`${currentYear}-${month}-${date}`]" :style="{color: 'red'}">+{{ formatAmount(income[`${currentYear}-${month}-${date}`]) }}</view>
              <!-- 支出 -->
              <view v-if="expense[`${currentYear}-${month}-${date}`]" :style="{color: 'green'}">-{{ formatAmount(expense[`${currentYear}-${month}-${date}`]) }}</view>
              <!-- 如果既没有收入也没有支出，则显示提示信息 -->
              <view v-if="!income[`${currentYear}-${month}-${date}`] && !expense[`${currentYear}-${month}-${date}`]" style="color: #888;">空</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({length: 20}, (_, i) => currentYear - 10 + i);
    const currentYearIndex = yearOptions.indexOf(currentYear);
    return {
      currentYear,
      income: { /* 示例数据 */ '2025-1-5': 300, '2025-1-14': 60000 },
      expense: { /* 示例数据 */ '2025-1-7': 200, '2025-1-14': 40000 },
      yearOptions,
      currentYearIndex
    };
  },
  methods: {
    bindYearChange(e) {
      this.currentYear = this.yearOptions[e.detail.value];
    },
    getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    },
    formatAmount(amount) {
      // 格式化金额，使其更易读
      return amount.toLocaleString();
    }
  }
};
</script>

<style scoped>
/* 样式保持不变 */
.calendar-container {
  padding: 10px;
}
.month-box {
  margin-bottom: 20px;
}
.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.dates > view {
  border: 1px solid #ddd;
  padding: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 80px; /* 固定高度 */
}
.date-number {
  font-weight: bold;
}
.amounts {
  display: flex;
  flex-direction: column;
}
.amounts > view {
  margin-top: 2px;
}
</style>
