import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingBottom: 70
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
        fontWeight: "bold"

    },
    buttom: {
        marginTop: 8,
        borderColor:'#54abf7',
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 20,
        marginRight: 20
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color:"#54abf7"
    },
    description: {
        fontSize: 20,
    },

});