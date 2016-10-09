/**
 * 宠物页面
 * 
 * Created by Troy on 2016-10-09 10:42:25
 */
'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    InteractionManager
} from 'react-native';
import Header from '../common/F8Header.js';
import ItemCell from '../common/ItemCell.js';

export default class PetScreen extends Component {

    constructor(props) {
        super(props);

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
            </View>
        );
    }

    getHTML() {
        fetch('http://www.ffxiv.cn/show/6')
            .then((response) => {
                this.analyizeHTML(response._bodyText)
            })
    }

    analyizeHTML(html) {
        var pets = [];
        var f = html.match(/<tbody>[\s\S]*?<\/tbody>/g);
        if (f) {
            for (var index = 0; index < f.length; index++) {
                var tbody = f[index];
                var ff = tbody.match(/<tr>[\s\S]*?<\/tr>/g);
                if (ff) {
                    for (var j = 0; j < ff.length; j++) {
                        var tr = ff[j];
                        var fff = tr.match(/<td[\s\S]*?<\/td>/g);
                        if (fff && fff[0] !== '') {
                            pets.push({
                                name: fff[0].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '').replace(/(<strong.*>)?(<\/strong>)?/g, ''),
                                version: fff[1].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '').replace(/(<strong.*>)?(<\/strong>)?/g, ''),
                                dropPoint: fff[2].replace(/(<td.*>)?[\r\n\t]*(<\/td>)?/g, '').replace(/(<strong.*>)?(<\/strong>)?/g, '').replace(/(<span.*>)?(<\/span>)?/g, '').replace(/(<br.*\/>)?/g, '').replace(/(<a.*>)?(<\/a>)?/g, '').replace(/(<p.*>)*(<\/p>)*/g, ''),
                                image: fff[3].substr(fff[3].indexOf('http:'), fff[3].indexOf('.jpg"'))
                            });
                        }
                    }
                }
            }
        } else {
            console.log('null');
        }
        console.log('end');
        for (var k = 0; k < pets.length; k++) {
            var pet = pets[k];
            console.log('-------------------', pet);
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red'
    }
});
