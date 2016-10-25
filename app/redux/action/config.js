/**
 * 初始化成功
 * 
 * Created by Troy on 2016年10月24日16:06:12
 */

function config(params) {
    return {
        type: 'set',
        config: params,
    };
}

function loading(params) {
    return {
        type: 'loading',
        startIndex: params,
    };
}

module.exports = { config, loading }