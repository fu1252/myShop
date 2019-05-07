<template>
    <div class="goods">
        <!-- swiper -->
        <div class="swiper">
            <swiper class="swiper-container" indicator-dots='true' autoplay='true' interval='3000' duration='1000'>
                <block v-for="(item, index) in gallery" :key="index">
                   <swiper-item class="swiper-item">
                        <image :src='item.img_url' class="slide-image"></image>
                   </swiper-item>
                </block>
            </swiper>
            <button class="share" hover-class='none' open-type='share' value=''>分享商品</button>
        </div>
        <!-- end -->
        <!-- swiper-b -->
        <div class="swiper-b">
            <div class="item">30天无忧退货</div>
            <div class="item">48小时快速退款</div>
            <div class="item">满88元免邮费</div>
        </div>
        <!-- end -->
        <!-- goods-info -->
        <div class="goods-info">
            <div class="c">
                <p>{{info.name}}</p>
                <p>{{info.goods_brief}}</p>
                <p>￥{{info.retail_price}}</p>
                <div class="brand" v-if="brand.name">
                    <p>{{brand.name}}</p>
                </div>
            </div>
        </div>
        <!-- end -->
        <div @click='showType' class="section-nav">
            <div>请选择规格数量</div>
            <div></div>
        </div>
        <!-- <div @click='showType' class="section-nav">
            <div>用户评价</div>
            <div></div>
        </div> -->
        <!-- 商品参数 -->
        <div class="attribute" v-if="attribute.length!=0">
           <div class="head">商品参数</div>
           <div class="item" v-for="(item, index) in attribute" :key="index">
               <div>{{item.name}}</div>
               <div>{{item.value}}</div>
           </div>
        </div>
        <div class="detail" v-if="goods_desc">
            <wxParse :content='goods_desc'/>
        </div>
        <!-- end -->
        <!-- 常见问题 -->
        <div class="common-problem">
            <div class="h">
                <div class="line"></div>
                <div class="title">常见问题</div>
                <div class="line"></div>
            </div>
            <div class="b">
                <div v-for="(item, index) in issueList" :key="index" class="item">
                    <div class="question-box">
                        <div class="spot"></div>
                        <div class="question">{{item.question}}</div>
                    </div>
                    <div class="answer">{{item.answer}}</div>
                </div>
            </div>
        </div>
        <!-- end -->
        <!-- 大家都在看 -->
        <div class="common-problem">
            <div class="h">
                <div class="line"></div>
                <div class="title">大家在看</div>
                <div class="line"></div>
            </div>
            <div class="sublist">
                <div @click='togoodsDetail(subitem.id)' v-for="(subitem, subindex) in productList" :key="subindex">
                    <img :src="subitem.list_pic_url" alt="">
                    <p>{{subitem.name}}</p>
                    <p>{{subitem.retail_price}}</p>
                </div>
            </div>
        </div>
        <!-- end -->
        <!-- 底部购物车 -->
        <div class="bottom-fixed">
            <div @click='collect'>
                <div class="collect" :class='[collectFlag?"active":""]'>                   
                </div>
            </div>
            <div @click='toCart'>
                 <div class="car">
                     <span>{{cartnumber}}</span>
                     <img src="/static/images/ic_menu_shoping_nor.png" alt="">
                 </div>
            </div>
            <div @click='bug'>立即购买</div>
            <div @click='addCart'>加入购物车</div>
        </div>
        <!-- end -->
        <!-- 选择规格 -->
        <div v-show="showpop" @click='showType' class="pop">
        </div>
        <div class="attr-pop" :class='[showpop?"fadeup":"fadedown"]'>
            <div class="top">
                <div class="left">
                    <img :src="info.primary_piv_url" alt="">
                </div>
                <div class="right">
                    <div>
                        <p>价格￥{{info.retail_price}}</p>
                        <p>请选择数量</p>
                    </div>
                </div>
                <div class="close" @click='showType'>
                    X
                </div>
            </div>
            <div class="b">
                <p>数量</p>
                <div class="count">
                    <div class="cut" @click='reduce'>-</div>
                    <input disabled="" v-model="number" class="number">
                    <div class="add" @click='add'>+</div>
                </div>
            </div>
        </div>
        <!-- end -->
    </div>
</template>

