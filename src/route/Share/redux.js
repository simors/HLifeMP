/**
 * Created by yangyang on 2017/9/27.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

/****  Model  ****/

const ShareRecord = Record({

}, 'ShareRecord')

/**** Constant ****/

/**** Action ****/

/**** Saga ****/

/**** Reducer ****/

/**** Selector ****/