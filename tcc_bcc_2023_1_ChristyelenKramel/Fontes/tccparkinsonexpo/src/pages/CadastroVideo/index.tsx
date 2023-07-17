import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, FlatList, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { styles } from "./styles";
import { Badge, Button, Card, DataTable, HelperText, List, TextInput } from "react-native-paper";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import ModalDropdown from 'react-native-modal-dropdown';

const CadastroVideo = () => {
    const navigation = useNavigation<propsStack>()

    const [exercicio, setExercicio] = useState('')
    const [tituloExercicio, setTituloExercicio] = useState('')
    const [descricaoExercicio, setDescricaoExercicio] = useState('')
    const [idVideo, setIdVideo] = useState('')
    const [nivel, setNivel] = useState('')
    const [listaExercicio, setListaExercicios] = useState([]);
    const [idDocumento, setIdDocumento] = useState('');
    const [estaEditando, setEstaEditando] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    var nivelValue = "";


    //Campos Obrigatórios:

    const [errorTitulo, setErrorTitulo] = useState('')
    const [errorIdVideo, setErrorIdVideo] = useState('')
    const [errorDescricao, setErrorDescricao] = useState('')
    const [errorNivel, setErrorNivel] = useState('')
    const [possuiErro, setPossuiErro] = useState(false);
    const [listaNiveis, setListaNiveis] = useState([]);

    useEffect(() => {
        buscarExercicio();
        buscarNiveis();
    }, []);

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
                    console.log(JSON.stringify(niveis))
                    setListaNiveis(niveis)
                }
            });
            return () => subscriber();
        } catch (error) {
            alert(error.message);
        }
    };

    const validarCampos = () => {
        let erros = 0
        if (idVideo == '') {
            setErrorIdVideo("Campo ID vídeo é obrigatório!");
            erros += 1;
        }
        if (tituloExercicio == '') {
            setErrorTitulo("Campo Titulo é obrigatório!");
            erros += 1;
        }
        if (descricaoExercicio == '') {
            setErrorDescricao("Campo Descrição é obrigatório!");
            erros += 1;
        }
        console.log("aqui " + nivel);
        if (nivel == null) {
            setErrorNivel("Campo Nivel é obrigatório!");
            erros += 1;
        }
        else {
            for (let index = 0; index < listaNiveis.length; index++) {
                if (listaNiveis[index].label == nivel) {
                    nivelValue = listaNiveis[index].value;
                    console.log("nivel tesste: " + nivelValue)
                }
            }
        }

        listaExercicio.filter((item) => item.id == idDocumento).map(exercicio => {

            if (exercicio.nivel != nivelValue) {
                let quantidadeVideosNivel = 0;
                listaExercicio.map((item) => {
                    if (item.nivel == nivelValue) {
                        quantidadeVideosNivel = quantidadeVideosNivel + 1;
                    }
                });
                if (quantidadeVideosNivel == 3) {
                    setErrorNivel("Esse nivel já possui a quantidade máxima de videos permitida.");
                    erros += 1;
                }
            }
        })

        if (erros > 0) {
            setPossuiErro(true);
            return false;
        }
        else {
            setPossuiErro(false);
            return true;
        }
    }

    const buscarExercicio = async () => {
        try {
            const exercicioRef = collection(FIRESTORE_DB, 'exercicio');
            const subscriber = onSnapshot(exercicioRef, {
                next: (snapshot) => {
                    const exercicio: any[] = [];
                    snapshot.docs.forEach((doc) => {
                        exercicio.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    setListaExercicios(exercicio)
                }
            });
            return () => subscriber();
        } catch (error) {
            alert(error.message);
        }
    };

    const excluirRegistro = (idDocumento) => {
        Alert.alert(
            'Excluir?',
            'Deseja realmente excluir o registro?',
            [
                {
                    text: 'Sim', onPress: () => {
                        const documentRef = doc(FIRESTORE_DB, 'exercicio', idDocumento);

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
        listaExercicio.filter((item) => item.id == idDocumento).map(exercicio => {
            setIdVideo(exercicio.idVideo);
            setTituloExercicio(exercicio.tituloExercicio);
            setDescricaoExercicio(exercicio.descricaoExercicio);
            setNivel(exercicio.nivel);
        })
        setEstaEditando(true);
        setIdDocumento(idDocumento);
    }

    const editarRegistro = async () => {
        console.log("Editar")
        try {
            if (validarCampos()) {
                const documentRef = doc(FIRESTORE_DB, 'exercicio', idDocumento);
                await updateDoc(documentRef, {
                    idVideo: idVideo,
                    tituloExercicio: tituloExercicio,
                    descricaoExercicio: descricaoExercicio,
                    nivel: nivel
                });
                limparCampos();
                exibirAlerta();
                console.log('Documento atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao atualizar o documento:', error);
        }
    }

    const addExercicio = () => {
        if (validarCampos()) {
            console.log('Passou ' + nivelValue)
            const doc = addDoc(collection(FIRESTORE_DB, 'exercicio'), { idVideo: idVideo, tituloExercicio: tituloExercicio, descricaoExercicio: descricaoExercicio, nivel: nivelValue });
            limparCampos();
            exibirAlerta();
            setExercicio('');
        }
    }

    const exibirAlerta = () => {
        setMostrarAlerta(true);
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3000);
    };

    const limparCampos = () => {
        setIdVideo('');
        setTituloExercicio('');
        setDescricaoExercicio('');
        setNivel('');
        nivelValue = '';
        setIdDocumento('');
        setEstaEditando(false);
    }

    const selecionarNivel = (index, value) => {
        setNivel(value);
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingBottom: 30, paddingTop: 40, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.containerBotoes}>
                        <Button icon="arrow-left-circle" mode="outlined" textColor="#54abf7" style={styles.buttom}
                            onPress={() => navigation.goBack()}>
                            Voltar
                        </Button>
                        {!estaEditando && <Button icon="content-save-outline" buttonColor="#54abf7" mode="contained" style={styles.buttom}
                            onPress={addExercicio}>
                            Salvar
                        </Button>}
                        {estaEditando && <Button icon="content-save-outline" buttonColor="#54abf7" mode="contained" style={styles.buttom}
                            onPress={editarRegistro}>
                            Salvar edição
                        </Button>}

                    </View>
                    <View style={styles.container}>
                        {mostrarAlerta && <Badge style={{ backgroundColor: '#90ee90', alignSelf: "center", width: '80%', height: 35, fontSize: 25, color: '#000000', padding: 10 }}>Salvo com sucesso!</Badge>}

                        <Text style={styles.textGroup}>Cadastrar novos vídeos</Text>

                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="ID vídeo" 
                            activeOutlineColor="#54abf7"
                            onChangeText={(text: string) => setIdVideo(text)}
                            value={idVideo}
                        />
                        {possuiErro && <HelperText type="error">{errorIdVideo}</HelperText>}

                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="Titulo do Exercício"
                            activeOutlineColor="#54abf7"
                            onChangeText={(text: string) => setTituloExercicio(text)}
                            value={tituloExercicio}
                        />
                        {possuiErro && <HelperText type="error">{errorTitulo}</HelperText>}

                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            activeOutlineColor="#54abf7"
                            label="Descrição do Exercício"
                            multiline
                            numberOfLines={4}
                            onChangeText={(text: string) => setDescricaoExercicio(text)}
                            value={descricaoExercicio}
                        />
                        {possuiErro && <HelperText type="error">{errorDescricao}</HelperText>}

                        <ModalDropdown
                            options={listaNiveis.map(nivel => nivel.label)}
                            defaultValue="Selecione um nível"
                            onSelect={selecionarNivel}
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            dropdownStyle={styles.dropdownContainer}
                            dropdownTextStyle={styles.dropdownOptionText}
                            dropdownTextHighlightStyle={styles.dropdownOptionHighlight}
                        />
                        {possuiErro && <HelperText type="error">{errorNivel}</HelperText>}

                    </View>
                    <View style={styles.containerTabela}>
                        <Card>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>ID</DataTable.Title>
                                    <DataTable.Title>Ações</DataTable.Title>
                                </DataTable.Header>
                                {listaExercicio.map(exercicio => (
                                    <DataTable.Row>
                                        <DataTable.Cell>{exercicio.id}</DataTable.Cell>
                                        <DataTable.Cell>
                                            <>
                                                <Button icon="pencil-outline" textColor="#54abf7" style={styles.buttom}
                                                    onPress={() => preencherCamposEdicao(exercicio.id)}>
                                                </Button>
                                                <Button icon="trash-can-outline" textColor="#54abf7" style={styles.buttom}
                                                    onPress={() => excluirRegistro(exercicio.id)}>
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

export default CadastroVideo