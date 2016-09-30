/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ListView
} from 'react-native';

export default class Home extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <View style={styles.container}>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});