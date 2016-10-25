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

export default class RecipeScreen extends Component {

    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
                    background={require('../home/img/schedule-background.png') }>
                </Header>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderFooter={this.renderFooter.bind(this)}
                    />
            </View>
        );
    }

    renderRow(rowData) {
        return (
            <IdentityCell
                icon={{uri: rowData.image}}
                name={rowData.name}
                first={rowData.version}
                second={rowData.dropPoint}
                flex={0}
                />
        );
    }

    renderFooter() {
        if (this.state.isLoading) {
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
                this.analyizeHTML(response._bodyText)
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
                            console.log('------', fff);
                            // pets.push({
                            //     name: fff[0].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '').replace(/(<strong.*?>)?(<\/strong>)?/g, ''),
                            //     version: fff[1].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '').replace(/(<strong.*?>)?(<\/strong>)?/g, ''),
                            //     dropPoint: fff[2].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '')
                            //         .replace(/(<strong.*?>)?(<\/strong>)?/g, '')
                            //         .replace(/(<span.*?">)?(<\/span>)?/g, '')
                            //         .replace(/(<br.*?\/>)?/g, '')
                            //         .replace(/(<a.*?">)?(<\/a>)?/g, '')
                            //         .replace(/[&nbsp;\s]?/g, '')
                            //         .replace(/(<tyle=.*?">)?(<\/>)?/g, ''),
                            //     image: fff[3].substring(fff[3].indexOf('http:'), fff[3].indexOf('.jpg"') + 4)
                            // });
                        }
                    }
                }
            }
        } else {
            console.log('null');
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(recipes),
            isLoading: false
        });
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
