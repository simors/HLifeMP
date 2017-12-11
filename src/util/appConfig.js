/**
 * Created by yangyang on 2017/9/18.
 */

//LeanCloud环境参数
var LC_APP_ID = ""
var LC_APP_KEY = ""
const LC_DEV_APP_ID = 'K5Rltwmfnxd5pYjMsOFFL0kT-gzGzoHsz'      //开发环境
const LC_DEV_APP_KEY = 'UseC5jvqLT7TIiQWI8nRPmEl'
const LC_STAGE_APP_ID = 'TUVjJ5HHNmopfJeREa4IcB1T-gzGzoHsz'    //预上线环境
const LC_STAGE_APP_KEY = 'XYSEQ5K4FYtMp7P8HXT8Vz63'
const LC_PRO_APP_ID = 'pHIMCdWo3VQX09TKFuU9AGdd-gzGzoHsz'      //生产环境
const LC_PRO_APP_KEY = 'qhIzQiFonde2yeaBdlcXHUDz'

//微信公众平台
var WECHAT_MP_APPID = ""
const WECHAT_MP_APPID_DEV = "wx1acbae7446bf8307"
const WECHAT_MP_APPID_PRE = "wxd1cc733cd20fdaea"
const WECHAT_MP_APPID_PRO = "wxc13204ac7a37acb4"

// 后台域名
var BACKEND_DOMAIN = ""
const BACKEND_DOMAIN_DEV = "http://hlyd-dev.leanapp.cn"
const BACKEND_DOMAIN_STAGE = "http://hlyd-pre.leanapp.cn"
const BACKEND_DOMAIN_PRO = "http://share.xiaojee.cn"

// 客户端域名
var CLIENT_DOMAIN = ''
const CLIENT_DOMAIN_DEV = 'http://www.hlifempwan.frp.lvyii.com'
const CLIENT_DOMAIN_STAGE = 'http://dev.xiaojee.cn:6300'
const CLIENT_DOMAIN_PRO = 'http://admin.xiaojee.cn:6300'

if(__DEV__) {          //开发环境
  LC_APP_ID = LC_DEV_APP_ID
  LC_APP_KEY = LC_DEV_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_DEV
  BACKEND_DOMAIN = BACKEND_DOMAIN_DEV
  CLIENT_DOMAIN = CLIENT_DOMAIN_DEV
} else if(__STAGE__) { //预上线环境
  LC_APP_ID = LC_STAGE_APP_ID
  LC_APP_KEY = LC_STAGE_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRE
  BACKEND_DOMAIN = BACKEND_DOMAIN_STAGE
  CLIENT_DOMAIN = CLIENT_DOMAIN_STAGE
} else if(__PROD__) {   //生产环境
  LC_APP_ID = LC_PRO_APP_ID
  LC_APP_KEY = LC_PRO_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRO
  BACKEND_DOMAIN = BACKEND_DOMAIN_PRO
  CLIENT_DOMAIN = CLIENT_DOMAIN_PRO
}

// 订单状态定义
const ORDER_STATUS = {
  PAID_FINISHED: 1, // 已支付
  DELIVER_GOODS: 2, // 已发货
  ACCOMPLISH: 3,    // 已完成
  DELETED: 4,       // 已删除
}


var appConfig = {
  APP_NAME: '汇邻优店',
  ORDER_STATUS: ORDER_STATUS,

  LC_APP_ID: LC_APP_ID,
  LC_APP_KEY: LC_APP_KEY,

  WECHAT_MP_APPID: WECHAT_MP_APPID,
  BACKEND_DOMAIN: BACKEND_DOMAIN,
  CLIENT_DOMAIN: CLIENT_DOMAIN,
  APP_DOWNLOAD_URL: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.hlife',
  FOCUS_MP_URL: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0ODA1Njg5MA==&scene=110#wechat_redirect',
}

module.exports = appConfig