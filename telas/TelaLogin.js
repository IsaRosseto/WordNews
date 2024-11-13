// telas/TelaLogin.js
import React, { useState, useContext } from 'react';
import { 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { autenticarUsuario } from '../utils/Usuario';
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';

const criarEstilos = (tema) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: tema.background,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 32,
    marginBottom: 40,
    textAlign: 'center',
    color: tema.texto,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: tema.borda,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: tema.texto,
    backgroundColor: tema.card,
    fontSize: 16,
  },
  botao: {
    backgroundColor: tema.botao,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoCadastro: {
    marginTop: 20,
    color: tema.link,
    textAlign: 'center',
    fontSize: 16,
  },
});

const TelaLogin = ({ navigation }) => {
  const { tema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const realizarLoginLocal = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await autenticarUsuario(email, senha);
      navigation.replace('TelaDashboard');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>WORD NEWS</Text>
      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={estilos.botao} onPress={realizarLoginLocal}>
        <Text style={estilos.textoBotao}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('TelaCadastro')}>
        <Text style={estilos.textoCadastro}>Não possui uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TelaLogin;
