import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,ActivityIndicator } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import store from '../../../Stores/orderStore';
import colors from '../../../Themes/Colors';

class ProfessorsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading_search: false,
            professors: [
                { id: 1, name: 'Sir, Tajamal Hussain', reviews: '23', rating: '5.0' },
                { id: 2, name: 'Sir, Atif Majid', reviews: '24', rating: '3.1' },
                { id: 3, name: 'Prof, Akmal Khan', reviews: '101', rating: '4.5' },
                { id: 4, name: 'Lec, Shahid Zakir', reviews: '4', rating: '5.0' },
                { id: 5, name: 'Sir, Arif Masood', reviews: '60', rating: '4.1' }
            ]
        };
    }
    static navigationOptions = {
        title: 'Professors List',
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

    getProfessor = async (id) => {
        this.setState({
            loading_search: true,
        })
        if (id !== 0) {
            fetch('http://157.230.63.199/api/professors/' + id)
                .then((response) => response.json())
                .then((responseJson) => {
                    //console.warn('Predictions', responseJson);
                    if (responseJson.status === 'success') {
                        store.PROFESSOR = responseJson;
                        this.props.navigation.navigate('professorDetail')
                        this.setState({ loading_search: false })
                        console.warn('Professor Detail==>', store.PROFESSOR)
                    } else {
                        this.setState({ loading_search: false })
                        Toast.show(responseJson.message)
                    }
                })
        } else {
            this.setState({ loading_search: false })
        }
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
                        <View style={styles.container}>
                            <View style={styles.topContainer}>
                                <View style={styles.iconContainer}>
                                    <Icon name='search' color='rgb(66,67,69)' type='font-awesome' size={totalSize(4)} />
                                </View>
                                <View style={styles.txtContainer}>
                                    <View >
                                        <Text style={styles.txtSmall}>Showing Professors in</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.txtLarg}>{store.PROFESSORS_LIST.length !== 0 ? store.PROFESSORS_LIST[0].department_name : 'Department'}</Text>
                                    </View>

                                </View>
                            </View>
                            <View style={styles.lowerContainer}>
                                {/* <View style={{ width: width(95), height: height(8), backgroundColor: 'transparent', justifyContent: 'center', borderBottomWidth: 0.25 }}>
                        <Text style={[styles.txtLarg, { fontSize: totalSize(2.5) }]}>Top Professors</Text>
                    </View> */}
                                <ScrollView>
                                    {
                                        store.PROFESSORS_LIST.map((item, key) => {
                                            return (
                                                <TouchableOpacity key={key} style={styles.detailContainer} onPress={() => this.getProfessor(item.id)}>
                                                    <View style={styles.iconContainerSmall}>
                                                        <Icon name='school' color={colors.appGreen} size={totalSize(3)} />
                                                    </View>
                                                    <View style={[styles.txtContainer, { width: width(65) }]}>
                                                        <Text style={[styles.txtLarg, { fontSize: totalSize(2) }]}>{item.professor_name}</Text>
                                                        <Text style={styles.txtSmall}>{item.total_reviews} Reviews</Text>
                                                    </View>
                                                    <View style={[styles.txtContainer, { width: width(20), alignItems: 'center', backgroundColor: 'transparent',flexDirection:'row' }]}>
                                                        <Icon name='star' color={colors.appGreen} size={totalSize(2)} type='font-awesome' />
                                                        <Text style={[styles.txtLarg, {}]}>{item.professor_rating}</Text>
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

export default ProfessorsList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'rgb(245,245,238)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        width: width(90),
        height: height(20),
        //backgroundColor: 'red',
        marginVertical: height(2),
        flexDirection: 'row',
        //alignItems:'center',
        //justifyContent:'center'
    },
    iconContainer: {
        width: width(20),
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtContainer: {
        //flex:1,
        width: width(70),
        //backgroundColor: 'yellow',
        justifyContent: 'center'

    },
    lowerContainer: {
        width: width(100),
        flex: 1,
        backgroundColor: 'rgb(245,245,238)',
        alignItems: 'center',
        //justifyContent: 'center'
    },



    txtLarg: {
        fontSize: totalSize(4),
        //textAlign: 'center',
        //margin: 10,
        color: 'rgb(66,67,69)',
        fontWeight: 'bold',
        //opacity: 0.6
    },
    txtSmall: {
        fontSize: totalSize(1.5),
        //textAlign: 'center',
        color: 'rgb(66,67,69)',
        fontWeight: 'normal'
        //color: 'rgb(217,217,217)',
        //marginBottom: 5,
    },
    detailContainer: {
        width: width(95),
        height: height(10),
        //backgroundColor: 'blue',
        flexDirection: 'row',
        marginTop: height(1)
    },
    iconContainerSmall: {
        width: width(15),
        //backgroundColor: 'green',
        justifyContent: 'center'
    }
})