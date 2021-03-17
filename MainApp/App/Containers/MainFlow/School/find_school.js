import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Picker, ActivityIndicator, ScrollView } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import { Header } from 'react-navigation';
import store from '../../../Stores/orderStore';
import api from '../../../lib/api'
import Toast from 'react-native-simple-toast'
import colors from '../../../Themes/Colors';


class FindSchool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchOption: false,
            school_predictions: [],
            loading_getSchools: false,
            loading_search: false,
            school_id: '',
            school: 'SCHOOL NAME',
            states: [],
            state_code: '',
            loading_states: false
        };
    }

    static navigationOptions = {
        title: 'Search School',
        headerStyle: {
            backgroundColor: 'rgb(66,67,69)',
        },
        headerTintColor: colors.appGreen,
        headerTitleStyle: {
            fontSize: totalSize(2),
            textAlign: 'center'
        }
    }
    searchByName = async () => {
        this.setState({ searchOption: false })
    }

    searchByLocation = async () => {
        this.setState({
            searchOption: true,
        })
        if (this.state.states.length === 0) {
            this.setState({
                loading_states: true
            })
            let response = await api.get('states')
            if (response.status === 'success') {
                await this.setState({ states: response.states })
                this.setState({ loading_states: false })
                console.warn(this.state.states)
            } else {
                this.setState({ loading_states: false })
            }
        }

    }
    searchSchool() {
        if (this.state.searchOption === false) {
            if (this.state.school !== 'SCHOOL NAME') {
                this.props.navigation.navigate('schoolDetails')
            } else {
                Toast.show('Please Select a School')
            }
        } else {
            if (this.state.state_code !== '') {
                this.getSchool_By_Location()
            } else {
                Toast.show('Please Select a State')
            }
        }
    }
    getSchool_By_Location = async () => {
        this.setState({ loading_search: true })
        if (this.state.state_code.length > 0) {

            fetch('http://157.230.63.199/api/schools/search?location=' + '&location=' + this.state.state_code)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status === 'success') {
                        store.SCHOOLS_LIST = responseJson.schools;
                        this.setState({ loading_search: false })
                        this.props.navigation.navigate('schoolList')
                        console.warn('Schools List==>', store.SCHOOLS_LIST)
                    } else {
                        this.setState({ loading_search: false })
                        Toast.show('There is no school found')
                    }
                })
        } else {
            Toast.show('Please Select State', Toast.LONG)
        }
    }
    getSchool_predictions = async (query) => {
        this.setState({ loading_getSchools: true })
        if (query.length >= 3) {
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
        } else {
            this.state.school_predictions = [];
            this.setState({ loading_getSchools: false })
        }
    }
    getSchool(school) {
        this.setState({ loading_search: true })
        this.setState({
            school: school.school_name,
            school_predictions: []
        })
        if (school.id.length !== 0) {
            fetch('http://157.230.63.199/api/schools/' + school.id)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.warn('Predictions', responseJson);
                    if (responseJson.status === 'success') {

                        store.SCHOOL = responseJson;

                        this.setState({ loading_search: false })
                        this.props.navigation.navigate('schoolDetails')

                    } else {
                        this.setState({ loading_search: false })
                        Toast.show('There is no school found')
                    }
                })
        } else {
            store.SCHOOL = {};
            Toast.show('Invalid school id')
            this.setState({ loading_search: false })
        }

    }
    render() {
        return (
            <View style={styles.container}>

                <View style={styles.lowerContainer}>
                    <View style={{ flex: 1, width: width(95), alignItems: 'center' }}>
                        <View style={[styles.txtContainer, {}]}>
                            <Text style={[styles.welcome, { fontSize: totalSize(4) }]}>Search a School</Text>
                        </View>
                        <View style={[styles.txtContainer, {}]}>
                            <Text style={[styles.welcome, { fontSize: totalSize(4), color: colors.appGreen }]}>BY</Text>
                        </View>
                        <View style={[styles.txtContainer, { flexDirection: 'row', backgroundColor: 'transparent' }]}>
                            <TouchableOpacity style={this.state.searchOption === false ? [styles.buttonSmall, { backgroundColor: colors.appGreen }] : styles.buttonSmall} onPress={() => this.searchByName()}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginHorizontal: 10, marginVertical: 5 }}>
                                    <View style={{ width: totalSize(4), height: totalSize(4), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: 'white', marginHorizontal: 5, marginVertical: 5 }}>
                                        <Icon name='university' type='font-awesome' color={colors.appGray} size={totalSize(1.5)} />
                                    </View>
                                    <Text style={[styles.welcome, { fontSize: totalSize(1.8), color: 'white' }]}>NAME</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: width(2) }}></View>
                            <TouchableOpacity style={this.state.searchOption === true ? [styles.buttonSmall, { backgroundColor: colors.appGreen }] : [styles.buttonSmall, {}]} onPress={() => this.searchByLocation()}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginHorizontal: 10, marginVertical: 5 }}>
                                    <View style={{ width: totalSize(4), height: totalSize(4), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: 'white', marginHorizontal: 5, marginVertical: 5 }}>
                                        <Icon name='location-pin' type='entypo' color={colors.appGray} size={totalSize(2.5)} />
                                    </View>
                                    <Text style={[styles.welcome, { fontSize: totalSize(2), color: 'white' }]}>LOCATION</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.searchOption === false ?
                                <View style={{ alignItems: 'center' }}>
                                    <View style={[styles.schoolInputContainer, { marginVertical: height(1) }]}>
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
                                            <ActivityIndicator size={'small'} color={colors.appGreen} />
                                            :
                                            null
                                    }
                                    {
                                        this.state.school_predictions.length > 0 ?

                                            <View style={{ width: width(90), backgroundColor: 'white', elevation: 5 }}>
                                                <ScrollView>
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
                                                </ScrollView>
                                            </View>
                                            :
                                            null
                                    }
                                </View>
                                :
                                <View>
                                    <View style={styles.txtContainer}>
                                        <Text style={[styles.welcome, { fontSize: totalSize(2), fontWeight: 'normal' }]}>I'm looking for a school</Text>
                                        <Text style={[styles.welcome, { fontSize: totalSize(2), fontWeight: 'normal' }]}>in</Text>
                                    </View>
                                    <View style={styles.schoolInputContainer}>
                                        {
                                            this.state.loading_states === true ?
                                                <ActivityIndicator color={colors.appGreen} size={'small'} />
                                                :
                                                <Picker
                                                    mode='dropdown'
                                                    selectedValue={this.state.state_code}
                                                    style={styles.PickerStyle}
                                                    onValueChange={(itemValue, itemIndex) => this.setState({ state_code: itemValue })}>
                                                    <Picker.Item label={'Select State'} value={''} />
                                                    {
                                                        this.state.states.map((item, key) => {
                                                            return (
                                                                <Picker.Item key={key} label={item.state} value={item.code} />
                                                            )
                                                        })
                                                    }
                                                </Picker>
                                        }
                                    </View>
                                </View>
                        }
                        <View style={styles.txtContainer}>
                            <Text style={styles.instructions}>Looking for a professor by</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.instructions}>School/department?</Text>
                                <Text style={[styles.instructions, { color: colors.appGreen }]} onPress={() => this.props.navigation.navigate('findProfessor')}> Click here</Text>
                            </View>
                        </View>
                        <View style={styles.btnContainer}>

                            <TouchableOpacity style={styles.button} onPress={() => this.searchSchool()}>
                                <View style={styles.btnTxtContainer}>
                                    {
                                        this.state.loading_search === true ?
                                            <ActivityIndicator color='white' />
                                            :
                                            <Text style={styles.btnTxt}>Search</Text>
                                    }
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.txtContainer}>
                            <Text style={[styles.instructions, { color: colors.appGreen }]} onPress={()=>this.props.navigation.goBack()} >CANCEL</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default FindSchool;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
        alignItems: 'center',
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
    TxtInput: {
        width: width(75),
        height: height(8),
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'white',
        fontSize: totalSize(2.5),
        color: 'rgb(217,217,217)'
    },
    PickerStyle: {
        width: width(75),
        height: height(8),
        color: 'rgb(66,67,69)'
    },
    TxtInputSchool: {
        fontSize: totalSize(2.5),
        color: colors.appGreen
    },
    lowerContainer: {
        flex: 1,
        width: width(100),
        alignItems: 'center',
        backgroundColor: 'rgb(245,245,238)'
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
        fontSize: totalSize(1.5),
        textAlign: 'center',
        color: 'rgb(66,67,69)',
        fontWeight: 'normal'
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
        width: width(90),
        height: height(8),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appLightGreen,
    },
    button: {
        width: width(90),
        height: height(8),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appGreen,
        marginVertical: height(3),
        elevation: 5

    },
    buttonSmall: {
        backgroundColor: 'rgb(66,67,69)',
        borderRadius: 50
    }
});
