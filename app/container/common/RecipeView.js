/**
 * 配方 Item View
 * 传入参数 ins
 * 
 * Created by Troy on 2016年10月26日13:19:41
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

const MIN_HEIGHT = 80;
const ICON_HEIGHT = 50;
const HEADER_PADDING = 8;
const RECI_ICON_HEIGHT = 35;

export default class RecipeView extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <TouchableOpacity style={styles.container}
                onPress={this.props.onPress} >
                <View style={styles.header} >
                    <Image style={styles.icon} source={{ uri: this.props.ins.iconUrl }} />
                    <View style={styles.headerLineContainer}>
                        <View style={styles.headerLine} >
                            <Text style={[styles.headerText, { fontWeight: 'bold' }]} >{this.props.ins.name}</Text>
                            <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>{this.props.ins.classJob}</Text>
                        </View>
                        <View style={styles.headerLine} >
                            <Text style={[styles.headerText, { textAlignVertical: 'top' }]} >{this.props.ins.type}</Text>
                            <Text style={{ textAlignVertical: 'top' }}>等级：{this.props.ins.level}</Text>
                        </View>
                    </View>
                </View>
                {
                    this.props.ins.recis.map((row) => {
                        return this.renderReciLine(row);
                    })
                }
                {
                    this.props.ins.comsumptions.map((row) => {
                        return this.renderComspLine(row);
                    })
                }
                    <Text style={{marginLeft: ICON_HEIGHT / 2 + HEADER_PADDING, color: 'gray'}}>{this.props.ins.remark}</Text>
            </TouchableOpacity>
        );
    }

    renderReciLine(reci) {
        return (
            <View style={styles.reciLine} >
                <View style={styles.vLine} />
                <View style={styles.hLine} />
                <Image style={{ width: 20, height: 20 }}
                    source={{ uri: reci.reciIconUrl }} />
                <Text style={{ paddingLeft: 8 }} >{reci.reciName}{reci.reciCount}[{reci.reciProduceLevel !== undefined ? reci.reciProduceLevel : '无'}]</Text>
            </View>
        );
    }

    renderComspLine(comsp) {
        return (
            <View style={styles.reciLine} >
                <View style={styles.vLine} />
                <View style={styles.hLine} />
                <Image style={{ width: 20, height: 20 }}
                    source={{ uri: comsp.comspUrl }} />
                <Text style={{ paddingLeft: 8 }} >{comsp.comspName}{comsp.comspCount}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        minHeight: MIN_HEIGHT,
    },
    header: {
        flexDirection: 'row',
        flex: 1,
        paddingTop: HEADER_PADDING,
        paddingLeft: HEADER_PADDING,
        paddingRight: HEADER_PADDING,
    },
    headerLineContainer: {
        flex: 1,
        height: ICON_HEIGHT,
        paddingLeft: 8,
    },
    headerLine: {
        flexDirection: 'row',
        flex: 1
    },
    headerText: {
        flex: 1,
        textAlignVertical: 'center'
    },
    icon: {
        width: ICON_HEIGHT,
        height: ICON_HEIGHT,
        borderRadius: 5
    },
    reciLine: {
        flexDirection: 'row',
        height: RECI_ICON_HEIGHT
    },
    vLine: {
        width: 1,
        height: RECI_ICON_HEIGHT,
        backgroundColor: 'orange',
        marginLeft: HEADER_PADDING + ICON_HEIGHT / 2
    },
    hLine: {
        height: 1,
        width: ICON_HEIGHT / 2,
        marginTop: 9.5,
        backgroundColor: 'orange'
    }
});