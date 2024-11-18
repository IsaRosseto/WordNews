// utils/Usuario.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_USUARIOS = '@usuarios';
const CHAVE_USUARIO_LOGADO = '@usuarioLogado';

export const registrarUsuario = async (nome, email, senha) => {
  const usuarios = JSON.parse(await AsyncStorage.getItem(CHAVE_USUARIOS)) || [];
  const usuarioExistente = usuarios.find((usuario) => usuario.email === email);

  if (usuarioExistente) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const novoUsuario = { nome, email, senha };
  usuarios.push(novoUsuario);

  console.log("Usuário registrado:", novoUsuario); // Log para verificar o usuário registrado
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
};

export const autenticarUsuario = async (email, senha) => {
  const usuarios = JSON.parse(await AsyncStorage.getItem(CHAVE_USUARIOS)) || [];
  const usuario = usuarios.find((usuario) => usuario.email === email && usuario.senha === senha);

  if (!usuario) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // Salva o usuário autenticado no AsyncStorage para recuperá-lo posteriormente
  await AsyncStorage.setItem(CHAVE_USUARIO_LOGADO, JSON.stringify(usuario));
  console.log("Usuário autenticado:", usuario); // Log para verificar o usuário autenticado
};

export const obterUsuarioAutenticado = async () => {
  const usuario = await AsyncStorage.getItem(CHAVE_USUARIO_LOGADO);
  console.log("Usuário autenticado:", usuario); // Log para verificar o usuário autenticado
  return usuario ? JSON.parse(usuario) : null;
};

export const deslogarUsuario = async () => {
  await AsyncStorage.removeItem(CHAVE_USUARIO_LOGADO);
};
