import { StyleSheet } from "react-native";
import colors from "../../assets/themes/colors";

export default StyleSheet.create({
    hCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
        height: "100%"
    },
    backBtnHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 170
    },
    locTxtHolder: {
        marginLeft: 10,
        maxWidth: 130
    },
    dNameHolder: {
        maxWidth: 150
    },
    txtStyle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    // locTxt: {
    //     borderBottomWidth: 1,
    //     borderBottomColor: colors.primary,
    //     padding: 8
    // },
    locContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },

    alocHolder: {
        width: '90%',
        height: '90%',
        position: 'relative',
        backgroundColor: 'lightgrey'
    },
    ap_img: {
        width:15,
        height: 15
    },

    tagHolder: {
        position: 'absolute',
        width: 15,
        height: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
})