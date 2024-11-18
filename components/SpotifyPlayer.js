// componentes/SpotifyPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { musicasPopulares } from '../telas/musicasPopulares';

const SpotifyPlayer = ({ countryCode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const rotateValue = useRef(new Animated.Value(0)).current; // Valor para rotação

  const track = musicasPopulares[countryCode];

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const iniciarRotacao = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 4000, // Velocidade da rotação em milissegundos
        useNativeDriver: true,
      })
    ).start();
  };

  const pararRotacao = () => {
    rotateValue.stopAnimation();
  };

  const playPauseAudio = async () => {
    if (!track || !track.audio) {
      alert('Áudio não disponível para esta música.');
      return;
    }

    if (sound === null) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          track.audio, 
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        iniciarRotacao(); // Iniciar rotação ao tocar
      } catch (error) {
        console.error("Erro ao carregar o áudio:", error);
        alert("Erro ao reproduzir o áudio.");
      }
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        pararRotacao(); // Parar rotação ao pausar
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        iniciarRotacao(); // Retomar rotação ao continuar tocando
      }
    }
  };

  const rotacao = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!track) {
    return null;
  }

  return (
    <View style={styles.playerContainer}>
      {/* Imagem do álbum com animação de rotação */}
      <Animated.Image
        source={track.albumCover}
        style={[styles.albumArt, { transform: [{ rotate: rotacao }] }]}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artist}</Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={playPauseAudio}>
        <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 15,
    marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  artistName: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  playButton: {
    padding: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
});

export default SpotifyPlayer;
