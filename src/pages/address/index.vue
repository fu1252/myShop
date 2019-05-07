<template>
  <div class="address">
    <scroll-view :scroll-y='scrollflag' class="addcont" style="height:100%">
      <div class="item" v-if="listData.length!=0">
        <div class="list" @touchstart='startMove' @touchmove='deleteGoods' @touchend='endMove'
          v-for="(item, index) in listData" :key="index" :data-index='index'>
          <div class="addresslist" :style='item.textStyle'>
            <div>
              <span>{{item.name}}</span>
              <div class="moren" v-if="item.is_default">默认</div>
            </div>
            <div class="info">
              <p>{{item.mobile}}</p>
              <p>{{item.address+item.address_detail}}</p>
            </div>
            <div @click='toDetail(item.id)'></div>
          </div>
          <div class="delete" @click='delAddress(item.id)' :style='item.textStyle1'>
            <div>删除</div>
          </div>
        </div>

      </div>
      <div v-else class="center">
        <p>收货地址在哪里</p>
      </div>
    </scroll-view>

    <div class="bottom">
      <div @click='wxaddress(1)'>+新建地址</div>
      <div @click='wxaddress'>一键导入微信地址</div>
    </div>

  </div>
</template>

<script>
  import {
    get,
    getStorageOpenid
  } from '@/utils/index'
  export default {
    onShow() {
      this.openId = getStorageOpenid()
      this.getAddressList()
    },
    data() {
      return {
        scrollflag: true,
        nowIndex: 0,
        userInfo: {},
        imgUrl: '',
        listData: [],
        tranX: 0,
        tranX1: 0,
        startY: '',
        moveX: '',
        moveY: '',
        moveEndX: '',
        moveEndY: '',
        X: 0,
        Y: '',
        flag: false
      }
    },
    methods: {
      initTextStyle() {
        //滑动之前先初始化数据
        for (var i = 0; i < this.listData.length; i++) {
          this.listData[i].textStyle = "";
          this.listData[i].textStyle1 = "";
        }
      },
      startMove(e) {
        this.initTextStyle();
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
      },
      deleteGoods(e) {
        //滑动之前先初始化样式数据
        this.initTextStyle();
        var index = e.currentTarget.dataset.index;
        console.log(this.X);
        if (this.X <= -100) {
          this.flag = true;
        }
        if (!this.flag) {
          this.moveX = e.touches[0].pageX;
          this.moveY = e.touches[0].pageY;
          this.X = this.moveX - this.startX;
          this.Y = this.moveX - this.startY;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          if (this.X >= 100) {
            this.X = 0;
          }
          this.tranX = this.X;
          if (this.X <= -100) {
            this.X = -100;
          }
          this.tranX1 = this.X;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        } else {
          this.moveX = e.touches[0].pageX;
          this.moveY = e.touches[0].pageY;
          this.X = this.moveX - this.startX;
          this.Y = this.moveX - this.startY;

          this.tranX = this.X - 100;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          // transform:'translateX(' + tranX + 'rpx)'
          console.log("heyushuo");

          console.log(this.listData[index].textStyle);

          if (this.X + -100 > -100) {
            this.flag = false;
          }
          this.tranX1 = -100;
          this.listData[index].textStyle1 = `transform:translateX(-100rpx);`;
          console.log(this.listData[index].textStyle1);
        }
      },
      endMove(e) {
        var index = e.currentTarget.dataset.index;
        if (this.X > -50) {
          this.tranX1 = 0;
          this.tranX = 0;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        } else if (this.X <= -50) {
          this.tranX1 = -100;
          this.tranX = -100;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        }
      },
      toDetail(id){
          wx.navigateTo({ url: '/pages/addaddress/main?id='+id });
      },
      async getAddressList(){
          const that=this
          const data=await get('/address/getListAction',{
              openId:that.openId
          })
          for (let i = 0; i < data.data.length; i++) {
              const element = data.data[i];
              element.textStyle=''
              element.textStyle1=''
          }
          this.listData=data.data
      },
      wxaddress(index){
          if(index==1){
              wx.navigateTo({ url: '/pages/addaddress/main' });
          }else{
              wx.chooseAddress({
                  success:function(res){
                    res=JSON.stringify(res)
                    console.log("TCL: wxaddress -> res", res)
                      wx.navigateTo({ url: '/pages/addaddress/main?res='+res });
                  }
              })
          }

      },
       async delAddress(id){
           const that=this
           wx.showModal({
             title: '', //提示的标题,
             content: '是否要删除该收货地址', //提示的内容,
             showCancel: true, //是否显示取消按钮,
             cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
             cancelColor: '#000000', //取消按钮的文字颜色,
             confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
             confirmColor: '#3CC51F', //确定按钮的文字颜色,
             success: res => {
               if (res.confirm) {
                 console.log('用户点击确定')
                 const data=get('/address/deleteAction',{
                     id:id
                 }).then(()=>{
                     that.getAddressList()
                 })

               } else if (res.cancel) {
                 console.log('用户点击取消')
                 that.initTextStyle()
               }
             }
           });
       }

    },
  }

</script>

<style lang="scss" scoped>
    @import "./style.scss";
</style>