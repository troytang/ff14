/**
 * 保存name-key对
 * 
 * Created by Troy on 2016年10月25日16:59:50
 */
'use strict'

function name2Keys(params) {
    return {
        type: 'keys',
        name2Keys: params
    };
}

module.exports = { name2Keys }