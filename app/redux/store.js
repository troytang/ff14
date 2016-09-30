/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import { createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import reducers from './reducer/index.js';
import { AsyncStorage } from 'react-native';

//const logger = store => next => action => {
//    if (typeof action === 'function') console.log('dispatching a function');
//    else console.log('dispatching', action);
//    let result = next(action);
//    console.log('next state', store.getState());
//    return result;
//};


function logger(store) {
    return (next) =>
        (action) => {
            if (typeof action === 'function') console.log('dispatching a function');
            else console.log('dispatching', action);
            let result = next(action);
            console.log('next state', store.getState());
            return result;
        };
}

let middlewares = [
    logger,
    thunk
];

let createAppStore = applyMiddleware(...middlewares)(createStore);

export default function setupStore(onComplete = ()=> {}) {
    const store = autoRehydrate()(createAppStore)(reducers);
    let opt = {
        storage: AsyncStorage,
        transform: []
    };
    persistStore(store, opt, onComplete);
    return store;
}
