import { StyleSheet } from "react-native";
import colors from "../../assets/themes/colors";

export default StyleSheet.create({
    menuItmHolder: {
        position: 'absolute',
        top: 60,
        backgroundColor: colors.white,
        alignSelf: 'flex-end',
        borderRadius: 6,
        padding: 5,
        borderWidth: 1,
        borderColor: 'lightgrey'
    },

    optHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5
    }, 

    closeIconHolder: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1
    },

    optTxt: {
        fontSize: 16,
        marginLeft: 10
    }
})