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
//     'SELECT * FROM Dbclien_Creditotmp WHERE CODCLI LIKE :codigo AND STATUS LIKE :letra',
'Select MIN(dt_venc) dt_min From DbReceb Where Rec like :letra and Cancel like :letra and CodCli LIKE :codigo',
    {
      replacements: { codigo: `${codClient}` ,letra:'N'} ,
      type: QueryTypes.SELECT,
    },
  );
  sequelize.close();

  res.statuCode = 200;
  res.setHeader('Content-Type', 'aplication/json');
  res.json(COM_VENDA);
}
