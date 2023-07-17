import { background } from "native-base/lib/typescript/theme/styled-system";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
    campostexto: {
        width: '100%',
        marginTop: 5,
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        marginRight: 10
    },
    textGroup: {
        fontSize: 20,
        margin: 8,
        fontWeight: "bold",
        color:"#54abf7"

    },
    buttom: {
        marginTop: 8,
        borderColor:"#54abf7"
    },
    readOnly: {
        backgroundColor: '#F2F2F2'
    }
});