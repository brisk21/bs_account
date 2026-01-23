<template>
  <view>
    <u-popup v-model="showPopup" mode="center" :closeable="true" @close="closePopup" @maskClick="closePopup">
      <view class="popup-content">
        <!-- 自定义输入框 -->
        <view class="custom-input-container" v-if="enableCustom">
          <input
            class="custom-input"
            v-model="customValue"
            placeholder="自定义一个"
            @confirm="handleCustomConfirm"
            confirm-type="done"
            type="text"
          />
          <button class="confirm-btn" @click="handleCustomConfirm">确定</button>
        </view>

        <scroll-view class="result-list" scroll-y="true" ref="resultList">
          <view v-if="show_type === 'grid'">
            <view v-if="filteredList.length > 0">
              <u-grid :col="2">
                <u-grid-item v-for="(item, index) in filteredList" :key="index" @click="selectItem(item)">
                  <view class="grid-icon" v-if="item.icon">
                    <u-icon :name="item.icon" size="40"></u-icon>
                  </view>
                  <view class="grid-text">{{ item.label }}</view>
                </u-grid-item>
              </u-grid>
            </view>
            <view v-else>
              <view class="no-result">
                <u-empty text="暂无数据" mode="list"></u-empty>
              </view>
            </view>
          </view>
          <view v-else class="list-view">
            <view v-if="filteredList.length > 0">
              <view v-for="(item, index) in filteredList" :key="index" @click="selectItem(item)" class="result-item">
                <view class="list-text">{{ item.label }}</view>
              </view>
            </view>
            <view v-else class="no-result">
              <u-empty text="暂无数据" mode="list"></u-empty>
            </view>
          </view>
        </scroll-view>

        <view class="to-manager" v-if="path">
          <text @click="goto(path)">去管理页面？</text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'typePopup',
  props: {
    // 过滤后的列表数据
    filteredList: {
      type: Array,
      default: () => []
    },
    enableCustom: {
      type: Boolean,
      default: false
    },
    // 管理页面路径
    path: {
      type: String,
      default: ''
    },
    // 显示类型：grid（网格）或 list（列表）
    show_type: {
      type: String,
      default: 'grid'
    }
  },
  data() {
    return {
      showPopup: false,
      customValue: '' // 自定义值
    }
  },
  methods: {
    // 跳转到管理页面
    goto(path) {
      uni.navigateTo({
        url: path,
        success: () => {
          this.closePopup()
        }
      })
    },

    // 打开弹出层
    togglePopup() {
      this.showPopup = true
    },

    // 关闭弹出层
    closePopup() {
      this.showPopup = false
    },

    // 选择某一项
    selectItem(item) {
      this.closePopup()
      this.$emit('selected', item)
    },

    // 处理用户输入的自定义内容
    handleCustomConfirm() {
      if (this.customValue.trim()) {
        const customItem = {
          value: this.customValue.trim(),
          label: this.customValue.trim(),
          isCustom: true //，标识是自定义输入的内容
        }
        this.selectItem(customItem)
        this.customValue = '' // 清空输入
      }
    }
  }
}
</script>

<style scoped>
.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  min-height: 180px;
  max-width: 95%;
  overflow: hidden;
  position: relative;
}

.custom-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
}

.custom-input {
  flex: 1;
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-right: 10px;
}

.confirm-btn {
  font-size: 14px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
}

.result-list {
  max-height: 260px;
}

/* 隐藏滚动条 */
scroll-view ::v-deep .uni-scroll-view__container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
scroll-view ::v-deep .uni-scroll-view__container::-webkit-scrollbar {
  display: none;
}

.grid-icon {
  margin-bottom: 10px;
}

.grid-text {
  font-size: 14px;
  color: #333;
}

.result-item {
  padding: 10px;
  border-bottom: 1px solid #e0e0e073;
  cursor: pointer;
}

.result-item:last-child {
  border-bottom: none;
}

.no-result {
  padding: 20px;
  text-align: center;
}

.to-manager {
  position: absolute;
  right: 5px;
  bottom: 7px;
  z-index: 10076;
  color: dodgerblue;
}
</style>
