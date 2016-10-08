/**
 * 搜索View
 * 
 * Created by Troy on 2016-10-4 13:47:41
 */
'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    Platform,
    LayoutAnimation,
    NativeModules,
    TouchableOpacity
} from 'react-native';

global.DEFAULT_SEARCH_VIEW_HEIGHT = 50;
const DEFAULT_SEARCH_VIEW_PADDING = 5;

export default class SearchView extends Component {

    constructor(props) {
        super(props);

        // Enable LayoutAnimation under Android
        if (Platform.OS === 'android') {
            NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true)
        }

        this.searchKey = '';
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <TextInput style={styles.textInput} 
                    autoFocus={true}
                    underlineColorAndroid='white'
                    returnKeyType='search'
                    onSubmitEditing={(event) => {
                        this.props.onSearch(this.searchKey);
                    }}
                    onChangeText={(text) => {
                        console.log('before', this.searchKey);
                        this.searchKey = text;
                        console.log('after', this.searchKey);
                    }} >
                </TextInput>
                <TouchableOpacity style={styles.commit}
                    onPress={() => {
                        this.props.onSearch(this.searchKey);
                    }} >
                    <Image style={styles.icon}
                    source={require('./img/search.png') } >
                </Image>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: DEFAULT_SEARCH_VIEW_HEIGHT,
        marginLeft: 12,
        marginRight: 8
    },
    icon: {
        width: DEFAULT_SEARCH_VIEW_HEIGHT - DEFAULT_SEARCH_VIEW_PADDING * 4,
        height: DEFAULT_SEARCH_VIEW_HEIGHT - DEFAULT_SEARCH_VIEW_PADDING * 4,
        marginTop: DEFAULT_SEARCH_VIEW_PADDING
    },
    textInput: {
        flex: 1,
        height: DEFAULT_SEARCH_VIEW_HEIGHT,
        alignSelf: 'stretch',
        color: 'white',
    },
    commit: {
        width: DEFAULT_SEARCH_VIEW_HEIGHT - DEFAULT_SEARCH_VIEW_PADDING * 2,
        height: DEFAULT_SEARCH_VIEW_HEIGHT - DEFAULT_SEARCH_VIEW_PADDING * 2,
        padding: DEFAULT_SEARCH_VIEW_PADDING,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold'
    }
});