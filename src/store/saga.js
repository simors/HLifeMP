/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
import {saga as sysUserSaga} from '../route/sysuser/redux'
import {configSaga} from '../util/config'
import {authSaga} from '../util/auth'
import {appStateSaga} from '../util/appstate'

export default function* rootSaga() {
  yield all([
    ...sysUserSaga,
    ...configSaga,
    ...authSaga,
    ...appStateSaga,
  ])
}
