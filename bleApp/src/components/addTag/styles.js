import { StyleSheet } from "react-native";
import colors from "../../assets/themes/colors";

export default StyleSheet.create({
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
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    tag_chkbx: {
        alignSelf: "center",
    }
})