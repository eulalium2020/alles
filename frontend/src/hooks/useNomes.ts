import { useEffect, useState, useCallback } from 'react'
import { nomeService, NomeItem } from '@services/nomeService'

/**
 * 🪝 Estado gerenciado pelos hooks de nomes
 */
interface UseNomesState {
  items: NomeItem[]
  loading: boolean
  error: string | null
}

/**
 * 🪝 Hook para carregar nomes de profissionais
 */
export function useProfissionaisNomes() {
  const [state, setState] = useState<UseNomesState>({
    items: [],
    loading: false,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await nomeService.getProfissionaisNomes()
        setState({ items: data, loading: false, error: null })
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao carregar profissionais'
        setState({ items: [], loading: false, error: errorMessage })
      }
    }

    fetchData()
  }, [])

  return state
}

/**
 * 🪝 Hook para carregar nomes de pacientes
 */
export function usePacientesNomes() {
  const [state, setState] = useState<UseNomesState>({
    items: [],
    loading: false,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await nomeService.getPacientesNomes()
        setState({ items: data, loading: false, error: null })
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao carregar pacientes'
        setState({ items: [], loading: false, error: errorMessage })
      }
    }

    fetchData()
  }, [])

  return state
}

/**
 * 🪝 Hook para carregar nomes de especialidades
 */
export function useEspecialidadesNomes() {
  const [state, setState] = useState<UseNomesState>({
    items: [],
    loading: false,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await nomeService.getEspecialidadesNomes()
        setState({ items: data, loading: false, error: null })
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao carregar especialidades'
        setState({ items: [], loading: false, error: errorMessage })
      }
    }

    fetchData()
  }, [])

  return state
}

/**
 * 🪝 Hook para carregar nomes de planos de saúde
 */
export function usePlanosNomes() {
  const [state, setState] = useState<UseNomesState>({
    items: [],
    loading: false,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await nomeService.getPlanosNomes()
        setState({ items: data, loading: false, error: null })
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao carregar planos'
        setState({ items: [], loading: false, error: errorMessage })
      }
    }

    fetchData()
  }, [])

  return state
}

/**
 * 🪝 Hook para resolver um profissional pelo nome
 */
export function useProfissionalPorNome(nome: string | null) {
  const [profissional, setProfissional] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!nome) {
      setProfissional(null)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await nomeService.getProfissionalPorNome(nome)
        setProfissional(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar profissional')
        setProfissional(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [nome])

  return { profissional, loading, error }
}

/**
 * 🪝 Hook para resolver um paciente pelo nome
 */
export function usePacientePorNome(nome: string | null) {
  const [paciente, setPaciente] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!nome) {
      setPaciente(null)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await nomeService.getPacientePorNome(nome)
        setPaciente(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar paciente')
        setPaciente(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [nome])

  return { paciente, loading, error }
}

/**
 * 🪝 Hook para resolver uma especialidade pelo nome
 */
export function useEspecialidadePorNome(nome: string | null) {
  const [especialidade, setEspecialidade] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!nome) {
      setEspecialidade(null)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await nomeService.getEspecialidadePorNome(nome)
        setEspecialidade(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar especialidade')
        setEspecialidade(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [nome])

  return { especialidade, loading, error }
}
