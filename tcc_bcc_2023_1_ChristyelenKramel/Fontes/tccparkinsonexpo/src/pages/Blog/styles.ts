import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
    },
    buttom: {
        marginTop: 8,
        borderColor:"#54abf7"
    },
    scroll: {
        flex: 1,
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 20,
        marginRight: 20
    },
    loadingContainer: {
        position: 'relative',
        borderRadius: 10,
        padding: 10,
        color: "#54abf7"
    },
    textGroup: {
        fontSize: 20,
        margin: 8,
        fontWeight: "bold",
        color: '#54abf7',
        alignSelf: "center"
    },
    campostexto: {
        width: '100%',
        marginTop: 5,
    },
})