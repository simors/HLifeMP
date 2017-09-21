/**
 * 移除字符中空格
 *
 * @param phone
 */
export function removeSpace(phone) {
  if (!phone) {
    return;
  }
  return phone.toString().replace(/\s+/g, "");
}

/**
 * 自动分割电话号码
 *
 * @param phone
 * @returns {*}
 */
export function formatPhone(phone) {
  if (!phone) {
    return;
  }

  phone = removeSpace(phone)

  if (phone.length <= 3) {
    return phone
  }
  else if (phone.length <= 7) {
    return phone.toString().substring(0, 3) + " " + phone.toString().substring(3, phone.length)
  } else {
    return phone.toString().substring(0, 3) + " " + phone.toString().substring(3, 7)
      + " " + phone.toString().substring(7, phone.length)
  }
}

/**
 * 隐藏电话号码中间4位
 *
 * @param phone
 * @returns {188****8888}
 */
export function hidePhoneNumberDetail(phone) {
  if (!phone) {
    return;
  }

  phone = removeSpace(phone)

  if (phone.length <= 7) {
    return phone
  }
  else {
    return phone.toString().substring(0, 3) + "****" + phone.toString().substring(7)
  }
}

export function formatNum(num) {
  let formatedNum = num
  if(num > 10000) {
    num = Number(num / 10000).toFixed(0)
    formatedNum = num + 'w+'
  }
  return formatedNum
}
