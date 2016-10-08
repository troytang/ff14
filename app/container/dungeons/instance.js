/**
 * 副本列表页面
 * 
 * Created by Troy on 2016-10-8 20:30:20
 */
'use strict'

import React, { Component } from 'react';
import {
    View,
    ListView,
    StyleSheet,
    ActivityIndicator,
    InteractionManager,
    ToastAndroid
} from 'react-native';
import Header from '../common/F8Header.js';
import ItemCell from '../common/ItemCell.js';
import EquipmentScreen from './equipment.js';

export default class InstanceScreen extends Component {

    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: true,
            isLoadAll: false,
            dataSource: ds.cloneWithRows([])
        };

        this.leftItem = {
            title: 'FF14',
            icon: require('../common/img/back_white.png'),
            onPress: () => {
                this.props.navigator.pop();
            }
        };

        this.startIndex = 0;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onRefresh();
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
                    renderFooter={this.renderFooter.bind(this) }
                    onEndReached={this.onLoadMore.bind(this) }
                    onEndReachedThreshold={5} />
            </View>
        );
    }

    renderRow(rowData) {
        let desc = '需求等级：' + rowData.raidInstanceLevel + '    副本人数：' + rowData.raidInstanceCapacity
        return (
            <ItemCell
                icon={require('../common/img/ic_launcher.png') }
                name={rowData.raidInstanceName}
                desc={desc}
                onPress={() => {
                    // TODO
                    this.props.navigator.push({
                        name: 'equipmentScreen',
                        component: EquipmentScreen,
                        params: {
                            icon: require('../common/img/ic_launcher.png'),
                            name: rowData.raidInstanceName,
                            raidInstanceCapacity: rowData.raidInstanceCapacity,
                            raidInstanceLevel: rowData.raidInstanceLevel,
                            raidInstanceId: rowData.raidInstanceId
                        }
                    });
                } } />
        );
    }

    renderFooter() {
        if (this.state.isLoading && !this.state.isLoadAll) {
            return (
                <ActivityIndicator
                    animating={true}
                    size="large"
                    />
            );
        } else {
            return (
                <View />
            );
        }
    }

    onRefresh() {
        this.setState({
            isLoading: true,
            isLoadAll: false
        });
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/databank/getAllInstancesByPage.html?startIndex=' + this.startIndex;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                this.startIndex = JSON.parse(json).data.length;
                this.setState({
                    isLoading: false,
                    dataSource: this.state.dataSource.cloneWithRows(JSON.parse(json).data)
                });
                console.log('---------------------------', this.startIndex);
            });
    }

    onLoadMore() {
        if (this.state.isLoadAll === true || this.state.isLoading === true) {
            return;
        }
        this.setState({
            isLoading: true
        });
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/databank/getAllInstancesByPage.html?startIndex=' + this.startIndex;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                // 加载更多
                if (JSON.parse(json).data.length === 0) {
                    this.setState({
                        isLoadAll: true,
                        isLoading: false
                    });
                    ToastAndroid.show('没有更多了', ToastAndroid.SHORT);
                    return;
                } else {
                    this.startIndex = this.state.dataSource._dataBlob.s1.length + JSON.parse(json).data.length;
                    let newList = this.state.dataSource._dataBlob.s1.concat(JSON.parse(json).data);
                    this.setState({
                        isLoading: false,
                        dataSource: this.state.dataSource.cloneWithRows(newList)
                    });
                    console.log('---------------------------', this.startIndex);
                }
            });
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});