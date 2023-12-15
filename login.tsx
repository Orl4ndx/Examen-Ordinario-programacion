import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

interface LoginProps {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ setLogin, setIsLogin }: LoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });


  const handleChange = (field: string, value: string) => {
    setCredentials((prevCredentials) => ({ ...prevCredentials, [field]: value }));
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      Alert.alert('Por favor, completa ambos campos.', 'Ambos campos son obligatorios para iniciar sesión.', [{
        text: 'Intentar de nuevo'
      }]);
      return;
    }

    try {
      const response = await fetch('http://189.170.151.52:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username.toLowerCase(),
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLogin(true);
      } else {
        Alert.alert('Inicio de sesión fallido', 'Asegurate de que tus credenciales son correctas.', [{
          text: "Corregir credenciales"
        }]);
      }
    } catch (error: any) {
      Alert.alert('Error al realizar la solicitud:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <View style={styles.campos}>
        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          style={styles.inputText}
          placeholder="Admin"
          placeholderTextColor="#ffffff"
          value={credentials.username}
          onChangeText={(text) => handleChange('username', text)}
        />
      </View>
      <View style={styles.campos}>
        <Text style={[styles.label, { marginTop: 6 }]}>Contraseña:</Text>
        <TextInput
          style={styles.inputText}
          placeholder="Admin"
          placeholderTextColor="#ffffff"
          secureTextEntry
          value={credentials.password}
          onChangeText={(text) => handleChange('password', text)}
        />
      </View>
      <View style={styles.buttons}>
        <View style={{width: '40%'}}>
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        </View>
        <View style={{width: '50%'}}>
          <Pressable
            style={[styles.button, { backgroundColor: 'white' }]}
            onPress={() => setLogin(false)}
          >
            <Text style={[styles.buttonText, { color: '#000', shadowColor: '#cccccc', textShadowColor: '#ccc' }]}>
              Registro
            </Text>
          </Pressable>
        </View>
      </View>
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
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: '8%'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
    color: '#fefefe',
    textShadowColor: '#000',
    textShadowRadius: 10
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
    marginTop: 6,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 30
  },
  button: {
    borderColor: '#fefefe',
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 22,
    color: '#fefefe',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  campos: {
    width: '100%'
  }
});

export default Login;
