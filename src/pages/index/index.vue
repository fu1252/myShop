<template>
  <div class="index">
    <!-- search -->
    <div class="search">
      <div @click='toMappage'>{{cityName}}</div>
      <div @click='toSearch'>
        <input type="text" placeholder="搜索商品">
        <span class="icon"></span>
      </div>
    </div>
    <!-- end -->
     <!-- swiper -->
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots='true' autoplay='true'
      interval='3000' circular='true' duration='500'>
         <block v-for="(item, index) in banner" :key="index">
            <swiper-item class="swiper-item">
               <image :src='item.image_url' class="slide-image"></image>
            </swiper-item>
         </block>
      </swiper>
    </div>
    <!-- end   -->
    <!-- channel -->
    <div class="channel">
      <div @click='categoryList(item.id)'v-for="(item, index) in channel" :key="index">
          <img :src="item.icon_url" alt="">
          <p>{{item.name}}</p>
      </div>
    </div>
    <!-- end -->
    <!-- brand -->
    <div class="brand">
      <div @click='tobrandList' class="head">
         品牌制造商直供
      </div>
      <div class="content">
        <div @click='branddetail(item.id)' v-for="(item, index) in brandList" :key="index">
            <div>
              <p>{{item.name}}</p>
              <p>{{item.floor_price}}元起</p>
            </div>
            <img :src='item.new_pic_url'>
        </div>
      </div>
    </div>
    <!-- end -->
    <!-- newgoods -->
    <div class="newgoods">
      <div @click='goodsList("new")' class="newgoods-top">
         <div class="top">
           <p>新品首发</p>
           <p>查看全部</p>
         </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x='true'>
             <li @click='goodsDetail(item.id)' v-for="(item, index) in newGoods" :key="index">
               <img :src='item.list_pic_url'>
               <p>{{item.name}}</p>
               <p>{{item.goods_brief}}</p>
               <p>￥{{item.retail_price}}</p>
             </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- end -->
    <!-- hotgoods -->
    <div class="newgoods hotgoods">
      <div @click='goodsList("hot")' class="newgoods-top">
         <div class="top">
           <p>人气推荐
             <span></span>好物精选
           </p>
           <p>查看全部</p>
         </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x='true'>
            <li @click='goodsDetail(item.id)'v-for="(item, index) in hotGoods" :key="index">
               <img :src="item.list_pic_url" alt="">
               <p>{{item.name}}</p>
               <p>{{item.goods_brief}}</p>
               <p>￥{{item.retail_price}}</p>
            </li>

          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- end -->
    <!-- topicList -->
    <div class="topicList">
      <div @click='totopic' class="topicList-top">
         专题精选 <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x='true'>
             <li @click='topicdetail(item.id)' v-for="(item, index) in topicList" :key="index">
                <img :src="item.item_pic_url" alt="">
                <div class="btom">
                  <div>
                    <p>{{item.title}}</p>
                    <p>{{item.subtitle}}</p>
                  </div>
                  <div>
                    {{item.price_info}}元起
                  </div>
                </div>
             </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- end -->
    <!-- newcategory -->
    <div class="newcategory">
      <div class="list" v-for="(item, index) in newCategoryList" :key="index">
         <div class="head">{{item.name}}好物</div>
         <div class="sublist">
           <div @click='goodsDetail(subitem.id)' v-for="(subitem, subindex) in item.goodsList" :key="subindex"> 
               <img :src="subitem.list_pic_url" alt="">
               <p>{{subitem.name}}</p>
               <p>￥{{subitem.retail_price}}</p>
           </div>
           <div @click='categoryList(item.id)'>
              <div class="last">
                <p>{{item.name}}好物</p>
                <span class="icon"></span>
              </div>
           </div>
         </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  import amapFile from '@/utils/amap-wx'
  import {get,post} from '@/utils/index'
