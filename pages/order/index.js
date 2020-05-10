// pages/order/index.js
import{ request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
       id:1,
       value:"待付款",
       isActive:false
     },
     {
       id:2,
       value:"待发货",
       isActive:false
     },
     {
      id:2,
      value:"退款/退货",
      isActive:false
    }
    ],
  },


  onShow(options){
    const token =wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
        
    }




    let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
      const {type}=currentPage.options;
      //激活选中标题 type-1
      this.changeTitleByIndex(type-1);
      this.getOrders(type);
  },
  //获取订单列表
  async getOrders(type){
    const res=await request({url:"/my/order/all",data:{type}});
    this.setData({
      orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },




//根据索引激活标题
  changeTitleByIndex(index){
    //2修改数组源
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //3 赋值
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    //1获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index+1);
  },
})