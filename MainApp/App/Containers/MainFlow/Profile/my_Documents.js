import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, ScrollView, Image, ActivityIndicator, TextInput, PermissionsAndroid, ProgressBarAndroid } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
import * as ImagePicker from 'react-native-image-picker';
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import store from '../../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import axios from 'axios'
import api from '../../../lib/api';
import RNFetchBlob from 'rn-fetch-blob'
import DocumentPicker  from 'react-native-document-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import colors from '../../../Themes/Colors';

class MyDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loading_search: false,
            isModalVisible: false,
            isImageShow: false,
            documents: [],
            images: [],
            avatarSource: null,
            image: null,
            docURI: null,
            docShow: null,
            progress: 0,
            downProgress: 0,
            isDownloaded: false,
            downloadDoc: false,
            docName: '',
            index: null,
            ShowVerifyDelete: false,
            loading_Delete: false,
            deleteDocId: '',

        };
        this._handleProgressChange = this.handleProgressChange.bind(this);
    }
    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });
    _toggleModalVerifyDelete = async (id) => {
        await this.setState({
            ShowVerifyDelete: !this.state.ShowVerifyDelete,
            deleteDocId: id
        })
        console.warn('Doc ID is', this.state.deleteDocId)

    }
    handleProgressChange = async (value) => {
        await this.setState({ progress: value });
        if (value === 100) {
            await this.setState({ isModalVisible: false })
        }
    }
    static navigationOptions = {
        title: 'Documents',
        headerStyle: {
            backgroundColor: 'rgb(66,67,69)',
        },
        headerTintColor: colors.appGreen,
        headerTitleStyle: {
            fontSize: totalSize(2),
        }
    }
    componentWillMount = async () => {
        await this.getStudyData()
    }
    getStudyData = async () => {
        if (store.professorData) {
            var id = store.PROFESSOR.professor.id;
        } else {
            var id = store.USER_LOGIN.id;
        }
        this.setState({ loading_search: true, images: [] })
        var url = 'http://157.230.63.199/api/professors/' + id + '/study-data?token=' + store.USER_TOKEN;
        await fetch(url, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                if (responseJson.status === 'success' && responseJson.documents !== []) {
                    await this.setState({ documents: responseJson.documents });
                    var index = 0;
                    for (let i = 0; i < this.state.documents.length; i++) {
                        if (this.state.documents[i].document_type === 'image') {
                            this.state.documents[i].index = index++;
                            this.state.documents[i].checked = false;
                        }
                    }
                    this.state.documents.forEach(item => {
                        if (item.document_type === 'image') {
                            this.state.images.push({ url: item.document })
                        }
                    });
                    this.setState({ loading_search: false })
                    Toast.show(responseJson.message)
                } else {
                    this.setState({ loading_search: false })
                    Toast.show(responseJson.message)
                }
            })
    }

    deleteDoc = async () => {
        this.setState({ loading_Delete: true })
        var url = 'http://157.230.63.199/api/documents/' + this.state.deleteDocId + '?token=' + store.USER_TOKEN;

        await fetch(url, {
            method: 'DELETE'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'success') {
                    this.setState({
                        loading_Delete: false,
                        deleteDocId: '',
                        ShowVerifyDelete: !this.state.ShowVerifyDelete,
                    })
                    this.getStudyData()
                    Toast.show(responseJson.message)
                } else {
                    this.setState({
                        loading_Delete: false,
                        ShowVerifyDelete: !this.state.ShowVerifyDelete,
                    })
                    Toast.show(responseJson.message)
                }
            })
            .catch((error) => {
                this.setState({
                    loading_Delete: false,
                    ShowVerifyDelete: !this.state.ShowVerifyDelete,
                })
            })
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
            if (response.fileSize >= '5000000') {
                alert('Image size is too big please select a image lower than 5Mb')
            } else {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    const source = { uri: response.uri };
                    await this.setState({
                        imageName: response.fileName,
                        avatarSource: { uri: response.uri, type: response.type, name: response.fileName },
                        image: { uri: response.uri, width: response.width, height: response.height }
                    });

                }
            }
        });
    }
    document_picker = () => {
        // iPhone/Android
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],//[DocumentPickerUtil.allFiles()],
        }, async (error, res) => {

            // Android
            if (res.type === 'application/pdf') {
                await this.setState({
                    docName: res.fileName,
                    docURI: { uri: res.uri, type: res.type, name: res.fileName },
                    docShow: { uri: res.uri }
                })
            } else {
                await this.setState({
                    docURI: null,
                    docShow: null
                })
                Toast.show('Please select a pdf file only')
            }

            console.warn(
                res.uri,
                res.type, // mime type
                res.fileName,
                res.fileSize
            );
        });
    }
    async requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.DOWNLOAD_WITHOUT_NOTIFICATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                await this.downloadDocument()
            } else {

            }
        } catch (err) {
            console.warn(err);
        }
    }
    //Document
    docDownload = async (item) => {
        Toast.show(item.document_name + 'is start downloading..', Toast.LONG)
        this.state.documents.forEach((doc) => {
            if (item.checked === false && doc.id === item.id) {
                doc.checked = true
            } else {
                doc.checked = false;
            }
        })
        this.setState({ downloadDoc: true })
        const android = RNFetchBlob.android
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        RNFetchBlob
            .config({
                path: RNFetchBlob.fs.dirs.DownloadDir + '/' + item.document_name //PictureDir , DownloadDir
            })
            .fetch('GET', item.document, {
            })
            .progress((received, total) => {
                this.setState({ downProgress: received / total })
            })
            .then((res) => {
                Toast.show(item.document_name + 'Downloaded successfuly in Downloads folder.', Toast.LONG)
                this.state.documents.forEach((doc) => {
                    if (doc.id === item.id) {
                        doc.checked = false
                    }
                })
                this.setState({ downloadDoc: false })
                this.setState({ downProgress: 0 })
                this.props.navigation.navigate('pdfView', { docItem: item })
                android.actionViewIntent(res.path(), 'pdf')
            }).catch((error) => {
                console.warn('error=>', error);
            })
    }
    //Image
    downloadDocument = async (item) => {
        Toast.show(item.document_name + 'is start downloading..', Toast.LONG)
        this.state.documents.forEach((doc) => {
            if (item.checked === false && doc.id === item.id) {
                doc.checked = true
            } else {
                doc.checked = false;
            }
        })
        this.setState({ downloadDoc: true })
        const android = RNFetchBlob.android
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob
            .config({
                path: RNFetchBlob.fs.dirs.DownloadDir + '/' + item.document_name //PictureDir , DownloadDir , DCIMDir
            })
            .fetch('GET', item.document, {
                //some headers ..
            })
            .progress((received, total) => {
                this.setState({ downProgress: received / total })
            })
            .then((res) => {
                Toast.show(item.document_name + 'Downloaded successfuly in Downloads folder.', Toast.LONG)
                this.state.documents.forEach((doc) => {
                    if (doc.id === item.id) {
                        doc.checked = false
                    }
                })
                this.setState({ downloadDoc: false })
                this.setState({ downProgress: 0 })
                var path = RNFetchBlob.fs.dirs.DownloadDir + '/' + item.document_name;
                RNFetchBlob.fs.scanFile([{ path: path, mime: item.document_type }])
                    .then(() => {
                    })
                    .catch((err) => {
                    })
                imageView = <Image source={{ uri: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }} />
                android.actionViewIntent(res.path(), item.document_type)
            }).catch((error) => {
                console.warn('error=>', error);
            })
    }
    upLoadDoc = async () => {
        this.setState({ loading: true })
        // check if you are going to upload to your data or other's data.
        if (store.professorData) {
            var id = store.PROFESSOR.professor.id;
        } else {
            var id = store.USER_LOGIN.id;
        }

        let formData = new FormData();
        formData.append("published_to", id);
        if (this.state.avatarSource && this.state.docURI) {
            for (let i = 0; i < 2; i++) {
                if (i === 0) {
                    const photo = this.state.avatarSource;
                    formData.append(`documents[${i}][document]`, photo);
                    formData.append(`documents[${i}][document_type]`, 'image');
                    formData.append(`documents[${i}][document_name]`, this.state.imageName);
                } else {
                    formData.append(`documents[${i}][document]`, this.state.docURI);
                    formData.append(`documents[${i}][document_type]`, 'document');
                    formData.append(`documents[${i}][document_name]`, this.state.docName);
                }
            }
        } else {
            for (let i = 0; i < 1; i++) {
                if (this.state.avatarSource) {
                    const photo = this.state.avatarSource;
                    formData.append(`documents[${i}][document]`, photo);
                    formData.append(`documents[${i}][document_type]`, 'image');
                    formData.append(`documents[${i}][document_name]`, this.state.imageName);
                }
            }
            for (let i = 0; i < 1; i++) {
                if (this.state.docURI) {
                    formData.append(`documents[${i}][document]`, this.state.docURI);
                    formData.append(`documents[${i}][document_type]`, 'document');
                    formData.append(`documents[${i}][document_name]`, this.state.docName);
                }
            }
        }

        await axios.post('http://157.230.63.199/api/professors/upload?token=' + store.USER_TOKEN, formData, {
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: async (progressEvent) => {
                var progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                await this._handleProgressChange(progress)
            },
        })
            .then(async (responseJson) => {
                await this.setState({ isModalVisible: false, loading: false })
                if (responseJson.data.status === "success") {
                    await this.setState({
                        image: null,
                        avatarSource: null,
                        docShow: null,
                        docURI: null
                    })
                    await this.getStudyData()
                    Toast.show(responseJson.data.message)
                } else {
                    await this.setState({ loading: false, isModalVisible: false, image: null, avatarSource: null, docShow: null, docURI: null })
                    Toast.show(responseJson.data.message)
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
            });
    }
    documentViewer = async (document) => {
        console.warn('image=', document);

        if (document.document_type === 'image') {
            //Show image
            await this.setState({ index: document.index, isImageShow: true })
        } else {
            this.props.navigation.navigate('pdfView', { docItem: document })
        }
    }
    render() {
        if (this.state.loading) {
            return (
                <View style={{ position: 'absolute', height: height(100), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                    <ProgressBarAndroid
                        indeterminate={false}
                        color={colors.appGreen}
                        styleAttr='Large'
                        progress={this.state.progress}
                    />
                    <Text style={{ fontSize: totalSize(2.5), color: colors.appGreen }}>{this.state.loading ? "Uploading... " + this.state.progress + '%' : 'Upload'}</Text>
                </View>
            )
        }
        return (
            <View style={styles.container}>

                <View style={{ width: width(95), height: height(8), backgroundColor: 'transparent', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={[styles.txtLarg, { fontSize: totalSize(2.5) }]}>Documents</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this._toggleModal()} style={{ width: totalSize(6), height: totalSize(6), backgroundColor: colors.appGreen, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name='add' color='rgb(66,67,69)' size={totalSize(4)} />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    !this.state.loading_search ?
                        <ScrollView style={{ marginBottom: 10 }} >
                            {
                                this.state.documents.length !== 0 ?
                                    this.state.documents.map((item, key) => {
                                        var trimmedImageName = item.document_name.length > 30 ?
                                            item.document_name.substring(0, 30 - 3) + "..." :
                                            item.document_name

                                        return (
                                            <TouchableOpacity key={key} style={styles.detailContainer} onPress={() => this.documentViewer(item)}>
                                                {
                                                    item.document_type === 'document' ?
                                                        <View style={styles.iconContainerSmall}>
                                                            <Icon name='note-text' color='rgb(218,21,30)' size={totalSize(4)} type='material-community' />
                                                        </View>
                                                        :
                                                        <View style={styles.iconContainerSmall}>
                                                            <Icon name='image' color='rgb(0,173,238)' size={totalSize(4)} />
                                                        </View>
                                                }
                                                <View style={styles.docNameContainer}>
                                                    <Text style={[styles.txtLarg, { fontSize: totalSize(1.7) }]}>{item.document_name.length > 30 ? trimmedImageName : item.document_name}</Text>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.txtLarg, { fontSize: totalSize(1), color: 'gray', }]}>Uploaded at {item.created_at}</Text>
                                                        <Text style={[styles.txtLarg, { fontSize: totalSize(1), color: 'gray', marginLeft: 20 }]}>Size {item.document_size}</Text>
                                                    </View>
                                                </View>
                                                <View style={[styles.iconContainerSmall, { flex: 1, backgroundColor: 'transparent' }]}>
                                                    {
                                                        item.checked ?
                                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: height(1) }}>
                                                                <ProgressBarAndroid
                                                                    styleAttr="Horizontal"
                                                                    indeterminate={false}
                                                                    progress={this.state.downProgress}
                                                                />
                                                            </View>
                                                            :
                                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginVertical: height(1) }} onPress={() => {
                                                                if (item.document_type === 'image') {
                                                                    this.downloadDocument(item)
                                                                } else {
                                                                    this.docDownload(item)
                                                                }
                                                            }}>
                                                                <Icon name='download' color={colors.appGreen} size={totalSize(3)} type='antdesign' />
                                                            </TouchableOpacity>
                                                    }

                                                </View>
                                                {
                                                    store.USER_LOGIN.id === item.published_by ?
                                                        <View style={[styles.iconContainerSmall, { flex: 1, backgroundColor: 'transparent' }]}>
                                                            <Icon name='delete' color={colors.appRed} size={totalSize(3)} type='antdesign' onPress={() => this._toggleModalVerifyDelete(item.id)} />
                                                        </View>
                                                        :
                                                        null
                                                }
                                            </TouchableOpacity>
                                        )
                                    })
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15, color: 'gray' }}>No record found!</Text>
                                    </View>
                            }
                        </ScrollView>
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color='gray' size='large' animating={true} />
                        </View>
                }
                <Modal
                    isVisible={this.state.ShowVerifyDelete} // Delete Document
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.50}
                    onBackdropPress={() => this.setState({ ShowVerifyDelete: false })}>
                    <View style={{ backgroundColor: 'white', height: height(20), width: width(80), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        {
                            this.state.loading_Delete === true ?
                                <ActivityIndicator color={colors.appGreen} size={totalSize(5)} />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: totalSize(1.5), }}>Are you sure you want to delete this document/image?</Text>
                                    <View style={{ marginTop: height(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>

                                        <TouchableOpacity onPress={() => this.setState({ ShowVerifyDelete: false })} style={{ height: height(6), width: width(35), backgroundColor: 'rgb(207,207,207)', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }}>
                                            <Text style={{ fontSize: totalSize(2) }}>Cancle</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: width(2.5) }}></View>
                                        <TouchableOpacity onPress={() => this.deleteDoc()} style={{ height: height(6), width: width(35), backgroundColor: 'rgb(218,21,30)', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }}>
                                            <Text style={{ fontSize: totalSize(2), color: 'white' }}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }
                    </View>
                </Modal>

                <Modal
                    visible={this.state.isImageShow}
                    transparent={true}
                    style={{ flex: 1 }}
                    onRequestClose={() => this.setState({ isImageShow: false })}
                >
                    <ImageViewer
                        imageUrls={this.state.images}
                        index={this.state.index}
                        saveToLocalByLongPress={true}
                        pageAnimateTime={500}
                        backgroundColor='black'
                        transparent={false}
                        enablePreload={true}
                        style={{ flex: 1, backgroundColor: 'black' }}
                        footerContainerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        onDoubleClick={() => {
                            this.setState({ isImageShow: false })
                        }}
                        onSwipeDown={() => {
                            this.setState({ isImageShow: false })
                        }}
                        enableSwipeDown={true}
                    />
                </Modal>
                <Modal
                    isVisible={this.state.isModalVisible}
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    backdropColor='black'
                    animationInTiming={250}
                    animationOutTiming={250}
                    onRequestClose={() => this.setState({ isModalVisible: false })}
                    backdropOpacity={0.50}
                    onBackdropPress={this._toggleModal}>
                    <View>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.txtLarg, { fontSize: totalSize(2), color: 'white' }]}>Add Document</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => this.image_picker()}>
                                    <View style={styles.btnTxtContainer}>
                                        {
                                            this.state.image !== null ?
                                                <View style={styles.btnTxtContainer} >
                                                    <Image source={this.state.image} style={{ height: totalSize(5), width: totalSize(5) }} />
                                                    <TextInput
                                                        onChangeText={(value) => this.setState({ imageName: value })}
                                                        value={this.state.imageName}
                                                        autoFocus={true}
                                                        style={styles.imageTitleInput}
                                                    />
                                                </View>
                                                :
                                                <View style={styles.btnTxtContainer}>
                                                    <Icon name='image' color='gray' size={totalSize(4)} />
                                                    <Text style={styles.btnTxt}>Tap To Add Image</Text>
                                                    <Text style={[styles.btnTxt, { fontSize: totalSize(1) }]}>only gif / jpg / png allowed. 3MB Max</Text>
                                                </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: width(2) }}></View>
                                <TouchableOpacity style={styles.button} onPress={() => this.document_picker()}>
                                    <View style={styles.btnTxtContainer}>
                                        {
                                            this.state.docShow !== null ?
                                                <View style={styles.btnTxtContainer} >
                                                    <Icon name='note-text' color='rgb(218,21,30)' size={totalSize(4)} type='material-community' />
                                                    <TextInput
                                                        onChangeText={(value) => this.setState({ docName: value })}
                                                        value={this.state.docName}
                                                        autoFocus={true}
                                                        style={styles.imageTitleInput}
                                                    />
                                                </View>
                                                :
                                                <View style={styles.btnTxtContainer}>
                                                    <Icon name='note-text' color='gray' size={totalSize(4)} type='material-community' />
                                                    <Text style={styles.btnTxt}>Tap To Add Document</Text>
                                                    <Text style={[styles.btnTxt, { fontSize: totalSize(1) }]}>only pdf allowed. 5MB Max</Text>
                                                </View>
                                        }

                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => this._toggleModal()} style={styles.Modalbutton} onPress={() => {
                                if (this.state.docURI || this.state.avatarSource) {
                                    this.upLoadDoc()
                                } else {
                                    Toast.show('Please choose any document')
                                }
                            }}>
                                <Text style={{ fontSize: totalSize(2), color: 'white' }}>{this.state.loading_search ? "Uploading... " + this.state.progress + '%' : 'Upload'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default MyDocument;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        width: width(90),
        height: height(20),
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
    },
    txtSmall: {
        fontSize: totalSize(1.2),
        color: 'rgb(66,67,69)',
        fontWeight: 'normal',
        marginHorizontal: 5,
        marginVertical: 2
    },
    detailContainer: {
        width: width(95),
        backgroundColor: 'rgb(245,245,238)',
        flexDirection: 'row',
        marginTop: height(1),
        alignItems: 'center',
    },
    iconContainerSmall: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    docNameContainer: {
        width: width(65),
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginVertical: height(1)
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: width(70),
        height: height(15),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: height(2),
        elevation: 2,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    Modalbutton: {
        width: width(70),
        height: height(5),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appGreen,
        marginVertical: height(3),
        elevation: 2,
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
    imageTitleInput: {
        height: height(6),
        width: width(70),
        marginTop: 3,
        fontSize: totalSize(2),
        alignItems: 'center',
        justifyContent: 'center',
        color: 'gray',
        textAlign: 'center',
    },

    btnTxtContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTxt: {
        fontSize: totalSize(1.5),
        fontWeight: 'normal',
        color: 'gray'
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
})
