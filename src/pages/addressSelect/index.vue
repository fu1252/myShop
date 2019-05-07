<template>
    <div class="address">
        <scroll-view scroll-y='true' class="addcont" style='height:100%'>
           <div v-if="listData.length!=0" class="item">
               <div v-for="(item, index) in listData" :key="index" class="list">
                   <div class="addresslist" :style='item.textStyle'>
                       <div>
                           <span>{{item.name}}</span>
                           <div v-if="item.is_default" class="moren">
                               默认
                           </div>
                       </div>
                       <div @click='selAddress(item.id)' class="info">
                           <p>{{item.mobile}}</p>
                           <p>{{item.address+item.address_detal}}</p>
                        </div>
                       <div @click='toDetail(item.id)'></div>
                   </div>
               </div>
           </div>
           <div class="center" v-else>
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
    import {get,getStorageOpenid} from '@/utils/index'
export default {
    onShow(){
        this.openId=getStorageOpenid()
        this.getAddressList()
    },
    data() {
        return {
            openId:'',
            listData:[]
        }
    },
    methods: {
        selAddress(id){
            wx.setStorageSync("addressId",id)
            const aa=wx.getStorageSync("addressId");
            console.log('test--id');
            console.log(id);
            wx.navigateBack({
              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
        },
        toDetail(id){
            wx.navigateTo({ url: '/pages/addaddress/main?id='+id });
        },
        wxaddress(index){
            if (index==1) {
                wx.navigateTo({ url: '/pages/addaddress/main' });
            }else{
                wx.chooseAddress({
                  success: function(res) {
                    res=encodeURIComponent(JSON.stringify(res))
                    wx.navigateTo({ url: '/pages/addaddress/main?res='+res });
                }
                });
            }
        },
        async getAddressList(){
          const that=this
          const data=await get('/address/getListAction',{
              openId:that.openId
          })
          for (let index = 0; index < data.data.length; index++) {
              const element = data.data[index];
              element.textStyle=''
              element.textStyle1=''
          }
          this.listData=data.data
          console.log('test--selectdata');
          console.log(data);
        },
    },
}
</script>

<style lang='scss' scoped>
@import './style.scss';
</style>
