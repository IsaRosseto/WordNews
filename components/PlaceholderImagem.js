// componentes/PlaceholderImagem.js
import React, { useContext } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';

const PlaceholderImagem = () => {
  const { tema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  return (
    <View style={estilos.container}>
      <Image source={require('../assets/default-news.png')} style={estilos.imagem} />
    </View>
  );
};

const criarEstilos = (tema) => StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: tema.placeholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagem: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default PlaceholderImagem;
