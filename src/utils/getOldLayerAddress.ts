export function getOldLayerAddress (layer2: string) {
  const layerInfo = info.find(
    (info: any) => info.newLayer.toLowerCase() === layer2.toLowerCase()
  )
  return layerInfo?.oldLayer
}

const info = [
  {
    oldLayer: "0x39a13a796a3cd9f480c28259230d2ef0a7026033",
    newLayer: "0xf3B17FDB808c7d0Df9ACd24dA34700ce069007DF",
    operator:"0xea8e2ec08dcf4971bdcdfffe21439995378b44f3",
    name: "tokamak1"
  },
  {
    oldLayer: "0x41fb4bad6fba9e9b6e45f3f96ba3ad7ec2ff5b3c",
    newLayer: "0x44e3605d0ed58FD125E9C47D1bf25a4406c13b57",
    operator: "0x566b98a715ef8f60a93a208717d9182310ac3867",
    name: "DXM Corp"
  },
  {
    oldLayer: "0xbc8896ebb2e3939b1849298ef8da59e09946cf66",
    newLayer: "0x2B67D8D4E61b68744885E243EfAF988f1Fc66E2D",
    operator: "0x8dfcbc1df9933c8725618015d10b7b6de2d2c6f8",
    name: "DSRV"
  },
  {
    oldLayer: "0xb9d336596ea2662488641c4ac87960bfdcb94c6e",
    newLayer: "0x36101b31e74c5E8f9a9cec378407Bbb776287761",
    operator: "0xcc2f386adca481a00d614d5aa77a30984f264a07",
    name: "Talken"
  },
  {
    oldLayer: "0xcc38c7aaf2507da52a875e93f57451e58e8c6372",
    newLayer: "0x2c25A6be0e6f9017b5bf77879c487eed466F2194",
    operator: "0x247a0829c63c5b40dc6b21cf412f80227dc7fb76",
    name: "staked"
  },
  {
    oldLayer: "0x42ccf0769e87cb2952634f607df1c7d62e0bbc52",
    newLayer: "0x0F42D1C40b95DF7A1478639918fc358B4aF5298D",
    operator: "0xd1820b18be7f6429f1f44104e4e15d16fb199a43",
    name: "level"
  },
  {
    oldLayer: "0x17602823b5fe43a65ad7122946a73b019e77fd33",
    newLayer: "0xbc602C1D9f3aE99dB4e9fD3662CE3D02e593ec5d",
    operator: "0xba33eddfd3e4e155a6da10281d9069bf44743228",
    name: "decipher"
  },
  {
    oldLayer: "0x2000fc16911fc044130c29c1aa49d3e0b101716a",
    newLayer: "0xC42cCb12515b52B59c02eEc303c887C8658f5854",
    operator: "0xfc9c403993bea576c28ac901bd62640bff8b057a",
    name: "DeSpread"
  },
  {
    oldLayer: "0x97d0a5880542ab0e699c67e7f4ff61f2e5200484",
    newLayer: "0xf3CF23D896Ba09d8EcdcD4655d918f71925E3FE5",
    operator: "0x887af02970781a088962dbaa299a1eba8d573321",
    name: "Danal Fintech"
  },
  {
    oldLayer: "0x5d9a0646c46245a8a3b4775afb3c54d07bcb1764",
    newLayer: "0x06D34f65869Ec94B3BA8c0E08BCEb532f65005E2",
    operator: "0x42adfaae7db56b294225ddcfebef48b337b34b23",
    name: "Hammer DAO"
  },
]