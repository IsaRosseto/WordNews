// telas/TelaDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { obterUsuarioAutenticado, deslogarUsuario } from '../utils/Usuario';
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';
import { useNavigation } from '@react-navigation/native';

const TelaDashboard = () => {
  const navigation = useNavigation();
  const { tema, alternarTema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  const [nome, setNome] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuario = await obterUsuarioAutenticado();
      console.log("Dados do usuário carregados:", usuario); // Verificar dados carregados
      if (usuario) {
        setNome(usuario.nome); // Atualiza o estado com o nome do usuário
      }
    };

    carregarUsuario();
  }, []);

  const sair = async () => {
    await deslogarUsuario();
    navigation.replace('TelaLogin');
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.headerContainer}>
        <Icon name="user-circle" size={60} color="#4a90e2" />
        <Text style={estilos.boasVindas}>Bem-vindo(a), {nome}!</Text>
      </View>

      <TouchableOpacity style={estilos.botaoPrincipal} onPress={() => navigation.navigate('TelaSelecaoPais')}>
        <Icon name="globe" size={30} color="#FFF" />
        <Text style={estilos.textoBotao}>Ver Notícias</Text>
      </TouchableOpacity>

      <View style={estilos.alternarTemaContainer}>
        <Text style={estilos.textoAlternarTema}>Tema Escuro</Text>
        <Switch
          value={tema === 'dark'}
          onValueChange={() => alternarTema()}
          thumbColor={tema === 'dark' ? '#f4f3f4' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <TouchableOpacity style={estilos.botaoSair} onPress={sair}>
        <Icon name="sign-out" size={20} color="#FFF" />
        <Text style={estilos.textoBotaoSair}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const criarEstilos = (tema) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: tema.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  boasVindas: {
    fontSize: 24,
    fontWeight: 'bold',
    color: tema.texto,
    marginTop: 10,
    textAlign: 'center',
  },
  botaoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  alternarTemaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textoAlternarTema: {
    fontSize: 16,
    color: tema.texto,
    marginRight: 10,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textoBotaoSair: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TelaDashboard;
