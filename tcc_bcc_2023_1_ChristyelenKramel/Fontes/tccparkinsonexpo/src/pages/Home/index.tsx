import React, { useEffect, useState } from "react";
import { View, Text, Image, SafeAreaView, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { styles } from "./styles";
import { Button } from "react-native-paper";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";

const Home = () => {
    const navigation = useNavigation<propsStack>();
    const [fichaAnamnese, setFichaAnamnese] = useState([]);
    const [listaUsuario, setlistaUsuario] = useState([]);
    const [usuarioPossuiPermissao, setusuarioPossuiPermissao] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        buscarFichaAnamnese();
        buscarUsuario();
    }, []);

    useEffect(() => {
        validarPossuiRegraCoordenador(listaUsuario)
    })

    const logout = () => {
        auth.signOut()
          .then(() => {
            navigation.navigate("Login");
          })
          .catch(error => {
            // Ocorreu um erro durante o logout
            console.log(error);
          });
      }

    const buscarFichaAnamnese = () => {
        try {
            const fichaAnamneseRef = collection(FIRESTORE_DB, 'fichaAnamnese');
            const q = query(fichaAnamneseRef, where('usuario', '==', auth.currentUser.uid));
            const subscriber = onSnapshot(fichaAnamneseRef, {
                next: (snapshot) => {
                    const fichaAnamnese: any[] = [];
                    snapshot.docs.forEach((doc) => {
                        fichaAnamnese.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    setFichaAnamnese(fichaAnamnese)
                }
            });

            return () => subscriber();

        } catch (error) {
            alert(error.message);
        }
    };
    const buscarUsuario = async () => {
        try {
            const usuariosRef = collection(FIRESTORE_DB, 'usuario');
            const q = query(usuariosRef, where('usuario', '==', auth.currentUser.uid));
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

    const validarPossuiRegraCoordenador = (usuario) => {
        console.log(auth.currentUser.uid)

        for (let index = 0; index < usuario.length; index++) {
            if (auth.currentUser.uid == usuario[index].usuario) {
                setusuarioPossuiPermissao(usuario[index].coordenador);
                console.log(usuario[index].coordenador)
            }
        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingTop:40, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.containerBotoes}>
                        <Button icon="logout" mode="outlined" textColor="#54abf7" style={styles.buttomAdm}
                            onPress={() => logout()}>
                            Sair
                        </Button>
                        {usuarioPossuiPermissao && <Button icon="security" mode="outlined" textColor="#54abf7" style={styles.buttomAdm}
                            onPress={() => navigation.navigate("CadastroAdm")}>
                            Área do administrador
                        </Button>
                        }
                    </View>
                    <View style={styles.container}>
                        <Image
                            source={require('../../../assets/imagens/LogoApp.png')}
                            style={{ width: 200, height: 200, alignSelf: "center" }} />
                        <Text style={styles.textGroupLegenda} > DP Move </Text>
                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("Niveis")}>
                            <Text>Exercícios</Text>
                        </Button>

                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("FichaAnamnese", { fichaAnamnese: fichaAnamnese })}>
                            <Text>Dados do Participante</Text>
                        </Button>

                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("Ofensiva")}>
                            <Text>Conquistas</Text>
                        </Button>

                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => navigation.navigate("Blog")}>
                            <Text>Blog</Text>
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Home