import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { DashboardScreen } from './src/screens/DashboardScreen'
import { LoginScreen } from './src/screens/LoginScreen'

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {isAuthenticated ? <DashboardScreen /> : <LoginScreen />}
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
})
