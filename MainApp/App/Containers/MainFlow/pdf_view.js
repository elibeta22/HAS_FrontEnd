import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { totalSize } from 'react-native-dimension'

import Pdf from 'react-native-pdf';

export default class Pdf_View extends React.Component {
    static navigationOptions = {
        title: 'Document Viewer',
        headerStyle: {
            backgroundColor: 'rgb(66,67,69)',
            //height:height(5)
        },
        headerTintColor: 'rgb(180,210,53)',
        headerTitleStyle: {
            fontSize: totalSize(2),
            //textAlign: 'center'
        }
    }
    render() {
        let { params } = this.props.navigation.state;
        var doc = params.docItem;
        console.warn('doc=>',doc.document);
        const source = { uri: doc.document }
        // const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
        return (
            <View style={styles.container}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{

                    }}
                    onPageChanged={(page,numberOfPages)=>{

                    }}
                    onError={(error)=>{

                    }}
                    style={styles.pdf}/>
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