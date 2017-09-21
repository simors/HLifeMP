/**
 * Created by yangyang on 2017/9/21.
 */
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import {createAction} from 'redux-actions'
import {authSelector, authSagaFunc} from './auth'
import {appStateSagaFunc} from './appstate'

/**** Constant ****/

const REHYDRATE_DONE = 'REHYDRATE_DONE'

/**** Action ****/

export const rehydrateDone = createAction(REHYDRATE_DONE)

/**** Saga ****/

function* doneRehydrate(action) {
  yield authSagaFunc.autoLogin(action)
  yield appStateSagaFunc.updateAppRehydrate(action)
}

export const rehydrateSaga = [
  takeLatest(REHYDRATE_DONE, doneRehydrate)
]