/**
 * 藏品页面
 * 
 * Created by Troy on 2016-10-09 10:46:58
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

import Header from '../common/F8Header.js';
import ItemCell from '../common/ItemCell.js';

export default class CollectionScreen extends Component {
    
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue'
    }
});
