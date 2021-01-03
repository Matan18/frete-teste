// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import frete from "node-correios";
import { NextApiRequest, NextApiResponse } from "next";

const formatoDisc = {
  CAIXA: 1,
  ROLO: 2,
  ENVELOPE: 3
}

interface FreteResult {
  Valor: string;
  ValorAvisoRecebimento: string;
  ValorValorDeclarado: string;
  ValorSemAdicionais: string;
  MsgErro: string | undefined;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { products, originCEP: origin, destinyCEP: destiny, valorDeclarado, avisoRecebimento, formato } = req.body;

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

  const commonArguments = {
    sCepOrigem: origin,
    sCepDestino: destiny,
    nVlPeso: totalPeso,
    nCdFormato: formatoDisc[formato],
    nVlComprimento: totalVolume,
    nVlAltura: totalVolume,
    nVlLargura: totalVolume,
    sCdAvisoRecebimento: avisoRecebimento ? "s" : "n",
    nVlValorDeclarado: valorDeclarado ? pack.value : "0.0"
  }

  const calcSedex = new Promise<FreteResult>((resolve, reject) => {
    correios.calcPreco({
      nCdServico: "04014",
      ...commonArguments
    }).then(result => {
      resolve(result[0]);
      // console.error("SEDEX", result[0]);
    }).catch(error => {
      console.error('Error ', error)
      reject(error)
    });
  })
  const SEDEX = await calcSedex;


  const calcPAC = new Promise<FreteResult>((resolve, reject) => {
    correios.calcPreco({
      nCdServico: "04510",
      ...commonArguments
    }).then(result => {
      resolve(result[0])
      // console.error("PAC ", PAC);
    }).catch(error => {
      reject(error)
      console.error('Error ', error)
    })
  });

  const PAC = await calcPAC;
  console.log({ PAC, SEDEX })
  res.statusCode = 200
  res.send({ PAC, SEDEX })
}
