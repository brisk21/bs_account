<template>
  <view class="container">
    <!-- 步骤条 -->
    <u-steps mode="dot" :list="numList" :current="currentStep"></u-steps>

    <!-- 根据当前步骤显示不同的内容 -->
    <view v-show="currentStep === 0">
      <view>
        <view class="search-box">
          <u-dropdown>
            <u-dropdown-item v-model="form.type" title="类型" :options="type" @change="set_type"></u-dropdown-item>

            <u-dropdown-item v-model="form.time_type"
                             :title="time_type_title"
                             :options="time_type" @change="set_time_type"></u-dropdown-item>
            <u-dropdown-item v-model="form.sort" title="排序" :options="sort_list" @change="set_sort"></u-dropdown-item>
          </u-dropdown>
          <view class="search-more">
            <button size="mini" type="default" @click="show_search_box=true">高级搜索</button>
          </view>
          <view class="search-box-left">
            <u-search :clearable="true" :show-action="true" :show-action-icon="true"
                      input-align="left" placeholder="分类、收支类型、备注查询"
                      v-model="form.keywords"
                      action-text="搜索"
                      @search="toSearch" @custom="toSearch"></u-search>
          </view>
        </view>
        <view v-if="list.length > 0" class="scroll data-list">

          <view class="list-box-children" v-for="(item, index) in list" :key="index">
            <label class="u-flex item-checkbox">
              <u-checkbox :disabled="item.disable || false" v-model="selectedItems[item.id]" :name="item.id"
                          @change="updateSelected"></u-checkbox>
            </label>
            <view class="u-flex-1  box-left box-left">
              <u-icon :name="item.category.icon" color="#42b479" size="32"></u-icon>
              {{ item.category.name }}
            </view>

            <view class="u-flex-1  box-right amount-green" v-if="item.type===20" @click="toDetail(item.id)">
              -￥{{ item.amount }}
            </view>
            <view class="u-flex-1  box-right amount-red" v-else @click="toDetail(item.id)">
              +￥{{ item.amount }}
            </view>
            <view class="u-flex-1 box-right item-date">
              {{ item.date }}
            </view>

          </view>
          <u-loadmore v-if="list.length >= form.limit" @loadmore="loadMore"></u-loadmore>

        </view>
      </view>
    </view>
    <view v-show="currentStep === 1">

        <u-form label-width="150">

          <view class="action-box">
              <view v-if="!formData.del_all" class="normal">
                  <view class="line">
                  <text class="popup_type">账单分类：</text>
                  <u-tag
                      v-show="formData.category_id"
                      :closeable="true"
                      :text="formData.category_name"
                      @close="unsetCategory('formData')"
                      @click="openPopup('category')"
                  ></u-tag>
                  <u-button   @click="openPopup('category','formData')" size="mini">选择分类</u-button>
                </view>
                <view class="line">
                  <text class="popup_type">交易平台：</text>
                  <u-tag
                      v-show="formData.amount_platform"
                      :closeable="true"
                      :text="formData.amount_platform"
                      @close="unsetAmountPlatformType()"
                      @click="openPopup('amount_platform','formData')"
                  ></u-tag>
                  <u-button   @click="openPopup('amount_platform','formData')" size="mini">选择平台</u-button>
                </view>
                <view class="line">
                  <text class="popup_type">收支方式：</text>
                  <u-tag
                      v-show="formData.amount_type"
                      :closeable="true"
                      :text="formData.amount_type"
                      @close="unsetAmountType()"
                      @click="openPopup('amount_type','formData')"
                  ></u-tag>
                  <u-button  @click="openPopup('amount_type','formData')" size="mini">选择方式</u-button>
                </view>
                <view class="line">
                  <text class="popup_type">关联预算：</text>
                  <u-tag :closeable="true"
                         v-show="!!formData.budget_id"
                         :text="formData.budget_title||'?'"
                         @click="openPopup('budget_list','formData')"
                         @close="unsetBudget()"
                  ></u-tag>

                  <u-button @click="openPopup('budget_list','formData')" size="mini">选择预算</u-button>
                </view>
                <view class="line">
                  <text class="popup_type">关联账本：</text>
                  <u-tag :closeable="true"
                         v-show="!!formData.cashbook_id"
                         :text="formData.cashbook_title||'未知?'"
                         @click="openPopup('cashbook','formData')"
                         @close="unsetCashbook()"
                  ></u-tag>

                  <u-button @click="openPopup('cashbook','formData')" size="mini">选择账本</u-button>
                </view>
                <view class="line">
                  <text class="popup_type">账单日期：</text>
                  <u-tag :closeable="true"
                         v-show="!!formData.date"
                         :text="formData.date||''"
                         @click="set_time_type(null,'formData')"
                         @close="unsetDate()"
                  ></u-tag>

                  <u-button   @click="set_time_type(null,'formData')" size="mini">选择日期</u-button>
                </view>
                <view class="line">
                  <text class="popup_type">备注内容：</text>
                  <u-input v-model="formData.remark" type="textarea"
                           placeholder="添加备注" maxlength="500"
                           clearable border auto-height>
                  </u-input>
              </view>
              </view>


              <view class="line">
                <view class="line del_all">
                  <text class="popup_type">批量删除：</text>
                   <u-checkbox v-model="formData.del_all" name="delete_all">
                  批量删除
                  </u-checkbox>
                </view>
              </view>

            </view>
        </u-form>

    </view>

    <u-picker mode="time" v-model="show_date" :params="params"
                @confirm="confirmTime" @cancel="cancelTime" :mask-close-able="false"></u-picker>

      <u-calendar toolTip="选择时间范围" v-model="show_calendar" :mode="calendar_mode"
                  @change="calendarChange"></u-calendar>

      <u-popup v-model="show_search_box" mode="center" width="90%" height="300px">
        <view class="search-popup">
          <view class="line">
            <text class="popup_type">具体分类：</text>
            <u-tag
                v-show="form.category_id"
                :closeable="true"
                :text="form.category_name"
                @close="unsetCategory()"
                @click="openPopup('category')"
            ></u-tag>
            <u-button v-show="!form.category_id" @click="openPopup('category','form')" size="mini">选择分类</u-button>
          </view>
          <view class="line">
            <text class="popup_type">交易平台：</text>
            <u-tag
                v-show="form.amount_platform"
                :closeable="true"
                :text="form.amount_platform"
                @close="unsetAmountPlatformType()"
                @click="openPopup('amount_platform')"
            ></u-tag>
            <u-button v-show="!form.amount_platform" @click="openPopup('amount_platform','form')" size="mini">选择平台</u-button>
          </view>
          <view class="line">
            <text class="popup_type">收支方式：</text>
            <u-tag
                v-show="form.amount_type"
                :closeable="true"
                :text="form.amount_type"
                @close="unsetAmountType()"
                @click="openPopup('amount_type')"
            ></u-tag>
            <u-button v-show="!form.amount_type" @click="openPopup('amount_type','form')" size="mini">选择方式</u-button>
          </view>
          <view class="line">
            <text class="popup_type">关联预算：</text>
            <u-tag :closeable="true"
                   v-show="!!form.budget_id"
                   :text="form.budget_title||'?'"
                   @click="openPopup('budget_list','form')"
                   @close="unsetBudget()"
            ></u-tag>

            <u-button v-show="!form.budget_id" @click="openPopup('budget_list','form')" size="mini">选择预算</u-button>
          </view>
          <view class="line">
            <text class="popup_type">关联账本：</text>
            <u-tag :closeable="true"
                   v-show="!!form.cashbook_id"
                   :text="form.cashbook_title||'未知?'"
                   @click="openPopup('cashbook','form')"
                   @close="unsetCashbook()"
            ></u-tag>

            <u-button v-show="!form.cashbook_id" @click="openPopup('cashbook','form')" size="mini">选择账本</u-button>
          </view>
          <view class="btn-list">
            <button size="mini" type="warn" class="action-btn u-border" @click="show_search_box = false">取消</button>
            <button size="mini" type="primary" class="action-btn  u-border" @click="toSearch">开始搜索</button>
          </view>
        </view>
      </u-popup>
      <type_popup
          ref="type_popup"
          @selected="handleTypeSelected"
          :filtered-list="popup_data_list"
          :path="popup_manager_path"
          :show_type="popup_show_type"

      ></type_popup>

    <!-- 按钮操作 -->
    <view class="button-group">
      <u-button class="buttons" @click="prevStep" size="medium " :disabled="currentStep == 0"
                v-if="currentStep>0">上一步
      </u-button>
      <u-button class="buttons" @click="nextStep" size="medium " v-if="currentStep == 0">下一步</u-button>
      <u-button class="buttons" @click="submit" size="medium " type="warn" v-if="currentStep == 1">提交
      </u-button>
    </view>
  </view>
