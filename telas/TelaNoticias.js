// telas/TelaNoticias.js
import React, { useEffect, useState, useContext } from 'react';
import { 
  Text, 
  View, 
  ActivityIndicator, 
  FlatList, 
  Linking, 
  Image, 
  Alert, 
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import * as rssParser from 'react-native-rss-parser';
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';
import { rssFeedsPorPais } from './rssFeedsPorPais';
import SpotifyPlayer from '../components/SpotifyPlayer';
import noticiaImage from '../assets/default-news.png';


const { width } = Dimensions.get('window');

const TelaNoticias = ({ route }) => {
  const { paisSelecionado, countryCode, timezone } = route.params || {};
  const { tema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  const [clima, setClima] = useState(null);
  const [hora, setHora] = useState('');
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const URL_TIME_API = 'https://worldtimeapi.org/api/timezone';
  const API_KEY_WEATHER = '3818a54964d7a21434592243282f7f2e'; // api chave

  useEffect(() => {
    const buscarDados = async () => {
      try {
        //Clima
        const respostaClima = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: paisSelecionado,
              appid: API_KEY_WEATHER,
              units: 'metric',
              lang: 'pt_br',
            },
          }
        );
        setClima({
          temperatura: respostaClima.data.main.temp,
          condicao: respostaClima.data.weather[0].description,
          icone: `https://openweathermap.org/img/wn/${respostaClima.data.weather[0].icon}@2x.png`,
        });

        // Horário
        const respostaHora = await axios.get(`${URL_TIME_API}/${timezone}`);
        if (respostaHora.data && respostaHora.data.datetime) {
          const datetime = respostaHora.data.datetime;
          const horaAtual = datetime.substring(11, 16);
          setHora(horaAtual);
        } else {
          setHora("Horário não disponível");
        }

        // Obter Notícias via RSS Feeds - transforma em JSON
        if (rssFeedsPorPais[countryCode]) {
          const feeds = rssFeedsPorPais[countryCode];
          const promises = feeds.map(async (feedUrl) => {
            try {
              const respostaFeed = await axios.get(feedUrl);
              const rss = await rssParser.parse(respostaFeed.data);
              return rss.items.map(item => ({
                title: item.title,
                description: item.description,
                link: item.links[0]?.url || item.links[0],
                // imagem API
                image: item.enclosure?.url || item.media?.thumbnail?.url || item.media?.content?.url || null,
                pubDate: item.published || item.pubDate || null,
              }));
            } catch (error) {
              console.error(`Erro ao processar o feed ${feedUrl}:`, error.message);
              return [];
            }
          });

          const resultadosFeeds = await Promise.all(promises);
          let todasNoticias = resultadosFeeds.flat();
          todasNoticias = todasNoticias.filter(noticia => noticia.title && noticia.link);
          todasNoticias = todasNoticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
          todasNoticias = todasNoticias.slice(0, 5);
          setNoticias(todasNoticias);
        } else {
          Alert.alert('Erro', `País não suportado: ${paisSelecionado}`);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error.message);
        Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados.');
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, [paisSelecionado, countryCode, timezone]);

  if (carregando) {
    return (
      <View style={estilos.loader}>
        <ActivityIndicator size="large" color={temas[tema].botao} />
        <Text style={estilos.textoCarregando}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.headerContainer}>
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Clima Atual</Text>
          <View style={estilos.infoClima}>
            {clima && (
              <>
                <Image source={{ uri: clima.icone }} style={estilos.iconeClima} />
                <View>
                  <Text style={estilos.textoClima}>{clima.temperatura}°C</Text>
                  <Text style={estilos.textoCondicao}>{clima.condicao}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Horário Atual</Text>
          <Text style={estilos.textoHora}>{hora || "Horário não disponível"}</Text>
        </View>
      </View>

      <SpotifyPlayer countryCode={countryCode} />

      <View style={estilos.secaoNoticias}>
        <Text style={estilos.tituloSecao}>Principais Notícias</Text>
        {noticias.length === 0 ? (
          <Text style={estilos.textoCarregando}>Nenhuma notícia encontrada.</Text>
        ) : (
<FlatList
  data={noticias}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={estilos.noticia} 
      onPress={() => Linking.openURL(item.link)} 
      activeOpacity={0.8}
    >
      {/* Usa a imagem original do feed, ou a imagem local caso não exista */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={estilos.imagemNoticia} />
      ) : (
        <Image source={noticiaImage} style={estilos.imagemNoticia} />
      )}
      <View style={estilos.conteudoNoticia}>
        <Text style={estilos.tituloNoticia} numberOfLines={2}>{item.title}</Text>
        <Text style={estilos.descricaoNoticia} numberOfLines={3}>{item.description}</Text>
        <Text style={estilos.linkNoticia}>Leia mais</Text>
      </View>
    </TouchableOpacity>
  )}
  showsVerticalScrollIndicator={false}
/>
        )}
      </View>
    </View>
  );
};

const criarEstilos = (tema) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: tema.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  secao: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: tema.card,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    color: tema.texto,
    marginBottom: 5,
  },
  infoClima: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeClima: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textoClima: {
    fontSize: 16,
    color: tema.texto,
    fontWeight: '600',
  },
  textoCondicao: {
    fontSize: 14,
    color: tema.texto,
  },
  textoHora: {
    fontSize: 18,
    color: tema.texto,
    fontWeight: '500',
    marginTop: 5,
  },
  secaoNoticias: {
    flex: 1,
    paddingTop: 20,
  },
  noticia: {
    flexDirection: 'row',
    backgroundColor: tema.card,
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'flex-start',
  },
  imagemNoticia: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  placeholderImagem: {
    width: 120,
    height: 100,
    backgroundColor: '#CCC',
    borderRadius: 10,
    marginRight: 15,
  },
  conteudoNoticia: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tituloNoticia: {
    fontSize: 16,
    fontWeight: '700',
    color: tema.texto,
  },
  descricaoNoticia: {
    fontSize: 14,
    color: tema.texto,
    marginVertical: 5,
  },
  linkNoticia: {
    fontSize: 14,
    color: tema.link,
    textDecorationLine: 'underline',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tema.background,
  },
  textoCarregando: {
    marginTop: 10,
    color: tema.texto,
    fontSize: 16,
  },
});

export default TelaNoticias;
