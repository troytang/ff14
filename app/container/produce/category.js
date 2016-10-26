/**
 * 生产职业等级目录
 * 
 * Created by Troy on 2016-10-26 20:23:51
 */
'use strict'

import React, { Component } from 'react';
import {
    View,
    ListView,
    StyleSheet,
    ActivityIndicator,
    InteractionManager,
    ToastAndroid
} from 'react-native';
import Header from '../common/F8Header.js';
import ItemCell from '../common/ItemCell.js';
import RecipeScreen from './recipe.js';

export default class CategoryScreen extends Component {

    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: true,
            dataSource: ds.cloneWithRows([
                { name: '1-5', level: 'level=1-5' },
                { name: '6-10', level: 'level=6-10' },
                { name: '11-15', level: 'level=11-15' },
                { name: '16-20', level: 'level=16-20' },
                { name: '21-25', level: 'level=21-25' },
                { name: '26-30', level: 'level=26-30' },
                { name: '31-35', level: 'level=31-35' },
                { name: '36-40', level: 'level=36-40' },
                { name: '41-45', level: 'level=41-45' },
                { name: '46-50', level: 'level=46-50' },
                { name: '51-55', level: 'level=51-55' },
                { name: '56-60', level: 'level=56-60' },
                { name: '50★1', level: 'leveld=50-1' },
                { name: '50★2', level: 'leveld=50-2' },
                { name: '50★3', level: 'leveld=50-3' },
                { name: '50★4', level: 'leveld=50-4' },
                { name: '60★1', level: 'leveld=60-1' },
                { name: '60★2', level: 'leveld=60-2' },
            ])
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
        // InteractionManager.runAfterInteractions(() => {
        //     this.getItemList();
        // });
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
                    dataSource={this.state.dataSource} />
            </View>
        );
    }

    renderRow(rowData) {
        return (
            <ItemCell
                icon={this.props.icon}
                name={rowData.name}
                iconRadius={3}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'recipeScreen',
                        component: RecipeScreen,
                        params: {
                            name: rowData.name,
                            kind: this.props.kind,
                            type: this.props.type,
                            level: rowData.level
                        }
                    });
                } } />
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

});