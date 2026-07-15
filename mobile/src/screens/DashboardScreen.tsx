import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { useProfissionais } from '../hooks/useProfissionais'

export function DashboardScreen() {
  const { user, logout } = useAuth()
  const { profissionais, loading, error, reload } = useProfissionais()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Olá, {user?.nome ?? user?.email}</Text>
          <Text style={styles.subtitle}>Profissionais cadastrados</Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loading} />
      ) : (
        <FlatList
          data={profissionais}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={reload}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum profissional encontrado.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.usuario?.email}</Text>
              <Text style={styles.meta}>CRM: {item.crm}</Text>
            </View>
          )}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 2,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  name: {
    fontWeight: '600',
    color: '#111827',
  },
  meta: {
    marginTop: 4,
    color: '#4b5563',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    marginTop: 24,
  },
  error: {
    marginTop: 12,
    textAlign: 'center',
    color: '#dc2626',
  },
})
