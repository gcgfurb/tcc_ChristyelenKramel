import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { propsNavigationStack } from "./Models";

import Home from "../../pages/Home"
import FichaAnamnese from "../../pages/FichaAnamnese"
import Exercicio from "../../pages/Exercicio"
import Blog from "../../pages/Blog"
import Niveis from "../../pages/Niveis"
import Ofensiva from "../../pages/Ofensiva"
import PreExercicio from "../../pages/PreExercicio"
import Login from "../../pages/Login";
import CadastroAdm from "../../pages/CadastroAdm";
import CadastroVideo from "../../pages/CadastroVideo";
import CadastroNives from "../../pages/CadastroNiveis";
import CadastroBlog from "../../pages/CadastroBlog";
import CriarUsuario from "../../pages/CriarUsuario";
import AprovarCoordenador from "../../pages/AprovarCoordenador";

const {Navigator, Screen } = createNativeStackNavigator<propsNavigationStack>()

export default function(){
    return(
        <Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Screen name="Home" component={Home}/>
            <Screen name="FichaAnamnese" component={FichaAnamnese}/>
            <Screen name="Exercicio" component={Exercicio}/>
            <Screen name="Niveis" component={Niveis}/>
            <Screen name="Ofensiva" component={Ofensiva}/>
            <Screen name="PreExercicio" component={PreExercicio}/>
            <Screen name="Blog" component={Blog}/>
            <Screen name="Login" component={Login}/>
            <Screen name="CadastroAdm" component={CadastroAdm} />
            <Screen name="CadastroVideo" component={CadastroVideo} />
            <Screen name="CadastroNiveis" component={CadastroNives} />
            <Screen name="CadastroBlog" component={CadastroBlog} />
            <Screen name="CriarUsuario" component={CriarUsuario} />
            <Screen name="AprovarCoordenador" component={AprovarCoordenador} />
        </Navigator>
    )
}