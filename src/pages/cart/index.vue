<template>
    <div class="cart">
        <!-- top -->
        <div class="top">
            <div>30天无忧退货</div>
            <div>48小时快速退款</div>
            <div>满88元免邮费</div>
        </div>
        <!-- end -->
        <!-- cartlist -->
        <div class="cartlist">
            <div @touchstart='startMove' @touchmove='deleteGoods' @touchend='endMove'
             class="item" v-for="(item, index) in listData" :data-index='index' :key="index">
                <div class="con" :style='item.textStyle'>
                  <div class="left">
                      <div class="icon" @click='changeColor(index,item.goods_id)'
                      :class='[Listids[index]?"active":"",{active:allcheck}]'></div>
                      <div class="img">
                          <img :src="item.list_pic_url" alt="">
                      </div>
                      <div class="info">
                          <p>{{item.goods_name}}</p>
                          <p>{{item.retail_price}}</p>
                      </div>
                  </div>
                  <div class="right">
                      x{{item.number}}
                  </div>
                </div>
                <div class="delete" @click='delGoods(item.id,index)' :style='item.textStyle1'>
                    <div>删除</div>
                </div>
            </div>
        </div>
        <!-- end -->
        <div class="nogoods" v-if="false">
                <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" alt="">
            </div>
            <div class="fixed">
                <div @click='allCheck' class="left":class='{active:allcheck}'>
                    全选{{isCheckedNumber}}
                </div>
                <div class="right">
                    <div>￥{{allPrice}}</div>
                    <div @click='orderDown'>下单</div>
                </div>
            </div>
    </div>
</template>

<script>
    import {get,post,login,getStorageOpenid} from '@/utils/index'
export default {
    onShow() {
        this.openId=getStorageOpenid()
        this.getListData()
    },
    data() {
        return {
            openId:'',
            listData:[],
            allcheck:false,
            Listids:[],
            userInfo:{},
            tranX:0,
            tranX1:0,
            startX:'',
            startY:'',
            moveX:'',
            moveY:'',
            moveEndX:'',
            moveEndY:'',
            X:0,
            Y:''

        }
    },
    computed: {
        isCheckedNumber(){
            let number=0
            for (let i = 0; i < this.Listids.length; i++) {
				console.log("TCL: isCheckedNumber -> this.Listids", this.Listids)
                const element = this.Listids[i];
                if (element) {
                    number++
                }
            }
            if (number==this.listData.length&&number!=0) {
                this.allcheck=true
            } else {
                this.allcheck=false
            }
            return number
        },
        allPrice(){
            let Prise=0
            for (let i = 0; i < this.Listids.length; i++) {
                const element = this.Listids[i];
                  if (element) {
                      Prise=Prise+this.listData[i].retail_price*this.listData[i].number
                  }
            }
            return Prise
        }
    },
    methods: {
        allCheck(){
            this.Listids=[]
            
            if(this.allcheck){
                this.allcheck=false
            }else{
                this.allcheck=true
                for (let i = 0; i < this.listData.length; i++) {
                    const element = this.listData[i];
                    this.Listids.push(element.goods_id)
                }
            }
        },
        async orderDown(){
            if (this.Listids.length == 0) {
                wx.showToast({
                  title: '请选择商品', //提示的内容,
                  icon: 'none', //图标,
                  duration: 1500, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {}
                });
                return false
            }
            const newgoodsid=[]
            for (let i = 0; i < this.Listids.length; i++) {
                const element = this.Listids[i];
                if (element) {
                    newgoodsid.push(element)
                }
            }
            let goodsId=newgoodsid.join(',')
            const data=await post('/order/submitAction',{
                goodsId:goodsId,
                openId:this.openId,
                allPrice:this.allPrice
            })
            if (data) {
                wx.navigateTo({ url: '/pages/order/main' });
            }
        },
        async delGoods(id,index){
            const that=this
            wx.showModal({
              title: '', //提示的标题,
              content: '是否要删除该商品', //提示的内容,
            //   showCancel: true, //是否显示取消按钮,
            //   cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
            //   cancelColor: '#000000', //取消按钮的文字颜色,
            //   confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            //   confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                if (res.confirm) {
                  that.Listids.splice(index,1)
                  const data=get('/cart/deleteAction',{
                      id:id
                  }).then(()=>{that.getListData()})
                  
                } else if (res.cancel) {
                  that.initTextStyle()
                }
              }
            });
        },
        async getListData(){
            const data=await get('/cart/cartList',{
                openId:this.openId
            })
            for (let i = 0; i < data.data.length; i++) {
                const el = data.data[i];
                el.textStyle=''
                el.textStyle1=''
            }
            this.listData=data.data 
            
        },
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

          if (this.X + -100 > -100) {
            this.flag = false;
          }
          this.tranX1 = -100;
          this.listData[index].textStyle1 = `transform:translateX(-100rpx);`;
          // this.listData = this.listData;
        }
        // if (Math.abs(this.X) > Math.abs(this.Y) && this.X > 20) {
        //   this.scrollflag = false;
        // } else if (Math.abs(this.X) > Math.abs(this.Y) && this.X < 20) {
        //   console.log("right 2 left");
        // }
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
      changeColor(index,id){
          if(this.Listids[index]){
              this.$set(this.Listids,index,false)
          }else{
              this.$set(this.Listids,index,id)
          }
      }

    },
}
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>