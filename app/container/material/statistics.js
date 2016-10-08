/**
 * 列表页面
 * 
 * Created by Troy on 2016-10-1 17:02:59
 */
'use strict'

import React, { Component } from 'react';
import {
    View,
    ListView,
    StyleSheet,
    ActivityIndicator,
    InteractionManager
} from 'react-native';
import Header from '../common/F8Header.js';
import ItemCell from '../common/ItemCell.js';
import ItemScreen from './item.js';

export default class StatisticsScreen extends Component {

    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: true,
            dataSource: ds.cloneWithRows([])
        };

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
            this.getItemList();
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    title={this.props.name}
                    leftItem={this.leftItem}
                    rightItem={this.props.rightItem}
                    background={require('../home/img/schedule-background.png') }>
                </Header>
                <ListView
                    enableEmptySection={true}
                    renderRow={this.renderRow.bind(this) }
                    dataSource={this.state.dataSource}
                    renderFooter={this.renderFooter.bind(this) } />
            </View>
        );
    }

    renderRow(rowData) {
        return (
            <ItemCell
                icon={require('../common/img/ic_launcher.png')}
                name={rowData.itemLevelIntervalName}
                desc={rowData.itemAmount}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'itemScreen',
                        component: ItemScreen,
                        params: {
                            name: this.props.name + ':' +rowData.itemLevelIntervalName,
                            categoryKey: this.props.categoryKey,
                            categoryName: this.props.categoryName,
                            levelIntervalKey: rowData.itemLevelInervalKey
                        }
                    });
                }} />
        );
    }

    renderFooter() {
        if (this.state.isLoading) {
            return (
                <ActivityIndicator
                    animating={true}
                    size="small"
                    />
            );
        } else {
            return (
                <View />
            );
        }
    }

    getItemList() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemStatisticsByLevel.html?keyword=&itemUICategoryKey=' + this.props.categoryKey;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                this.setState({
                    isLoading: false,
                    dataSource: this.state.dataSource.cloneWithRows(JSON.parse(json).data)
                });
            });
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});