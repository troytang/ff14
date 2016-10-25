/**
 * 列表项的基本组件
 * 
 * Created by Troy on 2016-10-1 21:12:29
 */
'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const DEFAULT_HEIGHT = 50;
const DEFAULT_PADDING = 8;

export default class ItemCell extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        let height = this.props.height || DEFAULT_HEIGHT;
        return (
            <TouchableOpacity style={[styles.container, {height: height + DEFAULT_PADDING * 2}]} 
                onPress={() => {this.props.onPress()}}>
                <Image style={[styles.icon, {width: height, height: height}, {borderRadius: this.props.iconRadius || 8}]}
                    source={this.props.icon}
                    resizeMode='contain' >
                </Image>
                <View style={styles.detail} >
                    <Text style={styles.name} >
                        {this.props.name}
                    </Text>
                    <Text style={styles.desc} >
                        {this.props.desc}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: DEFAULT_HEIGHT,
    },
    icon: {
        width: DEFAULT_HEIGHT - DEFAULT_PADDING * 2,
        height: DEFAULT_HEIGHT - DEFAULT_PADDING * 2,
        margin: DEFAULT_PADDING,
        borderRadius: 8
    },
    detail: {
        flex: 1,
        justifyContent: 'center',
        borderBottomColor: '#E3E3E3',
        borderBottomWidth: 0.5
    },
    name: {
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    desc: {
        textAlignVertical: 'center'
    },
});
