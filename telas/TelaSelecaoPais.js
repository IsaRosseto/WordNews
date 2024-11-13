// telas/TelaSelecaoPais.js
import React, { useContext } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Vibration, 
  StyleSheet 
} from 'react-native';
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';

const TelaSelecaoPais = ({ navigation }) => {
  const { tema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  const paises = [
    { nome: 'Alemanha', imagem: require('../assets/alemanha.png'), countryCode: 'de', timezone: 'Europe/Berlin' },
    { nome: 'Estados Unidos', imagem: require('../assets/eua.png'), countryCode: 'us', timezone: 'America/New_York' },
    { nome: 'Brasil', imagem: require('../assets/brasil.png'), countryCode: 'br', timezone: 'America/Sao_Paulo' },
    { nome: 'Itália', imagem: require('../assets/italia.png'), countryCode: 'it', timezone: 'Europe/Rome' },
    { nome: 'Israel', imagem: require('../assets/israel.png'), countryCode: 'il', timezone: 'Asia/Jerusalem' },
  ];

  const selecionarPais = (pais) => {
    Vibration.vibrate(100); // Vibração de 100ms ao selecionar um país
    console.log('Selecionando País:', pais);
    navigation.navigate('TelaNoticias', { 
      paisSelecionado: pais.nome, 
      countryCode: pais.countryCode, 
      timezone: pais.timezone 
    });
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Selecione o País</Text>
      {paises.map((pais, index) => (
        <TouchableOpacity 
          key={index} 
          style={estilos.card} 
          onPress={() => selecionarPais(pais)}
          activeOpacity={0.8}
        >
          <Image source={pais.imagem} style={estilos.imagem} />
          <Text style={estilos.textoPais}>{pais.nome}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const criarEstilos = (tema) => StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: tema.background,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 26,
    marginBottom: 30,
    color: tema.texto,
    fontWeight: '700',
  },
  card: {
    width: '90%',
    height: 100,
    backgroundColor: tema.card,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    shadowColor: tema.borda,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imagem: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 20,
  },
  textoPais: {
    fontSize: 20,
    fontWeight: '600',
    color: tema.texto,
  },
});

export default TelaSelecaoPais;
