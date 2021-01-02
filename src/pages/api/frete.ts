// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import frete from "node-correios";
import { NextApiRequest, NextApiResponse } from "next";

const formatoDisc= {
  CAIXA: 1,
  ROLO: 2,
  ENVELOPE: 3
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { products, originCEP: origin, destinyCEP: destiny, valorDeclarado, avisoRecebimento, formato } = req.body;

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const correios = new frete();

  const pack = products.map(product => {
    const volume = (product.width * product.length * product.height * product.quantity);
    const peso = (product.weight * product.quantity);
    const value = (product.value * product.quantity);
    return {
      volume,
      peso,
      value
    }
  })
    .reduce((sum, value, index) => {
      sum.volume += value.volume;
      sum.peso += value.peso;
      sum.value += value.value;
      return sum
    }, { volume: 0, peso: 0, value: 0 });

  const totalVolume = Math.cbrt(pack.volume);
  const totalPeso = pack.peso;
  // console.log(pack)
  // console.log(pack.volume, totalVolume * totalVolume * totalVolume)

  let SEDEX;
  correios.calcPreco({
    nCdServico: "04014",
    sCepOrigem: origin,
    sCepDestino: destiny,
    nVlPeso: totalPeso,
    nCdFormato: formatoDisc[formato],
    nVlComprimento: totalVolume,
    nVlAltura: totalVolume,
    nVlLargura: totalVolume,
    nVlDiametro: totalVolume,
    sCdAvisoRecebimento: avisoRecebimento ? "s" : "n",
    nVlValorDeclarado: valorDeclarado ? pack.value : "0.0"
  }).then(result => {
    SEDEX = result[0]
    // console.log("SEDEX", SEDEX);
  }).catch(error => {
    // console.log('Error ', error)
  });

  let PAC;
  correios.calcPreco({
    nCdServico: "04510",
    sCepOrigem: origin,
    sCepDestino: destiny,
    nVlPeso: totalPeso,
    nCdFormato: 3,
    nVlComprimento: totalVolume,
    nVlAltura: totalVolume,
    nVlLargura: totalVolume,
    nVlDiametro: totalVolume,
    sCdAvisoRecebimento: avisoRecebimento ? "s" : "n",
    nVlValorDeclarado: valorDeclarado ? pack.value : "0.0"
    // sCdMaoPropria: 'S'
  }).then(result => {
    PAC = result[0]
    // console.log("PAC ", PAC);
  }).catch(error => {
    // console.log('Error ', error)
  });

  await delay(1000);
  res.statusCode = 200
  res.send({ PAC, SEDEX })
}
