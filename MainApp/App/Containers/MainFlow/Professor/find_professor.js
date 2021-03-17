import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Picker, ActivityIndicator } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import store from '../../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import api from '../../../lib/api'
import colors from '../../../Themes/Colors';
class FindProfessor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchOption: false,
            professor: 'PROFESSOR NAME',
            school: 'SCHOOL NAME',
            school_predictions: [],
            department_predictions: [],
            professors_List: [],
            school_id: '',
            loading_getSchools: false,
            loading_getDepartments: false,
            loading_search: false,
            Is_school_selected: false,
            department_id:'',
            department: 'DEPARTMENT',
            loading_department: false,
            loading_getProfessors_by_department: false
        };
    }

    static navigationOptions = {
        title: 'Search Professor',
        headerStyle: {
            backgroundColor: 'rgb(66,67,69)',

        },
        headerTintColor: colors.appGreen,
        headerTitleStyle: {
            fontSize: totalSize(2),
            textAlign: 'center'
        }
    }
    searchByName() {
        this.setState({ searchOption: false })
    }
    searchBySchool() {
        this.setState({ searchOption: true })

    }

    getDepartments = async (id) => {
        this.setState({ loading_department: true, school_id: id })
        fetch('http://157.230.63.199/api/schools/' + id + '/departments')
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'success') {
                    this.setState({ departments: responseJson.school_departments })
                    this.setState({ loading_department: false })
                    console.warn('departments==>', this.state.departments)
                } else {
                    this.setState({ loading_department: false })
                    Toast.show('There is no department found')
                }
            })
    }

    getProfessors_by_department = async () => {

        this.setState({ loading_getProfessors_by_department: true })
        await fetch('http://157.230.63.199/api/professors/search?' + 'by_department=' + 1 + '&school_id=' + this.state.school_id + '&department_id=' + this.state.department_id)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'success') {
                    store.PROFESSORS_LIST = responseJson.professors
                    this.setState({ loading_getProfessors_by_department: false })
                    this.props.navigation.navigate('professorsList')
                } else {
                    this.setState({ loading_getProfessors_by_department: false })
                }
            })

    }

    searchProfessor() {
        if (this.state.searchOption === false) {
            if (this.state.professor !== 'PROFESSOR NAME') {
                this.props.navigation.navigate('professorDeteail')
            } else {
                Toast.show('School or Professor is not selected')
            }
        } else {
            if (this.state.school_id.length !== 0 && this.state.department_id.length !== 0) {
                this.getProfessors_by_department()
            } else {
                Toast.show('School or Department is not selected')
            }
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

    getSchool = async (school) => {
        await this.setState({
            school: school.school_name,
            school_predictions: [],
            school_id: school.id,
        })
        if (school.id !== 0) {
            await fetch('http://157.230.63.199/api/schools/' + school.id)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status === 'success') {
                        store.SCHOOL = responseJson;
                        this.setState({ Is_school_selected: true })
                    } else {
                        Toast.show('There is no school found')
                    }
                })
        } else {
            store.SCHOOL = {};
        }

    }

    getProfessors_predictions = async () => {
        if (this.state.Is_school_selected === true) {
            await this.setState({ professors_List: store.SCHOOL.school.professors })
            if (this.state.professors_List.length === 0) {
                Toast.show('No Professor found in this school', Toast.LONG)
            }
        } else {
            Toast.show('Please Select a School', Toast.LONG)
        }
    }

    getProfessor = async (professor) => {
        this.setState({
            professor: professor.professor_name,
            professors_List: [],
            loading_search: true,
        })
        if (professor.id !== 0) {
            fetch('http://157.230.63.199/api/professors/' + professor.id)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status === 'success') {
                        store.PROFESSOR = responseJson;
                        this.props.navigation.navigate('professorDetail')
                        this.setState({ loading_search: false })
                    } else {
                        this.setState({ loading_search: false })
                        Toast.show('There is no school found')
                    }
                })
        } else {
            store.SCHOOL = {};
            this.setState({ loading_search: false })
        }
    }

     getDepartment_predictions = async (query) => {


                this.setState({ loading_getDepartments: true })
                if (query.length >= 3) {
                    try {
                        fetch('http://157.230.63.199/api/departments/search?query=' + '&query=' + query)
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.warn('Predictions', responseJson);
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


    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loading_search === true ?
                        <View style={styles.container}>
                            <View style={[styles.container, { position: 'absolute' }]}>
                                <Icon name='school' color={colors.appGreen} size={totalSize(3)} />
                            </View>
                            <ActivityIndicator size={totalSize(10)} color='gray' />
                        </View>
                        :
                        <ScrollView>
                            <View style={styles.lowerContainer}>
                                <View style={{ flex: 1, width: width(95), alignItems: 'center', }}>
                                    <View style={[styles.txtContainer, {}]}>
                                        <Text style={[styles.welcome, { fontSize: totalSize(4) }]}>Search a Professor</Text>
                                    </View>
                                    <View style={[styles.txtContainer, {}]}>
                                        <Text style={[styles.welcome, { fontSize: totalSize(4), color: colors.appGreen }]}>BY</Text>
                                    </View>
                                    <View style={[styles.txtContainer, { flexDirection: 'row', backgroundColor: 'transparent' }]}>
                                        {/* <Text style={[styles.welcome, { fontSize: totalSize(1.5) }]}>SEARCH  BY</Text> */}
                                        <TouchableOpacity style={this.state.searchOption === false ? [styles.buttonSmall, { backgroundColor: colors.appGreen }] : styles.buttonSmall} onPress={() => this.searchByName()}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginHorizontal: 10, marginVertical: 5 }}>
                                                <View style={{ width: totalSize(4), height: totalSize(4), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: 'white', marginHorizontal: 5, marginVertical: 5 }}>
                                                    <Icon name='user' type='font-awesome' color={colors.appGray} size={totalSize(2)} />
                                                </View>
                                                <Text style={[styles.welcome, { fontSize: totalSize(1.8), color: 'white' }]}>NAME</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ width: width(2) }}></View>
                                        <TouchableOpacity style={this.state.searchOption === true ? [styles.buttonSmall, { backgroundColor: colors.appGreen }] : [styles.buttonSmall, {}]} onPress={() => this.searchBySchool()}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginHorizontal: 10, marginVertical: 5 }}>
                                                <View style={{ width: totalSize(4), height: totalSize(4), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: 'white', marginHorizontal: 5, marginVertical: 5 }}>
                                                    <Icon name='university' type='font-awesome' color={colors.appGray} size={totalSize(1.5)} />
                                                </View>
                                                <Text style={[styles.welcome, { fontSize: totalSize(2), color: 'white' }]}>SCHOOL</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.txtContainer}>
                                        <Text style={[styles.welcome, { fontSize: totalSize(2), fontWeight: 'normal' }]}>I'm searching for a professor</Text>
                                        <Text style={[styles.welcome, { fontSize: totalSize(2), fontWeight: 'normal' }]}>at</Text>
                                    </View>
                                    <View style={styles.schoolInputContainer}>
                                        <TextInput
                                            onChangeText={(value) => this.getSchool_predictions(value)}
                                            placeholder={this.state.school}
                                            placeholderTextColor='rgb(217,217,217)'
                                            //placeholderTextColor='gray'
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
                                    {
                                        this.state.searchOption === false ?
                                            <View>
                                                <View style={styles.txtContainer}>
                                                    <Text style={[styles.welcome, { fontSize: totalSize(2), fontWeight: 'normal' }]}>named</Text>
                                                </View>
                                                <View style={styles.schoolInputContainer}>
                                                    <TextInput
                                                        onFocus={() => this.getProfessors_predictions()}
                                                        onChangeText={(value) => this.getProfessors_predictions()}
                                                        placeholder={this.state.professor}
                                                        placeholderTextColor='rgb(217,217,217)'
                                                        underlineColorAndroid='transparent'
                                                        style={styles.TxtInputSchool}
                                                    />
                                                </View>
                                                {
                                                    this.state.professors_List.length > 0 ?

                                                        <View style={{ width: width(90), backgroundColor: 'white', elevation: 5 }}>
                                                            <ScrollView>
                                                                {
                                                                    this.state.professors_List.map((item, key) => {
                                                                        return (
                                                                            <TouchableOpacity key={key} style={{ marginHorizontal: 5, borderBottomWidth: 0.4, borderColor: 'gray', elevation: 0 }}
                                                                                onPress={() => {
                                                                                    this.getProfessor(item)
                                                                                }}
                                                                            >
                                                                                <Text style={{ fontSize: totalSize(1.6), color: 'black', marginVertical: 10 }}>{item.professor_name}</Text>
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
                                                    <Text style={[styles.welcome, { fontSize: totalSize(2), fontWeight: 'normal' }]}>in the</Text>
                                                </View>
                                                <View style={styles.schoolInputContainer}>

                                                <TextInput
                                                onChangeText={(value) => this.getDepartment_predictions(value)}
                                                placeholder={this.state.department}
                                                placeholderTextColor='rgb(217,217,217)'
                                                underlineColorAndroid='transparent'
                                                style={styles.TxtInputSchool}
                                                />

                                                </View>
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
                                            </View>
                                    }

                                    <View style={styles.btnContainer}>

                                        <TouchableOpacity style={styles.button} onPress={() => this.searchProfessor()}>
                                            <View style={styles.btnTxtContainer}>
                                                {
                                                    this.state.loading_getProfessors_by_department === true ?
                                                        <ActivityIndicator color='white' />
                                                        :
                                                        <Text style={styles.btnTxt}>Search</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                }

            </View>
        );
    }
}

export default FindProfessor;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

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
        fontSize: totalSize(2.5),
        color: 'rgb(217,217,217)'
    },
    TxtInputSchool: {
        fontSize: totalSize(3),
        color: colors.appGreen,
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
        width: width(4),
        height: height(8),
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 6,
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.appGreen,
        transform: [
            { rotate: '180deg' }
        ],
        bottom: height(0.1)
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'black'
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
        marginVertical: height(8),
        elevation: 5

    },
    buttonSmall: {
        backgroundColor: 'rgb(66,67,69)',
        borderRadius: 50
    },
    PickerStyle: {
        width: width(75),
        height: height(8),
        color: 'rgb(66,67,69)'
    },
});
