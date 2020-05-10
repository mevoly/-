import{ request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧菜单数据
    leftMenuList:[],
    //右侧菜单数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧菜单与顶部的距离
    scrollTop:0
  },
  Cates:[],
  onLoad: function (options) {
    /*
    1 先判断一下本地存储中有没有旧的数据
    
    存储数据{time:Data.now(),data:[...]}
    2 没有旧的数据 直接发送请求
    3 有旧的数据 同时 就的数据没有过期 本地存储中的数据即可
    */
    //1 获取本地存储中的数据  小程序中也有本地存储技术
    const Cates = wx.getStorageSync("cates");//获取
    //2 判断
    if(!Cates){
      //不存在 发送请求
      this.getCates();
    }else{
      //有旧的数据 定义过期时间10s 改 5分钟
      if(Date.now()-Cates.time>1000*10){
        //重新发送请求
        this.getCates();
      }else{
        //可以使用就的数据
        this.Cates=Cates.data; 
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        })
      }
    }
      
  },
  //获取分类数据
  async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res =>{
    //   this.Cates=res.data.message;

    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});//存储
        

    //   //构造左侧大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent, 
    //   })
    // })

    //1使用es7的async await来发送请求
    const res = await request({url:"/categories"});
    // this.Cates=res.data.message;
    this.Cates=res;
      // 把接口的数据存入到本地存储中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});//存储
      //构造左侧大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧的商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent, 
      })
  },
  //左侧菜单点击事件
  handleTtemTap(e){
    //1 获取被点击的标题身上的索引
    //2 给data中的currentIndex赋值
    //3 根据不同的索引来渲染右侧的商品内容
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      //重新设置右侧菜单距离顶部的距离
      scrollTop:0,
    })
  }
})