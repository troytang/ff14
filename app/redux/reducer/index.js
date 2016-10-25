/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import { combineReducers } from 'redux';
import configReducer from './config.js';
import name2KeysReducer from './name-key.js';

export default combineReducers({
    config: configReducer,
    name2Keys: name2KeysReducer
});