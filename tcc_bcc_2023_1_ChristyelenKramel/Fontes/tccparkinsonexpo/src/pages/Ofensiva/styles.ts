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
    textGroup: {
        fontSize: 30,
        textAlign:"center",
        margin: 8,
        fontWeight: "bold",
        color: '#54abf7'
    },
})