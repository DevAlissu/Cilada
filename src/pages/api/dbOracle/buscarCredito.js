/* eslint-disable @typescript-eslint/no-unused-vars */
const { Sequelize } = require('sequelize');
const oracledb = require('oracledb');
const { QueryTypes } = require('sequelize');
export default async function Sec(req, res) {
  await oracledb.initOracleClient({
    libDir: 'C:\\oracle\\instantclient\\instantclient_23_4',
  });
  // Option 1: Passing a connection URI
  const { codClient } = req.body;
  const sequelize = new Sequelize(process.env.DATABASE_URL2);
  
//  SELECT PRVENDA FROM DBCLIEN WHERE CODCLI = '07536'
  const COM_VENDA = await sequelize.query(
    'select c.codcli,c.nome, c.claspgto,c.limite, c.debito, (c.limite - c.debito) saldo from dbclien c WHERE c.CODCLI like :codigo',
    {
      replacements: { codigo: `${codClient}` } ,
      type: QueryTypes.SELECT,
    },
  );
  sequelize.close();

  res.statuCode = 200;
  res.setHeader('Content-Type', 'aplication/json');
  res.json(COM_VENDA);
}
