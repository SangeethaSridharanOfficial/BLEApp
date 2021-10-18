import { StyleSheet } from "react-native";

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
    tempTxtHolder: {
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
    tempContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        width: '100%',
        height: '100%'
    },
    chartHolder: {
        paddingHorizontal: 10,
        // justifyContent: 'center',
        backgroundColor: 'grey',
        // width: '100%'
        height: '80%'
    }
})