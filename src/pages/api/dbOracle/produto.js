const { Sequelize } = require('sequelize');
const oracledb = require('oracledb');
const { QueryTypes } = require('sequelize');
export default async function Sec(req, res) {
  await oracledb.initOracleClient({
    libDir: 'C:\\oracle\\instantclient\\instantclient_23_4',
  });
  // Option 1: Passing a connection URI
  const { descricao } = req.body;
  const { PRVENDA } = req.body;

  const sequelize = new Sequelize(process.env.DATABASE_URL2);
 
  //  SELECT PRVENDA FROM DBCLIEN WHERE CODCLI = '07536'
  let tipoCliente='0';
  if (PRVENDA) tipoCliente = PRVENDA;

  const COM_VENDA = await sequelize.query(
    'SELECT DISTINCT  DBPROD."REF",DBPROD."CODGPE",DBPROD."CODPROD",DBPROD."DESCR",DBPROD."QTEST",(QTEST - DBPROD.QTDRESERVADA) QTDDISPONIVEL, cus.MARCA, preco.precovenda From DBPROD JOIN CMP_PRODUTO cus ON DBPROD.CODPROD = cus.CODPROD JOIN DBFORMACAOPRVENDA preco ON DBPROD.CODPROD = preco.CODPROD WHERE  preco.precovenda>0 AND  (DBPROD.DESCR LIKE :Dbprod OR DBPROD.REF LIKE :codigo) AND preco.TIPOPRECO LIKE :codCliente AND preco.CODPROD LIKE DBPROD."CODPROD" ORDER BY QTDDISPONIVEL DESC  ',
    {
      replacements: { Dbprod: `${descricao}%`, codigo: `${descricao}%`,codCliente: `${tipoCliente}` },
      type: QueryTypes.SELECT,
    },
  );

  sequelize.close();

  res.statuCode = 200;
  res.setHeader('Content-Type', 'aplication/json');
  res.json(COM_VENDA);
}
