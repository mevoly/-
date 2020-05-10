// 0 引入 用来发送请求的 方法 一定要把路径补全
import{ request } from "../../request/index.js";
Page({
  data: {
    swiperList:[],//轮播图数组
    cateList:[],//导航 数组
    floorList:[]// 楼层数组
  },
  //页面加载就开始触发
  onLoad: function(options) {
    // 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
      this.getSwiperList();
      this.getCateList();
      this.getFloorList();
    },



    //获取轮播图数据
    getSwiperList(){
      request({url:"/home/swiperdata"})
      .then(result =>{
        this.setData({
          swiperList:result
        })
      })
    },
    //获取导航数据
    getCateList(){
      request({url:"/home/catitems"})
      .then(result =>{
        this.setData({
          cateList:result
        })
      })
    },
    //获取楼层数据
    getFloorList(){
      request({url:"/home/floordata"})
      .then(result =>{
        this.setData({
          floorList:result
        })
      })
    },
})
  