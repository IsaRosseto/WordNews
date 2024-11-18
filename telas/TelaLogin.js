// telas/TelaLogin.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { autenticarUsuario } from '../utils/Usuario';
import { useNavigation } from '@react-navigation/native';

const TelaLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      await autenticarUsuario(email, senha);
      navigation.replace('TelaDashboard');
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.logoContainer}>
        <Icon name="globe" size={80} color="#4a90e2" />
        <Text style={estilos.logoTexto}>Globo News</Text>
      </View>

      <View style={estilos.formContainer}>
        <TextInput
          style={estilos.input}
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={estilos.input}
          placeholder="Senha"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          onChangeText={setSenha}
          value={senha}
        />
        {erro ? <Text style={estilos.erroTexto}>{erro}</Text> : null}

        <TouchableOpacity style={estilos.botaoLogin} onPress={handleLogin}>
          <Text style={estilos.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('TelaCadastro')}>
          <Text style={estilos.textoCadastro}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoTexto: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#D1D1D1',
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  botaoLogin: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  erroTexto: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 15,
  },
  textoCadastro: {
    color: '#4a90e2',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default TelaLogin;
