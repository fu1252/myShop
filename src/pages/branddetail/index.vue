<template>
    <div class="branddetail">
        <div class="banner">
                <img src="http://yanxuan.nosdn.127.net/1541445967645114dd75f6b0edc4762d.png" alt="">
                <div class="info">
                    <span>MUJI制造商</span>
                </div>
            </div>
            <div class="info-desc">
                    严选精选了MUJI制造商和生产原料， 用几乎零利润的价格，剔除品牌溢价， 让用户享受原品牌的品质生活。
            </div>
            <div class="sortlist" v-if="goodsList.length!=0">
                <div class="item" v-for="(item, index) in goodsList" :key="index">
                    <img :src="item.list_pic_url" alt="">
                    <p class="name">{{item.name}}</p>
                    <p class="price">￥{{item.retail_price}}</p>
                </div>
            </div>
            <div class="none" v-else>
                数据库暂无数据
            </div>
    </div>
</template>

<script>
    import {get} from '@/utils/index';
export default {
    mounted() {
        this.id=this.$root.$mp.query.id
        this.getDetail()
    },
    data() {
        return {
            id:"",
            detailData:{},
            goodsList:[]
        }
    },
    methods: {
        async getDetail(){
            const data=await get('/brand/detailaction',{id:this.id})
            this.detailData=data.data
            this.goodsList=data.goodsList
        }
    },
}
</script>

<style lang='scss' scoped>
@import './style'
</style>