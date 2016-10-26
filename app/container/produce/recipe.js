/**
 * 配方页面
 * 
 * Created by Troy on 2016年10月25日19:22:39
 */
'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    InteractionManager,
    ActivityIndicator
} from 'react-native';
import Header from '../common/F8Header.js';
import IdentityCell from '../common/IdentityCell.js';
import RecipeView from '../common/RecipeView.js';
import CostScreen from './cost.js';

export default class RecipeScreen extends Component {

    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: true,
            isLoadedAll: false,
            dataSource: ds.cloneWithRows([])
        };

        this.leftItem = {
            title: 'FF14',
            icon: require('../common/img/back_white.png'),
            onPress: () => {
                this.props.navigator.pop();
            }
        };

        this.currPage = 1;
        this.totalCount = undefined;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getHTML();
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
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderFooter={this.renderFooter.bind(this)}
                    onEndReached={this.getHTMLMore.bind(this)}
                    />
            </View>
        );
    }

    renderRow(rowData) {
        return (
            <RecipeView
                ins={rowData}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'costScreen',
                        component: CostScreen,
                        type: 'Bottom',
                        params: {
                            name: rowData.name,
                            ins: rowData
                        }
                    })
                }} />
        );
    }

    renderFooter() {
        if (this.state.isLoading && !this.state.isLoadedAll) {
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

    getHTML() {
        fetch('http://cha.17173.com/ff14/recipe?type=' + this.props.type)
            .then((response) => {
                this.analyizeHTML(response._bodyText);
                this.analyizeTotalCount(response._bodyText);
                this.currPage++;
            })
    }

    getHTMLMore() {
        if (this.state.isLoadedAll || this.state.isLoading) {
            return;
        }
        this.setState({
            isLoading: true
        });
        console.log('+++++++++', this.state.dataSource._dataBlob.s1.length);
        fetch('http://cha.17173.com/ff14/recipe?type=' + this.props.type + '&page=' + this.currPage)
            .then((response) => {
                this.analyizeHTML(response._bodyText);
                this.currPage++;
            })
    }

    analyizeHTML(html) {
        var recipes = [];
        var f = html.match(/<table>[\s\S]*?<\/table>/g);
        if (f) {
            for (var index = 0; index < f.length; index++) {
                var table = f[index];
                var ff = table.match(/<tr[\s\S]*?<\/tr>/g);
                if (ff) {
                    for (var j = 0; j < ff.length; j++) {
                        var tr = ff[j];
                        var fff = tr.match(/<td[\s\S]*?<\/td>/g);
                        if (fff && j !== 0) {
                            let iconUrl = fff[0].match(/(src="http.*?\.png)/g)[0].substring(5);
                            let name = fff[1].match(/(">.*?<\/a>)/g)[0].replace(/(">)?(<\/a>)?/g, '');
                            let classJob = fff[2].replace(/(<td.*?>)?(<\/td>)?/g, '');
                            let level = fff[3].replace(/(<td.*?>)?(<\/td>)?/g, '');
                            let type = fff[4].replace(/(<td.*?>)?(<\/td>)?/g, '');
                            let recis = [];
                            var ffff = fff[5].match(/(<p.*?>).*?(<\/p>)/g);
                            if (ffff) {
                                for (var p = 0; p < ffff.length; p++) {
                                    let reci = ffff[p];
                                    let reciIconUrl = reci.match(/(src="http.*?\.png)/g)[0].substring(5);
                                    let reciName = reci.replace(/(<p>[\s\S]*?\/>)?(<\/a>[\s\S]*?<\/p>)?/g, '');
                                    let reciCount = reci.replace(/(<p>[\s\S]*?<\/a>)?(<\/p>)?/g, '').replace(/(\[.*?\])/g, '');
                                    let reciProduceLevel = reci.replace(/(<p>[\s\S]*?'>)?(<\/span>[\s\S]*?<\/p>)?/g, '');
                                    if (reciProduceLevel.indexOf('<p>') >= 0) {
                                        reciProduceLevel = undefined
                                    }
                                    recis.push({
                                        reciIconUrl: reciIconUrl,
                                        reciName: reciName,
                                        reciCount: reciCount,
                                        reciProduceLevel: reciProduceLevel
                                    });
                                }
                            }
                            let comsumptions = [];
                            var fffff = fff[6].match(/(<p.*?>).*?(<\/p>)/g);
                            if (fffff) {
                                for (var q = 0; q < fffff.length; q++) {
                                    let comsp = fffff[q];
                                    let comspUrl = comsp.match(/(src="http.*?\.png)/g)[0].substring(5);
                                    let comspName = comsp.replace(/(<p>[\s\S]*?\/>)?(<\/a>[\s\S]*?<\/p>)?/g, '');
                                    let comspCount = comsp.replace(/(<p>[\s\S]*?<\/a>)?(<\/p>)?/g, '');
                                    comsumptions.push({
                                        comspUrl: comspUrl,
                                        comspName: comspName,
                                        comspCount: comspCount
                                    });
                                }
                            }
                            let remark = fff[7].replace(/(<td.*?>)?[\r\n\t]*?(<\/td>)?/g, '').replace(/(<a.*?>)?(<\/a>)?/g, '');
                            recipes.push({
                                iconUrl: iconUrl,
                                name: name,
                                classJob: classJob,
                                level: level,
                                type: type,
                                recis: recis,
                                comsumptions: comsumptions,
                                remark: remark
                            });
                        }
                    }
                }
            }
            console.log(recipes);
        } else {
            console.log('null');
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.dataSource._dataBlob.s1.concat(recipes)),
            isLoading: false,
            isLoadedAll: (this.totalCount === undefined) ? false : (this.totalCount <= this.state.dataSource._dataBlob.s1.length)
        });
    }

    analyizeTotalCount(html) {
        var f = html.match(/(<span class="fl color-duan lh30">[\s\S]*?<\/span>)/g)[0]
            .match(/(<strong.*?>)[\s\S]*?(<\/strong>)/g)[0]
            .replace(/(<strong.*?>)?(<\/strong>)?/g, '');
        this.totalCount = f;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
