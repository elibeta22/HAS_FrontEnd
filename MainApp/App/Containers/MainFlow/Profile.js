import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import store from '../../Stores/orderStore'
import { Header } from 'react-navigation';
import colors from '../../Themes/Colors';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsRerender: false
        };
    }

    static navigationOptions = {
        title: 'Profile',
        headerStyle: {
            backgroundColor: 'rgb(66,67,69)',
            //height:height(5)
        },
        headerTintColor: colors.appGreen,
        headerTitleStyle: {
            fontSize: totalSize(2),
            //textAlign: 'center'
        }
    }

    componentDidMount = () => {
        // setInterval(() => {
        //     this.TokenRefresh_Validation()
        // }, 15000);
        this._onFocusListener = this.props.navigation.addListener('didFocus', async (payload) => {
            await this.Rerender()
        });
    }

    Rerender() {
        this.setState({ IsRerender: !this.state.IsRerender })
    }

    goToDocuments() {
        store.professorData = false
        this.props.navigation.navigate('myDocuments')
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.uperContainer}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('editProfile')} style={{ width: totalSize(6), height: totalSize(6), backgroundColor: 'transparent', borderRadius: 100, alignItems: 'center', justifyContent: 'center', marginTop: 5, marginRight: 5 }}>
                        <Icon name='pencil' color={'white'} size={totalSize(4)} type='material-community' />
                    </TouchableOpacity>
                </View>
                <View style={styles.lowerContainer}>
                    <TouchableOpacity style={styles.button2} onPress={() => this.goToDocuments()}>
                        <View style={{ width: totalSize(7), height: totalSize(7), backgroundColor: colors.appGreen, alignItems: 'center', justifyContent: 'center', borderRadius: 100, marginHorizontal: width(2) }}>
                            <Icon name='note-text' color='rgb(66,67,69)' size={totalSize(4)} type='material-community' />
                        </View>
                        <View>
                            <Text style={[styles.welcome, { fontSize: totalSize(2) }]}>My Documents </Text>
                            <Text style={[styles.instructions, { fontSize: totalSize(1), color: 'gray' }]}>Manage your files and images </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Icon name='arrow-right' color='rgb(66,67,69)' size={totalSize(3)} type='simple-line-icon' />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.imageContainer}>
                    <Image source={store.USER_LOGIN.image === null ? require('../../Images/stylish-boy-whatsapp-dp-500x570.jpg') : { uri: store.USER_LOGIN.image }} style={styles.imageProfile} />
                    <Text style={[styles.welcome, { fontSize: totalSize(3) }]}>{store.USER_LOGIN.professors[0].professor_name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name='email' size={totalSize(1.5)} color='gray' />
                        <Text style={[styles.welcome, { fontSize: totalSize(1.5), fontWeight: 'normal', color: 'gray', left: 2 }]}>{store.USER_LOGIN.email}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //width: null,
        //height: null,
        //justifyContent: 'center',
        //alignItems: 'center',
        //backgroundColor: 'rgb(66,67,69)',
        //backgroundColor: 'rgb(180,210,53)',
        backgroundColor: colors.appGreen


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
    uperContainer: {
        flex: 0.25,
        flexDirection: 'row',
        //width: width(100),
        //height: null,
        //justifyContent: 'center',
        justifyContent: 'flex-end',
        //backgroundColor: 'rgb(0,173,238)'
        //backgroundColor:'rgb(180,210,53)'
        //backgroundColor:'rgb(217,217,217)'
        //backgroundColor: 'red',
        //marginTop: height(2),

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
        backgroundColor: 'rgb(245,245,238)',
        // marginTop: height(20),

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
        fontSize: totalSize(1.5),
        textAlign: 'center',
        color: 'rgb(217,217,217)',
        marginBottom: 5,
    },
    btnTxtContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    btnTxt: {
        fontSize: totalSize(1.5),
        //color: 'white',
        //color: 'rgb(66,67,69)',
        fontWeight: 'normal',
        color: 'gray'
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },

    button: {
        width: width(40),
        height: height(15),
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'rgb(180,210,53)',
        marginVertical: height(1),
        elevation: 2,
        //backgroundColor: 'rgb(245,245,238)',
        borderRadius: 5,
        backgroundColor: 'white',
        // borderWidth: 1,

    },
    button2: {
        width: width(90),
        height: height(10),
        alignItems: 'center',
        //justifyContent: 'flex-start',
        //backgroundColor: 'rgb(180,210,53)',
        marginVertical: height(1),
        //elevation: 2,
        //backgroundColor: 'red',
        //borderRadius: 5,
        //backgroundColor: 'white',
        // borderWidth: 1,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: 'rgb(66,67,69)'

    },
    imageContainer: {
        //flex:1,
        width: width(100),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        marginTop: height(5),
        // backgroundColor:'black'
    },
    imageProfile: {
        height: totalSize(20),
        width: totalSize(20),
        borderRadius: 100,
    }
});
