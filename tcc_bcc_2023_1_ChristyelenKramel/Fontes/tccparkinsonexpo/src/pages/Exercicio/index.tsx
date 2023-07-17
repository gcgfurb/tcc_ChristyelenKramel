import React, { useState, useCallback, useEffect } from "react";
import { Alert, SafeAreaView, ScrollView, View, Image, useWindowDimensions } from "react-native";
import { ActivityIndicator, Button, Dialog, Portal, Provider, Text } from "react-native-paper";
import { SCREEN_SPACE, VIDEO_HEIGHT, styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import YoutubePlayer, { PLAYER_STATES } from "react-native-youtube-iframe";
import * as ScreenOrientation from 'expo-screen-orientation';
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import moment from 'moment';
import { getAuth } from "firebase/auth";

const Exercicio = (props) => {

    const { width } = useWindowDimensions();
    const VIDEO_WIDTH = width - (SCREEN_SPACE * 2);
    const navigation = useNavigation<propsStack>();

    const [videoReady, setVideoReady] = useState(false);
    const [videoAtual, setVideoAtual] = useState(1);
    const [idVideo, setIdVideo] = useState(''); //fazer o metodo p trocar o id do video e nao ficar renderizando novos youtube players
    const [isPlaying, setIsPlaying] = useState(false);
    const [contemErro, setContemErro] = useState(false);
    const [fimExercicio, setFimExercicio] = useState(false);
    const [dataHoraInicial, setDataHoraInicial] = useState('');
    let duracaoExercicio = '';
    const [listaOfensivas, setlistaOfensivas] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        definirVideo();
        validarCadastro();
        buscarOfensivas();
        iniciarExercicioAlerta();
    }, []);

    const buscarOfensivas = async () => {
        try {
            const ofensivasRef = collection(FIRESTORE_DB, 'ofensiva');
            const subscriber = onSnapshot(ofensivasRef, {
                next: (snapshot) => {
                    const ofensivas: any[] = [];
                    snapshot.docs.forEach((doc) => {
                        ofensivas.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    setlistaOfensivas(ofensivas)

                }
            });
            return () => subscriber();
        } catch (error) {
            alert(error.message);
        }
    };

    const iniciarExercicioAlerta = () => {
        if (!videoReady)
            setDataHoraInicial(moment().toString());

        console.log("Passou no iniciar")
    }

    const addOfensiva = () => {
        const dataExercicioRealizado = moment();
        addDoc(collection(FIRESTORE_DB, 'ofensiva'), { dataExercicioRealizado: dataExercicioRealizado.format('YYYY-MM-DD'), dataOrdenacao: dataExercicioRealizado.toDate(), tempoDuracaoExercicio: duracaoExercicio, usuario: auth.currentUser.uid });
        console.log('Passou valor Ofensiva')
        buscarOfensivas();
    }

    const realizarContagemTempo = () => {

        let horaInicial = moment(dataHoraInicial, 'ddd MMM DD YYYY HH:mm:ss GMTZZ');
        console.log(horaInicial);

        let horaFinal = moment(moment().toString(), 'ddd MMM DD YYYY HH:mm:ss GMTZZ');
        console.log(horaFinal);

        const duration = moment.duration(horaFinal.diff(horaInicial));
        const horas = duration.hours();
        const minutos = duration.minutes();
        const segundos = duration.seconds();

        duracaoExercicio = formatarTempo(horas * 3600 + minutos * 60 + segundos);
    }

    const formatarTempo = (tempo) => {
        const horas = Math.floor(tempo / 3600);
        const minutos = Math.floor((tempo % 3600) / 60);
        const segundos = tempo % 60;

        return `${horas.toString().padStart(2, '0')}:${minutos
            .toString()
            .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    const validarCadastro = () => {
        if (props.route.params.idVideo1 == null ||
            props.route.params.idVideo2 == null ||
            props.route.params.idVideo03 == null) {
            setContemErro(true);
        }
    }

    const definirVideo = () => {
        switch (videoAtual) {
            case 1:
                if (props.route.params.idVideo1 != null) {
                    setIdVideo(props.route.params.idVideo1);
                    setVideoAtual(videoAtual + 1);

                }
                else {
                    setIdVideo('');
                }
                break;
            case 2:
                if (props.route.params.idVideo2 != null) {
                    setIdVideo(props.route.params.idVideo2);
                    setVideoAtual(videoAtual + 1);

                }
                else {
                    setIdVideo('');
                }
                break;
            case 3:
                if (props.route.params.idVideo03 != null) {
                    setIdVideo(props.route.params.idVideo03);
                    setVideoAtual(videoAtual + 1);
                }
                else {
                    setIdVideo('');
                }
                break;
            default:
                break;
        }
    }

    const proximoExercicio = () => {
        setIdVideo('');
        setTimeout(() => {
            definirVideo();
        }, 500);
    }

    const finalizarExercicio = () => {
        setIsPlaying(false);
        setFimExercicio(true);
        realizarContagemTempo();
        addOfensiva();
    }

    const onFullScreenChange = useCallback((isfullscreen: boolean) => {
        if (isfullscreen) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } else {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    }, []);

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingBottom: 30, paddingTop: 40, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.containerBotoes}>
                        <Button mode="outlined" textColor="#54abf7" style={styles.buttomAdm}
                            onPress={() => navigation.goBack()} icon="arrow-left-circle" >
                            Voltar
                        </Button>
                        {fimExercicio && <Button icon="flag-checkered"  mode="contained" buttonColor="#54abf7" style={styles.buttom} onPress={() => navigation.navigate("Ofensiva")}>
                            Conquistas
                        </Button>}
                    </View>
                    <View style={styles.container}>
                        {!fimExercicio && !contemErro && <View style={styles.player}>
                            <YoutubePlayer
                                height={videoReady ? VIDEO_HEIGHT + 20 : 0}
                                width={VIDEO_WIDTH}
                                play={isPlaying}
                                videoId={idVideo}
                                onReady={() => setVideoReady(true)}
                                onFullScreenChange={onFullScreenChange}
                            />
                        </View>}
                        <View>
                            {contemErro && <Text>Alerta: Exercicio não cadastrado corretamente. contate o administrador do sistema</Text>}
                            {!videoReady && !fimExercicio && !contemErro && <ActivityIndicator color="#54abf7" style={styles.loadingContainer} />}
                            {!fimExercicio && videoAtual <= 3 && !contemErro &&
                                <Button onPress={proximoExercicio} style={styles.buttomTela}
                                    labelStyle={styles.textButton} mode="contained">
                                    Próximo exercício
                                </Button>}
                            {!fimExercicio && videoAtual > 3 && !contemErro &&
                                <Button onPress={finalizarExercicio} style={styles.buttomTela}
                                    labelStyle={styles.textButton} mode="contained">
                                    Finalizar exercícios
                                </Button>}
                            {fimExercicio && <Image
                                source={require('../../../assets/imagens/Trofeu.png')}
                                style={{ width: 200, height: 200, alignSelf: "center" }} />}

                            {fimExercicio && !contemErro &&
                                <Text style={{ margin: 10, fontSize: 30, textAlign: "center" }}>
                                   <Text style={{ fontWeight: 'bold',textAlign: "center" }}>Parabéns! {`\n`}</Text>
                                    Você finalizou seus exercicios diários!{`\n`}
                                    Veja sua evolução na página de  Conquistas.
                                </Text>}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

export default Exercicio;