export default {
  data() {
    return {
      banner:[],
      channel:[],
      brandList:[],
      newGoods:[],
      hotGoods:[],
      topicList:[],
      newCategoryList:[]
    }
  },
  mounted() {
    this.getCityName()
    this.getData()
  },
  computed: {
    ...mapState(['cityName'])
  },
  methods: {
    topicdetail(id){
      wx.navigateTo({ url:'/pages/topicdetail/main?id='+id });
    },
    totopic(){
      wx.switchTab({ url: '/pages/topic/main' });
    },
    goodsDetail(id){
      wx.navigateTo({ url: '/pages/goods/main?id='+id });
    },
    goodsList(info){
      if(info=='hot'){
        wx.navigateTo({ url: '/pages/newgoods/main?isHot='+1 });
      }else{
        wx.navigateTo({ url: '/pages/newgoods/main?isNew='+1 });
      }
    },
    branddetail(id){
      wx.navigateTo({ url: '/pages/branddetail/main?id='+id });
    },
    tobrandList(){
      wx.navigateTo({ url: '/pages/brandlist/main' });
    },
    categoryList(id){
      wx.navigateTo({ url: '/pages/categorylist/main?id='+id });
    },
    async getData(){
      const data=await get('/index/index')
      this.banner=data.banner
      this.channel=data.channel
      this.brandList=data.brandList
      this.newGoods=data.newGoods
      this.hotGoods=data.hotGoods
      this.topicList=data.topicList
      this.newCategoryList=data.newCategoryList
    },
    toSearch(){
      wx.navigateTo({url:'/pages/search/main'})
    },
    getCityName(){
      const that=this
      const myAmapFun= new amapFile.AMapWX({
        key:"be02462afd02714001c6aa72d00b295b"
      })
      myAmapFun.getRegeo({
        success:function(data){
           that.update({cityName:data[0].regeocodeData.formatted_address})
        },
        fail:function(info){
          
          that.cityName='北京市'
          that.update({cityName:'北京市'})
        }
      })
    },
    ...mapMutations(['update']),
    toMappage(){
      const that=this
      
      wx.getSetting({
        success(res){
          if(!res.authSetting["scope.userLocation"]){
            wx.openSetting({
              success:res=>{
                that.getCityName()
              }
            })
          }else{
            wx.navigateTo({
              url:'/pages/map/main'
            })
          }
        },fail:function(){
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  overflow: hidden;
  position: relative;

  .search {
    width: 100%;
    box-sizing: border-box;
    padding: 0 25rpx 0 10rpx;
    position: fixed;
    top: 0;
    z-index: 99;
    height: 80rpx;
    display: flex;
    align-items: center;
    background: #fff;

    div:nth-child(1) {
      width: 115rpx;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 20rpx;
      padding-right: 15rpx;
    }

    div:nth-child(2) {
      flex: 1;
      position: relative;

      input {
        width: 100%;
        height: 56rpx;
        border-radius: 8rpx;
        background: #ededed;
        box-sizing: border-box;
        padding-left: 40rpx;
      }

      .icon {
        position: absolute;
        top: 15rpx;
        left: 10rpx;
        background: url('http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/search2-2fb94833aa.png') center no-repeat;
        background-size: 100%;
        width: 28rpx;
        height: 28rpx;
        margin-right: 10rpx;
      }
    }
  }

  .swiper {
    width: 100%;
    height: 417rpx;
    margin-top: 80rpx;

    .swiper-container {
      width: 100%;
      height: 100%;

      .swiper-item {
        width: 100%;
        height: 100%;

        .slide-image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .channel {
    display: flex;
    padding: 20rpx 0;
    background: #ffffff;

    div {
      width: 25%;
      text-align: center;

      img {
        height: 58rpx;
        width: 58rpx;
        display: inline-block;
      }
    }
  }

  .brand {
    width: 100%;
    margin-top: 20rpx;
    background: #ffffff;

    .head {
      text-align: center;
      padding: 40rpx 0;
    }

    .content {
      width: 730rpx;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      div {
        width: 360rpx;
        height: 235rpx;
        margin-bottom: 10rpx;
        position: relative;

        div {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10rpx;

          p:nth-child(2) {
            font-size: 24rpx;
          }
        }

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .newgoods {
    .newgoods-top {
      margin-top: 20rpx;
      height: 260rpx;
      width: 100%;
      background: url('../../../static/images/bgnew.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;

      .top {
        p {
          color: #8c9bae;
          font-size: 32rpx;
        }

        p:nth-child(2) {
          width: 180rpx;
          height: 50rpx;
          line-height: 50rpx;
          margin: 27rpx auto 0 auto;
          font-size: 22rpx;
          background: #d8e4f0;
        }
      }
    }

    .list {
      margin-top: 20rpx;
      background: #fff;
      padding-bottom: 10rpx;

      ul {
        .scroll-view {
          width: 100%; // height: 470rpx; // display: flex;
          // flex-wrap: nowrap;
          white-space: nowrap;

          li {
            width: 280rpx;
            height: 416rpx;
            margin: 5rpx 0 5rpx 25rpx;
            display: inline-block;

            img {
              width: 280rpx;
              height: 280rpx;
            }

            p:nth-child(2) {
              font-size: 30rpx;
              font-weight: bold;
            }

            p:nth-child(3) {
              color: #8a8a8a;
              font-size: 24rpx;
            }

            p:nth-child(4) {
              color: #9c3232;
              font-size: 24rpx;
            }

            p {
              width: 94%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-top: 8rpx;
              text-indent: 1em;
            }
          }

          li:nth-child(n+2) {
            border-left: 1rpx solid #f4f4f4;
          }
        }
      }
    }
  }

  .hotgoods {
    .newgoods-top {
      background: url('../../../static/images/bgtopic.png') no-repeat;
      background-size: 100% 100%;

      .top {
        p {
          color: #b1a279;
          font-size: 32rpx;
          vertical-align: middle;
        }

        p:nth-child(1) {
          span {
            width: 4rpx;
            height: 4rpx;
            font-size: 14rpx;
            display: inline-block;
            vertical-align: middle;
            background: #b1a279;
          }
        }

        p:nth-child(2) {
          background: #f4e9cb;
        }
      }
    }
  }

  .topicList {
    margin-top: 20rpx;
    background: #fff;

    .topicList-top {
      text-align: center;
      padding: 36rpx;
      vertical-align: middle;

      .icon {
        display: inline-block;
        width: 32rpx;
        height: 32rpx;
        margin-left: 5rpx;
        background: url('../../../static//images/right.png') no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
      }
    }

    .list {
      .scroll-view {
        white-space: nowrap;

        li {
          display: inline-block;
          width: 575rpx;
          margin-left: 25rpx;

          img {
            display: block;
            width: 575rpx;
            height: 325rpx;
            border-radius: 10rpx;
          }

          .btom {
            display: flex;
            justify-content: space-between;
            margin-bottom: 42rpx;
            width: 100%;

            div:nth-child(1) {
              width: 90%;

              p {
                margin-top: 8rpx;
              }

              p:nth-child(1) {
                font-size: 30rpx;
                font-weight: bold;
              }

              p:nth-child(2) {
                width: 90%;
                color: #8a8a8a;
                font-size: 24rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            div:nth-child(2) {
              margin-top: 8rpx;
              color: #9c3232;
              font-size: 24rpx;
            }
          }
        }

        li:last-child {
          margin-right: 25rpx;
        }
      }
    }
  }

  .newcategory {
    margin-top: 20rpx;
    padding: 0 10rpx 25rpx 10rpx;

    .head {
      padding: 25rpx 0;
      text-align: center;
    }

    .sublist {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 730rpx;
      margin: 0 auto;

      div {
        width: 360rpx;
        background: #fff;
        margin-bottom: 10rpx;
        padding-bottom: 10rpx;

        img {
          display: block;
          width: 302rpx;
          height: 302rpx;
          margin: 0 auto;
        }

        p {
          margin-bottom: 5rpx;
          text-indent: 1em;
        }

        p:nth-child(2) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 98%;
        }

        p:nth-child(3) {
          color: #9c3232;
        }
      }

      .last {
        display: block;
        width: 302rpx;
        height: 302rpx;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        p {
          height: 33rpx;
          width: 100%;
          line-height: 33rpx;
          color: #333;
          font-size: 33rpx;
          text-align: center;
        }

        .icon {
          display: inline-block;
          width: 70rpx;
          height: 70rpx;
          background: url('../../../static/images/rightbig.png') no-repeat;
          background-size: 100% 100%;
          margin-top: 60rpx;
        }
      }

      div:nth-child(2n) {
        margin-left: 10rpx;
      }
    }
  }
}

</style>