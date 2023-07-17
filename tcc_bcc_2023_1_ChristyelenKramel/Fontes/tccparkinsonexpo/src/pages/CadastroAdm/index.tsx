import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { styles } from "./styles";
import { Button } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

const CadastroAdm = () => {
    const navigation = useNavigation<propsStack>()
    const [isAdmPrincipal, setIsAdmPrincipal] = useState(false);
    const [listaUsuario, setlistaUsuario] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        buscarAdmPrincipal();
    }, []);

    useEffect(() => {
        validarUsuarioAdm();
    })

    const buscarAdmPrincipal = async () => {
        try {
            const usuariosRef = collection(FIRESTORE_DB, 'usuario');
            const subscriber = onSnapshot(usuariosRef, {
                next: (snapshot) => {
                    const usuario: any[] = [];
                    snapshot.docs.forEach((doc) => {
                        usuario.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    setlistaUsuario(usuario)
                }
            });
            return () => subscriber();
        } catch (error) {
            alert(error.message);
        }
    };

    const validarUsuarioAdm = () => {
        listaUsuario.filter(usuario => usuario.administrador).map(ListaUsuario =>{
            console.log("userID " + ListaUsuario.usuario + "auth "+ auth.currentUser.uid)
            if (auth.currentUser.uid == ListaUsuario.usuario) {
                setIsAdmPrincipal(true);
            }
        });
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingBottom: 30, paddingTop:40, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.containerBotoes}>
                        <Button icon="arrow-left-circle" mode="outlined" textColor="#54abf7" style={styles.buttonCabecalho}
                            onPress={() => navigation.goBack()}>
                            Voltar
                        </Button>
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.textGroup}>Área do Administrador</Text>
                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("CadastroVideo")}>
                            <Text>Cadastrar novos vídeos</Text>
                        </Button>

                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("CadastroNiveis")}>
                            <Text>Cadastrar novos níveis</Text>
                        </Button>

                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("CadastroBlog")}>
                            <Text>Cadastrar nova Matéria</Text>
                        </Button>

                        {isAdmPrincipal && <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("AprovarCoordenador")}>
                            <Text>Avaliar Coordenadores</Text>
                        </Button>}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default CadastroAdm