/**
 * Created by wanpeng on 2017/12/2.
 */
import * as promotionRedux from './redux'
import NearbyPromotion from './NearbyPromotion'
import PromotionDetail from './PromotionDetail'
import BuyGoods from './BuyGoods'
import SelectAddress from './SelectAddress'
import SubmitOrder from './SubmitOrder'

/* export saga */
export const promotionSaga = promotionRedux.saga

/* export reducer */
export const promotionReducer = promotionRedux.reducer

/* export action */
export const promotionAction = promotionRedux.actions

/* export selector */
export const promotionSelector = promotionRedux.selector

export default NearbyPromotion
export {PromotionDetail, BuyGoods, SelectAddress, SubmitOrder}