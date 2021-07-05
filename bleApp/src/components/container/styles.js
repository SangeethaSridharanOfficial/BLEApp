import { StyleSheet } from "react-native";
import colors from "../../assets/themes/colors";

export default StyleSheet.create({
    wrapper: {
        padding: 50
    },
    deviceHolder: {
        backgroundColor: colors.grey,
        marginTop: 12,
        borderRadius: 5,
        padding: 12,
        flexDirection: 'row-reverse'
    },
    info: {
        flex: 1
    },
    actionBtn: {
        width: '80%',
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
        justifyContent: 'space-between',
        width: '30%',
    },

    menuIcon: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    sideWrapper: {
        width: '100%',
        height: '100%',
        marginTop: 70
    },

    textStyle: {
        fontSize: 20,
        color: '#5050f0'
    },

    smOpts : {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8'
    }
})