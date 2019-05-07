<template>
    <div class="search">
      <!-- head -->
      <div class="head">
        <div>
          <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
          <input type="text" confirm-type="search" focus="true" v-model="words"
           @focus="inputFocus" @input="tipsearch" @confirm="searchWords" placeholder="商品搜索">
          <!-- <input name="input" class="keywrod" focus="true" value="{{keyword}}" confirm-type="search" bindinput="inputChange" bindfocus="inputFocus" bindconfirm="onKeywordConfirm" confirm-type="search" placeholder="{{defaultKeyword.keyword}}" /> -->
          <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
        </div>
        <div @click="cancel">取消</div>
      </div>
      <!-- end -->
      <!-- tips -->
      <div class="searchtips" v-if="words">
        <div @click="searchWords" v-if="tipsData.length!=0" :data-value="item.name"
         v-for="(item,index) in tipsData" :key="index">
          {{ item.name }}
        </div>
        <div v-if="tipsData.length==0" class="nogoods">
          数据库暂无此类商品...
        </div>
      </div>
      <!-- end -->
      <!-- history -->
      <div class="history" v-if="historyData.length!=0">
        <div class="t">
          <div>历史记录</div>
          <div @click="clearHistory">
  
          </div>
        </div>
        <div class="cont">
          <div @click="searchWords" :data-value="item.keyword" 
          v-for="(item,index) in historyData" :key="index">
            {{item.keyword}}
          </div>
        </div>
      </div>
      <!-- end -->
      <!-- hotsearch -->
      <div class="history hotsearch">
        <div class="t">
          <div>热门搜索</div>
        </div>
        <div class="cont">
          <div @click="searchWords" v-for="(item,index) in hotData" :data-value="item.keyword" 
          :class="{active:0==index}" :key="index">
            {{item.keyword}}
          </div>
        </div>
      </div>
      <!-- end -->
      <!--商品列表  -->
      <div v-if="listData.length!=0" class="goodsList">
        <div class="sortnav">
          <div @click="changeTab(0)" :class="[0==nowIndex ?'active':'']">综合</div>
          <div @click="changeTab(1)" class="price" 
          :class="[1==nowIndex ?'active':'', order =='desc'? 'desc':'asc']">价格</div>
          <div @click="changeTab(2)" :class="[2==nowIndex ?'active':'']">分类</div>
        </div>
        <div class="sortlist">
          <div @click="goodsDetail(item.id)" v-for="(item, index) in listData" :key="index" 
          :class="[(listData.length)%2==0?'active':'none']" class="item">
            <img :src="item.list_pic_url" alt="">
            <p class="name">{{item.name}}</p>
            <p class="price">￥{{item.retail_price}}</p>
          </div>
        </div>
      </div>
      <!-- end -->
    </div>
  </template>

<script>
    import {post,get} from '@/utils/index';
export default {
    data(){
        return{
            words:"",
            openid:"",
            hotData:[],
            historyData:[],
            listData:[],
            tipsData:[],
            nowIndex:0,
            order:'',
            isHot:'',
            isNew:''
        }
    },
    mounted() {
        
        this.openid=wx.getStorageSync('openId')||"";
        this.getHotData()
    },
    methods: {
        goodsDetail(id){
            wx.navigateTo({ url: '/pages/goods/main?id='+id });
        },
        changeTab(index){
            this.nowIndex=index
            if (index==1) {
                this.order=this.order=='asc'?'desc':'asc'
            }else{
                this.order=""
            }
            this.getlistData()
        },
        async searchWords(e){
            let value=e.currentTarget.dataset.value
            this.words=value||this.words
            const data=await post('/search/addhistoryaction',{
                openId:this.openid,
                keyword:value||this.words
            })
            this.getHotData()
            this.getlistData()
            
        },
        async clearHistory(){
            const data=await post('/search/clearhistoryAction',{
                openId:this.openid
            })
            if (data) {
                this.historyData=[]
            }
            
        },
        cancel(){
            wx.navigateBack({
              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
        },
        clearInput(){
            this.words=""
            this.listData=[]
            this.tipsData=[]
        },
        async getlistData(){
            const data=await get('/search/helperaction',{
                keyword:this.words,
                order:this.order
            })
            
            
            this.listData=data.keywords
            this.tipsData=[]
        },
        inputFocus(){
              this.listData=[]
            this.tipsearch()      
        },
        async tipsearch(e){
          // if(this.timer){
          //     clearTimeout(this.timer)
          //   }
          //  this.timer=setTimeout(async()=>{ 
             const data=await get('/search/helperaction',{
              keyword:this.words
          })
          this.tipsData=data.keywords
          // },500)
        },
        async getHotData(){
            
            const data= await get("/search/indexaction?openId="+this.openid)            
            this.hotData=data.hotKeywordList
            this.historyData=data.historyData
        }
    },
}
</script>

<style lang="scss" scoped>
@import "./style"
</style>
