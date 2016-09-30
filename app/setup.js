/**
 * Created by Troy on 16/9/30.
 */
'use strict'

import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import createStore from './redux/store.js';
import MainApp from './main.js';

global.store = null;

export default class Setup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appStore: createStore(() => {
                // do something
            })
        };
    }

    render() {
        store = this.state.appStore;

        return (
            <Provider store={ this.state.appStore }>
                <MainApp/>
            </Provider>
        );
    }
}