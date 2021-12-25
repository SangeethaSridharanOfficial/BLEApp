import { StyleSheet } from "react-native";
import colors from "../../assets/themes/colors";

export default StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: '91%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapHolder: {
        backgroundColor: '#eaeaea',
        width: '90%',
        height: '95%',
        position: 'relative',
        borderRadius: 10
    },
    tag_container: {
        position: 'absolute',
        width: 40,
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ap_img: {
        width: 25,
        height: 60
    },
    bp_img: {
        // position: 'absolute',
        width: 25,
        height: 60
    },

    dNameTxt: {
        fontSize: 11,
        fontWeight: 'bold'
    },

    mobile_img:{
        width: 40,
        height: 40
    },

    loaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute'
    },

    dt_loading_cont: {
        width: '100%',
        height: '100%',
        position: "absolute",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.7)',
        zIndex: 3,
        elevation: 3,
    },
    searchCont: {
        backgroundColor: 'white'
    }
})