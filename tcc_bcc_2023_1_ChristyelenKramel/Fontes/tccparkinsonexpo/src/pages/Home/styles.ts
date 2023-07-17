import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignItems:"center"
    },
    buttom: {
        marginTop: 40,
        backgroundColor: '#54abf7',
        height: 60,
        width: '100%'
    },
    scroll: {
        flex: 1,
    },
    textButton: {
        fontSize: 30,
        paddingTop: 15,
        width: '100%'
    },
    textGroupLegenda:{
        fontSize: 20,
        margin: 8,
        fontWeight: "bold",
        color: '#54abf7'
    },
    textGroup: {
        fontSize: 20,
        margin: 8,
        fontWeight: "bold",
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent:"space-between",
        marginLeft: 20,
        marginRight:20
    },
    buttomAdm: {
        marginTop: 8,
        borderColor:'#54abf7',
    },
})