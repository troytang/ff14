/**
 * 初始化 App 的配置
 * 这里先通过请求把物品的 name-key 记下来
 * 
 * Created by Troy on 16/9/30.
 */
'use strict'

const initialState = {
    hasInit: false,
    startIndex: 0
}

function config(state = initialState, action) {
    switch (action.type) {
        case 'set':
            return Object.assign({}, state, action.config);
        case 'clear':
            return Object.assign({}, state, {});
        case 'loading':
            return Object.assign({}, state, action.startIndex);
        default:
            return state;
    }
}

export default config;