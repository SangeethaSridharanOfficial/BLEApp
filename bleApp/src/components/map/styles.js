import { StyleSheet } from "react-native";
import colors from "../../assets/themes/colors";

export default StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapHolder: {
        backgroundColor: '#eaeaea',
        width: '90%',
        height: '90%',
        position: 'relative',
        borderRadius: 10
    },
    tag_container: {
        position: 'absolute',
        width: 40,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ap_img: {
        width: 150,
        height: 150
    },
    bp_img: {
        position: 'absolute',
        width: 100,
        height: 100
    },


    loaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }
})