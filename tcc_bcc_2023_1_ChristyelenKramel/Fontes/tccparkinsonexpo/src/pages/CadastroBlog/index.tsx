import React, { useEffect, useState } from "react";
import { View, Text, Image, SafeAreaView, ScrollView, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { styles } from "./styles";
import { Badge, Button, Card, DataTable, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

const CadastroBlog = () => {
    const navigation = useNavigation<propsStack>()
    const [image, setImage] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [urlMateria, setUrlMateria] = useState('');
    const [idDocumento, setIdDocumento] = useState('');
    const [estaEditando, setEstaEditando] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);


    const [listaMaterias, setlistaMaterias] = useState([]);

    //Campos Obrigatórios:

    const [errorTitulo, setErrorTitulo] = useState('')
    const [errorDescricao, setErrorDescricao] = useState('')
    const [errorURLMateria, setErrorURLMateria] = useState('')
    const [possuiErro, setPossuiErro] = useState(false);


    useEffect(() => {
        buscarMaterias();
    }, []);

    const validarCampos = () => {
        let erros = 0
        if (titulo == '') {
            setErrorTitulo("Campo Titulo é obrigatório!");
            erros += 1;
        }
        if (descricao == '') {
            setErrorDescricao("Campo Descrição é obrigatório!");
            erros += 1;
        }
        if (urlMateria == '') {
            setErrorURLMateria("Campo URL é obrigatório!");
            erros += 1;
        }

        if (erros > 0) {
            setPossuiErro(true);
            return false;
        }
        else {
            setPossuiErro(false);
            return true;
        }
    }

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

    const addMateria = async () => {
        if (validarCampos()) {
            const doc = await addDoc(collection(FIRESTORE_DB, 'blog'), { titulo: titulo, descricao: descricao, urlImage: image, urlMateria: urlMateria });
            exibirAlerta();
            limparCampos();
        }
    }

    const limparCampos = () => {
        setTitulo('');
        setDescricao('');
        setUrlMateria('');
        setImage('');
        setIdDocumento('');
        setEstaEditando(false);
    }

    const handleImageSelect = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result.assets[0].uri);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const excluirRegistro = (idDocumento) => {
        Alert.alert(
            'Excluir?',
            'Deseja realmente excluir o registro?',
            [
                {
                    text: 'Sim', onPress: () => {
                        const documentRef = doc(FIRESTORE_DB, 'blog', idDocumento);
                        // Remove o documento
                        deleteDoc(documentRef).then(() => {
                            console.log('Documento removido com sucesso!');
                        }).catch((error) => {
                            console.error('Erro ao remover o documento:', error);
                        });

                    }
                },
                {
                    text: 'Não', onPress: () => {
                    }
                }
            ]
        );

    }

    const preencherCamposEdicao = (idDocumento) => {
        listaMaterias.filter((item) => item.id == idDocumento).map(materia => {
            setTitulo(materia.titulo);
            setDescricao(materia.descricao);
            setUrlMateria(materia.urlMateria);
            setImage(materia.image);
        })
        setEstaEditando(true);
        setIdDocumento(idDocumento);
    }

    const editarRegistro = async () => {
        console.log("Editar")
        try {
            if (validarCampos()) {
                const documentRef = doc(FIRESTORE_DB, 'blog', idDocumento);
                await updateDoc(documentRef, {
                    titulo: titulo,
                    descricao: descricao,
                    urlMateria: urlMateria,
                    urlImage: image ? image : null
                });
                limparCampos();
                exibirAlerta();
                console.log('Documento atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao atualizar o documento:', error);
        }
    }

    const exibirAlerta = () => {
        setMostrarAlerta(true);
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3000);
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
                        {!estaEditando && <Button icon="content-save-outline" buttonColor="#54abf7" mode="contained" style={styles.buttom}
                            onPress={addMateria}>
                            Salvar
                        </Button>}
                        {estaEditando && <Button icon="content-save-outline" buttonColor="#54abf7" mode="contained" style={styles.buttom}
                            onPress={editarRegistro}>
                            Salvar edição
                        </Button>}

                    </View>

                    <View style={styles.container}>
                        {mostrarAlerta && <Badge style={{ backgroundColor: '#90ee90', alignSelf: "center", width: '80%', height: 35, fontSize: 25, color: '#000000', padding: 10 }}>Salvo com sucesso!</Badge>}

                        <Text style={styles.textGroup}>Cadastrar nova matéria</Text>
                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="Titulo da Matéria"
                            activeOutlineColor="#54abf7"
                            onChangeText={(text: string) => setTitulo(text)}
                            value={titulo}
                        />
                        {possuiErro && <HelperText type="error">{errorTitulo}</HelperText>}

                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            activeOutlineColor="#54abf7"
                            label="Texto da Matéria"
                            multiline
                            numberOfLines={4}
                            onChangeText={(text: string) => setDescricao(text)}
                            value={descricao}
                        />
                        {possuiErro && <HelperText type="error">{errorDescricao}</HelperText>}

                        <TextInput style={styles.campostexto}
                            activeOutlineColor="#54abf7"
                            mode="outlined"
                            label="Url da matéria"
                            onChangeText={(text: string) => setUrlMateria(text)}
                            value={urlMateria}
                        />
                        {possuiErro && <HelperText type="error">{errorURLMateria}</HelperText>}

                        <View style={{ flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                            <Button icon={'camera'} textColor="#54abf7" onPress={() => handleImageSelect()} >Selecione uma imagem</Button>
                            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                        </View>
                    </View>
                    <View style={styles.containerTabela}>
                        <Card>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>ID</DataTable.Title>
                                    <DataTable.Title>Ações</DataTable.Title>
                                </DataTable.Header>
                                {listaMaterias.map(materia => (
                                    <DataTable.Row>
                                        <DataTable.Cell>{materia.id}</DataTable.Cell>
                                        <DataTable.Cell>
                                            <>
                                                <Button icon="pencil-outline" textColor="#54abf7" style={styles.buttom}
                                                    onPress={() => preencherCamposEdicao(materia.id)}>
                                                </Button>
                                                <Button icon="trash-can-outline" textColor="#54abf7" style={styles.buttom}
                                                    onPress={() => excluirRegistro(materia.id)}>
                                                </Button>
                                            </>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                            </DataTable>
                        </Card>
                    </View>
                </ScrollView>
            </SafeAreaView >
        </>
    )
}

export default CadastroBlog