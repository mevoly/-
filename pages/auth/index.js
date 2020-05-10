import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx.js";
Page({
  async handleGetUserInfo(e) {
    try {
      const { encrypttedData, pawData, iv, signature } = e.detail;
      const { code } = await login();
      const loginParams = { encrypttedData, pawData, iv, signature, code };
      const res = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
      
    }
  }
})