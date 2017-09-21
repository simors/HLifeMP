/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
import {authSaga} from '../util/auth'
import {appStateSaga} from '../util/appstate'
import {rehydrateSaga} from '../util/rehydrateRedux'

export default function* rootSaga() {
  yield all([
    ...rehydrateSaga,
    ...authSaga,
    ...appStateSaga,
  ])
}
