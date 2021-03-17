import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import colors from '../../../Themes/Colors';
class LoadingSchool extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.container, { position: 'absolute' }]}>
                    <Icon name='university' color={colors.appGreen} type='font-awesome' size={totalSize(2)} />
                </View>
                <ActivityIndicator size={totalSize(10)} color='gray' />
            </View>
        );
    }
}

export default LoadingSchool;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
})
