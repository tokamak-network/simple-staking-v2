import { OLD_CONTRACT } from "@/services/addresses/contract"


export function getOldLayerAddress (layer2: string) {
  const layerInfo = OLD_CONTRACT.find(
    (info: any) => info.newLayer.toLowerCase() === layer2.toLowerCase()
  )
  return layerInfo?.oldLayer

}

export function getLayerName (layer2: string) {
  let layerInfo = OLD_CONTRACT.find (
    (info: any) => info.newLayer.toLowerCase() === layer2.toLowerCase()
  )
  if (!layerInfo) {
    layerInfo = OLD_CONTRACT.find(
      (info: any) => info.oldLayer.toLowerCase() === layer2.toLowerCase()
    )
  }
  return layerInfo?.name
}