/**
 * 生产成本页面
 * 
 * Created by Troy on 2016年10月26日15:32:57
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    InteractionManager
} from 'react-native';
import Header from '../common/F8Header.js';
import RecipeView from '../common/RecipeView.js';
import ItemCell from '../common/ItemCell.js';
import StockScreen from '../material/stock.js';

export default class CostScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipes: [],
            totalCost: 0,
            prize: 0
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
            this.getLastAveragePrize();
            this.calculate();
        });
    }

    render() {
        return (
            <View style={styles.container} >
                <Header
                    title={this.props.name}
                    leftItem={this.leftItem}
                    rightItem={this.props.rightItem}
                    background={require('../home/img/schedule-background.png')}>
                </Header>
                <ScrollView>
                    <RecipeView
                        ins={this.props.ins}
                        onPress={this.gotoStockScreen.bind(this)} />
                    <Text style={{padding: 8, fontWeight: 'bold', fontSize: 16}} >最近市场平均价格：{this.state.prize}</Text>
                    <Text style={{padding: 8, fontWeight: 'bold', fontSize: 16}} >最近平均生产成本：{this.state.totalCost}</Text>
                    {
                        this.state.recipes.map((recipe) => {
                            return this.renderRecipePrizeLine(recipe);
                        })
                    }
                </ScrollView>
            </View>
        );
    }

    gotoStockScreen() {
        this.props.navigator.push({
            name: 'stockScreen',
            component: StockScreen,
            type: 'Bottom',
            params: {
                icon: { uri: this.props.ins.icon },
                itemKey: this.getItemKeyFromStore(this.props.name),
                name: '交易情况',
                itemName: this.props.name,
                categoryName: this.props.ins.type,
                areaId: 1,
                groupId: 6,
            }
        });
    }

    renderRecipePrizeLine(recipe) {
        return (
            <ItemCell
                icon={{ uri: recipe.url }}
                name={recipe.name}
                desc={'总花费：' + recipe.prize * recipe.count}
                onPress={() => {}} />
        );
    }

    calculate() {
        if (this.props.ins.recis) {
            for (var i = 0; i < this.props.ins.recis.length; i++) {
                let element = this.props.ins.recis[i];
                let itemKey = this.getItemKeyFromStore(element.reciName);
                if (itemKey) {
                    this.getPrizeForAH(itemKey, element.reciName, element.reciIconUrl, element.reciCount);
                }
            }
        }
        if (this.props.ins.comsumptions) {
            for (var j = 0; j < this.props.ins.comsumptions.length; j++) {
                let element = this.props.ins.comsumptions[j];
                let itemKey = this.getItemKeyFromStore(element.comspName);
                if (itemKey) {
                    this.getPrizeForAH(itemKey, element.comspName, element.comspUrl, element.comspCount);
                }
            }
        }
    }

    getItemKeyFromStore(name) {
        return store.getState().name2Keys[name]
    }

    getPrizeForAH(itemKey, name, url, count) {
        fetch('http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemTradeDataOfTheLatestHalfAmonthByAreaIdAndGroupId.html?areaId=1&groupId=6&itemKey=' + itemKey)
            .then((response) => {
                return JSON.parse(response._bodyText);
            }).then((json) => {
                if (json.data && json.data.length > 0) {
                    let lastAveragePrize = json.data[json.data.length - 1].itemAveragePrize;
                    let newRecipes = this.state.recipes.concat({
                        name: name,
                        itemKey: itemKey,
                        url: url,
                        count: count.replace(/[^0-9]/g, ''),
                        prize: Math.floor(lastAveragePrize)
                    });
                    this.setState({
                        recipes: newRecipes,
                        totalCost: this.state.totalCost + count.replace(/[^0-9]/g, '') * Math.floor(lastAveragePrize)
                    });
                }
            });
    }

    getLastAveragePrize() {
        let itemKey = this.getItemKeyFromStore(this.props.name);
        if (!itemKey) {
            return;
        }
        fetch('http://gxh.dw.sdo.com:8080/ff14.portal/business/item/getItemTradeDataOfTheLatestHalfAmonthByAreaIdAndGroupId.html?areaId=1&groupId=6&itemKey=' + itemKey)
            .then((response) => {
                return JSON.parse(response._bodyText);
            }).then((json) => {
                if (json.data && json.data.length > 0) {
                    let lastAveragePrize = json.data[json.data.length - 1].itemAveragePrize;
                    this.setState({
                        prize: Math.floor(lastAveragePrize)
                    });
                }
            })
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});