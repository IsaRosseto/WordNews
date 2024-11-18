// App.js
import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { StatusBar, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TemaProvider, TemaContexto } from './contextos/TemaContexto';

// Importar as telas
import TelaCadastro from './telas/TelaCadastro';
import TelaLogin from './telas/TelaLogin';
import TelaDashboard from './telas/TelaDashboard';
import TelaSelecaoPais from './telas/TelaSelecaoPais';
import TelaNoticias from './telas/TelaNoticias';

const Stack = createStackNavigator();

const ConteudoApp = () => {
  const { tema, alternarTema } = useContext(TemaContexto);

  // Define o tema de navegação com base no tema atual (claro ou escuro)
  const temaNavegacao = tema === 'escuro' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={temaNavegacao}>
      <StatusBar barStyle={tema === 'escuro' ? 'light-content' : 'dark-content'} />
      <Stack.Navigator initialRouteName="TelaLogin">
        <Stack.Screen 
          name="TelaLogin" 
          component={TelaLogin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="TelaCadastro" 
          component={TelaCadastro} 
          options={{ title: 'Cadastro' }} 
        />
 <Stack.Screen 
          name="TelaDashboard" 
          component={TelaDashboard} 
          options={{
            headerLeft: null,
            title: 'WORD NEWS',
            headerRight: () => (
              <TouchableOpacity onPress={alternarTema} style={{ marginRight: 15 }}>
                <Text style={{ color: tema === 'dark' ? '#FFFFFF' : '#000000', fontSize: 16 }}>
                  {tema === 'dark' ? 'Claro' : 'Escuro'}
                </Text>
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="TelaSelecaoPais" 
          component={TelaSelecaoPais} 
          options={{ title: 'Seleção de País' }} 
        />
        <Stack.Screen 
          name="TelaNoticias" 
          component={TelaNoticias} 
          options={{ title: 'Notícias' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TemaProvider>
        <ConteudoApp />
      </TemaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
