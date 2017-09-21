/**
 * Created by yangyang on 2017/9/13.
 */
import * as authRedux from './redux'

/* export saga */
export const authSaga = authRedux.authSaga
export const authSagaFunc = authRedux.authSagaFunc

/* export reducer */
export const authReducer = authRedux.authReducer

/* export action */
export const authAction = authRedux.authAction

/* export selector */
export const authSelector = authRedux.authSelector

export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}