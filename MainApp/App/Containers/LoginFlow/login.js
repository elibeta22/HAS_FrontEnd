import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Image, AsyncStorage } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import store from '../../Stores/orderStore'
import api from '../../lib/api'
import Toast from 'react-native-simple-toast'
import images from '../../Themes/Images';
import colors from '../../Themes/Colors';
import Modal from 'react-native-modal'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            newPassword: '',
            code: '',
            loading_code: false,
            loading: false,
            isModalVisible: false,
            isModalVisibleSendCode: false,
            loadingResetPassword: false,
            LoadingsendCode: false,
            isModalVisibleResetPassword: false,

        };
    }

    static navigationOptions = {
        header: null
    }
    componentWillMount = async () => {
        let email = await AsyncStorage.getItem('email') || null;
        let pass = await AsyncStorage.getItem('pass') || null;
        // console.warn('email & pass==>>>', email, pass);
        if (email !== null && pass !== null) {
            await this.setState({
                email: email,
                password: pass
            })
            await this.login()
        }
    }
    _toggleModalSendCode = () =>
        this.setState({ isModalVisibleSendCode: !this.state.isModalVisibleSendCode });
    _toggleModalResetPassword = () =>
        this.setState({ isModalVisibleResetPassword: !this.state.isModalVisibleResetPassword });


    login = async () => {
        if (this.state.email.length !== 0 && this.state.password.length !== 0) {
            this.setState({ loading: true })
            let params = {
                email: this.state.email,
                password: this.state.password
            }
            try {
                let response = await api.post('login', params);
                if (response.status === 'success') {
                    store.USER_TOKEN = response.token
                    store.USER_LOGIN = response.user
                    await AsyncStorage.setItem('email', this.state.email);
                    await AsyncStorage.setItem('pass', this.state.password);
                    Toast.show(response.message)
                    this.setState({ loading: false })
                    this.props.navigation.replace('home');
                    console.warn(store.USER_LOGIN.professors[0].professor_name);

                }
            } catch (error) {
                this.setState({ loading: false })
                Toast.show('Please enter valid email or password.')
            }
        } else {
            Toast.show('Please enter your email and password.')
        }
    }
    resendCode = async () => {
        this.setState({ loading_code: true })
        const formdata = new FormData();
        formdata.append('code', this.state.v_code);
        formdata.append('token', store.USER_TOKEN);
        await fetch('http://157.230.63.199/api/email/resend', {
            method: 'POST',
            body: formdata
        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn('Code data response=====>>>>>', responseJson);
                if (responseJson.status === 'success') {
                    this.setState({ isModalVisible: false, loading_code: false })
                    Toast.show(responseJson.message)
                } else {
                    this.setState({ isModalVisible: false, loading_code: false })
                    Toast.show(responseJson.message)
                }
            })
            .catch((error) => {
                this.setState({
                    loading_code: false
                })
                Toast.show('Your verification code is not correct.', Toast.CENTER)
            })
    }
    sendCode = async () => {
        if (this.state.email.length !== 0) {
            this.setState({ LoadingsendCode: true })
            let params = {
                email: this.state.email,
            }
            try {
                let response = await api.post('password/email', params)
                if (response.status) {
                    Toast.show(response.message, Toast.LONG)
                    this._toggleModalSendCode()
                    this._toggleModalResetPassword()
                    this.setState({ LoadingsendCode: false })
                } else {
                    Toast.show(response.message, Toast.LONG)
                    this.setState({ LoadingsendCode: false, email: '' })
                    this._toggleModalSendCode()
                }
            } catch (error) {
                Toast.show(error.message, Toast.LONG)
                this.setState({ LoadingsendCode: false })
                this._toggleModalSendCode()
                this._toggleModalResetPassword()
            }

        } else {
            Toast.show('Please enter email address')
        }
    }

    ResetPassword = async () => {
        if (this.state.email.length !== 0 && this.state.newPassword.length !== 0 && this.state.code.length !== 0) {
            this.setState({ loadingResetPassword: true })
            let params = {
                email: this.state.email,
                code: this.state.code,
                password: this.state.newPassword
            }
            console.warn(params)
            try {
                let response = await api.post('password/reset', params);
                if (response.status) {
                    Toast.show(response.message, Toast.LONG)
                    this._toggleModalResetPassword()
                    this.setState({ loadingResetPassword: false })
                } else {
                    Toast.show(response.message, Toast.LONG)
                    this.setState({ loadingResetPassword: false })
                    this._toggleModalResetPassword()

                }
            } catch (error) {
                Toast.show(response.message, Toast.LONG)
                this.setState({ loadingResetPassword: false })
                this._toggleModalResetPassword()
            }
        } else {
            Toast.show('Please fill up all fields')
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.lowerContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, width: width(95), alignItems: 'center', backgroundColor: 'transparent', marginTop: height(5) }}>
                            <Image source={images.logo} style={styles.logo} />
                            <View style={[styles.txtContainer, {}]}>
                                <Text style={[styles.welcome, { fontSize: totalSize(4) }]}>Login</Text>
                            </View>
                            <View style={[styles.txtContainer, { flexDirection: 'row' }]}>
                                <Text style={[styles.welcome, { fontSize: totalSize(1.5), fontWeight: 'normal' }]}>DON'T HAVE AN ACCOUNT? </Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('signup')}>
                                    <Text style={[styles.welcome, { fontSize: totalSize(1.5), color: colors.appGreen, fontWeight: 'normal' }]}>SIGN UP!</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.schoolInputContainer}>
                                <Icon name='email' size={totalSize(3)} color='rgb(66,67,69)' />
                                <TextInput
                                    onChangeText={(value) => this.setState({ email: value })}
                                    placeholder='EMAIL'
                                    placeholderTextColor='rgb(217,217,217)'
                                    underlineColorAndroid='transparent'
                                    style={styles.TxtInputSchool}
                                />
                            </View>
                            <View style={styles.schoolInputContainer}>
                                <Icon name='lock' size={totalSize(3)} color='rgb(66,67,69)' />
                                <TextInput
                                    onChangeText={(value) => this.setState({ password: value })}
                                    placeholder='PASSWORD'
                                    placeholderTextColor='rgb(217,217,217)'
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={true}
                                    style={styles.TxtInputSchool}
                                />
                            </View>

                            <View style={styles.txtContainer}>
                                <TouchableOpacity onPress={() => this._toggleModalSendCode()}>
                                    <Text style={[styles.welcome, { fontSize: totalSize(1.5), color: colors.appGreen, fontWeight: 'normal' }]}>Forget Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => this.login()}>
                                    <View style={styles.btnTxtContainer}>
                                        {
                                            this.state.loading === true ?
                                                <ActivityIndicator size={'small'} color='white' />
                                                :
                                                <Text style={styles.btnTxt}>Login</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Modal
                    isVisible={this.state.isModalVisibleSendCode} // Send Code to Email
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    backdropOpacity={0.50}
                    onBackdropPress={this._toggleModalSendCode}>
                    <View style={{ backgroundColor: colors.appLightGreen, height: height(35), width: width(95), alignSelf: 'center', borderRadius: 5 }}>
                        {
                            this.state.LoadingsendCode === true ?
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator color={colors.appGreen} size={totalSize(5)} />
                                </View>
                                :
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}>
                                        <TouchableOpacity onPress={this._toggleModalSendCode} style={{ backgroundColor: 'Transparent', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }}>
                                            <Icon
                                                name='close' color='rgb(218,21,30)' />
                                        </TouchableOpacity>
                                        <View style={{ width: 5 }}></View>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                                        <Text style={{ fontSize: totalSize(3), fontWeight: 'bold' }}>Forget Password</Text>
                                    </View>
                                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                                        <TextInput
                                            onChangeText={(value) => this.setState({ email: value })}
                                            placeholder='Email Address'
                                            placeholderTextColor='gray'
                                            keyboardType={'email-address'}
                                            value={this.state.email}
                                            style={{ marginHorizontal: width(2.5), height: height(6.5), alignSelf:"stretch",marginVertical: height(1), borderWidth: 1, borderRadius: 0, paddingLeft: width(4), borderColor: colors.appGreen, fontSize: totalSize(2) }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                                        <TouchableOpacity onPress={() => this.sendCode()} style={[styles.button, { height: height(6), width: width(40) }]}>
                                            <Text style={{ fontSize: totalSize(2), color: 'white' }}>Send</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }
                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.isModalVisibleResetPassword} // Send Code to Email
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    backdropOpacity={0.50}
                    onBackdropPress={this._toggleModalResetPassword}>
                    <View style={{ backgroundColor: colors.appLightGreen, height: height(60), width: width(95), alignSelf: 'center', borderRadius: 0 }}>
                        {
                            this.state.loadingResetPassword === true ?
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator color={colors.appGreen} size={totalSize(5)} />
                                </View>
                                :
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}>
                                        <TouchableOpacity onPress={this._toggleModalResetPassword} style={{ backgroundColor: 'Transparent', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }}>
                                            <Icon
                                                name='close' color='rgb(218,21,30)' />
                                        </TouchableOpacity>
                                        <View style={{ width: 5 }}></View>
                                    </View>
                                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                                        <Text style={{ fontSize: totalSize(1.5), fontWeight: 'bold', color: colors.appGray }}>We 've sent you verification code in your email address</Text>
                                        <Text style={{ fontSize: totalSize(1.4), fontWeight: 'normal', color: 'gray' }}>Please check your email and enter code below</Text>
                                    </View>
                                    <View style={{ flex: 1, backgroundColor: 'transparent', }}>
                                        <TextInput
                                            onChangeText={(value) => this.setState({ code: value })}
                                            placeholder='Enter Code Here'
                                            placeholderTextColor='gray'
                                            keyboardType={'email-address'}
                                            style={{ marginHorizontal: width(2.5), height: height(6), marginVertical: height(1), borderWidth: 1, borderRadius: 0, paddingLeft: width(4), borderColor: colors.appGreen, fontSize: totalSize(1.5) }}
                                        />
                                        <TextInput
                                            onChangeText={(value) => this.setState({ email: value })}
                                            placeholder='Email Address'
                                            placeholderTextColor='gray'
                                            keyboardType={'email-address'}
                                            value={this.state.email}
                                            style={{ marginHorizontal: width(2.5), height: height(6), marginVertical: height(1), borderWidth: 1, borderRadius: 0, paddingLeft: width(4), borderColor: colors.appGreen, fontSize: totalSize(1.5) }}
                                        />
                                        <TextInput
                                            onChangeText={(value) => this.setState({ newPassword: value })}
                                            placeholder='New Password'
                                            placeholderTextColor='gray'
                                            keyboardType={'visible-password'}
                                            //value={this.state.email}
                                            style={{ marginHorizontal: width(2.5), height: height(6), marginVertical: height(1), borderWidth: 1, borderRadius: 0, paddingLeft: width(4), borderColor: colors.appGreen, fontSize: totalSize(1.5) }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                                        <TouchableOpacity onPress={() => this.ResetPassword()} style={[styles.button, { height: height(6), width: width(40) }]}>
                                            <Text style={{ fontSize: totalSize(2), color: 'white' }}>Reset Password</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.isModalVisible}
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.50}
                    onBackdropPress={()=>this.setState({ isModalVisible: !this.state.isModalVisible })}
                    onBackButtonPress={()=>this.setState({ isModalVisible: !this.state.isModalVisible })}
                    >
                    <View style={{ backgroundColor: 'white', height: height(30), width: width(90), borderRadius: 5, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: 'rgb(86,194,2)', fontWeight: '600', marginVertical: 10 }}>Enter Your Verification Code</Text>
                        <TextInput
                            onChangeText={(value) => this.setState({ v_code: value })}
                            autoFocus={true}
                            placeholder='Enter Verification Code'
                            keyboardType='numeric'
                            returnKeyLabel='Send'
                            returnKeyType='send'
                            style={{ backgroundColor: '#f9f9f9', height: height(6), width: width(80), borderRadius: 3, borderWidth: 1, borderColor: 'gray', textAlign: 'center', fontSize: 16 }}
                        />
                        <TouchableOpacity style={{ height: height(6), width: width(40), backgroundColor: 'rgb(86,194,2)', marginVertical: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                            onPress={() => this.resendCode()}
                        >
                            <Text style={{ fontSize: 16, color: 'white' }}>Resend</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default Login;


const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    logo: {
        width: totalSize(15),
        height: totalSize(16)
    },
    TxtInputSchool: {
        width: width(70),
        height: height(6),
        fontSize: totalSize(1.5),
        color: 'rgb(86,194,2)',
    },
    lowerContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    txtContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: height(2),
    },
    welcome: {
        fontSize: totalSize(5),
        color: 'rgb(66,67,69)',
        fontWeight: 'bold',
    },
    instructions: {
        fontSize: totalSize(2),
        textAlign: 'center',
        color: 'rgb(66,67,69)',
    },
    btnTxtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTxt: {
        fontSize: totalSize(2.5),
        color: 'white',

    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    schoolInputContainer: {
        flexDirection: 'row',
        width: width(80),
        height: height(7),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 0.5,
        borderColor: 'rgb(86,194,2)'
    },
    button: {
        width: width(80),
        height: height(7),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(86,194,2)',
        marginVertical: height(5),
        elevation: 5
    },


});
