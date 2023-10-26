import { OLD_CONTRACT } from "@/services/addresses/contract"

export function getOldLayerAddress (layer2: string) {
  const layerInfo = OLD_CONTRACT.find(
    (info: any) => info.newLayer.toLowerCase() === layer2.toLowerCase()
  )
  return layerInfo?.oldLayer
}
