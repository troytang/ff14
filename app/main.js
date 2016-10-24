/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    Navigator,
    BackAndroid,
    TouchableOpacity
} from 'react-native';
import HomeScreen from './container/home/index.js';

var currNavigator = null;

export default class MainApp extends Component {

    constructor(props) {
        super(props);

        this._onBackAndroid = this._onBackAndroid.bind(this);
    }

    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);
    }


    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor="rgba(0, 0, 0, 0.2)"
                    barStyle="light-content"
                    />
                <Navigator
                    initialRoute={{
                        name: 'homeScreen',
                        component: HomeScreen
                    }}
                    configureScene={this._configureScene}
                    renderScene={this._renderScene} />
            </View>
        );

    }

    _configureScene(route, routeStack) {
        if (route.type == 'Bottom') {
            return Navigator.SceneConfigs.FloatFromBottom; // 底部弹出
        } else if (route.type == 'Left') {
            return Navigator.SceneConfigs.FloatFromLeft; // 底部弹出
        }
        return Navigator.SceneConfigs.FloatFromRight;    // 右侧弹出
    }

    _renderScene(route, navigator) {
        currNavigator = navigator;
        let Component = route.component;
        return <Component navigator={navigator} route={route} {...route.params} />
    }

    _onBackAndroid() {
        if (currNavigator && currNavigator.getCurrentRoutes().length > 1) {
            currNavigator.pop();
            return true;
        }
        return false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});