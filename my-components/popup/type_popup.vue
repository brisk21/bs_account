<template>
  <view>
    <u-popup v-model="showPopup" mode="center" :closeable="true" @close="closePopup" @maskClick="closePopup">
      <view class="popup-content">
        <view class="result-list" ref="resultList">
          <u-grid :col="2"  >
          <u-grid-item v-for="(item, index) in filteredList" :key="index" @click="selectItem(item)">
            <view class="grid-text">{{ item.label }}</view>
          </u-grid-item>
        </u-grid>
        </view>
        <view class="to-manager">
           <text @click="goto(path)">去管理页面？</text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'typePopup',
   props : {
     filteredList: {
      type: Array,
      default: () => []
    },
     path: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPopup: false,
    }
  },
  methods: {
    goto(path){
      uni.navigateTo({
        url: path,
        success: () => {
          this.closePopup()
        }
      })
    },
    async togglePopup() {
      if (!this.showPopup) {
        try {
           this.showPopup = true;
           this.disableBodyScroll(); // 禁止背景滚动
        } catch (error) {
          console.error('数据加载失败:', error);
          this.showPopup = false; // 如果加载失败则关闭弹出层
        }
      } else {
        this.showPopup = true;
      }
    },

    cleanupData() {
      this.filteredList = []; // 清空过滤后的列表
    },

    closePopup() {
      this.showPopup = false;
      //this.cleanupData(); // 关闭时清理数据
      this.enableBodyScroll(); // 恢复背景滚动
    },
    disableBodyScroll() {
      document.body.classList.add('no-scroll');
    },
    enableBodyScroll() {
      document.body.classList.remove('no-scroll');
    },
    selectItem(item) {
      // 用户选择了某个项目后的操作
      console.log('选择了:', item);
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
 /*  width: 80%; 设置宽度 */
  min-width: 300px;
  min-height: 200px;
  max-width: 500px; /* 最大宽度限制 */
/*  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  阴影效果 */
  overflow: hidden; /* 确保内部元素不会溢出 */
}
.search-box{
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
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}


/* 禁止body滚动 */
.no-scroll {
  overflow: hidden;
}
.to-manager{
  margin-top: 20px;
  color:dodgerblue;
}
</style>
