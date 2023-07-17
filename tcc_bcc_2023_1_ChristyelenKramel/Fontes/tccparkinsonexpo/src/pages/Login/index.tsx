import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { propsStack } from "../../routes/Stack/Models";
import { ActivityIndicator, Badge, Button, HelperText, TextInput } from "react-native-paper";
import { styles } from "../Login/styles";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, ActionCodeSettings } from "firebase/auth";
import validator from 'validator';

const Login = () => {
    const navigation = useNavigation<propsStack>()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const auth = getAuth();
    var carregamento = false;

    //campos obrigatorios

    const [errorEmail, setErrorEmail] = useState('')
    const [errorSenha, setErrorSenha] = useState('')
    const [possuiErro, setPossuiErro] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home");
            }
        })
        return unsubscribe;
    }, []);

    const resetPassword = () => {
        if (email == '') {
            setErrorEmail('Adicione um email para recuperar a senha!');
            setPossuiErro(true);
        }
        else {
            console.log('E-mail de redefinição de senha enviado com sucesso.');
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    console.log('E-mail de redefinição de senha enviado com sucesso.');
                    exibirAlerta();
                })
                .catch((error) => {
                    console.log('Erro ao enviar o e-mail de redefinição de senha:', error);
                });
        }
    };

    const signIn = () => {
        if (validarCampos()) {
            const user = signInWithEmailAndPassword(auth, email, password).then(userCredentials => {
                const user = userCredentials.user;
            }).catch(error => {
                switch (error.code) {
                    case 'auth/user-not-found':
                        setErrorEmail('Email inválido. Por favor, verifique o email digitado.');
                        setPossuiErro(true);
                        break;
                    case 'auth/invalid-email':
                        setErrorEmail('Email inválido. Por favor, verifique o email digitado.');
                        setPossuiErro(true);
                    case 'auth/wrong-password':
                        setErrorSenha('Senha incorreta. Por favor, tente novamente.');
                        setPossuiErro(true);
                    case 'auth/too-many-requests':
                        setErrorSenha('Muitas tentativas de login. Por favor, tente novamente mais tarde.');
                        setPossuiErro(true);
                    default:
                        alert(error.message)
                        break;
                }
            });
        }
    }


    const validarCampos = () => {
        let erros = 0

        if (!validator.isEmail(email)) {
            setErrorEmail('Por favor, insira um email válido.');
            erros += 1;
        }
        if (email == '') {
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
        if (erros > 0) {
            setPossuiErro(true);
            return false;
        }
        else {
            setPossuiErro(false);
            return true;
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const exibirAlerta = () => {
        setTimeout(() => {
            Alert.alert("Email enviado com sucesso!");
        }, 3000);
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, paddingBottom: 30, paddingTop: 40, backgroundColor: '#ebf6fa', }}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.container}>
                        <Text style={styles.textGroup}>Entre ou inscreva-se</Text>
                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="Email"
                            value={email}
                            activeOutlineColor="#54abf7"
                            onChangeText={(text: string) => setEmail(text)}
                        />
                        {possuiErro && <HelperText type="error">{errorEmail}</HelperText>}

                        <TextInput style={styles.campostexto}
                            mode="outlined"
                            label="Senha"
                            value={password}
                            activeOutlineColor="#54abf7"
                            onChangeText={(text: string) => setPassword(text)}
                            secureTextEntry={!showPassword}
                            right={<TextInput.Icon icon="eye" onPress={toggleShowPassword} />}
                        />
                        {possuiErro && <HelperText type="error">{errorSenha}</HelperText>}

                        <View style={{ flexDirection: "row", padding: 10 }}>

                            <Text style={{ marginRight: 5 }}>Esqueceu sua senha?</Text>
                            <TouchableOpacity onPress={resetPassword}>
                                <Text style={{ color: '#54abf7' }}>Clique aqui!</Text>
                            </TouchableOpacity>
                        </View>
                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={signIn}>
                            <Text>Entrar</Text>
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.buttom}
                            labelStyle={styles.textButton}
                            onPress={() => { navigation.navigate("CriarUsuario") }}>
                            <Text>Criar novo usuário</Text>
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Login