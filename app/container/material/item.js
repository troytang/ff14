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
import DetailScreen from './detail.js';

export default class CategoryScreen extends Component {

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
        let iconUrl = 'http://gxh.dw.sdo.com:3344/ff14/item_icon/' + rowData.itemIcon;
        let desc = '需求等级：' + rowData.itemLevelRequired + '    道具等级：' + rowData.itemLevelEquipment
        return (
            <ItemCell
                icon={{uri: iconUrl}}
                name={rowData.itemUINameCn === '' ? rowData.itemUINameEn : rowData.itemUINameCn}
                desc={desc}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'detailScreen',
                        component: DetailScreen,
                        params: {
                            itemKey: rowData.itemKey,
                            name: rowData.itemUINameCn === '' ? rowData.itemUINameEn : rowData.itemUINameCn,
                            icon: {uri: iconUrl},
                            categoryName: this.props.categoryName,
                            levelRequired: rowData.itemLevelRequired,
                            levelEquipment: rowData.itemLevelEquipment
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
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemOverViewList.html?keyword=&itemUICategoryKey='
            + this.props.categoryKey + '&itemLevelIntervalKey=' + this.props.levelIntervalKey;
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