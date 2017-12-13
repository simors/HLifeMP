/**
 * Created by lilu on 2017/12/6.
 */
import AV from 'leancloud-storage'


export function getThumbUrl(uri, width, height) {
  if (!uri || uri.length == 0) {
    return ""
  }
  let filename = uri.split('/').pop()
  let file = AV.File.withURL(filename, uri)
  let thumb = file.thumbnailURL(width * 2, height * 2)
  return thumb
}