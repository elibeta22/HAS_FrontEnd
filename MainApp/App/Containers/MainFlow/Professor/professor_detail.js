import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import Toast from 'react-native-simple-toast'
import StarRating from 'react-native-star-rating';
import store from '../../../Stores/orderStore';
import api from '../../../lib/api'
import colors from '../../../Themes/Colors';


class ProfessorDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: 0,
            isModalVisible: false,
            loadind_rate: false,
            postCom: false,
            comment: 'No Comments',
            professors: [
                { id: 1, name: 'Max Tim', comment: 'He is very good in convieing this moral of lecture. He is very good in convieing this moral of lecture', date: '25-08-2018', rating: 4 },
                { id: 2, name: 'Leo Lenardo', comment: 'He is very good in convieing this moral of lecture', date: '25-08-2018', rating: 2 },
                { id: 3, name: 'Arnold Tim', comment: 'He is very good in convieing this moral of lecture. He is very good in convieing this moral of lecture. He is very good in convieing this moral of lecture', date: '25-08-2018', rating: 3 },
                { id: 4, name: 'Jacob Black', comment: 'He is very good in convieing this moral of lecture', date: '25-08-2018', rating: 5 },
                { id: 5, name: 'Sam Andrson', comment: 'He is very good in convieing this moral of lecture', date: '25-08-2018', rating: 3 }
            ],
        };
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
        //console.warn('Rating===>', rating)
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    static navigationOptions = {
        title: 'Professor Detail',
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
    rateProfessor = async () => {
        if (this.state.starCount !== 0) {
            this.setState({ loadind_rate: true })
            let params = {
                review_for: store.PROFESSOR.professor.id,
                rating: this.state.starCount,
                comment: this.state.comment,
                token: store.USER_TOKEN
            }

            let response = await api.post('professors/rate', params);

            if (response.status === 'success') {
                this.setState({
                    loadind_rate: false,
                    starCount: 0,
                    comment: 'No Comments',
                })
                this._toggleModal()
                Toast.show(response.message, Toast.LONG)
                await this.getProfessor()
            } else {
                Toast.show(response.message, Toast.LONG)
                this.setState({ loadind_rate: false })
            }
        } else {
            Toast.show('Please tap a star to rate professor')
        }

    }

    getProfessor() {
        //store.PROFESSOR = {}
        if (store.PROFESSOR.professor.id.length !== 0) {
            fetch('http://157.230.63.199/api/professors/' + store.PROFESSOR.professor.id)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.warn('egfhghghgkhgkggfjhgfhjgfh');
                    if (responseJson.status === 'success') {
                        store.PROFESSOR = responseJson;
                        this.setState({ postCom: true })
                        console.warn('Professor Detail==>', store.PROFESSOR)
                    } else {
                        //this.setState({ loading_search: false })
                        //Toast.show('There is no school found')
                    }
                })
        } else {
            Toast.show('There is no Professor found')
            //this.setState({ loading_search: false })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name='school' color='rgb(66,67,69)' size={totalSize(5)} />
                    </View>
                    <View style={styles.txtContainer}>
                        <View>
                            <Text style={styles.txtLarg}>{store.PROFESSOR.professor.professor_name}</Text>
                        </View>
                        <View >
                            <Text style={styles.txtSmall}>Professor in the {store.PROFESSOR.professor.department.department_name} department </Text>
                        </View>
                        <View style={{ flexDirection: 'row',alignItems:'center' }}>
                            <Text style={[styles.txtLarg,{fontSize:totalSize(1.5)}]}>{store.PROFESSOR.professor.average_rating} </Text>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                starSize={totalSize(1.5)}
                                rating={store.PROFESSOR.professor.average_rating}
                                //selectedStar={(rating) => this.onStarRatingPress(rating)}
                                fullStarColor={'rgb(66,67,69)'}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => this._toggleModal()}>
                        <Text style={styles.buttonTxt}>Rate it</Text>
                    </TouchableOpacity>
                    <View style={{ width: width(10) }}></View>
                    <TouchableOpacity style={[styles.button, { backgroundColor: 'rgb(0,173,238)' }]} onPress={() => { store.professorData = true, this.props.navigation.navigate('myDocuments') }}>
                        <Text style={styles.buttonTxt}>Study Data</Text>

                        <View style={{ width: 5 }}>
                        </View>
                        <Icon name='arrow-right' color='rgb(66,67,69)' size={totalSize(1.5)} type='simple-line-icon' />
                    </TouchableOpacity>

                </View>
                <View style={styles.lowerContainer}>
                    <View style={{ width: width(95), height: height(8), backgroundColor: 'transparent', justifyContent: 'center' }}>
                        <Text style={[styles.txtLarg, { fontSize: totalSize(2.5) }]}>Reviews {store.PROFESSOR.professor.total_reviews}</Text>
                    </View>
                    <ScrollView
                        style={{ marginBottom: 10 }}
                        ref={ref => this.scrollView = ref}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            if (this.state.postCom) {
                                this.scrollView.scrollToEnd({ animated: true });
                            }
                        }}
                    >
                        {
                            store.PROFESSOR.professor.ratings.map((item, key) => {
                                return (
                                    <View key={key} style={styles.detailContainer} >
                                        <View style={styles.iconContainerSmall}>
                                            <Icon name='person' color={colors.appGreen} size={totalSize(4)} />
                                        </View>
                                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: width(60), backgroundColor: 'transparent', marginVertical: height(3) }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={[styles.txtLarg, { fontSize: totalSize(2) }]}>{item.review_by_name}</Text>
                                                <View style={{ width: width(2) }}></View>
                                                <StarRating
                                                    disabled={false}
                                                    maxStars={5}
                                                    starSize={totalSize(1.5)}
                                                    rating={item.rating}
                                                    //selectedStar={(rating) => this.onStarRatingPress(rating)}
                                                    fullStarColor={colors.appGreen}
                                                />
                                            </View>
                                            <Text style={[styles.txtSmall, { fontSize: totalSize(1.25) }]}>{item.comment}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', width: width(20), backgroundColor: 'transparent' }}>
                                            <Text style={[styles.txtSmall, { fontSize: totalSize(1.25) }]}>{item.review_date}</Text>
                                        </View>
                                        <View style={{ width: width(5) }}></View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <Modal
                    isVisible={this.state.isModalVisible}
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.50}
                    onBackdropPress={this._toggleModal}>

                    <View>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.txtLarg, { fontSize: totalSize(2), color: 'white' }]}>Rate a Professor</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <View style={styles.starTxtContainer}>
                                <Text style={styles.txtSmall}>
                                    Tap to Rate:
                                </Text>
                                <View style={{ width: width(5) }}></View>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    starSize={totalSize(3)}
                                    rating={this.state.starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    fullStarColor={colors.appGreen}
                                />
                            </View>
                            <View style={styles.inputTxtContainer}>
                                <Text style={styles.txtSmall}>Comment</Text>
                                <View style={styles.commentInputView}>
                                    <TextInput
                                        onChangeText={(value) => this.setState({ comment: value })}
                                        placeholder='ENTER COMMENT HERE'
                                        placeholderTextColor='rgb(245,245,238)'
                                        style={styles.commentInput}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => this.rateProfessor()} style={styles.buttonModal}>
                                {
                                    this.state.loadind_rate === true ?
                                        <ActivityIndicator color='white' size={'small'} />
                                        :
                                        <Text style={{ fontSize: totalSize(1.5), color: 'white' }}>Submit</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default ProfessorDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'rgb(245,245,238)',
        //backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        width: width(90),
        height: height(20),
        backgroundColor: 'white',
        marginTop: height(4),
        flexDirection: 'row',
        elevation: 5,
        borderRadius: 5
        //alignItems:'center',
        //justifyContent:'center',

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
        //backgroundColor: 'orange',
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
        // height: height(15),
        backgroundColor: 'blue',
        backgroundColor: 'rgb(245,245,238)',
        flexDirection: 'row',
        marginTop: height(1),
        alignItems: 'center',
        //justifyContent: 'center'
    },
    iconContainerSmall: {
        width: totalSize(5),
        height: totalSize(5),
        backgroundColor: 'green',
        justifyContent: 'center',
        marginHorizontal: width(2),
        //marginVertical:height(2),
        borderRadius: 100,
        backgroundColor: 'rgb(66,67,69)',

    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:'red'
    },
    button: {
        height: height(6),
        width: width(40),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appGreen,
        elevation: 5,
        marginVertical: height(4),
        flexDirection: 'row'
    },
    buttonModal: {
        height: height(6),
        width: width(80),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appGreen,
        elevation: 3,
        marginVertical: height(4),
        flexDirection: 'row'
    },
    buttonTxt: {
        color: 'rgb(66,67,69)',
        //marginVertical:height(2),
        //marginHorizontal: width(10),
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
        //backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputTxtContainer: {
        //backgroundColor:'orange'
    },
    commentInputView: {
        height: height(30),
        width: width(80),
        borderWidth: 0.5,
        borderColor: colors.appGreen,
        alignItems: 'center',
        justifyContent: 'center'
    },
    commentInput: {
        height: height(30),
        width: width(75),
        //borderWidth: 0.5,
        //backgroundColor:'blue',
        paddingBottom: height(25)
    }
})