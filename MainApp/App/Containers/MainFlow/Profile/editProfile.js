import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, TextInput, ImageBackground,ScrollView } from 'react-native';

import styles from '../../Styles/editeProfileStyles'
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast'
import store from '../../../Stores/orderStore';
import { Icon } from 'react-native-elements'
import { observer } from 'mobx-react'
import colors from '../../../Themes/Colors';
import { totalSize } from 'react-native-dimension';
class EditProfile extends Component {
    static navigationOptions = {
        title: 'Edit Profile',
        headerTitleStyle: {
            color: colors.appGreen,
            fontSize: 16,
        },
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: '',
            Password: '',
            image: null,
            avatarSource: null,
            camera: false,
        };
    }
    image_picker = () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, func = async (response) => {

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
    componentWillMount() {
        let data = store.USER_LOGIN
        this.setState({
            name: data.name
        })
    }
    editeProfile = async () => {
       this.setState({ loading: true });
        const formdata = new FormData();
        const photo = this.state.avatarSource;
        formdata.append('name', this.state.name);
        if (this.state.avatarSource !== null) {
            formdata.append('image', photo);
        }
        if (this.state.Password.length !== 0) {
            formdata.append('password', this.state.Password);
        }
        formdata.append('token', store.USER_TOKEN);
        console.warn('formdata===>', formdata);
        await fetch('http://157.230.63.199/api/professors/update-profile', {
            method: 'POST',
            body: formdata
        }).then((response) => response.json())
            .then(func = async (responsejson) => {
                if (responsejson.status === "success") {
                    store.USER_LOGIN = responsejson.user;
                    this.setState({ loading: false })
                    Toast.show(responsejson.message, Toast.LONG);
                    if(this.state.Password.length===0){
                        this.props.navigation.push('profile');
                    }else{
                        this.props.navigation.replace('login');
                    }
                }

            }).catch((error) => {

                this.setState({ loading: false })
            });

    }
    render() {
        return (
            <ImageBackground style={styles.Container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.topContainer}>
                        <View style={styles.pfContainer}>
                            <Image source={this.state.image === null ? { uri: store.USER_LOGIN.image } : this.state.image} style={styles.profileImage} />
                            <TouchableOpacity onPress={this.image_picker}>
                                <Icon name='camera' type='entypo' color='gray' size={totalSize(4)} />
                            </TouchableOpacity>
                        </View>
                        <View >
                            <Text style={styles.formTxt}>Your Name</Text>
                            <TextInput
                                onChangeText={(value) => this.setState({ name: value })}
                                value={this.state.name}
                                placeholderTextColor='rgb(183,179,179)'
                                style={styles.inputName}
                            />
                        </View>
                    </View>
                    <View style={styles.txtContainer}>
                        <Text style={styles.formTxt}>Email Adress</Text>
                        <TextInput
                            editable={false}
                            placeholder={store.USER_LOGIN.email}
                            placeholderTextColor='rgb(183,179,179)'
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.txtContainer}>
                        <Text style={[styles.formTxt, { color: 'rgb(218,21,30)', fontWeight: 'normal' }]}>*If you want to change the password then enter a new password below</Text>
                        <Text style={styles.formTxt}>New Password</Text>
                        <TextInput
                            onChangeText={(value) => this.setState({ Password: value })}
                            editable={true}
                            placeholder='*******'
                            placeholderTextColor='rgb(183,179,179)'
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.btn} onPress={this.editeProfile}>
                            {
                                this.state.loading === true ?
                                    <ActivityIndicator size='small' color='white' />
                                    :
                                    <Text style={styles.btnTxt}>Update Profile</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

export default EditProfile;


