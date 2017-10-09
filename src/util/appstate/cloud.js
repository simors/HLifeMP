/**
 * Created by yangyang on 2017/10/9.
 */
import AV from 'leancloud-storage'

export function getJssdkConfig(payload) {
  return AV.Cloud.run('wechatGetJsConfig', payload).then((configInfo) => {
    return configInfo
  }).catch((error) => {
    console.log("获取微信js-sdk config失败：", error)
    throw error
  })
}