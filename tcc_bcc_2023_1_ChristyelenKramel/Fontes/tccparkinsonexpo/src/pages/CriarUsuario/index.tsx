import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Linking } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { Badge, Button, Checkbox, HelperText, TextInput } from "react-native-paper";
import { styles } from "../Login/styles";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import validator from 'validator';
import qs from 'qs';



const CriarUsuario = () => {
    const navigation = useNavigation<propsStack>()
    const [emailValue, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [coordenador, setCoordenador] = useState(false);
    const [cpf, setCpf] = useState('');
    const EMAIL_ADM = "christyelenkra@gmail.com";
    const auth = getAuth();
    const [mostrarAlerta, setMostrarAlerta] = useState(false);


    //campos obrigatorios

    const [errorEmail, setErrorEmail] = useState('')
    const [errorSenha, setErrorSenha] = useState('')
    const [errorSenhaConfirmacao, setErrorSenhaConfirmacao] = useState('')
    const [errorCPF, setErrorCPF] = useState('')
    const [possuiErro, setPossuiErro] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home");
            }
        })
        return unsubscribe;
    }, [])

    const signUp = () => {
        if (validarCampos()) {
            const after = createUserWithEmailAndPassword(auth, emailValue, password).then(userCredentials => {
                const user = userCredentials.user;
                if (coordenador) {
                    addUsuario(user.uid, cpf);
                }
                else {
                    addUsuario(user.uid, "");
                }
                exibirAlerta();
            }).catch(error => alert(error.message));

        }
    }

    const addUsuario = async (usuario, cpf) => {
        const doc = await addDoc(collection(FIRESTORE_DB, 'usuario'), { usuario: usuario, cpf: cpf, coordenador: false, solicitacao: coordenador });
        if (cpf != "") {
            enviarEmail(cpf);
        }
    }

    const enviarEmail = async (cpf) => {
        let url = `mailto:${EMAIL_ADM}`;
        const query = qs.stringify({
            subject: 'Nova solicitação de coordenador',
            body: `Um usuário solicitou a permissão de coordenador, possuindo o CPF: ${cpf}. \n Avalie a solicitação no Firebase.`,
        });
        if (query.length) {
            url += `?${query}`;
        }
        const canOpen = await Linking.canOpenURL(url);
        if (!canOpen) {
            throw new Error('URL não está funcionando');
        }
        return Linking.openURL(url);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setCoordenador(!isChecked);
    };

    const validarCampos = () => {
        let erros = 0
        if (!validator.isEmail(emailValue)) {
            setErrorEmail('Por favor, insira um email válido.');
            erros += 1;
        }
        if (emailValue == '') {
            setErrorEmail("Campo Email é obrigatório!");
            erros += 1;
        }
        if (password == '') {
            setErrorSenha("Campo Senha é obrigatório!");
            erros += 1;
        }
        else if (password.length < 6) {
            setErrorSenha("Campo senha deve ter mais que 6 digitos");
            erros += 1;
        }

        if (confirmPassword == '') {
            setErrorSenhaConfirmacao("Campo Senha é obrigatório!");
            erros += 1;
        }
        else if (confirmPassword.length < 6) {
            setErrorSenhaConfirmacao("Campo senha deve ter mais que 6 digitos");
            erros += 1;
        }
        if (password != confirmPassword) {
            setErrorSenha("Senhas não batem.");
            erros += 1;
        }

        if (coordenador && cpf == '') {
            setErrorCPF("Campo CPF é obrigatório!");
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

    const exibirAlerta = () => {
        setMostrarAlerta(true);
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3000);
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingBottom: 30, paddingTop: 40, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.containerBotoes}>
                        <Button icon="arrow-left-circle" mode="outlined" textColor="#54abf7" style={styles.buttonCabecalho}
                            onPress={() => navigation.goBack()}>
                            Voltar
                        </Button>
                    </View>
                    <View style={styles.container}>
                        {mostrarAlerta && <Badge style={{ backgroundColor: '#90ee90', alignSelf: "center", width: '80%', height: 35, fontSize: 25, color: '#000000', padding: 10 }}>Salvo com sucesso!</Badge>}

                        <Text style={styles.textGroup}>Inscreva-se</Text>
                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="Email"
                            keyboardType="email-address"
                            activeOutlineColor="#54abf7"
                            value={emailValue}
                            onChangeText={(text: string) => setEmail(text)}
                        />
                        {possuiErro && <HelperText type="error">{errorEmail}</HelperText>}

                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="Senha"
                            activeOutlineColor="#54abf7"
                            value={password}
                            onChangeText={(text: string) => setPassword(text)}
                            secureTextEntry={!showPassword}
                            right={<TextInput.Icon icon="eye" onPress={toggleShowPassword} />}
                        />
                        {possuiErro && <HelperText type="error">{errorSenha}</HelperText>}

                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="Confirmar Senha"
                            activeOutlineColor="#54abf7"
                            value={confirmPassword}
                            onChangeText={(text: string) => setConfirmPassword(text)}
                            secureTextEntry={!showPassword}
                            right={<TextInput.Icon icon="eye" onPress={toggleShowPassword} />}
                        />
                        {possuiErro && <HelperText type="error">{errorSenhaConfirmacao}</HelperText>}

                        <View style={{ flexDirection: "row", flex: 1, alignSelf: "flex-start", marginTop: 10 }}>
                            <Checkbox.Android
                                status={isChecked ? 'checked' : 'unchecked'}
                                onPress={handleCheckboxChange}
                                uncheckedColor="#54abf7"
                                color="#54abf7" />
                            <Text style={{ alignSelf: "center" }}>Perfil de coordenador?</Text>
                        </View>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            {isChecked &&
                                <TextInput style={styles.campostexto}
                                    mode="outlined"
                                    activeOutlineColor="#54abf7"
                                    label="CPF"
                                    keyboardType="numeric"
                                    onChangeText={(text: string) => {
                                        setCpf(text.replace(/\D/g, '')
                                            .replace(/(\d{3})(\d)/, '$1.$2')
                                            .replace(/(\d{3})(\d)/, '$1.$2')
                                            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                                            .replace(/(-\d{2})\d+?$/, '$1'))
                                    }}
                                    value={cpf}
                                />
                            }
                        </View>
                        {possuiErro && <HelperText type="error">{errorCPF}</HelperText>}

                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={signUp}>
                            <Text>Cadastrar</Text>
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView >
        </>
    )
}

export default CriarUsuario