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
import CategoryScreen from './category.js';
import SearchScreen from './search.js';

export default class KindScreen extends Component {

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

        this.rightItem = {
            title: 'FF14',
            icon: require('../common/img/search.png'),
            onPress: () => {
                this.props.navigator.push({
                    name: 'searchScreen',
                    component: SearchScreen,
                    type: 'Bottom',
                    params: {
                        name: '搜索'
                    }
                });
            }
        }
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
                    rightItem={this.rightItem}
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
                icon={require('../common/img/ic_launcher.png') }
                name={rowData.itemUIKindNameCn}
                desc={rowData.itemAmount}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'category',
                        component: CategoryScreen,
                        params: {
                            name: rowData.itemUIKindNameCn,
                            kindKey: rowData.itemUIKindKey
                        }
                    });
                } } />
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
        fetch('http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemStatisticsByKind.html?keyword=')
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