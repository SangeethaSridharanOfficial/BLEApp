import { StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import colors from "../../assets/themes/colors";

export default StyleSheet.create({
    wrapper: {
        padding: 50
    },
    actionBtn: {
        width: '40%',
        marginBottom: 10,
        alignSelf: 'center'
    },
    deviceWrapper: {
        marginTop: 20
    },
    logout: {
        width: '40%',
        marginBottom: 10,
        margin: 10
    },
    loginImg: {
        height: 150,
        width: 150,
        alignSelf: 'center',
        marginTop: 50
    },

    title: {
        fontSize: 21,
        textAlign: 'center',
        paddingTop: 20,
        fontWeight: '500',
        marginBottom: 50
    },

    userName: {
        fontSize: 16
    },
    
    headerCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        height: "100%"
    },

    rightWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '30%',
    },

    menuIcon: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    pageNameCont: {
        height: '100%',
        padding: 10
    },

    pageName: {
        fontSize: 20,
        fontWeight: 'bold'
    },

    sideWrapper: {
        width: '100%',
        height: '100%',
        marginTop: 70
    },

    textStyle: {
        fontSize: 20,
        // color: '#5050f0'
        color: 'black'
    },

    smOpts : {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8'
    },

    profileWrapper: {
        height: '100%'
    },

    pHeaderWrapper: {
        backgroundColor: 'lightgrey',
        height: '40%',
        display: 'flex'
    },

    imageWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '89%'
    },

    profileImg: {
        width: 150,
        height: 150,
        borderRadius: 150
    },

    deviceList: {
        height: '90%'
    },

    // add new tag styles - START
    addTagView: {
        backgroundColor: '#eaeaea',
        borderRadius: 8
    },
    at_header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 10
    },
    at_he_text: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
    },
    at_co_wrapper: {
        width: '100%',
        height: 70,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    at_co_cont: {
        backgroundColor: '#e2e2e2',
        width: '45%',
        height: '70%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    at_co_txt: {
        width: '20%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    at_txt: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold'
    },
    at_ipt: {
        width: '80%',
        height: '100%',
        fontSize: 22
    },
    tagBtns_wrapper: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    at_btn: {
        backgroundColor: colors.accent,
        width: '45%',
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    at_btn_txt: {
        fontSize: 24,
        color: 'black'
    },
    at_cancel_btn_wrp: {
        width: '100%',
        height: 50
    },
    at_cancel_btn: {
        backgroundColor: colors.accent,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8
    },
    at_cancel_btn_txt: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold'
    }

    // add new tag styles - END
})