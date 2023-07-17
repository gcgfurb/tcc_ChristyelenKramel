import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    buttom: {
        marginTop: 8,
        borderColor:"#54abf7"
    },
    scroll: {
        flex: 1,
    },
    textButton: {
        fontSize: 30,
        padding: 15,
        width: '100%'
    },
    textGroup: {
        fontSize: 20,
        margin: 8,
        fontWeight: "bold",
        color: '#54abf7'
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 20,
        marginRight: 20
    },
    campostexto: {
        width: '100%',
        marginTop: 5,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    buttomImage: {
        borderRadius: 5,
    },
    containerImage: {
        justifyContent: "center",
        alignSelf: "center",
        width: '100%',
        marginTop: 8
    },
    containerTabela: {
        padding: 20
    }
})