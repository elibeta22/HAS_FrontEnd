import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import store from '../../../Stores/orderStore';
import Loading_School from './loading_school'
import colors from '../../../Themes/Colors';

class SchoolList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools_state: '',
            loading_search: false,
            professors: [
                { id: 1, name: 'School of Exelense', address: 'NEW YORK,NY,UNITED STATES', rating: '5.0' },
                { id: 2, name: 'New  Brain School of Scienses', address: 'NEW YORK,NY,UNITED STATES', rating: '3.1' },
                { id: 3, name: 'Universirt at Lahore', address: 'NEW YORK,NY,UNITED STATES', rating: '4.5' },
                { id: 4, name: 'The City School of Sialkot', address: 'NEW YORK,NY,UNITED STATES', rating: '5.0' },
                { id: 5, name: 'Sialkot Gramer School', address: 'NEW YORK,NY,UNITED STATES', rating: '4.1' }
            ]
        };
    }
    componentWillMount() {
        this.setState({ schools_state: store.SCHOOLS_LIST[0].school_state })
    }

    getSchool(id) {
        this.setState({ loading_search: true })
        if (id.length !== 0) {
            fetch('http://157.230.63.199/api/schools/' + id)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status === 'success') {
                        store.SCHOOL = responseJson;
                        this.props.navigation.navigate('schoolDetails')
                        this.setState({ loading_search: false })
                        console.warn('School Detail==>', store.SCHOOL)
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
    static navigationOptions = {
        title: 'Schools List',
        headerStyle: {
            backgroundColor: 'rgb(66,67,69)',
        },
        headerTintColor: colors.appGreen,
        headerTitleStyle: {
            fontSize: totalSize(2),
            textAlign: 'center'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loading_search === true ?
                        <Loading_School/>
                        :
                        <View style={styles.container}>
                            <View style={styles.topContainer}>
                                <View style={styles.iconContainer}>
                                    <Icon name='search' color='rgb(66,67,69)' type='font-awesome' size={totalSize(4)} />
                                </View>
                                <View style={styles.txtContainer}>

                                    <View >
                                        <Text style={styles.txtSmall}>Search Results For All Schools in the state of </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.txtLarg}>{this.state.schools_state}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.lowerContainer}>
                                <ScrollView>
                                    {
                                        store.SCHOOLS_LIST.map((item, key) => {
                                            return (
                                                <TouchableOpacity key={key} style={styles.detailContainer} onPress={() => this.getSchool(item.id)}>
                                                    <View style={styles.iconContainerSmall}>
                                                        <Icon name='university' color={colors.appGreen} type='font-awesome' size={totalSize(2)} />
                                                    </View>
                                                    <View style={[styles.txtContainer, { width: width(65) }]}>
                                                        <Text style={[styles.txtLarg, { fontSize: totalSize(2) }]}>{item.school_name}</Text>
                                                        <Text style={[styles.txtSmall, { fontSize: totalSize(1.3) }]}>{item.school_location}</Text>
                                                    </View>
                                                    <View style={[styles.txtContainer, { width: width(15), alignItems: 'center' }]}>

                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                }
            </View>
        );
    }
}

export default SchoolList;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        width: width(90),
        height: height(20),
        backgroundColor: 'white',
        marginVertical: height(2),
        flexDirection: 'row',
        elevation: 5,
        borderRadius: 5,
    },
    iconContainer: {
        width: width(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtContainer: {
        width: width(70),
        justifyContent: 'center'

    },
    lowerContainer: {
        width: width(100),
        flex: 1,
        alignItems: 'center',
    },



    txtLarg: {
        fontSize: totalSize(4),
        color: 'rgb(66,67,69)',
        fontWeight: 'bold',
    },
    txtSmall: {
        fontSize: totalSize(1.5),
        color: 'rgb(66,67,69)',
        fontWeight: 'normal'
    },
    detailContainer: {
        width: width(95),
        height: height(10),
        flexDirection: 'row',
        marginTop: height(1),
        backgroundColor: 'rgb(245,245,238)',

    },
    iconContainerSmall: {
        width: width(15),
        justifyContent: 'center'
    }
})