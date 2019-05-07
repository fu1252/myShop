<template>
  <div class="feedback">
    <div class="title">
      意见与反馈
    </div>
    <div class="cont">
      <textarea class="text" max='150' v-model="content" placeholder="请填写你的意见和反馈"></textarea>
      <span>{{content.length}}/150</span>
    </div>
    <div class="connect">
      <label for="">联系方式</label>
      <input type="text" v-model="phone" placeholder="邮箱/手机号/微信号">
    </div>
    <div class="bottom" @click='submitMes'>提交</div>
  </div>
</template>

<script>
  import {
    get,
    login
  } from '@/utils/index'
  export default {
    mounted() {
      if (login()) {
        this.userInfo = login()

      }
    },
    data() {
      return {
        userInfo: {},
        content: '',
        phone: ''
      }
    },
    methods: {
      async submitMes() {
        const that = this
        if (that.content && that.phone.length == 11) {
          const data = await post('/feedback/submitAction', {
            openId: this.userInfo.openId,
            name: this.userInfo.nickName,
            content: this.content,
            phone: this.phone
          })
          if (data.data) {
            wx.showToast({
              title: '提交成功', //提示的内容,
              icon: 'success', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {
                that.content = ''
                that.phone = ''
              }
            });
          }

        } else {
        wx.showToast({
                  title: '请填写内容', //提示的内容,
                  icon: 'none', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {}
                });
                return false
      }

      }
    },
  }

</script>

<style lang='scss' scoped>
  @import './style.scss';

</style>
