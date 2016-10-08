/**
 * 股市页面
 * 
 * Created by Troy on 2016-10-3 10:49:15
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    InteractionManager
} from 'react-native';
import Header from '../common/F8Header.js';
import IdentityCell from '../common/IdentityCell.js';
import LineChart from '../common/LineChart.js';

const LINE_CHART_REF = 'lineChart';
const COUNT_CHART_REF = 'countChart';
const TOTAL_CHART_REF = 'totalChart';

export default class StockScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            average: '?',
            peak: '?',
            bottom: '?',
            count: 0
        }

        this.leftItem = {
            title: 'FF14',
            icon: require('../common/img/back_white.png'),
            onPress: () => {
                this.props.navigator.pop();
            }
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getItemTradeDataOfTheLatestHalfAmonth();
        });
    }

    render() {
        return (
            <View style={styles.container} >
                <Header
                    title={this.props.name}
                    leftItem={this.leftItem}
                    rightItem={this.props.rightItem}
                    background={require('../home/img/schedule-background.png') }>
                </Header>
                <IdentityCell
                    icon={this.props.icon}
                    name={this.props.itemName}
                    type={this.props.categoryName}
                    first={'平均价格：' + this.state.average}
                    second={'最高价格：' + this.state.peak}
                    third={'最低价格：' + this.state.bottom} />
                <View style={{ flexDirection: 'row', padding: 8 }}>
                    <Text style={{ textAlignVertical: 'center', fontSize: 15, fontWeight: 'bold' }}>
                        15 日内交易数量：
                    </Text>
                    <Text style={{ textAlignVertical: 'center', fontSize: 20, fontWeight: 'bold', color: 'red' }}>
                        {this.state.count}
                    </Text>
                </View>
                <ScrollView style={{ flex: 1 , marginBottom: 8}}>
                    <Text style={{ textAlignVertical: 'center', fontSize: 15, fontWeight: 'bold', paddingLeft: 8, paddingBottom: 8, paddingRight: 8 }}>
                        15 日内道具交易价格走势图
                    </Text>
                    <LineChart
                        ref={LINE_CHART_REF} >
                    </LineChart>
                    <Text style={{ textAlignVertical: 'center', fontSize: 15, fontWeight: 'bold', padding: 8 }}>
                        15 日内道具交易数量走势图
                    </Text>
                    <LineChart
                        ref={COUNT_CHART_REF} >
                    </LineChart>
                    <Text style={{ textAlignVertical: 'center', fontSize: 15, fontWeight: 'bold', padding: 8, marginTop: 12 }}>
                        15 日内道具交易总额走势图
                    </Text>
                    <LineChart
                        ref={TOTAL_CHART_REF} >
                    </LineChart>
                </ScrollView>
            </View>
        );
    }

    getItemTradeDataOfTheLatestHalfAmonth() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemTradeDataOfTheLatestHalfAmonthByAreaIdAndGroupId.html?itemKey=' + this.props.itemKey
            + '&areaId=' + this.props.areaId
            + '&groupId=' + this.props.groupId;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((data) => {
                this.calculateTradeData(data);
            });
    }

    calculateTradeData(data) {
        if (data && data.length > 0) {
            let average = 0;
            let peak = 0;
            let bottom = 0;
            let count = 0;
            let total = 0;
            let averages = [];
            let peaks = [];
            let bottoms = [];
            let tradeDates = [];
            let counts = [];
            let totals = [];
            for (var index = 0; index < data.length; index++) {
                var element = data[index];
                console.log(element);
                averages[index] = element.itemAveragePrize;
                peaks[index] = element.itemPeakPrice;
                bottoms[index] = element.itemBottomPrice;
                tradeDates[index] = element.itemTradeDate;
                counts[index] = element.itemTradeAmount;
                totals[index] = element.itemAveragePrize * element.itemTradeAmount;

                count += element.itemTradeAmount;
                total += element.itemAveragePrize * element.itemTradeAmount;
                peak = Math.max(peak, element.itemPeakPrice);
                if (index === 0) {
                    bottom = element.itemBottomPrice;
                } else {
                    bottom = Math.min(bottom, element.itemBottomPrice);
                }
            }
            average = Math.floor(total / count);

            this.setState({
                average: average,
                peak: peak,
                bottom: bottom,
                count: count
            })
            this.refs[LINE_CHART_REF].sendAverage(tradeDates, averages, peaks, bottoms);
            this.refs[COUNT_CHART_REF].sendCount(tradeDates, counts);
            this.refs[TOTAL_CHART_REF].sendTotal(tradeDates, totals);
        } else {
            console.log('----------------------');
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
