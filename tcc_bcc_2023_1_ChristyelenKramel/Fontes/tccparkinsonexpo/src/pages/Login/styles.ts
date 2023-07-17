import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingContainer: {
        position: 'relative',
        borderRadius: 10,
        padding: 10,
        color: "#54abf7"
    },
    buttom: {
        marginTop: 50,
        backgroundColor: '#54abf7',
        height: 60,
        width: '100%'
    },
    buttonCabecalho: {
        marginTop: 8
    },
    scroll: {
        flex: 1,
    },
    textButton: {
        fontSize: 30,
        paddingTop: 15,
        width: '100%'
    },
    textGroup: {
        fontSize: 20,
        margin: 8,
        fontWeight: "bold",
        color: '#54abf7'
    },
    campostexto: {
        width: '100%',
        marginTop: 5,
        borderColor: "#54abf7"
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 20,
        marginRight: 20
    },

})