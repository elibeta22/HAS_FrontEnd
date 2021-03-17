import React, { Component } from 'react';
import { View, Text, StyleSheet,ImageBackground} from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import {Icon} from 'react-native-elements'
import images from '../Themes/Images'

class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    static navigationOptions={
        header:null
    }
    componentDidMount(){
        setTimeout(() => {this.props.navigation.replace('login')}, 3000);
    }

    render() {
        return (
            <ImageBackground style={styles.container} source={images.splashBg}>
            </ImageBackground>
        );
    }
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center'
    },
    welcome: {
        fontSize: totalSize(8),
        color: 'rgb(66,67,69)',
        fontWeight: 'bold',
    },
    instructions: {
        fontSize: totalSize(1.7),
        textAlign: 'center',
        color: 'rgb(217,217,217)',
        marginBottom: 5,
    },
    logo:{
        height:height(10),
        width:width(8)
    }
});