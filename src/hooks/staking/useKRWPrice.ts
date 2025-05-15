import { getUSDInfo } from '@/api'
import { useQuery } from '@tanstack/react-query'

export function useKrwPrice() {
  return useQuery({
    queryKey: ['krwPrice'],
    queryFn: async () => {
      return await getUSDInfo()
    },
    refetchInterval: 1000 * 5,
  })
}