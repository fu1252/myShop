<template>
    <div class="topicdetail">
        <div class="content">
            <div class="detail" v-if="goods_desc">
                <wxParse :content='goods_desc'/>
            </div>
        </div>
        <div class="list" v-if="recommendList!=0">
            <p class="title" >专题推荐</p>
            <div v-for="(item, index) in recommendList" :key="index" class="item">
               <img :src="item.scene_pic_url" alt="">
               <p>{{item.title}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {get} from '@/utils/index'
    import wxParse from 'mpvue-wxparse'
export default {
    async mounted() {
        this.id=this.$root.$mp.query.id
        this.getListData()
    },
    data() {
        return {
            recommendList:[],
            id:"",
            goods_desc:''
        }
    },
    components:{
        wxParse
    },
    methods: {
        async getListData(){
            const data=await get('/topic/detailaction',{
                id:this.id
            })
            console.log('test::data');
            console.log(data);
            
            
            this.goods_desc=data.data.content
            this.recommendList=data.recommendList
        }
    },

}
</script>

<style lang="scss" scoped>
    @import './style.scss';
    @import url('~mpvue-wxparse/src/wxParse.css');
</style>