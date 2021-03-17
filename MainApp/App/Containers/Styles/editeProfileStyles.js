import {StyleSheet,Dimensions} from 'react-native'
import { width, height, totalSize } from 'react-native-dimension'
import colors from '../../Themes/Colors';
const {width:WIDTH} =Dimensions.get('window')


export default StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        alignSelf:'center',
        height:null,
        width:WIDTH +50
    },
    pfContainer: {
        width: totalSize(15),
        height: totalSize(15),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: width(2),
        borderRadius: 100,

    },
    profileImage: {
        width: totalSize(15),
        height: totalSize(15),
        position: 'absolute',
        borderRadius: 100,
       
    },
    cameraIcon:{
        width: width(8),
        height: height(5),

    },

    topContainer: {
        width: width(80),
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: height(5)

    },
    txtContainer: {
        width: width(80),
        //alignItems: 'flex-start',
        marginTop: height(3)

    },
    btnContainer: {
        width: width(80),
        alignItems: 'center',
        marginTop: height(15),
        justifyContent:'center'
    },
    btnTxt: {
        fontSize: totalSize(1.6),
        fontWeight: '100',
        color: 'white'

    },
    btn: {
        width: width(80),
        height: height(6),
        backgroundColor:colors.appGreen,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1
    },
    formTxt: {
        fontSize: totalSize(1.6),
        fontWeight: 'bold',
        marginBottom: height(0.5),
        alignSelf: 'flex-start',

    },
    formTxt2: {
        fontSize: totalSize(1.6),
        color: 'rgb(207,207,207)',
        //marginTop:height(1)


    },
    inputName: {
        width: width(48),
        height: height(6),
        borderWidth: 0.5,
        borderColor: colors.appGreen,
        paddingLeft: 10,
        fontSize: totalSize(1.5),
        borderRadius: 5,
    },
    input: {
        width: width(80),
        height: height(6),
        borderWidth: 0.5,
        borderColor:  colors.appGreen,
        paddingLeft: 10,
        borderRadius: 5,
        fontSize: totalSize(1.5),
    },



})