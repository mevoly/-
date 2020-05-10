import{ request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
     tabs:[
       {
         id:0,
         value:"综合",
         isActive:true
       },
       {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
     ],
     goodsList:[]
  },

  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.cid||"";
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    //获取总条数
    const total=res.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  },


  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    //1获取被点击的标题索引
    const {index}=e.detail;
    //2修改数组源
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //3 赋值
    this.setData({
      tabs
    })
  },
  //页面触底事件
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({title: '没有商品了',});   
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.getGoodsList();
  }
})