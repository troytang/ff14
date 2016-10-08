/**
 * 头部的基本组件
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

const DEFAULT_HEIGHT = 75;
const DEFAULT_PADDING = 8;

export default class ItemCell extends Component {

    constructor(props) {
        super(props)

        this.state = {
            first: this.props.first,
            second: this.props.second,
            third: this.props.third,
            type: this.props.type
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.first) {
            this.setState({
                first: nextProps.first,
                second: nextProps.second,
                third: nextProps.third,
            });
        }
        if (nextProps && nextProps.name) {
            this.setState({
                name: nextProps.name
            });
        }
    }

    render() {
        let height = this.props.height || DEFAULT_HEIGHT;
        let classJob = this.props.classJob;
        return (
            <View style={[styles.container, { height: height + DEFAULT_PADDING * 2 }]} >
                <Image style={[styles.icon, { width: height, height: height }]}
                    source={this.props.icon}
                    resizeMode='contain' >
                </Image>
                <View style={styles.detail} >
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >
                        <Text style={styles.name} >
                            {this.props.name}
                        </Text>
                        {
                            this.state.type &&
                            <Text style={styles.name} >
                                {this.state.type}
                            </Text>
                        }
                    </View>
                    <Text style={styles.first} >
                        {this.state.first}
                    </Text>
                    <Text style={styles.second} >
                        {this.state.second}
                    </Text>
                    {
                        this.state.third &&
                        <Text style={styles.second} >
                            {this.state.third}
                        </Text>
                    }

                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
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
        padding: DEFAULT_PADDING,
        borderBottomColor: '#E3E3E3',
        borderBottomWidth: 0.5
    },
    name: {
        textAlignVertical: 'center',
        fontWeight: 'bold',
    },
    first: {
        flex: 1,
        textAlignVertical: 'center'
    },
    second: {
        flex: 1,
        textAlignVertical: 'center'
    },
    classJob: {
        textAlignVertical: 'center'
    }
});
