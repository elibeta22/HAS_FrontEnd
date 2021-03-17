import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Image } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import api from '../../lib/api';
import * as ImagePicker from 'react-native-image-picker';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import images from '../../Themes/Images';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const radio_props = [
{label: 'Student', value: 1 },
{label: 'Professor', value: 2 }
   ];
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department_predictions: [],
            school_predictions: [],
            loading_getSchools: false,
            loading_getDepartments: false,
            loading_code: false,
            isModalVisible: false,
            school_id: '',
            school: 'SCHOOL',
            department_id:'',
            department: 'DEPARTMENT',
            name: '',
            v_code: '',
            last_name: '',
            email: '',
            password: '',
            loading: false,
            camera: false,
            avatarSource: null,
            image: null,
            toggle:false,

        };
    }

userType() {


if(this.state.value == 2){
 return <View style={styles.schoolInputContainer}>
                            <Icon name='book' color='rgb(66,67,69)' type='font-awesome' size={totalSize(2)} />
                            <TextInput
                                onChangeText={(value) => this.getDepartment_predictions(value)}
                                placeholder={this.state.department}
                                placeholderTextColor='rgb(217,217,217)'
                                underlineColorAndroid='transparent'
                                style={styles.TxtInputSchool}
                            />
                        </View>
}
return null;

}
    static navigationOptions = {
        header: null
    }

    image_picker = () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, func = async (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                const source = { uri: response.uri };
                await this.setState({
                    camera: true,
                    avatarSource: { uri: response.uri, type: response.type, name: response.fileName },
                    image: { uri: response.uri, width: response.width, height: response.height }
                });

            }
        });
    }
    sendCode = async() => {
        this.setState({ loading_code: true })
        const formdata = new FormData();
        formdata.append('code', this.state.v_code);
        formdata.append('token', store.USER_TOKEN);
        await fetch('http://157.230.63.199/api/email/verify', {
            method: 'POST',
            body: formdata
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'success') {
                    this.setState({ isModalVisible: false, loading_code: false })
                    this.props.navigation.navigate('login')
                    Toast.show(responseJson.message)
                } else {
                    this.setState({ isModalVisible: false, loading_code: false })
                    Toast.show(responseJson.message)
                }
            })
            .catch((error)=>{
                this.setState({ isModalVisible: false, loading_code: false })
            })
    }
    SignUp = async () => {
        this.setState({ loading: true });
        const formdata = new FormData();
        const photo = this.state.avatarSource;
        formdata.append('school_id', this.state.school_id);
        formdata.append('name', this.state.name);
        formdata.append('email', this.state.email);
        formdata.append('password', this.state.password);
        formdata.append('user_type_id', this.state.value);
        formdata.append('department_id', this.state.department_id);

        if (this.state.avatarSource !== null) {
            formdata.append('image', photo);
        }

        await fetch('http://157.230.63.199/api/register', {
            method: 'POST',
            body: formdata
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ loading: false })
                if (responseJson.status === 'success') {

                    store.USER_TOKEN = responseJson.token;
                    Toast.show('You have been Registered successfully, Please enter verfication code.', Toast.LONG)
                    this.setState({ isModalVisible: true })
                    this.setState({
                        school: '',
                        school_id: '',
                        name: '',
                        email: '',
                        password: '',
                        image: null,
                        avatarSource: null,
                        value: '',
                        department_id: '',
                        department: ''
                    })
                } else {
                    Toast.show(responseJson.message, Toast.LONG)
                    alert(responseJson.message)
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                this.setState({ loading: false })
            });
    }

        getDepartment_predictions = async (query) => {

            this.setState({ loading_getDepartments: true })
            if (query.length >= 3) {
                try {
                    fetch('http://157.230.63.199/api/departments/search?query=' + '&query=' + query)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.status === 'success') {
                                this.state.department_predictions = responseJson.departments;
                                this.setState({ loading_getDepartments: false })
                            } else {
                                Toast.show('There is no school found')
                            }
                        })
                } catch (error) {

                }
            } else {
                this.state.department_predictions = [];
                this.setState({ loading_getDepartments: false })
            }
        }

    getDepartment(department) {
        this.setState({
            department: department.department_name,
            department_id: department.id,
        })
        this.setState({ department_predictions: [] })

    }

    getSchool_predictions = async (query) => {

        this.setState({ loading_getSchools: true })
        if (query.length >= 3) {
            try {
                fetch('http://157.230.63.199/api/schools/search?query=' + '&query=' + query)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.warn('Predictions', responseJson);
                        if (responseJson.status === 'success') {
                            this.state.school_predictions = responseJson.schools;
                            this.setState({ loading_getSchools: false })
                        } else {
                            Toast.show('There is no school found')
                        }
                    })
            } catch (error) {

            }
        } else {
            this.state.school_predictions = [];
            this.setState({ loading_getSchools: false })
        }
    }
    getSchool(school) {
        this.setState({
            school: school.school_name,
            school_id: school.id,
        })
        this.setState({ school_predictions: [] })

    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.lowerContainer}>
                <Image source={images.logo} style={styles.logo} />
                        <View style={[styles.txtContainer, {}]}>
                            <Text style={[styles.welcome, { fontSize: totalSize(4) }]}>Sign Up</Text>
                        </View>

                        <View style={[styles.txtContainer, { flexDirection: 'row' }]}>
                            <Text style={[styles.welcome, { fontSize: totalSize(1.5), fontWeight: 'normal' }]}>ALREADY HAVE AN ACCOUNT? </Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
                                <Text style={[styles.welcome, { fontSize: totalSize(1.5), color: 'rgb(86,194,2)', fontWeight: 'normal' }]}>LOGIN!</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.schoolInputContainer}>
                            <Icon name='university' color='rgb(66,67,69)' type='font-awesome' size={totalSize(2)} />
                            <TextInput
                                onChangeText={(value) => this.getSchool_predictions(value)}
                                placeholder={this.state.school}
                                placeholderTextColor='rgb(217,217,217)'
                                underlineColorAndroid='transparent'
                                style={styles.TxtInputSchool}
                            />
                        </View>
                        {
                            this.state.loading_getSchools === true ?
                                <ActivityIndicator size={'small'} color='rgb(180,210,53)' />
                                :
                                null
                        }
                        {
                            this.state.school_predictions.length > 0 ?

                                <View style={{ width: width(80), backgroundColor: 'white', elevation: 5, }}>
                                    {
                                        this.state.school_predictions.map((item, key) => {
                                            return (
                                                <TouchableOpacity key={key} style={{ marginHorizontal: 5, borderBottomWidth: 0.4, borderColor: 'gray', elevation: 0 }}
                                                    onPress={() => {
                                                        this.getSchool(item)
                                                    }}
                                                >
                                                    <Text style={{ fontSize: totalSize(1.6), color: 'black', marginVertical: 10 }}>{item.school_name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                                :
                                null
                        }
                        <View style={styles.schoolInputContainer}>
                            <Icon name='person' size={totalSize(2.5)} color='rgb(66,67,69)' />
                            <TextInput
                                onChangeText={(value) => this.setState({ name: value })}
                                placeholder='FULL NAME'
                                placeholderTextColor='rgb(217,217,217)'
                                underlineColorAndroid='transparent'
                                style={styles.TxtInputSchool}
                            />
                        </View>
                        <View style={styles.schoolInputContainer}>
                            <Icon name='email' size={totalSize(2.5)} color='rgb(66,67,69)' />
                            <TextInput
                                onChangeText={(value) => this.setState({ email: value })}
                                placeholder='EMAIL'
                                keyboardType='email-address'
                                onFocus={() => alert('Please enter a valid email address. A unique email verification code will be send to your email that you need to enter for verification later')}
                                placeholderTextColor='rgb(217,217,217)'
                                underlineColorAndroid='transparent'
                                style={styles.TxtInputSchool}
                            />
                        </View>
                        <View style={styles.schoolInputContainer}>
                            <Icon name='lock' size={totalSize(2.5)} color='rgb(66,67,69)' />
                            <TextInput
                                onChangeText={(value) => this.setState({ password: value })}
                                placeholder='PASSWORD'
                                placeholderTextColor='rgb(217,217,217)'
                                underlineColorAndroid='transparent'
                                secureTextEntry={true}
                                style={styles.TxtInputSchool}
                            />
                        </View>
                        <View style={styles.schoolInputContainer}>
                            <RadioForm
                                radio_props={radio_props}
                                formHorizontal={true}
                                buttonColor={'rgb(86,194,2)'}
                                initial={-1}
                                buttonSize={8}
                                labelStyle={{marginRight: 20,}}
                                selectedButtonColor = 'rgb(86,194,2)'
                                onPress={(value)=>{this.setState({value:value})}}

                             />
                        </View>
                        <Text>
                          { this.userType() }
                        {
                                                    this.state.loading_getDepartments === true ?
                                                        <ActivityIndicator size={'small'} color='rgb(180,210,53)' />
                                                        :
                                                        null
                                                }

                        </Text>
{
                                                    this.state.department_predictions.length > 0 ?

                                                        <View style={{ width: width(80), backgroundColor: 'white', elevation: 5, }}>
                                                            {
                                                                this.state.department_predictions.map((item, key) => {
                                                                    return (
                                                                        <TouchableOpacity key={key} style={{ marginHorizontal: 5, borderBottomWidth: 0.4, borderColor: 'gray', elevation: 0 }}
                                                                            onPress={() => {
                                                                                this.getDepartment(item)
                                                                            }}
                                                                        >
                                                                            <Text style={{ fontSize: totalSize(1.6), color: 'black', marginVertical: 10 }}>{item.department_name}</Text>
                                                                        </TouchableOpacity>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                        :
                                                        null
                                                }
                        <View style={[styles.txtContainer, { flexDirection: 'row', width: width(80), height: height(8), justifyContent: 'flex-start', backgroundColor: 'transparent', marginVertical: 0 }]}>
                            <TouchableOpacity style={[styles.buttonSmall, { backgroundColor: 'rgb(86,194,2)', borderRadius: 3 }]} onPress={() => this.image_picker()} >
                                <Text style={[styles.welcome, { fontSize: totalSize(1), color: 'white', marginHorizontal: 10 }]}>Upload Image</Text>
                            </TouchableOpacity>
                            <View style={{ width: width(2) }}></View>
                            {
                                this.state.image === null ?
                                    <Text style={[styles.instructions, { fontSize: totalSize(1), color: 'rgb(217,217,217)' }]}>No file selected</Text>
                                    :
                                    <Image source={this.state.image} style={{ height: totalSize(5), width: totalSize(5) }} />
                            }
                        </View>



                        <View style={styles.btnContainer}>

                            <TouchableOpacity style={styles.button} onPress={() => this.SignUp()}>
                                {
                                    this.state.loading === true ?
                                        <ActivityIndicator size={'small'} color='white' />
                                        :
                                        <View style={styles.btnTxtContainer}>
                                            <Text style={styles.btnTxt}>Signup</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>

                <Modal
                    isVisible={this.state.isModalVisible}
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.50}>
                    <View style={{ backgroundColor: 'white', height: height(30), width: width(90), borderRadius: 5,alignSelf: 'center', alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color:'rgb(86,194,2)', fontWeight:'600', marginVertical: 10 }}>Enter Your Verification Code</Text>
                        <TextInput
                            onChangeText={(value)=>this.setState({ v_code: value })}
                            autoFocus={true}
                            placeholder='Enter Verification Code'
                            keyboardType='numeric'
                            returnKeyLabel='Send'
                            returnKeyType='send'
                            style={{ backgroundColor:'#f9f9f9',height: height(6.5), width: width(80), borderRadius: 3, borderWidth: 1, borderColor: 'gray', textAlign:'center', fontSize: 12 }}
                            />
                        <TouchableOpacity style={{ height: height(6), width: width(40), backgroundColor:'rgb(86,194,2)', marginVertical: 20,justifyContent:'center', alignItems:'center', borderRadius: 5 }}
                            onPress={()=>this.sendCode()}
                        >
                            <Text style={{ fontSize: 16, color:'white' }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default SignUp;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(66,67,69)'

    },
    searchContainer: {
        width: width(90),
        height: height(6),
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
        marginVertical: height(1),
        borderRadius: 25,
        flexDirection: 'row'
    },
    logo: {
        marginVertical: height(2),
        height: totalSize(16),
        width: totalSize(15)
    },
    TxtInput: {
        width: width(70),
        height: height(8),
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'white',
        fontSize: totalSize(2.5),
        color: 'rgb(217,217,217)'
    },
    TxtInputSchool: {
        width: width(70),
        height: height(6),
        fontSize: totalSize(1.5),
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
        height: height(6),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height(1),
        borderWidth: 0.5,
        borderColor: 'rgb(86,194,2)',

    },
    button: {
        width: width(80),
        height: height(6),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(86,194,2)',
        marginVertical: height(5),
        elevation: 5

    },
    buttonSmall: {
        height: height(3),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(66,67,69)',
    },
    PickerStyle: {
        width: width(75),
        height: height(8),
        fontSize: totalSize(2.5),
        color: 'rgb(66,67,69)'
    },
});
