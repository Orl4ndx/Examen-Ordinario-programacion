import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

interface RegistroProps {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

function Registro({ setLogin }: RegistroProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (text: string) => {
    setUsername(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleRegistroPress = async () => {
    if (!username || !password) {
      Alert.alert('Por favor, completa ambos campos.', 'Ambos campos son obligatorios para el registro de tu cuenta.', [{
        text: 'Intentar de nuevo'
      }]);
      return;
    }

    try {
      const response = await fetch('http://189.170.151.52:3000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Registro exitoso');
        setLogin(true);
      } else {
        console.error('Error en el registro:', response.statusText);
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {
        textAlign: 'center',
        textTransform: 'uppercase',
        fontSize: 24
      }]}>Registrate</Text>
      <Text style={styles.label}>Usuario:</Text>
      <TextInput
        style={styles.inputText}
        placeholder='Usuario'
        placeholderTextColor='#ffffff'
        value={username}
        onChangeText={handleUsernameChange}
      />
      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.inputText}
        placeholder='Contraseña'
        placeholderTextColor='#ffffff'
        secureTextEntry={true}
        value={password}
        onChangeText={handlePasswordChange}
      />
      <Pressable style={styles.boton} onPress={handleRegistroPress}>
        <Text style={styles.botonText}>Registrarse</Text>
      </Pressable>
      <Text style={styles.botonText} onPress={() => setLogin(true)}>
        ¿Ya tienes una cuenta? Haz click aquí
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    borderColor: 'rgba(255, 255, 255, .7)',
    borderWidth: 1,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: '8%',
    width: '90%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 22,
    color: '#fefefe',
    fontFamily: 'Roboto-Regular',
  },
  inputText: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 1,
    fontSize: 20,
    opacity: 0.8,
    color: '#fefefe',
    paddingLeft: 10,
    letterSpacing: 1,
    fontFamily: 'Roboto-Light',
    marginTop: 10,
  },
  boton: {
    borderColor: '#fefefe',
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  botonText: {
    fontSize: 22,
    color: '#fefefe',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Registro;
