// contextos/TemaContexto.js
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const TemaContexto = createContext();

export const TemaProvider = ({ children }) => {
  const esquemaPreferido = Appearance.getColorScheme();
  const [tema, setTema] = useState(esquemaPreferido || 'light');

  const alternarTema = () => {
    setTema((temaAtual) => (temaAtual === 'light' ? 'dark' : 'light'));
  };

  // Ouvir mudanças no esquema de cores do dispositivo
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setTema(colorScheme);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <TemaContexto.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaContexto.Provider>
  );
};
