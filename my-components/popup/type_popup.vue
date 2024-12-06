<template>
  <view>
    <u-popup v-model="showPopup" mode="center" :closeable="true" @close="closePopup" @maskClick="closePopup">
      <view class="popup-content">
        <view class="result-list" ref="resultList">
          <view v-if="show_type === 'grid'">
            <view v-if="filteredList.length>0">
              <u-grid :col="2">
                <u-grid-item v-for="(item, index) in filteredList" :key="index" @click="selectItem(item)">
                  <view class="grid-text">{{ item.label }}</view>
                </u-grid-item>
              </u-grid>
            </view>
            <view v-else>
              <view class="no-result" >
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
        </view>
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
    filteredList: {
      type: Array,
      default: () => []
    },
    path: {
      type: String,
      default: ''
    },
    show_type: {
      type: String,
      default: 'grid'
    }
  },
  data() {
    return {
      showPopup: false,
    }
  },
  methods: {
    goto(path) {
      uni.navigateTo({
        url: path,
        success: () => {
          this.closePopup()
        }
      })
    },
     togglePopup() {
      if (!this.showPopup) {
        this.showPopup = true;
      } else {
        this.showPopup = true;
      }
    },
    closePopup() {
      this.showPopup = false;
    },

    selectItem(item) {
      // 用户选择了某个项目后的操作
      //console.log('选择了:', item);
      this.closePopup(); // 关闭弹出层
      this.$emit('selected', item); // 返回选中的项
    }
  }
}
</script>

<style scoped>
/* 添加一些样式 */
.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  min-height: 150px;
  max-width: 500px; /* 最大宽度限制 */
  overflow: hidden; /* 确保内部元素不会溢出 */
}

.search-box {
  padding-top: 30rpx;
}

.result-list {
  max-height: 300px;
  overflow-y: auto; /* 启用垂直滚动 */
}

/* 隐藏滚动条 */
.result-list::-webkit-scrollbar {
  display: none;
}

/* 对于非Webkit内核浏览器 */
.result-list {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.result-item {
  padding: 10px;
  border-bottom: 1px solid #e0e0e073;
  cursor: pointer;
}

.result-item:last-child {
  border-bottom: none;
}

/* 禁止body滚动 */
.no-scroll {
  overflow: hidden;
}

.to-manager {
  position: absolute;
  right: 5px;
  color: dodgerblue;
  bottom: 7px;
  z-index: 10076;
}
</style>
