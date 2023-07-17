import{ NativeStackNavigationProp} from "@react-navigation/native-stack"

export type propsNavigationStack = {
    Home: undefined
    FichaAnamnese:{
        fichaAnamnese: object
    }
    Exercicio: {
        idVideo1: string,
        idVideo2: string,
        idVideo03: string
    }
    Blog: undefined
    PreExercicio: {
        nivel: string,
        listaOfensiva: object
    }
    Ofensiva:undefined
    Niveis: undefined
    Login: undefined
    CadastroAdm: undefined
    CadastroVideo: undefined
    CadastroNiveis: undefined
    CadastroBlog: undefined
    CriarUsuario: undefined
    AprovarCoordenador: undefined
}

export type propsStack = NativeStackNavigationProp<propsNavigationStack>