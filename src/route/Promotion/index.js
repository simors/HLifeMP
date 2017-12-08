/**
 * Created by wanpeng on 2017/12/2.
 */
import * as promotionRedux from './redux'
import NearbyPromotion from './NearbyPromotion'
import PromotionDetail from './PromotionDetail'

/* export saga */
export const promotionSaga = promotionRedux.saga

/* export reducer */
export const promotionReducer = promotionRedux.reducer

/* export action */
export const promotionAction = promotionRedux.actions

/* export selector */
export const promotionSelector = promotionRedux.selector

export default NearbyPromotion
export {PromotionDetail}