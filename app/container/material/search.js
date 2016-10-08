/**
 * 搜索页面
 * 
 * Created by Troy on 2016-10-4 13:25:52
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
import DetailScreen from './detail.js';
import SearchView from '../common/SearchView.js';

const LIST_VIEW_REF = 'listView';

export default class CategoryScreen extends Component {

    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: false,
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

        this.isSearching = false;
        this.startIndex = 0;
        this.searchKey = undefined;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    title={this.props.name}
                    leftItem={this.leftItem}
                    rightItem={this.props.rightItem}
                    background={require('../home/img/schedule-background.png') }
                    childrenHeight={DEFAULT_SEARCH_VIEW_HEIGHT}>
                </Header>
                <SearchView
                    style={{
                        position: 'absolute',
                        top: HEADER_HEIGHT,
                        left: 0,
                        right: 0,
                    }}
                    onSearch={this.onSearch.bind(this) } />
                <ListView
                    ref={LIST_VIEW_REF}
                    enableEmptySection={true}
                    renderRow={this.renderRow.bind(this) }
                    dataSource={this.state.dataSource}
                    renderFooter={this.renderFooter.bind(this) }
                    onEndReached={this.onLoadMore.bind(this) }
                    onEndReachedThreshold={20} />
            </View>
        );
    }

    renderRow(rowData) {
        let iconUrl = 'http://gxh.dw.sdo.com:3344/ff14/item_icon/' + rowData.itemIcon;
        let desc = '需求等级：' + rowData.itemLevelRequired + '    道具等级：' + rowData.itemLevelEquipment
        return (
            <ItemCell
                icon={{ uri: iconUrl }}
                name={rowData.itemUINameCn === '' ? rowData.itemUINameEn : rowData.itemUINameCn}
                desc={desc}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'detailScreen',
                        component: DetailScreen,
                        params: {
                            itemKey: rowData.itemKey,
                            name: rowData.itemUINameCn === '' ? rowData.itemUINameEn : rowData.itemUINameCn,
                            icon: { uri: iconUrl },
                            categoryName: this.props.categoryName,
                            levelRequired: rowData.itemLevelRequired,
                            levelEquipment: rowData.itemLevelEquipment,
                            categoryKey: rowData.itemUICategoryKey
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

    onSearch(searchKey) {
        if (searchKey === undefined || searchKey === '') {
            ToastAndroid.show('请输入搜索名称', ToastAndroid.SHORT);
            return;
        }
        if (this.isSearching === true) {
            return;
        } else {
            this.isSearching = true;
            this.setState({
                isLoading: true,
                isLoadAll: false
            });
        }
        this.startIndex = 0;
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemDataList.html?keyword=' + decodeURIComponent(searchKey)
            + '&itemUIKindKey=0'
            + '&itemUICategory=0'
            + '&itemRarity=0'
            + '&classJobKey=0'
            + '&maxItemLevel=1000'
            + '&minItemLevel=0'
            + '&basicParamKey='
            + '&basicParamValue=0'
            + '&startIndex=' + this.startIndex;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                // 新搜索
                this.startIndex = JSON.parse(json).data.length;
                this.setState({
                    isLoading: false,
                    dataSource: this.state.dataSource.cloneWithRows(JSON.parse(json).data)
                });
                this.refs[LIST_VIEW_REF].scrollTo({y: 0, animated: false});
                this.searchKey = searchKey;
                console.log('---------------------------', this.startIndex);
                this.isSearching = false;
            });
    }

    onLoadMore() {
        if (this.searchKey === undefined || this.state.isLoadAll === true) {
            return;
        }
        this.setState({
            isLoading: true
        });
        console.log('onLoadMore', this.searchKey);
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemDataList.html?keyword=' + decodeURIComponent(this.searchKey)
            + '&itemUIKindKey=0'
            + '&itemUICategory=0'
            + '&itemRarity=0'
            + '&classJobKey=0'
            + '&maxItemLevel=1000'
            + '&minItemLevel=0'
            + '&basicParamKey='
            + '&basicParamValue=0'
            + '&startIndex=' + this.startIndex;
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

                this.isSearching = false;
            });
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});