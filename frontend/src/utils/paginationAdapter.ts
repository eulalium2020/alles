import { PaginatedResponse } from '@/types'

/**
 * 🔄 Adapter para normalizar respostas do Spring Page
 * Spring retorna: { number, size, totalElements, totalPages, last, content }
 * Frontend espera: { currentPage, pageSize, totalElements, totalPages, isLast, content }
 */
export function adaptSpringPage<T>(springPage: any): PaginatedResponse<T> {
  return {
    content: springPage.content || [],
    totalElements: springPage.totalElements || 0,
    totalPages: springPage.totalPages || 0,
    currentPage: springPage.number ?? 0,    // Spring usa "number"
    pageSize: springPage.size || 10,        // Spring usa "size"
    isLast: springPage.last ?? false,       // Spring usa "last"
  }
}
