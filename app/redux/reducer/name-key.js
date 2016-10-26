/**
 * 初始化 App 的配置
 * 这里先通过请求把物品的 name-key 记下来
 * 
 * Created by Troy on 2016年10月25日16:53:54
 */
'use strict'

const initialState = {
    
}

function name2Keys(state = initialState, action) {
    switch (action.type) {
        case 'keys':
            return Object.assign({}, state, action.name2Keys);
        default:
            return state;
    }
}

export default name2Keys;