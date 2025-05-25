import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

import { Produto } from '@/data/produtos/produtos';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const data: Produto = req.body;
  // const saveData = {
  //   codbar: data.codbar,
  //   ref: data.ref,
  //   reforiginal: data.reforiginal,
  //   descr: data.descr,
  //   aplic_extendida: data.aplic_extendida,
  //   codmarca: data.codmarca,
  //   codgpf: data.codgpf,
  //   codgpp: data.codgpp,
  //   curva: data.curva,
  //   qtestmin: data.qtestmin,
  //   qtestmax: data.qtestmax,
  //   obs: data.obs,
  //   inf: data.inf,
  //   pesoliq: data.pesoliq,
  //   qtembal: data.qtembal,
  //   unimed: data.unimed,
  //   multiplo: data.multiplo,
  //   coddesc: data.coddesc,
  //   tabelado: data.tabelado,
  //   compradireta: data.compradireta,
  //   dolar: data.dolar,
  //   multiplocompra: data.multiplocompra,
  //   tipo: data.tipo,
  //   descr_importacao: data.descr_importacao,
  //   nrodi: data.nrodi,
  //   trib: data.trib,
  //   clasfiscal: data.clasfiscal,
  //   dtdi: data.dtdi,
  //   strib: data.strib,
  //   percsubst: data.percsubst,
  //   isentopiscofins: data.isentopiscofins,
  //   pis: data.pis,
  //   cofins: data.cofins,
  //   isentoipi: data.isentoipi,
  //   ipi: data.ipi,
  //   naotemst: data.naotemst,
  //   prodepe: data.prodepe,
  //   hanan: data.hanan,
  //   descontopiscofins: data.descontopiscofins,
  //   ii: data.ii,
  //   cest: data.cest,
  //   prfabr: data.prfabr,
  //   prcustoatual: data.prcustoatual,
  //   preconf: data.preconf,
  //   precosnf: data.precosnf,
  //   prcompra: data.prcompra,
  //   prcomprasemst: data.prcomprasemst,
  //   pratualdesp: data.pratualdesp,
  //   txdolarcompra: data.txdolarcompra,
  //   prcusto: data.prcusto,
  //   prvenda: data.prvenda,
  //   primp: data.primp,
  //   impfat: data.impfat,
  //   impfab: data.impfab,
  //   concor: data.concor,
  //   txdolarvenda: data.txdolarvenda,
  //   codprod: data.codprod,
  // };

  data.qtdreservada = 1;
  data.qtest_filial = 1;
  data.cmercd = '10.00';
  data.margem = 0;
  data.cmercf = '10.00';
  data.margempromo = 0;
  data.cmerczf = '10.00';
  data.excluido = 0;
  data.qtestmax_sugerido = 0;
  data.prmedio = 0;
  data.qtest = 0;

  const latestProduto = await prisma.dbprod.findMany({
    orderBy: {
      codprod: 'desc',
    },
    take: 1,
  });

  const newCodProd = parseInt(latestProduto[0].codprod) + 1;

  data.codprod = newCodProd.toString();

  try {
    const produto = await prisma.dbprod.create({
      data: data,
    });

    res.status(201).setHeader('Content-Type', 'application/json').json({
      data: produto,
    });
  } catch (errors) {
    console.log(errors);
    res.json('erro');
  }
}
