import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import Toast from 'react-native-simple-toast'
import store from '../../Stores/orderStore';
import Modal from 'react-native-modal';
import api from '../../lib/api'
import colors from '../../Themes/Colors'
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisibleLogout: false,
            loading: false
        };
    }
    _toggleModalLogout = () =>
        this.setState({ isModalVisibleLogout: !this.state.isModalVisibleLogout });
    // logOut = () => {
    //     store.USER_LOGIN = {}
    //     this._toggleModalLogout()
    //     this.props.navigation.navigate('login')
    // }

    log_out = async () => {
        this.setState({ loading: true })
        let params = {
            token: store.USER_TOKEN
        }
        //console.warn('Paramss===>', params)
        let response = await api.post('logout', params)
        if (response.status === 'success') {
            store.USER_TOKEN = ''
            store.USER_LOGIN = {}
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('pass')
            Toast.show(response.message, Toast.LONG)
            await this.setState({ isModalVisibleLogout: false, loading: false })
            this.props.navigation.push('login')
        } else {
            Toast.show(response.message)
            this.setState({ loading: false })
        }

    }
    componentDidMount() {
        //console.warn('Email is===>',store.RESPONSE)
    }
    static navigationOptions = {
        header: null
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{ width: width(3) }}></View>
                        <Icon name='sign-out' color={colors.appGreen} type='octicon' onPress={() => this._toggleModalLogout()} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.btnTxt,{color:colors.appGreen}]}>Home</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Icon name='person' color={colors.appGreen} onPress={() => this.props.navigation.navigate('profile')} />
                        <View style={{ width: width(3) }}></View>
                    </View>
                </View>
                <View style={styles.lowerContainer}>
                    <View style={styles.txtContainer}>
                        <View style={styles.btnTxtContainer}>
                            <Text style={[styles.welcome, { color: colors.appGreen }]}>Learn </Text>
                            <Text style={styles.welcome}>More.</Text>
                        </View>
                        <View style={styles.btnTxtContainer}>
                            <Text style={[styles.welcome, { color: colors.appGreen }]}>Teach </Text>
                            <Text style={styles.welcome}>Better.</Text>
                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('findProfessor')}>
                            <View style={styles.btnTxtContainer}>
                                <Text style={styles.btnTxt}>SEARCH A  </Text>
                                <Text style={[styles.btnTxt, { fontWeight: 'bold', fontSize: totalSize(3) }]}>Professor</Text>
                                {/* <Icon name='school' color='rgb(180,210,53)'/> */}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('findSchool')}>
                            <View style={styles.btnTxtContainer}>
                                <Text style={styles.btnTxt}>SEARCH A  </Text>
                                <Text style={[styles.btnTxt, { fontWeight: 'bold', fontSize: totalSize(3) }]}>School</Text>
                                {/* <Icon name='university' color='rgb(180,210,53)' type='font-awesome'/> */}
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.button}>
                            <View style={styles.btnTxtContainer}>
                                <Text style={styles.btnTxt}>RATE A </Text>
                                <Text style={[styles.btnTxt, { fontWeight: 'bold', fontSize: totalSize(3) }]}>Professor</Text>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>
                <Modal
                    isVisible={this.state.isModalVisibleLogout} // Delete User
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.50}
                    onBackdropPress={this._toggleModalLogout}>
                    <View style={{ backgroundColor: 'white', height: height(20), width: width(80), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        {
                            this.state.loading === true ?
                                <ActivityIndicator color='rgb(180,210,53)' size={totalSize(5)} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: totalSize(1.8), }}>Are you sure you want to logout?</Text>
                                    <View style={{ marginTop: height(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>

                                        <TouchableOpacity onPress={this._toggleModalLogout} style={{ height: height(6), width: width(35), backgroundColor: 'rgb(207,207,207)', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }}>
                                            <Text style={{ fontSize: totalSize(2) }}>Cancle</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: width(2.5) }}></View>
                                        <TouchableOpacity onPress={() => this.log_out()} style={{ height: height(6), width: width(35), backgroundColor: 'rgb(218,21,30)', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }}>
                                            <Text style={{ fontSize: totalSize(2), color: 'white' }}>Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }
                    </View>
                </Modal>
            </View>
        );
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //width: null,
        //height: null,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: 'rgb(66,67,69)'

    },
    searchContainer: {
        width: width(70),
        height: height(6),
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
        marginVertical: height(1),
        borderRadius: 25,
        flexDirection: 'row'
    },
    TxtInput: {
        width: width(65),
        height: height(8),
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'white',
        fontSize: totalSize(2.5),
        color: 'rgb(217,217,217)'
        //marginVertical:height(2),
        //borderRadius: 25,
    },
    lowerContainer: {
        flex: 1,
        //width: width(100),
        //height: null,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'rgb(0,173,238)'
        //backgroundColor:'rgb(180,210,53)'
        //backgroundColor:'rgb(217,217,217)'
        backgroundColor: 'rgb(245,245,238)'

    },
    txtContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: height(3)
    },
    welcome: {
        fontSize: totalSize(5),
        //textAlign: 'center',
        //margin: 10,
        //color: 'white',
        color: 'rgb(66,67,69)',
        fontWeight: 'bold',
        //opacity: 0.6
    },
    instructions: {
        fontSize: totalSize(2),
        textAlign: 'center',
        color: 'rgb(217,217,217)',
        marginBottom: 5,
    },
    btnTxtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTxt: {
        fontSize: totalSize(2.5),
        color: 'white',
        fontWeight: 'normal'
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 50,
        borderRightWidth: 50,
        borderBottomWidth: 100,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'red',
        position: 'absolute'
    },
    triangleDown: {
        width: width(1),
        height: height(2),
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderRightWidth: 3,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgb(180,210,53)',
        transform: [
            { rotate: '180deg' }
        ],
        bottom: height(0.1)
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        width: width(65),
        height: height(15),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appGreen,
        marginVertical: height(1),
        elevation: 5,
        borderRadius: 3
    }
});
