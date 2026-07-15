import { useCallback, useEffect, useState } from 'react'
import { Profissional } from '../types'
import { listProfissionais } from '../services/profissionalService'

export function useProfissionais() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listProfissionais()
      setProfissionais(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { profissionais, loading, error, reload: load }
}