<script>
    import {get,post,toLogin,login,getStorageOpenid} from '@/utils/index';
    import wxParse from 'mpvue-wxparse';
export default {
    mounted() {
        if (login()) {
            this.userInfo=login()
        }
        console.log('test::userid');
        console.log(this.userInfo);
        
        this.id=this.$root.$mp.query.id
        this.openId=getStorageOpenid()
        this.goodsDetail()
    },
    components:{
        wxParse
    },
    data() {
        return {
            goods_desc:"",
            id:"",
            openId:"",
            number:0,
           allnumber:0,
            collectFlag:false,
            showpop:false,
            gallery:[],
            info:{},
            brand:{},
            attribute:[],
            issueList:[],
            productList:[],
            userInfo:"",
            goodsId:"",
            allPrice:""

        }
    },
    onShareAppMessage() {
      return {
        title: this.info.name,
        path: '/pages/goods/main?id='+this.info.id,
        imageUrl: this.gallery[0].img_url,
        success: res => {},
        fail: () => {},
        complete: () => {}
      };
    },
    computed: {
        cartnumber(){
            return this.allnumber+this.number
        }
    },
    methods: {
        async bug(){
            if(toLogin()){
                if(this.showpop){
                    if (this.number== 0) {
                        wx.showToast({
                          title: '请选择商品数量', //提示的内容,
                          icon: 'none', //图标,
                          duration: 2000, //延迟时间,
                          mask: true, //显示透明蒙层，防止触摸穿透,
                          success: res => {}
                        });
                        return false
                    }
                    console.log('test::bug');
                    console.log(this.goodsId)
                    const data=await post('/order/submitAction',{
                        goodsId:this.goodsId,
                        openId:this.openId,
                        allPrice:this.allPrice
                    })
                    if(data){
                        wx.navigateTo({ url: '/pages/order/main' });
                    }
                    
                }else{
                    this.showpop=true
                }
            }
        },
        async addCart(){
            
            if (toLogin()) {
                if (this.showpop) {
                    if (this.number==0) {
                        wx.showToast({
                          title: '请选择商品数量', //提示的内容,
                          icon: 'none', //图标,
                          duration: 2000, //延迟时间,
                          mask: true, //显示透明蒙层，防止触摸穿透,
                          success: res => {}
                        });
                        return false
                    }
                    const data=await post('/cart/addCart',{
                        openId:this.userInfo.openId,
                        goodsId:this.goodsId,
                        number:this.number
                    })
                    if (data) {
                        this.allnumber=this.allnumber+this.number
                        wx.showToast({
                          title: '添加购物车成功', //提示的内容,
                          icon: 'success', //图标,
                          duration: 1500, //延迟时间,
                          mask: true, //显示透明蒙层，防止触摸穿透,
                          success: res => {
                              this.showpop=false
                          }
                        });
                    }
                } else {
                    this.showpop=true
                }
            }
        },
        add(){
            this.number=this.number+1
        },
        reduce(){
            if (this.number>0) {
                this.number=this.number-1
            } else {
                return false
            }
        },
        toCart(){
            wx.switchTab({ url: '/pages/cart/main' });
        },
        async collect(){
            if (toLogin()) {
                this.collectFlag=!this.collectFlag
                const data=await post('/collect/addcollect',{
                    openId:this.userInfo.openId,
                    goodsId:this.goodsId
                })
            }
        },
        togoodsDetail(id){
            wx.navigateTo({ url: '/pages/goods/main?id='+id });
        },
        showType(){
            this.showpop=!this.showpop
        },
        async goodsDetail(){
            const data=await get('/goods/detailaction',{
                id:this.id,
                openId:this.openId
            })
            console.log('test:::goodsdetaidata');
            console.log(data);
            
            this.gallery=data.gallery
            this.info=data.info
            this.allnumber=data.allnumber
            this.goodsId=data.info.id
            this.allPrice=data.info.retail_price
            this.brand=data.brand
            this.attribute=data.attribute
            this.goods_desc=data.info.goods_desc
            this.issueList=data.issue
            this.collectFlag=data.collected
            this.productList=data.productList
        }
    },

}
</script>

<style lang="scss" scoped>
    @import url('~mpvue-wxparse/src/wxParse.css');
    @import './style.scss'
</style>