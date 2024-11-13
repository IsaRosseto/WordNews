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
import { TemaContexto } from '../contextos/TemaContexto';
import { temas } from '../contextos/temas/Temas';
import * as rssParser from 'react-native-rss-parser'; // Importação do parser de RSS

const CHAVE_NEWS_API = '756e808da5774ca09c92a2d0b3aaad88'; // Sua chave NewsAPI
const CHAVE_WEATHER_API = '3818a54964d7a21434592243282f7f2e'; // Sua chave OpenWeatherMap

const { width } = Dimensions.get('window');

const rssFeedsPorPais = {
  de: [
    'https://www.tagesschau.de/xml/rss2',
    'https://www.spiegel.de/international/index.rss',
  ],
  br: [
    'https://noticias.uol.com.br/index.xml',
    'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml',
  ],
  it: [
    'https://www.repubblica.it/rss/homepage/rss2.0.xml',
    'https://www.ilsole24ore.com/rss/home.xml',
  ],
  il: [
    'https://www.israelnationalnews.com/RssMain.aspx',
    'https://www.jpost.com/Rss/RssFeedsHeadlines.aspx',
  ],
};


const TelaNoticias = ({ route }) => {
  const { paisSelecionado, countryCode, timezone } = route.params || {};
  const { tema } = useContext(TemaContexto);
  const estilos = criarEstilos(temas[tema]);

  const [clima, setClima] = useState(null);
  const [hora, setHora] = useState('');
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const URL_TIME_API = 'https://worldtimeapi.org/api/timezone';

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Obter Clima
        const respostaClima = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: paisSelecionado,
              appid: CHAVE_WEATHER_API,
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

        // Obter Horário
        const respostaHora = await axios.get(`${URL_TIME_API}/${timezone}`);
        const datetime = respostaHora.data.datetime;
        const horaAtual = datetime.substring(11, 16);
        setHora(horaAtual);

        // Obter Notícias
        if (countryCode === 'us') {
          // Estados Unidos: Usar NewsAPI com pageSize = 5
          const respostaNoticias = await axios.get(
            `https://newsapi.org/v2/top-headlines`,
            {
              params: {
                country: countryCode,
                apiKey: CHAVE_NEWS_API,
                language: 'en',
                pageSize: 5,
              },
            }
          );
          setNoticias(respostaNoticias.data.articles);
        } else if (rssFeedsPorPais[countryCode]) {
          // Outros países (Alemanha, Brasil, Itália, Israel): Usar RSS Feeds
          const feeds = rssFeedsPorPais[countryCode];
          const promises = feeds.map(async (feedUrl) => {
            try {
              const respostaFeed = await axios.get(feedUrl);
              const rss = await rssParser.parse(respostaFeed.data);
              return rss.items.map(item => ({
                title: item.title,
                description: item.description,
                link: item.links[0]?.url || item.links[0],
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
          todasNoticias = todasNoticias.sort((a, b) => {
            const dateA = new Date(a.pubDate || 0);
            const dateB = new Date(b.pubDate || 0);
            return dateB - dateA;
          });
          todasNoticias = todasNoticias.slice(0, 5);
          setNoticias(todasNoticias);
        } else {
          Alert.alert('Erro', `País não suportado: ${paisSelecionado}`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error.message);
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
        <Text style={estilos.textoHora}>{hora}</Text>
      </View>

      <View style={estilos.secao}>
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
                {item.image && (
                  <Image source={{ uri: item.image }} style={estilos.imagemNoticia} />
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
  secao: {
    marginBottom: 25,
  },
  tituloSecao: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: tema.texto,
  },
  infoClima: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeClima: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  textoClima: {
    fontSize: 20,
    color: tema.texto,
    fontWeight: '600',
  },
  textoCondicao: {
    fontSize: 16,
    color: tema.texto,
    fontWeight: '400',
  },
  textoHora: {
    fontSize: 18,
    color: tema.texto,
    fontWeight: '500',
  },
  noticia: {
    flexDirection: 'row',
    backgroundColor: tema.card,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: tema.borda,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'flex-start',
  },
  imagemNoticia: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  conteudoNoticia: {
    flex: 1,
    padding: 10,
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
