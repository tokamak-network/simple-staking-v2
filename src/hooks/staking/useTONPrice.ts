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
        tonPriceKRW: data?.trade_price ?? 0,
        highPrice: data?.high_price ?? 0,
        lowPrice: data?.low_price ?? 0,
        openingPrice: data?.opening_price ?? 0,
        closingPrice: data?.trade_price ?? 0,
      }
    },
  })

  return { ...tonPrice, krwPrice, tonPriceUSD: tonPrice.tonPriceKRW * (krwPrice ?? 0) }
}