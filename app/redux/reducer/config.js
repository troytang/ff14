/**
 * Created by Troy on 16/9/30.
 */
'use strict'

const initialState = {
    initialized: false
}

function config(state = initialState, action) {
    switch (action.type) {
        case 'set':
            return Object.assign({}, state, action.config);
        case 'clear':
            return Object.assign({}, state, {});
        default:
            return state;
    }
}

export default config;