/**
 * 掉落列表页面
 * 
 * Created by Troy on 2016-10-8 20:53:58
 */
'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    ActivityIndicator,
    InteractionManager,
    TouchableOpacity
} from 'react-native';
import Header from '../common/F8Header.js';
import IdentityCell from '../common/IdentityCell.js';
import DetailScreen from '../material/detail.js';

export default class EquipmentScreen extends Component {

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
                    rightItem={this.rightItem}
                    background={require('../home/img/schedule-background.png') }>
                </Header>
                <IdentityCell
                    icon={this.props.icon}
                    name={this.props.name}
                    first={'需要等级：' + this.props.raidInstanceLevel}
                    second={'副本人数：' + this.props.raidInstanceCapacity}/>
                <View style={styles.line}>
                    <Text style={styles.category}>
                        装备名称
                    </Text>
                    <Text style={styles.category}>
                        装备类型
                    </Text>
                    <Text style={styles.category}>
                        职业
                    </Text>
                </View>
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
            <TouchableOpacity style={{flex: 1}}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'detailScreen',
                        component: DetailScreen,
                        params: {
                            itemKey: rowData.itemKey,
                            name: rowData.equipmentName
                        }
                    });
                } }>
                <View style={styles.line}>
                    <Text style={styles.item}>
                        {rowData.equipmentName}
                    </Text>
                    <Text style={styles.item}>
                        {rowData.equipmentType}
                    </Text>
                    <Text style={styles.item}>
                        {rowData.equipmentCareer}
                    </Text>
                </View>
            </TouchableOpacity>
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
        fetch('http://gxh.dw.sdo.com:8080/ff14.portal/business/databank/getEquipmentsByInstanceId.html?raidInstanceId=' + this.props.raidInstanceId)
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
    line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12
    },
    category: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    item: {
        fontSize: 15,
    },
    classJop: {
        fontWeight: 'bold'
    },
    dropPoint: {
        fontWeight: 'bold'
    }
});