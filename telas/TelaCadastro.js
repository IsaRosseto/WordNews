// telas/TelaCadastro.js
import React, { useState, useContext } from 'react';
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  StyleSheet, 
  View 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { registrarUsuario } from '../utils/Usuario';
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';

const TelaCadastro = ({ navigation }) => {
  const { tema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [pais, setPais] = useState('');

  const cadastrarUsuarioLocal = async () => {
    if (!nome || !email || !senha || !pais) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await registrarUsuario(nome, email, senha, pais);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('TelaLogin');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Criar Conta</Text>
      <TextInput
        style={estilos.input}
        placeholder="Nome Completo"
        placeholderTextColor={temas[tema].inputText}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        placeholderTextColor={temas[tema].inputText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        placeholderTextColor={temas[tema].inputText}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <View style={estilos.pickerContainer}>
        <Picker
          selectedValue={pais}
          style={estilos.picker}
          onValueChange={(itemValue) => setPais(itemValue)}
          dropdownIconColor={temas[tema].link}
        >
          <Picker.Item label="Selecione seu país de residência" value="" />
          <Picker.Item label="Alemanha" value="Alemanha" />
          <Picker.Item label="Estados Unidos" value="Estados Unidos" />
          <Picker.Item label="Brasil" value="Brasil" />
          <Picker.Item label="Itália" value="Itália" />
          <Picker.Item label="Israel" value="Israel" />
        </Picker>
      </View>
      <TouchableOpacity style={estilos.botao} onPress={cadastrarUsuarioLocal}>
        <Text style={estilos.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('TelaLogin')}>
        <Text style={estilos.textoCadastro}>Já possui uma conta? Faça login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const criarEstilos = (tema) => StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: tema.background,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    color: tema.texto,
    fontWeight: '700',
  },
  input: {
    height: 50,
    borderColor: tema.borda,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: tema.inputBackground,
    color: tema.inputText,
    fontSize: 16,
  },
  pickerContainer: {
    borderColor: tema.borda,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: tema.inputBackground,
  },
  picker: {
    height: 50,
    color: tema.inputText,
  },
  botao: {
    backgroundColor: tema.botao,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: tema.botao,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  textoCadastro: {
    color: tema.link,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default TelaCadastro;
