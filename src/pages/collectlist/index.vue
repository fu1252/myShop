<template>
    <div class="collection">
        <div class="title">
            我的收藏
        </div>
        <div class="sublist">
            <div @click='goodsDetail(item.id)' v-for="(item, index) in collectlist" :key="index">
               <img :src="item.list_pic_url" alt="">
               <p>{{item.name}}</p>
               <p>￥{{item.retail_price}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {get,getStorageOpenid} from '@/utils/index'
export default {
    onShow(){
        this.openId=getStorageOpenid()
        this.getlist()
    },
    data() {
        return {
            openId:'',
            collectlist:[]
        }
    },
    methods: {
        async getlist(){
            const data=await get('/collect/listAction',{
                openId:this.openId
            })
            this.collectlist=data.collectGoodsList
        },
        goodsDetail(id){
            wx.navigateTo({ url: '/pages/goods/main?id='+id });
        }
    },
}
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>