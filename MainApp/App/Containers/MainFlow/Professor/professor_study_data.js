import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import colors from '../../../Themes/Colors';

class StudyData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                { id: 1, name: 'Lecture(01-4-18)', type: '.jpg', size: '2.5' },
                { id: 2, name: 'Lecture(01-4-18)', type: '.pdf', size: '3.0' },
                { id: 3, name: 'Class(01-4-18)', type: '.pdf', size: '4.9' },
                { id: 4, name: 'Class(01-4-18)', type: '.jpg', size: '3' },
                { id: 5, name: 'Lecture(01-4-18)', type: '.pdf', size: '4.8' }
            ],
        };
    }
    static navigationOptions = {
        title: 'Study data',
        headerStyle: {
            backgroundColor: 'rgb(66,67,69)',
        },
        headerTintColor: colors.appGreen,
        headerTitleStyle: {
            fontSize: totalSize(2),
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: width(95), height: height(8), backgroundColor: 'transparent', justifyContent: 'center' }}>
                    <Text style={[styles.txtLarg, { fontSize: totalSize(2.5) }]}>Study Data</Text>
                </View>
                <ScrollView>
                    {
                        this.state.data.map((item, key) => {
                            return (
                                <TouchableOpacity key={key} style={styles.detailContainer} >
                                    {
                                        item.type === '.pdf' ?
                                            <View style={styles.iconContainerSmall}>
                                                <Icon name='note-text' color='rgb(218,21,30)' size={totalSize(4)} type='material-community' />
                                            </View>
                                            :
                                            <View style={styles.iconContainerSmall}>
                                                <Icon name='image' color='rgb(0,173,238)' size={totalSize(4)} />
                                            </View>
                                    }
                                    <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                        <Text style={[styles.txtLarg, { fontSize: totalSize(2) }]}>{item.name}</Text>
                                        <Text style={[styles.txtLarg, { fontSize: totalSize(2) }]}>{item.type}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', alignItems: 'flex-end' }}>
                                        <Text style={[styles.txtSmall, {}]}>{item.size} MB</Text>
                                    </View>
                                    <View style={{ width: width(5) }}></View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

export default StudyData;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        width: width(90),
        height: height(20),
        //backgroundColor: 'red',
        marginVertical: height(2),
        flexDirection: 'row',
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
        backgroundColor: 'rgb(245,245,238)',
        flexDirection: 'row',
        marginTop: height(1),
        alignItems: 'center',
    },
    iconContainerSmall: {
        width: width(15),
        justifyContent: 'center'
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        height: height(6),
        width: width(40),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appGreen,
        elevation: 5,
        marginVertical: height(3)
    },
    buttonTxt: {
        color: 'rgb(66,67,69)',
        fontSize: totalSize(2),

    },
    modalHeader: {
        backgroundColor: 'rgb(66,67,69)',
        height: height(6),
        width: width(90),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBody: {
        backgroundColor: 'white',
        width: width(90),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    starTxtContainer: {
        flexDirection: 'row',
        marginVertical: height(2),
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputTxtContainer: {
    },
    commentInputView: {
        height: height(30),
        width: width(80),
        borderWidth: 0.25,
        borderColor: 'rgb(66,67,69)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    commentInput: {
        height: height(30),
        width: width(75),
        paddingBottom: height(25)
    }
})