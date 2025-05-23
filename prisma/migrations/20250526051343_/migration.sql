/*
  Warnings:

  - The primary key for the `dbclassificacao_fiscal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `dbclien` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tb_filial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `NOME_FILIAL` on the `tb_filial` table. All the data in the column will be lost.
  - The `codigo_filial` column on the `tb_filial` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tb_login_filiais` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `login_group_name` on the `tb_login_user` table. All the data in the column will be lost.
  - You are about to drop the `tb_login_access_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_login_group` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nome_filial` to the `tb_filial` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `codigo_filial` on the `tb_login_filiais` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "cad_credor_regra_faturamento" DROP CONSTRAINT "cad_credor_regra_faturamento_dbcredor_fk";

-- DropForeignKey
ALTER TABLE "dbbairro" DROP CONSTRAINT "dbbairro_codmunicipio_fkey";

-- DropForeignKey
ALTER TABLE "dbbairro" DROP CONSTRAINT "dbbairro_codpais_fkey";

-- DropForeignKey
ALTER TABLE "dbctel" DROP CONSTRAINT "dbctel_cod_credor_fkey";

-- DropForeignKey
ALTER TABLE "dbvenda" DROP CONSTRAINT "dbvenda_codcli_fkey";

-- DropForeignKey
ALTER TABLE "tb_grupo_Permissao" DROP CONSTRAINT "tb_grupo_Permissao_grupoId_fkey";

-- DropIndex
DROP INDEX "idx_dbclien_codcli_trgm";

-- DropIndex
DROP INDEX "idx_dbclien_nome_trgm";

ALTER TABLE "dbclassificacao_fiscal" DROP CONSTRAINT "pk1ncm";
ALTER TABLE "dbclassificacao_fiscal" ADD COLUMN "id" SERIAL NOT NULL;
ALTER TABLE "dbclassificacao_fiscal" ALTER COLUMN "ncm" SET DATA TYPE TEXT;
ALTER TABLE "dbclassificacao_fiscal" ADD CONSTRAINT "dbclassificacao_fiscal_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbclien" DROP CONSTRAINT "dbclien_pkey",
ALTER COLUMN "codcli" SET DATA TYPE VARCHAR(10),
ADD CONSTRAINT "dbclien_pkey" PRIMARY KEY ("codcli");

-- AlterTable
ALTER TABLE "dbcliente_limite" ALTER COLUMN "codcli" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "dbreceb" ALTER COLUMN "codcli" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "dbtipopagtocliente" ALTER COLUMN "codcli" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "dbvenda" ADD COLUMN     "LOCALENTREGACLIENTE" VARCHAR(5),
ADD COLUMN     "codcv" VARCHAR(3),
ADD COLUMN     "codvend" VARCHAR(5),
ADD COLUMN     "comnormal" DECIMAL(6,2),
ADD COLUMN     "comobj" DECIMAL(6,2),
ADD COLUMN     "comtele" DECIMAL(6,2),
ADD COLUMN     "credito" DECIMAL(9,2),
ADD COLUMN     "debito" DECIMAL(9,2),
ADD COLUMN     "limite" DECIMAL(9,2),
ADD COLUMN     "nome" VARCHAR(30),
ADD COLUMN     "ra_mat" VARCHAR(6),
ADD COLUMN     "valobj" DECIMAL(8,2),
ADD COLUMN     "valobjf" DECIMAL(8,2),
ADD COLUMN     "valobjm" DECIMAL(8,2),
ADD COLUMN     "valobjsf" DECIMAL(8,2),
ALTER COLUMN "codcli" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "dbvenda_orcamento" ALTER COLUMN "codcli" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "tb_filial" DROP CONSTRAINT "tb_filial_pkey",
DROP COLUMN "NOME_FILIAL",
ADD COLUMN     "nome_filial" VARCHAR NOT NULL,
DROP COLUMN "codigo_filial",
ADD COLUMN     "codigo_filial" BIGSERIAL NOT NULL,
ADD CONSTRAINT "tb_filial_pkey" PRIMARY KEY ("codigo_filial");

-- AlterTable
ALTER TABLE "tb_login_access_user" ADD COLUMN     "login_perfil_name" VARCHAR(255);

-- AlterTable
ALTER TABLE "tb_login_filiais" DROP CONSTRAINT "tb_login_filiais_pkey",
DROP COLUMN "codigo_filial",
ADD COLUMN     "codigo_filial" INTEGER NOT NULL,
ADD CONSTRAINT "tb_login_filiais_pkey" PRIMARY KEY ("login_user_login", "codigo_filial");

-- AlterTable
ALTER TABLE "tb_login_functions" ADD COLUMN     "codigo_filial" SERIAL NOT NULL,
ADD COLUMN     "sigla" VARCHAR(50),
ADD COLUMN     "usadoEm" VARCHAR(255);

-- AlterTable
ALTER TABLE "tb_login_user" DROP COLUMN "login_group_name",
ADD COLUMN     "login_perfil_name" VARCHAR(60),
ALTER COLUMN "login_user_password" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "tb_login_access_group";

-- DropTable
DROP TABLE "tb_login_group";

-- CreateTable
CREATE TABLE "dbcompras" (
    "id" SERIAL NOT NULL,
    "ordem_compra" TEXT,
    "data_ordem" DATE,
    "status_ordem" TEXT,
    "requisicao" TEXT,
    "versao" INTEGER,
    "tipo" TEXT,
    "data_requisicao" DATE,
    "status_requisicao" TEXT,
    "fornecedor_codigo" TEXT,
    "fornecedor_nome" TEXT,
    "fornecedor_cpf_cnpj" TEXT,
    "comprador_nome" TEXT,
    "local_entrega" TEXT,
    "destino" TEXT,

    CONSTRAINT "dbcompras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbcredor_ccontabil" (
    "codcta" VARCHAR(20) NOT NULL,
    "descr" VARCHAR(100) NOT NULL,

    CONSTRAINT "dbcredor_ccontabil_pkey" PRIMARY KEY ("codcta")
);

-- CreateTable
CREATE TABLE "dbnfe_ent" (
    "codnfe_ent" VARCHAR(9) NOT NULL,
    "chave" VARCHAR(50) NOT NULL,
    "versao" VARCHAR(5),
    "cuf" DECIMAL DEFAULT 0,
    "cnf" DECIMAL DEFAULT 0,
    "natop" VARCHAR(100),
    "indpag" DECIMAL DEFAULT 0,
    "mod" VARCHAR(2),
    "serie" DECIMAL DEFAULT 0,
    "nnf" DECIMAL DEFAULT 0,
    "demi" DATE,
    "tpnf" DECIMAL DEFAULT 0,
    "cmunfg" DECIMAL DEFAULT 0,
    "tpimp" DECIMAL DEFAULT 0,
    "tpemis" DECIMAL DEFAULT 0,
    "cdv" DECIMAL DEFAULT 0,
    "finnfe" DECIMAL DEFAULT 0,
    "procemi" DECIMAL DEFAULT 0,
    "verproc" VARCHAR(20),
    "modfrete" DECIMAL DEFAULT 0,
    "pesol" DECIMAL DEFAULT 0,
    "pesob" DECIMAL DEFAULT 0,
    "vbc" DECIMAL DEFAULT 0,
    "vicms" DECIMAL DEFAULT 0,
    "vbcst" DECIMAL DEFAULT 0,
    "vst" DECIMAL DEFAULT 0,
    "vprod" DECIMAL DEFAULT 0,
    "vfrete" DECIMAL DEFAULT 0,
    "vseg" DECIMAL DEFAULT 0,
    "vdesc" DECIMAL DEFAULT 0,
    "vii" DECIMAL DEFAULT 0,
    "vipi" DECIMAL DEFAULT 0,
    "vpis" DECIMAL DEFAULT 0,
    "vcofins" DECIMAL DEFAULT 0,
    "voutro" DECIMAL DEFAULT 0,
    "vnf" DECIMAL DEFAULT 0,
    "infcpl" VARCHAR(4000),
    "nprot" VARCHAR(20),
    "exec" VARCHAR(1) NOT NULL DEFAULT 'N',
    "nfat" VARCHAR(60),
    "vorigfat" DECIMAL DEFAULT 0,
    "vliqfat" DECIMAL DEFAULT 0,
    "vdescfat" DECIMAL DEFAULT 0,
    "codent" VARCHAR(10),
    "codusr" VARCHAR(20),
    "dtexec" DATE,
    "qvol" DECIMAL DEFAULT 0,
    "hemi" VARCHAR(10),
    "iddest" VARCHAR(1),
    "indfinal" VARCHAR(1),
    "indpres" VARCHAR(1),
    "vtottrib" DECIMAL DEFAULT 0,
    "vserv" DECIMAL DEFAULT 0,
    "vbciss" DECIMAL DEFAULT 0,
    "viss" DECIMAL DEFAULT 0,
    "vpis_ser" DECIMAL DEFAULT 0,
    "vcofins_ser" DECIMAL DEFAULT 0,
    "dcompet" DATE,
    "vdeducao" DECIMAL DEFAULT 0,
    "voutroiss" DECIMAL DEFAULT 0,
    "vdescincond" DECIMAL DEFAULT 0,
    "vdesccond" DECIMAL DEFAULT 0,
    "vissret" DECIMAL DEFAULT 0,
    "cregtrib" VARCHAR(1),
    "vretpis" DECIMAL DEFAULT 0,
    "vretcofins" DECIMAL DEFAULT 0,
    "vretcsll" DECIMAL DEFAULT 0,
    "vbcirrf" DECIMAL DEFAULT 0,
    "virrf" DECIMAL DEFAULT 0,
    "vbcretprev" DECIMAL DEFAULT 0,
    "vretprev" DECIMAL DEFAULT 0,
    "ufsaidapais" VARCHAR(2),
    "xlocexporta" VARCHAR(60),
    "xlocdespacho" VARCHAR(60),
    "xnemp" VARCHAR(30),
    "xpedemp" VARCHAR(60),
    "xcontemp" VARCHAR(60),
    "pdevol" DECIMAL DEFAULT 0,
    "vipidevol" DECIMAL DEFAULT 0,
    "dtimport" DATE,
    "ufembarq" VARCHAR(2),
    "xlocembarq" VARCHAR(60),
    "nfref" VARCHAR(44),
    "dev_id" DECIMAL,

    CONSTRAINT "pk_nfe_ent_cod" PRIMARY KEY ("codnfe_ent")
);

-- CreateTable
CREATE TABLE "dbnfe_ent_dest" (
    "codnfe_ent" VARCHAR(9) NOT NULL,
    "cpf_cnpj" VARCHAR(14),
    "xnome" VARCHAR(60),
    "xlgr" VARCHAR(60),
    "nro" VARCHAR(60),
    "xcpl" VARCHAR(60),
    "xbairro" VARCHAR(60),
    "cmun" DECIMAL DEFAULT 0,
    "xmun" VARCHAR(60),
    "uf" VARCHAR(2),
    "cep" VARCHAR(10),
    "cpais" DECIMAL DEFAULT 0,
    "xpais" VARCHAR(60),
    "fone" VARCHAR(20),
    "ie" VARCHAR(20),
    "isuf" VARCHAR(10),
    "email" VARCHAR(60),
    "idestrangeiro" VARCHAR(20)
);

-- CreateTable
CREATE TABLE "dbnfe_ent_emit" (
    "codnfe_ent" VARCHAR(9) NOT NULL,
    "cpf_cnpj" VARCHAR(14),
    "xnome" VARCHAR(60),
    "xlgr" VARCHAR(60),
    "nro" VARCHAR(50),
    "xcpl" VARCHAR(60),
    "xbairro" VARCHAR(60),
    "cmun" DECIMAL DEFAULT 0,
    "xmun" VARCHAR(60),
    "uf" VARCHAR(2),
    "cep" VARCHAR(10),
    "cpais" DECIMAL DEFAULT 0,
    "xpais" VARCHAR(60),
    "fone" VARCHAR(20),
    "ie" VARCHAR(20),
    "im" VARCHAR(20),
    "cnae" VARCHAR(10)
);

-- CreateTable
CREATE TABLE "dbnfe_ent_tran" (
    "codnfe_ent" VARCHAR(9) NOT NULL,
    "cpf_cnpj" VARCHAR(14),
    "xnome" VARCHAR(60),
    "ie" VARCHAR(20),
    "xender" VARCHAR(60),
    "xmun" VARCHAR(60),
    "uf" VARCHAR(2),
    "rntc" VARCHAR(20),
    "placa" VARCHAR(10),
    "uf_placa" VARCHAR(2),
    "rntc_reb" VARCHAR(20),
    "placa_reb" VARCHAR(10),
    "uf_placa_reb" VARCHAR(2),
    "vagao_reb" VARCHAR(20),
    "balsa_reb" VARCHAR(20),
    "especie" VARCHAR(60),
    "marca" VARCHAR(60),
    "numeracao" VARCHAR(60),
    "lacre" VARCHAR(60),
    "vserv" DECIMAL DEFAULT 0,
    "vbcret" DECIMAL DEFAULT 0,
    "picmsret" DECIMAL DEFAULT 0,
    "vicmsret" DECIMAL DEFAULT 0,
    "cfop" DECIMAL DEFAULT 0,
    "cmunfg" VARCHAR(7)
);

-- CreateTable
CREATE TABLE "dbtipopagto" (
    "codtipo" DECIMAL NOT NULL,
    "descricao" VARCHAR(50)
);

-- CreateTable
CREATE TABLE "tb_login_access_perfil" (
    "id_functions" BIGINT NOT NULL,
    "login_perfil_name" VARCHAR(500) NOT NULL,

    CONSTRAINT "tb_login_access_group_pkey" PRIMARY KEY ("id_functions","login_perfil_name")
);

-- CreateTable
CREATE TABLE "tb_login_perfil" (
    "login_perfil_name" VARCHAR NOT NULL,

    CONSTRAINT "tb_login_group_pkey" PRIMARY KEY ("login_perfil_name")
);

-- CreateTable
CREATE TABLE "tb_user_perfil" (
    "user_login_id" VARCHAR(40) NOT NULL,
    "perfil_name" VARCHAR NOT NULL,
    "codigo_filial" INTEGER NOT NULL,
    "nome_filial" VARCHAR(500),

    CONSTRAINT "pk_user_perfil" PRIMARY KEY ("user_login_id","perfil_name","codigo_filial")
);

-- CreateTable
CREATE TABLE "cmp_produto" (
    "CODPROD" VARCHAR(6),
    "CODUNICO" DECIMAL,
    "ORIGEM" VARCHAR(6),
    "MARCA" VARCHAR(50),
    "GRUPOPRODUTO" VARCHAR(50),
    "REF" VARCHAR(50),
    "APLICACAO" VARCHAR(50),
    "ESTOQUE" DECIMAL NOT NULL,
    "CUSTO" DECIMAL NOT NULL,
    "CODMARCA" VARCHAR(5),
    "CODGPP" VARCHAR(5),
    "INF" VARCHAR(1),
    "MULTIPLO" DECIMAL,
    "ESTOQUE_MIN" DECIMAL,
    "ESTOQUE_MAX" DECIMAL,
    "MAR_ID" DECIMAL,
    "GPP_ID" DECIMAL,
    "CURVA" VARCHAR(1),
    "id" SERIAL NOT NULL,

    CONSTRAINT "cmp_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbformacaoprvenda" (
    "CODPROD" VARCHAR(6),
    "TIPOPRECO" DECIMAL NOT NULL,
    "MARGEMLIQUIDA" DECIMAL NOT NULL,
    "ICMSDEVOL" DECIMAL NOT NULL,
    "ICMS" DECIMAL NOT NULL,
    "IPI" DECIMAL NOT NULL,
    "PIS" DECIMAL NOT NULL,
    "COFINS" DECIMAL NOT NULL,
    "DCI" DECIMAL NOT NULL,
    "COMISSAO" DECIMAL NOT NULL,
    "FATORDESPESAS" DECIMAL NOT NULL,
    "PRECOVENDA" DECIMAL NOT NULL,
    "TAXACARTAO" DECIMAL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "dbformacaoprvenda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_nfe_ent_id" ON "dbnfe_ent"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "uq_nfe_ent_codent" ON "dbnfe_ent"("codent");

-- CreateIndex
CREATE INDEX "idx_login_access_user_perfil" ON "tb_login_access_user"("login_perfil_name");

-- AddForeignKey
ALTER TABLE "dbnfe_ent_dest" ADD CONSTRAINT "fk_dest_nfe_ent_cod" FOREIGN KEY ("codnfe_ent") REFERENCES "dbnfe_ent"("codnfe_ent") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbnfe_ent_emit" ADD CONSTRAINT "fk_emit_nfe_ent_cod" FOREIGN KEY ("codnfe_ent") REFERENCES "dbnfe_ent"("codnfe_ent") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbnfe_ent_tran" ADD CONSTRAINT "fk_tran_nfe_ent_cod" FOREIGN KEY ("codnfe_ent") REFERENCES "dbnfe_ent"("codnfe_ent") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbvenda" ADD CONSTRAINT "dbvenda_codcli_fkey" FOREIGN KEY ("codcli") REFERENCES "dbclien"("codcli") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_grupo_Permissao" ADD CONSTRAINT "tb_grupo_Permissao_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "tb_login_perfil"("login_perfil_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_login_access_user" ADD CONSTRAINT "fk_login_access_user_perfil" FOREIGN KEY ("login_perfil_name") REFERENCES "tb_login_perfil"("login_perfil_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_perfil" ADD CONSTRAINT "fk_user_perfil_perfil" FOREIGN KEY ("perfil_name") REFERENCES "tb_login_perfil"("login_perfil_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_perfil" ADD CONSTRAINT "fk_user_perfil_user" FOREIGN KEY ("user_login_id") REFERENCES "tb_login_user"("login_user_login") ON DELETE CASCADE ON UPDATE CASCADE;
