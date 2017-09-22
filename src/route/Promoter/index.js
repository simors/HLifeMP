/**
 * Created by yangyang on 2017/9/22.
 */
import PromoterPerformance from './PromoterPerformance'
import * as promoterRedux from './redux'

/* export saga */
export const promoterSaga = promoterRedux.promoterSaga

/* export reducer */
export const promoterReducer = promoterRedux.promoterReducer

/* export action */
export const promoterAction = promoterRedux.promoterAction

/* export selector */
export const promoterSelector = promoterRedux.promoterSelector

export default PromoterPerformance