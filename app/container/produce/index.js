/**
 * 生产路由页
 * 
 * Created by Troy on 2016年10月25日17:36:30
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
import CategoryScreen from './category.js';
import CateCollectScreen from './cate-collect.js';

export default class ProduceScreen extends Component {

    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: true,
            dataSource: ds.cloneWithRows([
                { name: '刻木匠', kind: 0, type: 0, icon: require('./img/icon-kemu.jpg') },
                { name: '锻铁匠', kind: 0, type: 1, icon: require('./img/icon-tiejian.jpg') },
                { name: '铸甲匠', kind: 0, type: 2, icon: require('./img/icon-zhujia.jpg') },
                { name: '雕金匠', kind: 0, type: 3, icon: require('./img/icon-diaojin.jpg') },
                { name: '制革匠', kind: 0, type: 4, icon: require('./img/icon-zhige.jpg') },
                { name: '裁衣匠', kind: 0, type: 5, icon: require('./img/icon-caiyi.jpg') },
                { name: '炼金术士', kind: 0, type: 6, icon: require('./img/icon-lianjin.jpg') },
                { name: '烹调师', kind: 0, type: 7, icon: require('./img/icon-pengren.jpg') },
                { name: '采矿工', kind: 1, type: '0,1', icon: require('./img/icon-caikuang.jpg') },
                { name: '园艺工', kind: 1, type: '2,3', icon: require('./img/icon-yuanyi.jpg') },
                { name: '捕鱼人', kind: 1, type: '4', icon: require('./img/icon-buyu.jpg') },
            ])
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
        // InteractionManager.runAfterInteractions(() => {
        //     this.getItemList();
        // });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    title={this.props.name}
                    leftItem={this.leftItem}
                    rightItem={this.props.rightItem}
                    background={require('../home/img/schedule-background.png')}>
                </Header>
                <ListView
                    enableEmptySection={true}
                    renderRow={this.renderRow.bind(this)}
                    dataSource={this.state.dataSource} />
            </View>
        );
    }

    renderRow(rowData) {
        return (
            <ItemCell
                icon={rowData.icon}
                name={rowData.name}
                desc={rowData.kind === 0 ? '制造' : '采集'}
                iconRadius={3}
                onPress={() => {
                    if (rowData.kind === 1) {
                        this.props.navigator.push({
                            name: 'cateCollectScreen',
                            component: CateCollectScreen,
                            params: {
                                name: rowData.name,
                                kind: rowData.kind,
                                type: rowData.type,
                                icon: rowData.icon
                            }
                        });
                    } else {
                        this.props.navigator.push({
                            name: 'categoryScreen',
                            component: CategoryScreen,
                            params: {
                                name: rowData.name,
                                kind: rowData.kind,
                                type: rowData.type,
                                icon: rowData.icon
                            }
                        });
                    }
                } } />
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});