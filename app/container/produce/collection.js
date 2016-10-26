/**
 * 采集页面
 * 
 * Created by Troy on 2016-10-26 21:06:00
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
import IdentityCell from '../common/IdentityCell.js';

export default class CollectionScreen extends Component {

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
            this.getHTML();
        });
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
                    dataSource={this.state.dataSource}
                    renderFooter={this.renderFooter.bind(this)} />
            </View>
        );
    }

    renderRow(rowData) {
        if (this.props.kind === 1 && this.props.type === '4') {
            return (
                <IdentityCell
                    icon={{ uri: rowData.url }}
                    name={rowData.name}
                    type='捕鱼人'
                    first={'等级：' + rowData.classJob}
                    second={'类型：' + rowData.level}
                    third={rowData.type + ' ' + rowData.location}
                    flex={0} />
            );
        } else {
            return (
                <IdentityCell
                    icon={{ uri: rowData.url }}
                    name={rowData.name}
                    type={rowData.classJob}
                    first={'等级：' + rowData.level}
                    second={'类型：' + rowData.type}
                    third={rowData.location}
                    flex={0} />
            );
        }

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

    getHTML() {
        let url = 'http://cha.17173.com/ff14/gathering?type=' + this.props.type + '&' + this.props.level;
        console.log(url);
        fetch(url)
            .then((response) => {
                this.analyzeHTML(response._bodyText);
            });
    }

    analyzeHTML(html) {
        var collections = [];
        var f = html.match(/(<table>[\s\S]*?<\/table>)/g);
        if (f) {
            var ff = f[0].match(/(<tr[\s\S]*?>[\s\S]*?<\/tr>)/g);
            if (ff) {
                for (var i = 0; i < ff.length; i++) {
                    var element = ff[i];
                    var fff = element.match(/(<td.*?>[\s\S]*?<\/td>)/g);
                    if (fff) {
                        let name = fff[0].replace(/(<td[\s\S]*?\/>)?(<\/a>[\s\S]*?<\/td>)?/g, '');
                        let url = fff[0].match(/(http:[\s\S]*?\.png)/g)[0];
                        let classJob = fff[1].replace(/(<td.*?>)?(<\/td>)?/g, '');
                        let level = fff[2].replace(/(<td.*?>)?(<\/td>)?/g, '');
                        let type = fff[3].replace(/(<td.*?>)?(<\/td>)?/g, '');
                        let location = fff[4].replace(/(<td.*?>)?(<\/td>)?/g, '').replace(/(<br.*?>)/g, '');
                        collections.push({
                            name,
                            url,
                            classJob,
                            level,
                            type,
                            location
                        });
                    }
                }
            }
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(collections),
            isLoading: false
        });
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});