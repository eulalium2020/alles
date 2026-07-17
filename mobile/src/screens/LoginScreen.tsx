import React, { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useAuth } from '../context/AuthContext'

export function LoginScreen() {
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function handleLogin() {
    await login({ email, senha })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ALLES Mobile</Text>
      <Text style={styles.subtitle}>Sistema de Gestão da Clínica</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  error: {
    color: '#dc2626',
    marginBottom: 8,
    textAlign: 'center',
  },
})
