import{ request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
    goodsObj:{},
    //商品是否被收藏过
    isCollect:false
  },
  GoodsInfo:{},
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },

  //轮播图放大
  handlePrevewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
      
  },
  handleCartAdd(){
    let cart=wx.getStorageSync("cart")||[];
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      cart[index].num++;
    }
    wx.setStorageSync("cart",cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
      
      
  },
  //点击 商品收藏
  handleCollect(){
    let isCollect=false;
    // 1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    // 2 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3 当index！=-1表示 已经收藏过 
    if(index!==-1){
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
        
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect
    })
      
      
  }
})