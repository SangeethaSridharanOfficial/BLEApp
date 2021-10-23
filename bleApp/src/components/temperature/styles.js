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
        width: '100%',
        height: '100%'
    },
    chartHolder: {
        paddingHorizontal: 10,
        height: '90%',
        marginRight: 10
        
    },
    tmpTxt: {
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
        padding: 8
    },
    timeTxt: {
        padding: 8
    },
    tooltipCont: {
        position: 'absolute',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: colors.accent,
        height: 'auto',
        width: 'auto',
        zIndex: 1000
    }
})