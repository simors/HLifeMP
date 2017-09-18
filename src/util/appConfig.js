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
const WECHAT_MP_APPID_DEV = "wx3dfde3f7184c8c51"
const WECHAT_MP_APPID_PRE = "wxd1cc733cd20fdaea"
const WECHAT_MP_APPID_PRO = "wxc13204ac7a37acb4"

if(__DEV__) {          //开发环境
  LC_APP_ID = LC_DEV_APP_ID
  LC_APP_KEY = LC_DEV_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_DEV

} else if(__STAGE__) { //预上线环境
  LC_APP_ID = LC_STAGE_APP_ID
  LC_APP_KEY = LC_STAGE_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRE

} else if(__PROD__) {   //生产环境
  LC_APP_ID = LC_PRO_APP_ID
  LC_APP_KEY = LC_PRO_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRO
}

var appConfig = {
  APP_NAME: '汇邻优店',

  LC_APP_ID: LC_APP_ID,
  LC_APP_KEY: LC_APP_KEY,

  WECHAT_MP_APPID: WECHAT_MP_APPID,
}

module.exports = appConfig