/**
 * 道具详情页
 * 
 * Created by Troy on 2016-10-2 12:57:13
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    ToastAndroid,
    ToolbarAndroid,
    Platform,
    TouchableNativeFeedback
} from 'react-native';
import Header from '../common/F8Header.js';
import IdentityCell from '../common/IdentityCell.js';
import StockScreen from './stock.js';

const CLASS_JOB = ['0', '剑术师', '格斗师', '斧术师', '枪术师', '弓箭手', '幻术师', '咒术士', '刻木匠', '锻铁匠',
    '铸甲匠', '雕金师', '制革匠', '裁衣匠', '炼金术士', '烹调师', '采矿工', '园艺工', '捕鱼人', '骑士', '武僧',
    '战士', '龙骑士', '吟游诗人', '白魔法师', '黑魔法师', '秘术师', '召唤师', '学者', '双剑师',
    '忍者', '机工师', '暗黑骑士', '占星术士'];
const REPAIR_MATERIAL = [5594, 5595, 5596, 5597, 5598, 10386];

export default class DetailScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            icon: this.props.icon || require('../common/img/ic_launcher.png'),
            categoryName: this.props.categoryName,
            levelRequired: this.props.levelRequired || '?',
            levelEquipment: this.props.levelEquipment || '?',
            classJob: [],
            baseParams: [],
            bonusParams: [],
            hqBaseParams: [],
            hqBonusParams: [],
            repairMaterial: undefined
        }

        this.leftItem = {
            title: 'FF14',
            icon: require('../common/img/back_white.png'),
            onPress: () => {
                this.props.navigator.pop();
            }
        };

        this.rightItem = {
            title: '股市',
            icon: require('./img/hamburger.png'),
            onPress: () => {
                this.props.navigator.push({
                    name: 'stockScreen',
                    component: StockScreen,
                    type: 'Bottom',
                    params: {
                        icon: this.state.icon,
                        itemKey: this.props.itemKey,
                        name: '交易情况',
                        itemName: this.props.name,
                        categoryName: this.state.categoryName,
                        areaId: 1,
                        groupId: 6,
                    }
                });
            }
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getItemDataByKey();
            this.getBasicParamsByItemKey();
            this.getBonusParamsByItemKey();
            this.getHqBasicParamsByItemKey();
            this.getHqBonusParamsByItemKey();
            if (!this.props.categoryName && this.props.categoryKey) {
                this.getItemUICategoryByKey(this.props.categoryKey);
            }
        });
    }

    render() {
        console.log(this.props.icon);
        return (
            <View style={styles.container} >
                <Header
                    title={this.props.name}
                    leftItem={this.leftItem}
                    rightItem={this.rightItem}
                    background={require('../home/img/schedule-background.png') }>
                </Header>
                <IdentityCell
                    icon={this.state.icon}
                    name={this.state.categoryName}
                    first={'需要等级：' + this.state.levelRequired}
                    second={'物品等级：' + this.state.levelEquipment}
                    classJob={this.state.classJob} />
                <View style={styles.body} >
                    <ScrollView>
                        {
                            this.state.classJob && this.state.classJob.length > 0 &&
                            this.renderClassJob(this.state.classJob)
                        }
                        {
                            this.state.baseParams.length > 0 &&
                            <Text style={{ marginTop: 10, fontSize: 17, fontWeight: 'bold' }}>基本性能</Text>
                        }
                        {
                            this.state.baseParams.map((base) => {
                                return this.renderBaseParam(base);
                            })
                        }
                        {
                            this.state.bonusParams.length > 0 &&
                            <Text style={{ marginTop: 10, fontSize: 17, fontWeight: 'bold' }}>特殊属性</Text>
                        }
                        {
                            this.state.bonusParams.map((bonus) => {
                                return this.renderBonusParam(bonus);
                            })
                        }
                        {
                            this.state.hqBaseParams.length > 0 &&
                            <Text style={{ marginTop: 10, fontSize: 17, fontWeight: 'bold' }}>HQ基本性能</Text>
                        }
                        {
                            this.state.hqBaseParams.map((base) => {
                                return this.renderBaseParam(base);
                            })
                        }
                        {
                            this.state.hqBonusParams.length > 0 &&
                            <Text style={{ marginTop: 10, fontSize: 17, fontWeight: 'bold' }}>HQ特殊属性</Text>
                        }
                        {
                            this.state.hqBonusParams.map((bonus) => {
                                return this.renderBonusParam(bonus);
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }

    renderClassJob(classJob) {
        let job = '';
        for (var index = 0; index < classJob.length; index++) {
            var element = classJob[index];
            job += CLASS_JOB[element];
            if (job === '0') {
                job = '全部';
                break;
            }
            if (index != classJob.length - 1) {
                job += '  ';
            }
        }
        return (
            <View style={{ flexDirection: 'row', marginBottom: 5, marginRight: 12 }} >
                <Text>
                    职业类别：
                </Text>
                <Text style={styles.classJob} >
                    {job}
                </Text>
            </View>
        );
    }

    renderBaseParam(base) {
        return (
            <View style={styles.base} >
                <Text style={styles.baseName} >
                    {base.itemBasicParamNameCn}
                </Text>
                <Text style={styles.baseValue} >
                    {base.itemBasicParamValue}
                </Text>
            </View>
        );
    }

    renderBonusParam(bonus) {
        return (
            <View style={styles.base} >
                <Text style={styles.baseName} >
                    {bonus.itemBonusParamNameCn}
                </Text>
                <Text style={styles.baseValue} >
                    {bonus.itemBonusParamValue}
                </Text>
            </View>
        );
    }

    getItemDataByKey() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemDataByKey.html?itemKey=' + this.props.itemKey;
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((detail) => {
                this.setState({
                    icon: {uri: ('http://gxh.dw.sdo.com:3344/ff14/item_icon/' + detail.itemIcon)},
                    classJob: JSON.parse(detail.itemData).classJob,
                    levelEquipment: detail.itemLevelEquipment,
                    levelRequired: detail.itemLevelRequired
                });
                if (!this.props.categoryKey) {
                    this.getItemUICategoryByKey(detail.itemUICategoryKey);
                }
            });
    }

    getItemUICategoryByKey(key) {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemUICategoryByKey.html?itemUICategoryKey=' + key;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((category) => {
                this.setState({
                    categoryName: category.itemUICategoryNameCn
                });
            });
    }

    getItemDataByKeyForRepair() {
        let itemKey = this.props.levelRequired % 10 === 0 ? this.props.levelRequired / 10 : this.props.levelRequired / 10 + 1;
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemDataByKey.html?itemKey=' + itemKey;
        console.log(itemKey);
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(JSON.parse(json).data.itemData).classjob;
            })
            .then((classJob) => {
                this.setState({
                    classJob: classJob
                });
            });
    }

    getBasicParamsByItemKey() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getBasicParamsByItemKey.html?itemKey=' + this.props.itemKey;
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((data) => {
                this.setState({
                    baseParams: data
                });
            });
    }

    getBonusParamsByItemKey() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getBonusParamsByItemKey.html?itemKey=' + this.props.itemKey;
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((data) => {
                this.setState({
                    bonusParams: data
                });
            });
    }

    getHqBasicParamsByItemKey() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getHqBasicParamsByItemKey.html?itemKey=' + this.props.itemKey;
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((data) => {
                this.setState({
                    hqBaseParams: data
                });
            });
    }

    getHqBonusParamsByItemKey() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getHqBonusParamsByItemKey.html?itemKey=' + this.props.itemKey;
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((data) => {
                this.setState({
                    hqBonusParams: data
                });
            });
    }

    getClassJobsByItemKey() {
        let url = 'http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getClassJobsByItemKey.html?itemKey=' + this.props.itemKey;
        fetch(url)
            .then((response) => {
                return response._bodyText;
            })
            .then((json) => {
                return JSON.parse(json).data;
            })
            .then((data) => {
                // this.setState({
                    
                // });
            });
    }
};

var STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 25;
var HEADER_HEIGHT = Platform.OS === 'ios' ? 44 + STATUS_BAR_HEIGHT : 56 + STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    body: {
        flex: 1,
        paddingTop: 12,
        paddingLeft: 12,
        paddingBottom: 12
    },
    classJob: {
        flex: 1,
        fontWeight: 'bold'
    },
    base: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    baseName: {
        fontSize: 15
    },
    baseValue: {
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 12,
    },
    stock: {
        position: 'absolute',
        top: STATUS_BAR_HEIGHT,
        right: 0,
        padding: 16
    },
    stockIcon: {
        height: HEADER_HEIGHT - STATUS_BAR_HEIGHT - 32,
        width: HEADER_HEIGHT - STATUS_BAR_HEIGHT - 32
    }
});