/**
 * 坐骑页面
 * 
 * Created by Troy on 2016-10-10 11:22:52
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

export default class MountScreen extends Component {

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
                imageHeight={100}
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
        fetch('http://www.ffxiv.cn/show/5')
            .then((response) => {
                this.analyizeHTML(response._bodyText)
            })
    }

    analyizeHTML(html) {
        var mounts = [];
        var f = html.match(/<tbody>[\s\S]*?<\/tbody>/g);
        if (f) {
            for (var index = 0; index < f.length; index++) {
                var tbody = f[index];
                var ff = tbody.match(/<tr>[\s\S]*?<\/tr>/g);
                if (ff) {
                    for (var j = 0; j < ff.length; j++) {
                        var tr = ff[j];
                        var fff = tr.match(/<td[\s\S]*?<\/td>/g);
                        if (fff && j !== 0) {
                            mounts.push({
                                name: fff[0].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '').replace(/(<strong.*?>)?(<\/strong>)?/g, '').replace(/(<img.*?\/>)/g, '').replace(/(<span.*?>)?(<\/span>)?/g, '').replace(/(<p.*?>)?(<\/p>)?/g, '').replace(/(&nbsp;)/g, ''),
                                version: fff[1].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '').replace(/(<strong.*?>)?(<\/strong>)?/g, '').replace(/(<span.*?>)?(<\/span>)?/g, '').replace(/(<p.*?>)?(<\/p>)?/g, '').replace(/(&nbsp;)/g, ''),
                                dropPoint: fff[2].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '')
                                    .replace(/(<strong.*?>)?(<\/strong>)?/g, '')
                                    .replace(/(<span.*?">)?(<\/span>)?/g, '')
                                    .replace(/(<br.*?\/>)?/g, '')
                                    .replace(/(<a.*?">)?(<\/a>)?/g, '')
                                    .replace(/[&nbsp;\s]?/g, '')
                                    .replace(/(<tyle=.*?">)?(<\/>)?/g, '')
                                    .replace(/(<div.*?>)?(<\/div>)?/g, '')
                                    .replace(/([rl]?d?quot?)/g, '"'),
                                image: fff[3].substring(fff[3].indexOf('http:'), fff[3].indexOf('.jpg"') + 4)
                            });
                        }
                    }
                }
            }
        } else {
            console.log('null');
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(mounts),
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
