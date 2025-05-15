import { getTONPrice } from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useKrwPrice } from './useKRWPrice'

export function useTONPrice() {
  const { data: krwPrice } = useKrwPrice()
  const { data: tonPrice } = useQuery({
    queryKey: ['tonPrice'],
    queryFn: async () => {
      return await getTONPrice()
    },
    refetchInterval: 1000 * 5,
    enabled: !!krwPrice,
    initialData: { tradePrice: 0, highPrice: 0, lowPrice: 0, openingPrice: 0, closingPrice: 0 },
    select: (data) => {
      return {
        tonPriceKRW: data / krwPrice ?? 0,
        tonPriceUSD: data ?? 0,
      }
    },
  })

  return { ...tonPrice, krwPrice }
}