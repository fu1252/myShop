<template>
    <div class="mappage">
        <div class="section">
            <input type="text" @input='bindInput' placeholder="搜索" v-model="keywords" :focus='true'>
        </div>
        <scroll-view :scroll-y='true' class="addcont" style='height:500rpx'>
            <div class="result" @touchstart='bindSearch(item.name)' v-for="(item, index) in tips" :key="index">{{item.name}}</div>
        </scroll-view>
        <div class="map_container">
            <div class="title">
                显示当前位置：
            </div>
            <map class="map" id="map" :longitude='longitude' :latitude='latitude' scale='16':markers='markers'></map>
        </div>
    </div>
</template>

<script>
    import amapFile from '@/utils/amap-wx'
    import {mapMutations} from 'vuex';

export default {
    mounted() {
        this.getMapaddress()
    },
    data(){
        return{
            keywords:"",
            longitude:"",
            latitude:"",
            markers:[],
            tips:[],
        }
    },
    methods: {
        ...mapMutations(['update']),
        bindSearch(cityName){
          this.update({cityName:cityName})
          wx.navigateBack({
              delta:1
          })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        },
        bindInput(e){
            const that=this
            let keywords=this.keywords
            const myAmapFun=new amapFile.AMapWX({
                key:"be02462afd02714001c6aa72d00b295b"
            })
            myAmapFun.getInputtips({
                keywords:keywords,
                location:"",
                success:function(data){
                    console.log('test--tipsdata');
                    console.log(data);
                    if (data&&data.tips) {
                        that.tips=data.tips
                    }
                    
                }
            })
        },
        getMapaddress(){
          const that=this
          const myAmapFun=new amapFile.AMapWX({
              key:'be02462afd02714001c6aa72d00b295b'
          })
          myAmapFun.getRegeo({
              iconPath:'/static/images/marker.png',
              iconWidth:22,
              iconHeight:32,
              success:function(data){
                  const marker=[
                      {
                          id:data[0].id,
                          latitude:data[0].latitude,
                          longitude:data[0].longitude,
                          iconPath:data[0].iconPath,
                          width:data[0].width,
                          height:data[0].height
                      }
                  ]
                  that.markers=marker
                  that.latitude=data[0].latitude
                  that.longitude=data[0].longitude                 
              },fail:function(info){
                  wx.showModal({title:info.errMsg})
              }
          })
        },
    },
}
</script>

<style scoped lang="scss">
    .mappage {
  height: 100%;
  background: #fff;
  position: relative;

  .section {
    height: 30px;
    width: 100%;

    input {
      width: 90%;
      margin: 0 auto;
      border: 1px solid #c3c3c3;
      height: 30px;
      border-radius: 3px;
      padding: 0 5px;
    }
  }

  .result {
    width: 40%;
    // margin: 0 auto;
    padding: 20rpx 0 20rpx 30rpx;
  }

  .map_container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .title {
      font-size: 34rpx;
      font-weight: bold;
      padding: 20rpx;
    }

    .map {
      width: 100%;
      height: 500rpx;
    }
  }
}


</style>