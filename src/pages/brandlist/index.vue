<template>
    <div class="brand">
        <div @click='branddetail(item.id)' v-for="(item, index) in listData" :key="index" class="list">
            <img :src="item.app_list_pic_url" alt="">
            <div class="info">
                <span>{{item.name}}</span>
                <span>|</span>
                <span>{{item.floor_price}}元起</span>
            </div>

        </div>
    </div>
</template>

<script>
    import {get} from '@/utils/index';
export default {
    mounted() {
        this.getData(true)
    },
    data() {
        return {
            page:1,
            listData:[],
            total:''
        }
    },
    onPullDownRefresh(){
        this.page=1
        this.getData(true)
        wx.stopPullDownRefresh();
    },
    onReachBottom(){
        this.page=this.page+1
        if (this.page>5) {
            return false
        }
        this.getData()
    },
    methods: {
        async getData(first){
            const data=await get('/brand/listaction',{page:this.page})
            this.total=data.total
            if(first){
                this.listData=data.data
            }else{
                this.listData=this.listData.concat(data.data)
            }
        },
        branddetail(id){
            wx.navigateTo({ url: '/pages/branddetail/main?id='+id });
        }
    },
}
</script>

<style lang="scss" scoped>
    @import './style'
</style>