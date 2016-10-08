'use strict'

import React, { Component } from 'react';
import ReactNative, {
    View,
    NativeModules,
    requireNativeComponent
} from 'react-native';

const REF = 'lineChart';

class LineChart extends Component {

    render() {
        return (
            <NativeLineChart
                ref={REF}
                style={{ height: 250 }} />
        );
    }

    sendAverage(tradeDates, averages, peaks, bottoms) {
        NativeModules.UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            NativeModules.UIManager.LineChart.Commands.renderAverage, 
            [tradeDates, averages, peaks, bottoms]
        );
    }

    sendCount(tradeDates, counts) {
        NativeModules.UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            NativeModules.UIManager.LineChart.Commands.renderCount, 
            [tradeDates, counts]
        );
    }

    sendTotal(tradeDates, totals) {
        NativeModules.UIManager.dispatchViewManagerCommand(
            this.getHandle(),
            NativeModules.UIManager.LineChart.Commands.renderTotal, 
            [tradeDates, totals]
        );
    }

    getHandle() {
        return ReactNative.findNodeHandle(this.refs[REF]);
    }
};

LineChart.propTypes = {
    ...View.propTypes
}

var NativeLineChart = requireNativeComponent('LineChart', LineChart);

module.exports = LineChart;
