// telas/TelaDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import { obterUsuarioAutenticado, deslogarUsuario } from '../utils/Usuario';
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';

const TelaDashboard = ({ navigation }) => {
  const { tema, alternarTema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  const [nome, setNome] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuario = await obterUsuarioAutenticado();
      if (usuario) {
        setNome(usuario.nome);
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
      <Text style={estilos.boasVindas}>Bem-vindo(a), {nome} ao WORD NEWS!</Text>
      <Button
        title="Quero ver as notícias atuais"
        color={temas[tema].botao}
        onPress={() => navigation.navigate('TelaSelecaoPais')}
      />
      <View style={estilos.alternarTemaContainer}>
        <Text style={estilos.textoAlternarTema}>Tema Escuro</Text>
        <Switch
          value={tema === 'dark'}
          onValueChange={alternarTema}
          thumbColor={tema === 'dark' ? '#f4f3f4' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Sair" color="red" onPress={sair} />
      </View>
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
  boasVindas: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: tema.texto,
  },
  alternarTemaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  textoAlternarTema: {
    fontSize: 16,
    marginRight: 10,
    color: tema.texto,
  },
});

export default TelaDashboard;
