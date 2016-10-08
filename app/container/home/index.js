/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';
import Header from '../common/F8Header.js';
import KindScreen from '../material/kind.js';
import InstanceScreen from '../dungeons/instance.js';

const EMPTY_CELL_HEIGHT = Dimensions.get('window').height > 600 ? 200 : 150;
const LIST_VIEW_ITEM = (Dimensions.get('window').width - 20) / 3;
const TEXT_HEIGHT = 20;

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([{ name: '道具', key: 'item', icon: require('../common/img/ic_launcher.png') }
                , { name: '副本掉落', key: 'dungeons', icon: require('../common/img/ic_launcher.png') }])
        };
    }

    render() {
        var leftItem = this.props.leftItem;
        if (!leftItem && Platform.OS === 'android') {
            leftItem = {
                title: 'FF14',
                icon: require('./img/hamburger.png')
            };
        }

        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='FINAL FANTASY XIV'
                    leftItem={leftItem}
                    rightItem={this.props.rightItem}
                    background={require('./img/schedule-background.png') }>
                    {this.renderHeaderTitle() }
                </Header>
                <ListView
                    enableEmptySections={true}
                    renderRow={this.renderRow.bind(this) }
                    dataSource={this.state.dataSource}
                    contentContainerStyle={styles.list} />
            </View>
        )
    }

    renderRow(rowData) {
        return (
            <TouchableOpacity style={styles.item} onPress={() => {
                this.onRowClicked(rowData);
            } }>
                <View style={{ width: LIST_VIEW_ITEM, height: LIST_VIEW_ITEM }}>
                    <Image style={{ width: LIST_VIEW_ITEM, height: LIST_VIEW_ITEM }} source={rowData.icon}>
                    </Image>
                </View>
                <Text style={styles.name}>
                    {rowData.name}
                </Text>
            </TouchableOpacity>
        );
    }

    renderHeaderTitle() {
        if (Platform.OS === 'android') {
            return null;
        }
        var transform;
        if (!this.props.parallaxContent) {
            var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
            transform = {
                opacity: this.state.anim.interpolate({
                    inputRange: [distance - 20, distance],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                })
            };
        }
        return (
            <Animated.Text style={[styles.headerTitle, transform]}>
                {this.props.title}
            </Animated.Text>
        );
    }

    onRowClicked(rowData) {
        switch (rowData.key) {
            case 'item':
                this.gotoKindScreen(rowData);
                break;
            case 'dungeons':
                this.gotoDungeonsScreen(rowData);
                break;
            default:
                break;
        }
    }

    gotoKindScreen(rowData) {
        this.props.navigator.push({
            name: 'kindScreen',
            component: KindScreen,
            params: {
                name: rowData.name,
            }
        });
    }

    gotoDungeonsScreen(rowData) {
        this.props.navigator.push({
            name: 'instanceScreen',
            component: InstanceScreen,
            params: {
                name: rowData.name,
            }
        });
    }

    switchDay(page) {
        this.props.switchDay(1);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        width: LIST_VIEW_ITEM,
        height: LIST_VIEW_ITEM + TEXT_HEIGHT,
        marginTop: 5,
        marginLeft: 5
    },
    name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
});