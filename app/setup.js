/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import createStore from './redux/store.js';
import MainApp from './main.js';

global.store = null;

export default class Setup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            appStore: createStore(() => {
                // do something
                this.setState({
                    isLoading: false
                });
            })
        };
    }

    render() {
        if (this.state.isLoading) {
            return null;
        }
        store = this.state.appStore;
        console.log(store.getState());

        return (
            <Provider store={this.state.appStore}>
                <MainApp />
            </Provider>
        );
    }
}