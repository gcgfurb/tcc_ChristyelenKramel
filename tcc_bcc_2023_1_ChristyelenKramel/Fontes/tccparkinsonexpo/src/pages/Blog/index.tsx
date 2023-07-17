import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { styles } from "./styles";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import CardBlog from "../../componentes/Blog";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

const Blog = () => {
    const navigation = useNavigation<propsStack>()
    const [listaMaterias, setlistaMaterias] = useState([]);

    useEffect(() => {
        buscarMaterias();
    }, []);

    const buscarMaterias = async () => {
        try {
            const materiasRef = collection(FIRESTORE_DB, 'blog');
            const subscriber = onSnapshot(materiasRef, {
                next: (snapshot) => {
                    const materias: any[] = [];
                    snapshot.docs.forEach((doc) => {
                        materias.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    setlistaMaterias(materias)
                }
            });
            return () => subscriber();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingBottom: 30, paddingTop:40, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.containerBotoes}>
                        <Button icon="arrow-left-circle" mode="outlined" textColor="#54abf7" style={styles.buttom}
                            onPress={() => navigation.goBack()}>
                            Voltar
                        </Button>
                    </View>
                    <Text style={styles.textGroup}>Blog de noticías</Text>
                    <View>
                        {listaMaterias.map(materia => (
                            <CardBlog key={materia.id} titulo={materia.titulo} descricao={materia.descricao} url={materia.urlMateria} imagem={materia.urlImage} ></CardBlog>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Blog