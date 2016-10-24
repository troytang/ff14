/**
 * Loading Dialog
 * 
 * Created by Troy on 2016年10月24日16:47:32
 */

import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Modal,
    View,
    Text,
    ColorPropType
} from 'react-native';

export default class LoadingView extends Component {
    render() {
        return (
            <Modal
                animationType={this.props.animationType}
                transparent={this.props.transparent}
                visible={this.props.visible}
                onShow={this.props.onShow}
                onRequestClose={this.props.onRequestClose}>
                <View style={styles.container}>
                    <View style={styles.subView}>
                        <ActivityIndicator
                            animating={this.props.animating}
                            color={this.props.color}
                            size={this.props.size}/>
                        {
                            (this.props.text) &&
                            <Text style={styles.text}>
                                {this.props.text}
                            </Text>
                        }
                    </View>
                </View>
            </Modal>
        );
    }
};

LoadingView.propTypes = {
    animationType: React.PropTypes.string,
    transparent: React.PropTypes.bool,
    visible: React.PropTypes.bool,
    onShow: React.PropTypes.func,
    onRequestClose: React.PropTypes.func,
    text: React.PropTypes.string,
    animating: React.PropTypes.bool,
    color: ColorPropType,
    size: React.PropTypes.oneOfType([
        React.PropTypes.oneOf(['small', 'large']),
        React.PropTypes.number
    ])
}

LoadingView.defaultProps = {
    animationType: 'fade',
    transparent: true,
    onShow: () => { },
    onRequestClose: () => { },
    animating: true,
    color: 'white',
    size: 'large'
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subView: {
        width: 80,
        height: 80,
        backgroundColor: '#04142aB2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        padding: 10
    },
    text: {
        color: 'white',
        fontSize: 14,
        marginTop: 4
    }
});