<template>
  <div class="categoryList">

    <scroll-view scroll-x="true" :scroll-left="scrollLeft" class="head">
      <div @click="changeTab(index,item.id)" :class="[nowIndex==index ?'active':'']" v-for="(item, index) in navData"
        :key="index">
        {{item.name}}
      </div>
    </scroll-view>

    <div class="info">
      <p>{{currentNav.name}}</p>
      <p>{{currentNav.front_desc}}</p>
    </div>

    <div class="list" v-if="goodsList.length!=0">
      <div @click="goodsDetail(item.id)" class="item" v-for="(item, index) in goodsList" :key="index">
        <img :src="item.list_pic_url" alt="">
        <p class="name">{{item.name}}</p>
        <p class="price">￥{{item.retail_price}}</p>
      </div>
    </div>

    <div v-else class="none">
      数据库暂无数据...
    </div>

  </div>
</template>

<script>
    import {get} from '@/utils/index'
  export default {
      mounted() {
          this.categoryId=this.$root.$mp.query.id
          this.getAllData()
      },
    data() {
      return {
        categoryId: '',
        navData:[],
        currentNav:{},
        nowIndex:0,
        scrollLeft:0,
        goodsList:[],
      }
    },
    methods: {
        goodsDetail(id){
            wx.navigateTo({ url: '/pages/goods/main?id='+id });
        },
        async changeTab(index,id){
            this.nowIndex=index
            const listdata=await get('/goods/goodsList',{categoryId:id})
            this.goodsList=listdata.data
            this.currentNav=listdata.currentNav

            if (this.nowIndex>4) {
                this.scrollLeft=this.nowIndex*60
            }else{
              this.scrollLeft=0
            }
        },
        async getAllData(){
            const navdata=await get('/category/categoryNav',{
                id:this.categoryId
            })
            console.log('test::data');
            console.log(this.categoryId);
            
            console.log(navdata);
            
            this.navData=navdata.navData
            this.currentNav=navdata.currentNav
            for (let i = 0; i < this.navData.length; i++) {
                const id = this.navData[i].id;
                if (id==this.currentNav.id) {
                    this.nowIndex=i
                }
                
            }
            if (this.nowIndex>4) {
                this.scrollLeft=this.nowIndex*60
            }else{
                this.scrollLeft=0
            }
            const listdata=await get('/goods/goodsList',{
                categoryId:this.categoryId
            })
            this.goodsList=listdata.data
            console.log('test::listdata');
            console.log(this.goodsList);
            
            
        },
    },
  }

</script>

<style lang="scss" scoped>
  @import './style'

</style>