</template>
<script>

import constConfig from "@/const";
import uploadFile from "@/components/UploadFile.vue";
import type_popup from "@/my-components/popup/type_popup.vue";
export default {
  components: {
    uploadFile,type_popup
  },
  data() {
    return {
      show_list_type: 'list',
      show_search_box: false,
      popup_manager_path: '',
      popup_data_list: [],
      popup_show_type: 'grid',
      popup_current: '',
      popup_to_form:'form',
      sort_list: [
        {label: '默认', value: ''},
        {label: '金额降序', value: 'amount_desc'},
        {label: '金额升序', value: 'amount_asc'},
        {label: '日期降序', value: 'date_desc'},
        {label: '日期升序', value: 'date_asc'}
      ],
      type: [
        {label: '全部', value: 0,},
      ],
      amount_type: [
        {label: '全部', value: ''}
      ],
      time_type: [
        {label: '全部', value: '',},
        {label: '按日历范围', value: 'calendar',},
        {label: '按年份筛选', value: 'year',},
        {label: '按月份筛选', value: 'month',},
      ],
      budget_list: [
        {label: '全部', value: ''}
      ],
      cashbook_list: [
        {label: '全部', value: ''}
      ],
      category_list: [
        {label: '全部', value: 0,},
      ],
      amount_platform_list: [
        {label: '全部', value: '',},
      ],
      time_type_title: '时间',
      show_calendar: false,
      calendar_mode: 'range',


       is_fresh: false,
      is_pulling: false,

      list: [],
      total_amount: 0,
      total_income: 0,
      total_outcome: 0,
      diff_amount: 0,
      total: 0,
      scrollTop: 0,
      no_more: false,
      show_date: false, // 控制picker的显示
      params: {
        year: true, // 是否显示年
        month: true, // 是否显示月
      },
      startYear: 2000, // 起始年份
      endYear: new Date().getFullYear(), // 结束年份，设置为当前年份


      currentStep: 0, // 当前步骤索引从0开始
      numList: [{
        name: '选择账单'
      }, {
        name: '修改内容'
      }],
      selectAll: false,
      selectedItems: {}, // 使用对象来存储每个项目的选中状态
      form: {
        keywords: '',
        category_id: 0,
        type: 0,
        type_name: '',
        budget_id: 0,
        budget_title: '',
        cashbook_id: 0,
        cashbook_title: '',
        month: '',
        year: '',
        time_type: '',
        amount_type: '',
        amount_platform: '',
        sort: '',
        page: 0,
        limit: 20
      },
      formData: {
        id: 0,
        ids: '',
        category_id: 0,
        type: 0,
        type_name: '',
        budget_id: 0,
        budget_title: '',
        cashbook_id: 0,
        cashbook_title: '',
        month: '',
        year: '',
        time_type: '',
        amount_type: '',
        amount_platform: '',
        date:'',
        remark:'',
        del_all: false
      },
    }
  },
  onShow() {
    if (this.hasLogin) {
      this.$store.dispatch('getUserInfo')
    }
  },
  onLoad(options) {
    this.get_search_config()
    if (options.id) {
      this.formData.id = options.id
      this.info()
    } else {
      this.getList(true)
    }
  },
  methods: {

    openPopup(type,form='form') {
      this.popup_current = type
      this.popup_to_form = form
      if (type === 'amount_type') {
        this.popup_manager_path = '/pages/packageA/amount_type/index'
        this.popup_data_list = this.amount_type
        this.popup_show_type = 'list'
      } else if (type === 'budget_list') {
        this.popup_manager_path = '/pages/budget/budget'
        this.popup_data_list = this.budget_list
        this.popup_show_type = 'list'
      } else if (type === 'cashbook') {
        this.popup_manager_path = '/pages/packageA/cashbook/index'
        this.popup_data_list = this.cashbook_list
        this.popup_show_type = 'list'
      } else if (type === 'category') {
        this.popup_manager_path = '/pages/setting/category'
        this.popup_data_list = this.category_list
        this.popup_show_type = 'list'
      } else if (type === 'amount_platform') {
        this.popup_manager_path = '/pages/packageA/amount_platform/index'
        this.popup_data_list = this.amount_platform_list
        this.popup_show_type = 'grid'
      } else if (type === 'type') {
        this.popup_data_list = this.type
        this.popup_show_type = 'list'
      }
      this.$refs.type_popup.togglePopup();
    },
    handleTypeSelected(item) {
      //console.log(this.popup_current + '父组件接收到了:', item);
      try {
        if (this.popup_current === 'amount_type') {
          this[this.popup_to_form].amount_type = item.value
        } else if (this.popup_current === 'budget_list') {
          this[this.popup_to_form].budget_id = item.value
          this[this.popup_to_form].budget_title = item.label || ''
          console.log(this[this.popup_to_form].budget_title)
        } else if (this.popup_current === 'cashbook') {
          this[this.popup_to_form].cashbook_id = item.value
          this[this.popup_to_form].cashbook_title = item.label || ''
        } else if (this.popup_current === 'type') {
          this[this.popup_to_form].type = item.value
          this[this.popup_to_form].type_name = item.label || ''
        } else if (this.popup_current === 'category') {
          this[this.popup_to_form].category_id = item.value
          this[this.popup_to_form].category_name = item.label || ''
        } else if (this.popup_current === 'amount_platform') {
          this[this.popup_to_form].amount_platform = item.value || ''
        }
      } catch (e) {
        console.log('err', e)
      }


    },
    unsetBudget() {
      if (this.popup_to_form==='formData'){
        this.formData.budget_id = 0
        this.formData.budget_title = ''
        return;
      }
      this.form.budget_id = 0
      this.form.budget_title = ''
    },
    unsetCashbook() {
      if (this.popup_to_form==='formData'){
        this.formData.cashbook_id = 0
        this.formData.cashbook_title = ''
        return;
      }
      this.form.cashbook_id = 0
      this.form.cashbook_title = ''
    },
    unsetDate(){
      if (this.popup_to_form==='formData'){
        this.formData.date = ''
      }
    },
    unsetCategory() {
      if (this.popup_to_form==='formData'){
        this.formData.category_id = 0
        this.formData.category_name = ''
        return;
      }
      this.form.category_id = 0
      this.form.category_name = ''
    },
    unsetType() {
      if (this.popup_to_form==='formData'){
        this.formData.type = ''
        this.formData.type_name = ''
        return;
      }
      this.form.type = ''
    },
    unsetAmountType() {
      if (this.popup_to_form==='formData'){
        this.formData.amount_type = ''
        return;
      }
      this.form.amount_type = ''
    },
    unsetAmountPlatformType() {
      if (this.popup_to_form==='formData'){
        this.formData.amount_platform = ''
        return;
      }
      this.form.amount_platform = ''
    },
    setAmountType(item) {
      if (this.popup_to_form==='formData'){
        this.formData.amount_type = item
        return;
      }
      this.form.amount_type = item
    },

    toDetail(id) {
      uni.navigateTo({
        url: `/pages/index/detail?id=${id}`
      });
    },
    toLogin() {
      this.goToLoginPage()
    },

    loadMore() {
      this.getList()
    },
    get_search_config() {
      let that = this
      this.$u.api.bill_list_search({from: 'list_option',mmm:'batch_manager'}).then(res => {
        console.log(res)
        let data = res.data
        if (res.code == 0) {
           if (data.budget_list.length > 0) {
              that.budget_list = that.budget_list.concat(data.budget_list)
            }
            if (data.cashbook_list.length > 0) {
              that.cashbook_list = that.cashbook_list.concat(data.cashbook_list)
            }
            if (data.amount_type.length > 0) {
              that.amount_type = that.amount_type.concat(data.amount_type)
            }
            if (data.type.length > 0) {
              that.type = data.type
            }
            if (data.time_type.length > 0) {
              that.time_type = data.time_type
            }
            if (data.sort_list.length > 0) {
              that.sort_list = data.sort_list
            }
            if (data.category_list.length > 0) {
              that.category_list = data.category_list
            }
            if (data.amount_platform_list.length > 0) {
               that.amount_platform_list = that.amount_platform_list.concat(data.amount_platform_list)
            }
        }

      })
    },
    cancelTime() {
      if (this.popup_to_form==='formData'){
        this.formData.date = ''
        return ;
      }
      this.form.year = ''
      this.form.month = ''
      this.form.time_type = ''
      this.time_type_title = '时间'
      this.getList(true)
    },
    confirmTime(e) {
      console.log('选择的年月：', e);
      if (this.popup_to_form==='formData'){
          this.formData.date =e.year+'-' + e.month+'-'  + e.day
          return ;
      }

      if (this.form.time_type == 'month') {
        this.form.year = e.year
        this.form.month = e.month
        this.time_type_title = e.year + e.month
      } else if (this.form.time_type == 'year') {
        this.form.year = e.year
        this.form.month = ''
        this.time_type_title = e.year
      } else {
        this.form.year = ''
        this.form.month = ''
        this.time_type_title = '时间'
      }
      this.getList(true)
    },
    calendarChange(e) {
      if (this.popup_to_form==='formData'){
        this.formData.time_type = 'date'
        this.formData.data = e.startDate
        return ;
      }
      this.form.time_type = 'range'
      this.form.start_time = e.startDate
      this.form.end_time = e.endDate
      this.getList(true)
    },

    set_type(value) {
      if (this.popup_to_form==='formData'){
        this.formData.type = value
        return;
      }
      this.form.type = value
      this.getList(true)

    },
    set_amount_type(value) {
      if (this.popup_to_form==='formData'){
        this.formData.amount_type = value
        return;
      }
      this.form.amount_type = value
      this.getList(true)
    },
    set_sort(value) {
      this.form.sort = value
      this.getList(true)
    },
    set_budget_type(value) {
      if (this.popup_to_form==='formData'){
        this.formData.budget_id = value
        return;
      }
      this.form.budget_id = value
      this.getList(true)
    },
    set_cashbook_id(value) {
      if (this.popup_to_form==='formData'){
        this.formData.cashbook_id = value
        return;
      }
      this.form.cashbook_id = value
      this.getList(true)
    },
    set_time_type(value,to_form) {
      if (to_form && to_form === 'formData'){
          this.popup_to_form = to_form
      }
      if (!value) {
         if (this.popup_to_form==='formData'){
            this.params = {year: true, month: true, day: true}
            this.form.time_type = 'day'
            this.show_date = true
          return;
        }
        this.form.year = ''
        this.form.month = ''
        this.form.time_type = ''
        this.time_type_title = '时间'
        this.getList(true);
        return
      }
      this.show_date = false
      this.show_calendar = false
      if (value === 'month') {
        this.params = {year: true, month: true}
        this.form.time_type = value
        this.show_date = true
      } else if (value === 'year') {
        this.params = {year: true, month: false}
        this.form.time_type = value
        this.show_date = true
      } else {
        if (this.popup_to_form==='formData'){
             this.params = {year: true, month: true, day: true}
            this.form.time_type = 'day'
            this.show_date = true
          return;
        }
        this.show_calendar = true
        this.time_type_title = '日历'
      }

    },
    toSearch() {
      this.form.page = 0
      this.show_search_box = false
      this.getList(true)
    },
    handleFileUploadSuccess({url, index, fileList, res}) {
      console.log('文件上传成功:', url);
      if (res.code == 0) {
        this.formData.images.push(res.data.full_url)
      } else {
        this.$u.toast(res.msg)
        //移除文件
        this.$refs.upload.remove(index)
      }
    },
    handleFileUploadRemove({index, fileList}) {
      // 更新状态或者做其他处理
      console.log('文件已被移除:', index);
      //移除对应的文件
      this.formData.images.splice(index, 1)
    },
    beforeUpload(index, list) {
      return true;
    },
    updateSelected(event) {
      console.log(event)
      const {name, checked} = event;
      //this.selectedItems[name] = !checked;
      console.log(this.selectedItems)
      this.$set(this.selectedItems, name, checked);
    },
    async getList(is_init) {
      if (!this.hasLogin) {
        this.goToLoginPage()
        return
      }
      if (this.is_pulling) {
        console.log('正在加载中，请勿重复点击')
        return;
      }
      let that = this;
      if (is_init) {
        this.form.page = 0
        this.list = []
        this.no_more = false
      }
      this.is_pulling = true
      this.form.page += 1
      uni.showLoading({
        title: '数据加载中...',
      })
      this.form.reimbursement_id = this.formData.id
      await this.$u.api.bill_list_options(this.form).then(res => {
        if (res.code == 0) {
          this.total_income = res.data.total_income
          this.total_outcome = res.data.total_outcome
          this.total = res.data.total
          this.diff_amount = res.data.diff_amount
          if (res.data.list.length > 0) {
            this.list = this.list.concat(res.data.list)
          } else {
            this.no_more = true
            this.$u.toast('没有更多数据了')
          }

        }

      }).catch(() => {
      }).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(function () {
          that.is_fresh = false;
          that.is_pulling = false
          uni.hideLoading()
        }, 1000)
      })
    },
    // 上一步
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    // 下一步
    nextStep() {
      if (this.currentStep < this.numList.length - 1) {
        this.currentStep++;
      }
    },
    submit() {
      if (!this.selectedItems) {
        this.$u.toast('请选择账单')
        return
      }
      //查询选中的账单
      let ids = []
      for (let i in this.selectedItems) {
        if (this.selectedItems[i]) {
          ids.push(i)
        }
      }
      if (ids.length <= 0) {
        this.$u.toast('请选择账单')
        return
      }

      this.formData.ids = ids.join(',')
      console.log(this.formData)
      let that = this
      uni.showModal({
        title: '',
        content: this.formData.del_all?'确定要删除选中的账单吗，不可恢复哦？': '确定提交保存数据吗',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.batchActionCashflow(that.formData).then(res => {
                that.$u.toast(res.msg);
                if (res.code == 0) {
                  setTimeout(function () {
                    uni.navigateBack()
                  }, 1000)
                }
              })
          } else if (res.cancel) {
            this.$u.toast('已取消');
          }
        }
      })
    },
  }
}
</script>
<style lang="scss">
.container {
  padding: 30rpx;
  margin-top: 10px;
  background-color: white;

  // scroll-view 通过flex 布局 自适应
  /* height: 100vh;*/
  display: flex;
  flex-direction: column;

  .scroll {
    flex: 1;
    overflow: scroll;
  }

  .need_login {
    margin-top: 45%;
    background: white;
  }

  .search-popup {
    padding-top: 20px;
    padding-left: 10px;
    height: 100%;

    .line {
      display: flex;
      flex-direction: row;
      margin-top: 10px;

    }

    .btn-list {
      display: flex;
      justify-content: space-evenly;
      margin-top: 50rpx;
      padding-right: 10px;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      align-items: center;

      .action-btn {
        width: 100%;
        border-radius: unset !important;
      }
    }
  }

  // 自适应结束


  .header-icon {
    padding: 15rpx;
  }

  .search-box {
    margin: 10rpx;
  }

  .list-box {
    padding: 18rpx 18rpx 18rpx 40rpx;
  }

  .no-more {
    text-align: center;
    color: rgb(200, 196, 196);
    margin-top: 10rpx;
    margin-bottom: 10rpx;
  }

  .list-box-children {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 26rpx 32rpx;
    font-size: 28rpx;
    line-height: 50rpx;
    color: #606266;
    background-color: #fff;
    text-align: left;

    .icon {
      font-size: 50rpx;
      padding-right: 10rpx;
    }

    .box-icon {
      width: 50rpx;
      height: 50rpx;
      margin-right: 35rpx;
    }

    .box-left {
      width: auto;
      font-weight: 500;
      font-size: 28rpx;
    }

    .box-right {
      overflow: hidden;
      text-align: right;
      vertical-align: middle;
      color: #909399;
      font-size: 26rpx;

    }

    .amount-green {
      color: #42b479;
    }

    .amount-red {
      color: #ff0000;
    }

    .box-remark {
      font-weight: 500;
      width: 100rpx;
      margin-left: 50rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      -ms-text-overflow: ellipsis;
      display: -webkit-box;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      color: #c8c4c4;
    }

    .item-date {

    }
  }

  .data-list {
    position: relative;
    top: 0px;
    width: 100%;
  }

  .empty {
    margin-top: 200px;
  }
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;

  .buttons {
    width: 48%;
    padding: 10px;
    border-radius: 5px;
    border: none;
    color: white;
    font-size: 16px;
    background-color: #089c08;
    /* #ifdef MP-WEIXIN */
    background-color: unset !important;
    /* #endif */


    &:disabled {
      background-color: #d3d3d3;
    }
  }

}
.action-box{
    margin-top: 10px ;
    position: relative ;
    top: 10px;
    left: 10px ;
    .line{
		 // #ifndef MP-WEIXIN
		 display: flex;
		// #endif
     
      margin-top: 10px ;
    }
  }
.del_all{
  margin-top: 30px;
  color: red;
}
</style>
