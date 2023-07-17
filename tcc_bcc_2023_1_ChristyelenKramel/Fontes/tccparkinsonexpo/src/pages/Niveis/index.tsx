import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { styles } from "./styles";
import { Button } from "react-native-paper";
import { collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

const Niveis = () => {
    const navigation = useNavigation<propsStack>()
    const [listaNiveis, setlistaNiveis] = useState([]);
    const [listaPreExercicio, setlistaPreExercicio] = useState([]);


    useEffect(() => {
        buscarNiveis();
        buscarPreExercicio();
    }, []);

    const buscarPreExercicio = () => {
        try {
            const preExercicioRef = collection(FIRESTORE_DB, 'exercicio');
            const subscriber = onSnapshot(preExercicioRef, {
                next: (snapshot) => {
                    const preExercicio: any[] = [];
                    snapshot.docs.forEach((doc) => {
                        preExercicio.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    setlistaPreExercicio(preExercicio)
                }
            });

            return () => subscriber();

        } catch (error) {
            alert(error.message);
        }
    };


    const buscarNiveis = async () => {
        try {
            const niveisRef = collection(FIRESTORE_DB, 'nivel');
            const subscriber = onSnapshot(niveisRef, {
                next: (snapshot) => {
                    const niveis: any[] = [];
                    snapshot.docs.forEach((doc) => {
                        niveis.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    setlistaNiveis(niveis);
                }
            });
            return () => subscriber();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingBottom: 30, paddingTop:20, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.containerBotoes}>
                        <Button icon="arrow-left-circle" mode="outlined" textColor="#54abf7" style={styles.buttomCabecalho}
                            onPress={() => navigation.goBack()}>
                            Voltar
                        </Button>
                    </View>

                    <View style={styles.containerBotoes}>
                        <View style={styles.container}>
                            {listaNiveis.map(niveis => (
                                <Button
                                    key={niveis.key}
                                    labelStyle={styles.textButton}
                                    style={styles.buttom}
                                    onPress={() => navigation.navigate("PreExercicio", { nivel: niveis.value, listaOfensiva: listaPreExercicio})}
                                    mode="contained">
                                    <Text>{niveis.label}</Text>
                                </Button>))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Niveis