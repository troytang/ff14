/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import { combineReducers } from 'redux';
import configReducer from './config.js';

export default combineReducers({
    config: configReducer
});

function config(state, action) {

}