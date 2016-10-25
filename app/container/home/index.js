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
import { connect } from 'react-redux';
import { config, loading } from '../../redux/action/config.js';
import { name2Keys } from '../../redux/action/name-key.js';
import Header from '../common/F8Header.js';
import LoadingView from '../common/LoadingView.js';
import KindScreen from '../material/kind.js';
import InstanceScreen from '../dungeons/instance.js';
import PetScreen from '../collection/pet.js';
import MountScreen from '../collection/mount.js';
import ProduceScreen from '../produce/index.js';

const EMPTY_CELL_HEIGHT = Dimensions.get('window').height > 600 ? 200 : 150;
const LIST_VIEW_ITEM = (Dimensions.get('window').width - 20) / 3;
const TEXT_HEIGHT = 20;

class HomeScreen extends Component {

    constructor(props) {
        super(props);

        this.startIndex = 0;
        this.name2Keys = {};
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([{ name: '道具', key: 'item', icon: require('../common/img/ic_launcher.png') }
                , { name: '副本掉落', key: 'dungeons', icon: require('../common/img/ic_launcher.png') }
                , { name: '坐骑', key: 'mount', icon: require('../common/img/ic_launcher.png') }
                , { name: '宠物', key: 'pet', icon: require('../common/img/ic_launcher.png') }
                , { name: '生产', key: 'produce', icon: require('../common/img/ic_launcher.png')}])
        };
    }

    componentDidMount() {
        if (!this.props.hasInit) {
            // 获取 name-key 对
            this.getAllItemForName2Key();
        }
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
                    background={require('./img/schedule-background.png')}>
                    {this.renderHeaderTitle()}
                </Header>
                <ListView
                    enableEmptySections={true}
                    renderRow={this.renderRow.bind(this)}
                    dataSource={this.state.dataSource}
                    contentContainerStyle={styles.list} />
                <LoadingView
                    visible={!this.props.hasInit}
                    // visible={false}
                    text={' 初始化:' + this.props.startIndex} />
            </View>
        )
    }

    renderRow(rowData) {
        return (
            <TouchableOpacity style={styles.item} onPress={() => {
                this.onRowClicked(rowData);
            } }>
                <View style={{ width: LIST_VIEW_ITEM, height: LIST_VIEW_ITEM }}>
                    <Image style={{ width: LIST_VIEW_ITEM, height: LIST_VIEW_ITEM, borderRadius: 5 }} source={rowData.icon}>
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
            case 'pet':
                this.gotoPetScreen(rowData);
                break;
            case 'mount':
                this.gotoMountScreen(rowData);
                break;
            case 'produce':
                this.gotoProduceScreen(rowData);
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

    gotoPetScreen(rowData) {
        this.props.navigator.push({
            name: 'petScreen',
            component: PetScreen,
            type: 'Bottom',
            params: {
                name: rowData.name,
            }
        });
    }

    gotoMountScreen(rowData) {
        this.props.navigator.push({
            name: 'mountScreen',
            component: MountScreen,
            type: 'Bottom',
            params: {
                name: rowData.name,
            }
        });
    }

    gotoProduceScreen(rowData) {
        this.props.navigator.push({
            name: 'produceScreen',
            component: ProduceScreen,
            params: {
                name: rowData.name
            }
        });
    }

    switchDay(page) {
        this.props.switchDay(1);
    }

    getAllItemForName2Key() {
        fetch('http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemDataList.html?keyword=&itemUIKindKey=0&itemUICategory=0&itemRarity=0&classJobKey=0&maxItemLevel=1000&minItemLevel=0&basicParamKey=&basicParamValue=0&startIndex=' + this.startIndex)
            .then((response) => {
                return JSON.parse(response._bodyText);
            }).then((json) => {
                if (json.data.length > 0) {
                    this.startIndex += json.data.length;
                    this.props.dispatch(loading({
                        startIndex: this.startIndex
                    }));
                    for (var index = 0; index < json.data.length; index++) {
                        var element = json.data[index];
                        let itemName = element.itemUINameCn;
                        if (itemName !== '') {
                            this.name2Keys[itemName] = element.itemKey;
                            console.log('-----------', itemName + '  ' + element.itemKey);
                        } else {
                            fetch('http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemTradeDataOfTheLatestHalfAmonthByAreaIdAndGroupId.html?areaId=1&groupId=6&itemKey=' + element.itemKey)
                                .then((res) => {
                                    return JSON.parse(res._bodyText);
                                }).then((resJson) => {
                                    if (resJson.data[0]) {
                                        this.name2Keys[resJson.data[0].itemNameCn] = resJson.data[0].itemKey;
                                        console.log('+++++++++', resJson.data[0].itemNameCn + '  ' + resJson.data[0].itemKey);
                                    } else {
                                        // 连拍卖行接口都没有中文名的暂时不管了
                                    }
                                })
                        }
                    }
                    this.getAllItemForName2Key();
                } else {
                    this.props.dispatch(config({
                        hasInit: true
                    }));
                    this.props.dispatch(name2Keys(this.name2Keys));
                }
            });
    }
}

function select(state) {
    return ({
        hasInit: state.config.hasInit,
        startIndex: state.config.startIndex
    });
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

export default connect(select)(HomeScreen);