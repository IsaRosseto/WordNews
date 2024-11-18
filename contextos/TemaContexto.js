// contextos/TemaContexto.js
import React, { createContext, useState } from 'react';
import { temas } from './temas/Temas';

export const TemaContexto = createContext();

export const TemaProvider = ({ children }) => {
  const [tema, setTema] = useState('claro');

  const alternarTema = () => {
    setTema((prevTema) => (prevTema === 'claro' ? 'escuro' : 'claro'));
  };

  return (
    <TemaContexto.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaContexto.Provider>
  );
};
