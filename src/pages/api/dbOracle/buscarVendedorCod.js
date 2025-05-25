/* eslint-disable @typescript-eslint/no-unused-vars */
const { Sequelize } = require('sequelize');
const oracledb = require('oracledb');
const { QueryTypes } = require('sequelize');
export default async function Sec(req, res) {
  await oracledb.initOracleClient({
    libDir: 'C:\\oracle\\instantclient\\instantclient_23_4',
  });
  // Option 1: Passing a connection URI
  const { descricao } = req.body;
  const sequelize = new Sequelize(process.env.DATABASE_URL2);
//  SELECT PRVENDA FROM DBCLIEN WHERE CODCLI = '07536'
  const COM_VENDA = await sequelize.query(
    'SELECT  * FROM DBVEND WHERE NOME LIKE :nome OR  CODVEND LIKE :codigo',
    {
      replacements: { nome: `${descricao.toUpperCase()}%`,  codigo: `%${descricao}%` },
      type: QueryTypes.SELECT,
    },
  );
  sequelize.close();

  res.statuCode = 200;
  res.setHeader('Content-Type', 'aplication/json');
  res.json(COM_VENDA);
}
