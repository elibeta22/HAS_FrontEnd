import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { totalSize } from 'react-native-dimension'

export default class Pdf_View extends React.Component {
    static navigationOptions = {
        headerTitle: null,
    }
    render() {
        return (
            <View style={styles.container}>
                <Modal
                    visible={this.state.modalVisible}
                    transparent={true}
                    style={{ flex: 1 }}
                    onRequestClose={() => this.setState({ modalVisible: false })}
                    >
                    <ImageViewer
                        imageUrls={this.state.images}
                        index={this.state.index}
                        pageAnimateTime={500}
                        backgroundColor='black'
                        transparent={false}
                        enablePreload={true}
                        style={{ flex: 1, backgroundColor: 'black' }}
                        footerContainerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        onDoubleClick={() => {
                        this.setState({ modalVisible: false })
                        }}
                        onSwipeDown={() => {
                        this.setState({ modalVisible: false })
                        }}
                        enableSwipeDown={true}
                    />
        </Modal>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});