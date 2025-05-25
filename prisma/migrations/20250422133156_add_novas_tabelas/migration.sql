-- CreateTable
CREATE TABLE "arm_it_transferencia" (
    "itt_tra_id" INTEGER NOT NULL,
    "itt_codprod" VARCHAR(6) NOT NULL,
    "itt_qtd" DECIMAL(38,0),

    CONSTRAINT "arm_it_transferencia_pkey" PRIMARY KEY ("itt_tra_id","itt_codprod")
);

-- CreateTable
CREATE TABLE "arm_transferencia" (
    "tra_id" INTEGER NOT NULL,
    "tra_arm_id_origem" INTEGER,
    "tra_arm_id_destino" INTEGER,
    "tra_codusr_emissao" VARCHAR(4),
    "tra_codusr_envio" VARCHAR(4),
    "tra_codusr_recebimento" VARCHAR(4),
    "tra_data" DATE,
    "tra_transp" VARCHAR(5),
    "tra_pedido" VARCHAR(100),
    "tra_obs" VARCHAR(150),
    "tra_status" VARCHAR(1),
    "tra_cancel" VARCHAR(1),

    CONSTRAINT "pkarm_transferencia_id" PRIMARY KEY ("tra_id")
);

-- CreateTable
CREATE TABLE "cad_armazem" (
    "arm_id" INTEGER NOT NULL,
    "arm_descricao" VARCHAR(15),
    "arm_serie" VARCHAR(3),
    "arm_iest" VARCHAR(20),
    "arm_status" VARCHAR(1),
    "arm_logradouro" VARCHAR(50),
    "arm_numero" VARCHAR(5),
    "arm_complemento" VARCHAR(50),
    "arm_bairro" VARCHAR(30),
    "arm_cep" VARCHAR(10),
    "arm_municipio" VARCHAR(30),
    "arm_uf" VARCHAR(2),
    "arm_custo" DECIMAL,

    CONSTRAINT "pk_cad_armazem" PRIMARY KEY ("arm_id")
);

-- CreateTable
CREATE TABLE "cad_centro_custo" (
    "cec_id" INTEGER NOT NULL,
    "cec_gcc_id" INTEGER NOT NULL,
    "cec_descricao" VARCHAR(100) NOT NULL,

    CONSTRAINT "pkcec_id" PRIMARY KEY ("cec_id")
);

-- CreateTable
CREATE TABLE "cad_conta_financeira" (
    "cof_id" INTEGER NOT NULL,
    "cof_cec_id" INTEGER NOT NULL,
    "cof_descricao" VARCHAR(100) NOT NULL,
    "cof_operacional" VARCHAR(1) NOT NULL DEFAULT 'S',

    CONSTRAINT "pkcod_id" PRIMARY KEY ("cof_id")
);

-- CreateTable
CREATE TABLE "cad_credor_regra_faturamento" (
    "crf_id" VARCHAR(5) NOT NULL,
    "desc_icms_sufra" INTEGER NOT NULL,
    "desc_icms_sufra_piscofins" INTEGER NOT NULL,
    "piscofins_365" INTEGER NOT NULL,
    "piscofins_925" INTEGER NOT NULL,
    "piscofins_1150" INTEGER NOT NULL,
    "piscofins_1310" INTEGER NOT NULL,
    "desc_icms_sufra_st" INTEGER NOT NULL,
    "desc_piscofins_st" INTEGER NOT NULL,
    "acres_piscofins_st" INTEGER NOT NULL,
    "desc_icms_sufra_importado" INTEGER NOT NULL,
    "cobrar_ipi_importado" INTEGER NOT NULL,
    "frete" INTEGER NOT NULL,
    "basereduzida_st" INTEGER NOT NULL,
    "basereduzida_icms" INTEGER NOT NULL,
    "desc_icms_sufra_base" INTEGER NOT NULL,
    "desc_icms_sufra_importado_base" INTEGER NOT NULL,

    CONSTRAINT "pkcredorregra_fat" PRIMARY KEY ("crf_id")
);

-- CreateTable
CREATE TABLE "cad_grupo_centro_custo" (
    "gcc_id" INTEGER NOT NULL,
    "gcc_descricao" VARCHAR(100) NOT NULL,

    CONSTRAINT "cad_grupo_centro_custo_pkey" PRIMARY KEY ("gcc_id")
);

-- CreateTable
CREATE TABLE "cad_unidade_melo" (
    "unm_id" DECIMAL(38,0) NOT NULL,
    "unm_nome" VARCHAR(30) NOT NULL,
    "unm_sigla" VARCHAR(5) NOT NULL,
    "unm_cnpj" VARCHAR(14) NOT NULL,

    CONSTRAINT "cad_unidade_melo_pkey" PRIMARY KEY ("unm_id")
);

-- CreateTable
CREATE TABLE "dadosempresa" (
    "cgc" VARCHAR(18),
    "inscricaoestadual" VARCHAR(14),
    "nomecontribuinte" VARCHAR(35),
    "municipio" VARCHAR(30),
    "uf" VARCHAR(2),
    "fax" VARCHAR(16),
    "codigoconvenio" VARCHAR(1),
    "codigonatureza" VARCHAR(1),
    "codigofinalidade" VARCHAR(1),
    "logradouro" VARCHAR(34),
    "numero" VARCHAR(5),
    "complemento" VARCHAR(22),
    "bairro" VARCHAR(15),
    "cep" VARCHAR(10),
    "contato" VARCHAR(28),
    "telefone" VARCHAR(16),
    "suframa" VARCHAR(12),
    "email" VARCHAR(50),
    "inscricaoestadual_07" VARCHAR(14),
    "inscricaomunicipal" VARCHAR(14),
    "id_token" VARCHAR(6),
    "token" VARCHAR(36)
);

-- CreateTable
CREATE TABLE "dbanalise_gpxcurva" (
    "codgpp" VARCHAR(5) NOT NULL,
    "diasprojecao" INTEGER DEFAULT 60,
    "diasdemanda" INTEGER DEFAULT 90,
    "curva" VARCHAR(1) NOT NULL,

    CONSTRAINT "xdbanalisecodgppcurva" PRIMARY KEY ("codgpp","curva")
);

-- CreateTable
CREATE TABLE "dbbairro" (
    "codbairro" VARCHAR(5) NOT NULL,
    "codzona" VARCHAR(3) NOT NULL,
    "descr" VARCHAR(70) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "cidade" VARCHAR(70) NOT NULL,
    "bai_nu_sequencial" BIGINT,
    "codmunicipio" VARCHAR(7) NOT NULL,
    "codpais" INTEGER NOT NULL,
    "SANKHYA_ID" VARCHAR(5),

    CONSTRAINT "dbbairro_pkey" PRIMARY KEY ("codbairro")
);

-- CreateTable
CREATE TABLE "dbbanco_cobranca" (
    "banco" VARCHAR(3) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "dbbanco_cobranca_pkey" PRIMARY KEY ("banco")
);

-- CreateTable
CREATE TABLE "dbccusto" (
    "cod_ccusto" VARCHAR(4) NOT NULL,
    "descr" VARCHAR(20),
    "tipo" VARCHAR(1),

    CONSTRAINT "dbccusto_pkey" PRIMARY KEY ("cod_ccusto")
);

-- CreateTable
CREATE TABLE "dbcest" (
    "id" SERIAL NOT NULL,
    "cest" VARCHAR(7) NOT NULL,
    "ncm" VARCHAR(8),
    "segmento" VARCHAR(100),
    "descricao" VARCHAR(1000),

    CONSTRAINT "dbcest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbcfop_n" (
    "cfop" VARCHAR(4) NOT NULL,
    "descr" VARCHAR(255),
    "cfopinverso" VARCHAR(4),
    "excecao" VARCHAR(1),

    CONSTRAINT "dbcfop_n_pkey" PRIMARY KEY ("cfop")
);

-- CreateTable
CREATE TABLE "dbclassefornecedor" (
    "codcf" VARCHAR(5) NOT NULL,
    "descr" VARCHAR(30) NOT NULL,

    CONSTRAINT "dbclassefornecedor_pkey" PRIMARY KEY ("codcf")
);

-- CreateTable
CREATE TABLE "dbclassevendedor" (
    "codcv" VARCHAR(3) NOT NULL,
    "descr" VARCHAR(20),

    CONSTRAINT "dbclassevendedor_pkey" PRIMARY KEY ("codcv")
);

-- CreateTable
CREATE TABLE "dbclassificacao_fiscal" (
    "codcla" DECIMAL,
    "ipi" DECIMAL(6,2) DEFAULT 0,
    "pis" DECIMAL(6,2) DEFAULT 0,
    "cofins" DECIMAL(6,2) DEFAULT 0,
    "descricao" VARCHAR(4000),
    "ncm" VARCHAR(8) NOT NULL,
    "agregado" DECIMAL(7,2) DEFAULT 0,
    "ncm_auto" VARCHAR(8),

    CONSTRAINT "pk1ncm" PRIMARY KEY ("ncm")
);

-- CreateTable
CREATE TABLE "dbclien" (
    "codcli" VARCHAR(5) NOT NULL,
    "nome" VARCHAR(40),
    "nomefant" VARCHAR(30),
    "cpfcgc" VARCHAR(20),
    "tipo" VARCHAR(1),
    "codcc" VARCHAR(5),
    "codvend" VARCHAR(5),
    "datacad" DATE,
    "ender" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "uf" VARCHAR(2),
    "cep" VARCHAR(9),
    "iest" VARCHAR(20),
    "isuframa" VARCHAR(20),
    "imun" VARCHAR(20),
    "status" VARCHAR(1),
    "obs" VARCHAR(100),
    "tipoemp" VARCHAR(3),
    "debito" DECIMAL(11,2) NOT NULL,
    "limite" DECIMAL(11,2) NOT NULL,
    "contato" VARCHAR(20),
    "socios" VARCHAR(50),
    "icms" VARCHAR(1),
    "endercobr" VARCHAR(100),
    "cidadecobr" VARCHAR(100),
    "bairrocobr" VARCHAR(100),
    "ufcobr" VARCHAR(2),
    "cepcobr" VARCHAR(9),
    "claspgto" VARCHAR(1) NOT NULL,
    "email" VARCHAR(100),
    "atraso" BIGINT,
    "ipi" VARCHAR(1),
    "prvenda" VARCHAR(1),
    "codbairro" VARCHAR(5),
    "codbairrocobr" VARCHAR(5),
    "banco" VARCHAR(1),
    "tipocliente" VARCHAR(1),
    "codtmk" VARCHAR(5),
    "kickback" BIGINT,
    "sit_tributaria" BIGINT,
    "numero" VARCHAR(60),
    "referencia" VARCHAR(200),
    "codpais" BIGINT,
    "numerocobr" VARCHAR(60),
    "codpaiscobr" BIGINT,
    "referenciacobr" VARCHAR(200),
    "codmunicipio" VARCHAR(7),
    "codmunicipiocobr" VARCHAR(7),
    "complemento" VARCHAR(100),
    "complementocobr" VARCHAR(100),
    "acrescimo" DECIMAL(5,2),
    "desconto" DECIMAL(5,2),
    "habilitasuframa" VARCHAR(1),
    "emailnfe" VARCHAR(100),
    "faixafin" VARCHAR(2),
    "codunico" VARCHAR(7),
    "bloquear_preco" VARCHAR(1) DEFAULT 'S',
    "local_entrega" VARCHAR(1),
    "codigo_filial" BIGINT,
    "codprod" INTEGER,
    "codgpf" INTEGER,
    "codgpp" INTEGER,
    "codgpe" INTEGER,
    "codmarca" INTEGER,
    "descr" VARCHAR(64),
    "REF" VARCHAR(50),
    "prcompra" REAL,
    "prmedio" REAL,
    "primp" REAL,
    "pesoliq" INTEGER,
    "qtembal" INTEGER,
    "LOCAL" VARCHAR(50),
    "prfabr" REAL,
    "concor" REAL,
    "impfat" INTEGER,
    "impfab" INTEGER,
    "sit" VARCHAR(50),
    "unimed" VARCHAR(50),
    "qtest" INTEGER,
    "clasfiscal" INTEGER,
    "strib" INTEGER,
    "codbar" INTEGER,
    "trib" VARCHAR(50),
    "dolar" VARCHAR(50),
    "est" VARCHAR(50),
    "reforiginal" VARCHAR(50),
    "dtprcompra" VARCHAR(50),
    "dtprvenda" VARCHAR(50),
    "dtprfabr" VARCHAR(50),
    "dtprimp" VARCHAR(50),
    "dtprconcor" VARCHAR(50),
    "dtcompra" VARCHAR(50),
    "dtvenda" VARCHAR(50),
    "qtdcompra" INTEGER,
    "qtdreservada" INTEGER,
    "qtdinicial" INTEGER,
    "percsubst" INTEGER,
    "dtinventario" VARCHAR(50),
    "qtdpromocao" INTEGER,
    "isentopiscofins" VARCHAR(50),
    "prcustoatual" REAL,
    "local2" VARCHAR(50),
    "dtprcustoatual" VARCHAR(50),
    "curva" VARCHAR(50),
    "qtestmin" INTEGER,
    "inf" VARCHAR(50),
    "nrodi" INTEGER,
    "dtdi" VARCHAR(50),
    "qtest_filial" INTEGER,
    "cumulativo" VARCHAR(50),
    "pratualdesp" REAL,
    "pis" REAL,
    "cofins" REAL,
    "multiplo" INTEGER,
    "aplic_extendida" VARCHAR(256),
    "isentoipi" VARCHAR(50),
    "coddesc" INTEGER,
    "prodepe" VARCHAR(50),
    "hanan" VARCHAR(50),
    "prcomprasemst" REAL,
    "prcompraf" REAL,
    "prmediof" REAL,
    "cmercd" REAL,
    "cmercf" REAL,
    "margem" INTEGER,
    "tabelado" VARCHAR(50),
    "margempromo" INTEGER,
    "estoque_contabil" INTEGER,
    "curva_fornecedor" VARCHAR(50),
    "prfat_fornecedor" INTEGER,
    "qtestmin_sugerido" INTEGER,
    "curva_sugerido" VARCHAR(50),
    "preconf" REAL,
    "precosnf" REAL,
    "txdolarfabrica" REAL,
    "txdolarvenda" REAL,
    "txdolarcompra" REAL,
    "txdolarcompramedio" INTEGER,
    "naotemst" VARCHAR(50),
    "compradireta" VARCHAR(50),
    "descontopiscofins" VARCHAR(50),
    "pro_id" INTEGER,
    "cmerczf" REAL,
    "excluido" INTEGER,
    "qtestmax" INTEGER,
    "qtestmax_sugerido" INTEGER,
    "multiplocompra" INTEGER,
    "codrelacionado" VARCHAR(50),
    "nfci" VARCHAR(50),
    "margem_min_venda" INTEGER,
    "margem_med_venda" INTEGER,
    "margem_ide_venda" INTEGER,
    "cest" INTEGER,
    "ii" INTEGER,
    "descr_importacao" VARCHAR(50),
    "sem_gtin" VARCHAR(50),

    CONSTRAINT "dbclien_pkey" PRIMARY KEY ("codcli")
);

-- CreateTable
CREATE TABLE "dbcclien" (
    "codcc" VARCHAR(5) NOT NULL,
    "descr" VARCHAR(100),

    CONSTRAINT "dbcclien_pkey" PRIMARY KEY ("codcc")
);

-- CreateTable
CREATE TABLE "dbcliente_limite" (
    "codclilim" INTEGER NOT NULL,
    "codcli" VARCHAR(5),
    "data" DATE,
    "ultimo_limite" INTEGER,
    "observacao" VARCHAR(255),
    "codusr" VARCHAR(4),

    CONSTRAINT "pkcodclilim" PRIMARY KEY ("codclilim")
);

-- CreateTable
CREATE TABLE "dbcompradores" (
    "codcomprador" VARCHAR(3) NOT NULL,
    "nome" VARCHAR(40) NOT NULL,

    CONSTRAINT "dbcompradores_pkey" PRIMARY KEY ("codcomprador")
);

-- CreateTable
CREATE TABLE "dbcredor" (
    "cod_credor" VARCHAR(5) NOT NULL,
    "nome" VARCHAR(40),
    "nome_fant" VARCHAR(40),
    "cpf_cgc" VARCHAR(20),
    "tipo" VARCHAR(1),
    "data_cad" DATE,
    "endereco" VARCHAR(100),
    "bairro" VARCHAR(70),
    "cidade" VARCHAR(70),
    "uf" VARCHAR(2),
    "isuframa" VARCHAR(20),
    "iest" VARCHAR(20),
    "imun" VARCHAR(20),
    "cc" VARCHAR(10),
    "n_agencia" VARCHAR(6),
    "banco" VARCHAR(20),
    "cod_ident" VARCHAR(5),
    "contatos" VARCHAR(50),
    "tipoemp" VARCHAR(2),
    "cep" VARCHAR(9),
    "codcf" VARCHAR(5),
    "fabricante" VARCHAR(1) DEFAULT 'N',
    "regime_tributacao" VARCHAR(1) DEFAULT '2',
    "codbairro" VARCHAR(5),
    "codmunicipio" VARCHAR(7),
    "numero" VARCHAR(60) DEFAULT '0',
    "referencia" VARCHAR(200),
    "codpais" DECIMAL,
    "complemento" VARCHAR(100),
    "tipofornecedor" VARCHAR(2),
    "codunico" VARCHAR(7),
    "codccontabil" VARCHAR(8),

    CONSTRAINT "dbcredor_pkey" PRIMARY KEY ("cod_credor")
);

-- CreateTable
CREATE TABLE "dbctel" (
    "tel" VARCHAR(14) NOT NULL,
    "cod_credor" VARCHAR(5) NOT NULL,

    CONSTRAINT "dbctel_pkey" PRIMARY KEY ("tel","cod_credor")
);

-- CreateTable
CREATE TABLE "dbdados_banco" (
    "id" SERIAL NOT NULL,
    "banco" VARCHAR(3),
    "tipo" VARCHAR(10),
    "nroconta" VARCHAR(10),
    "convenio" VARCHAR(10),
    "variacao" VARCHAR(3),
    "carteira" VARCHAR(3),
    "melo" VARCHAR(3),
    "agencia" VARCHAR(10),

    CONSTRAINT "dbdados_banco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbdados_vend" (
    "codvend" VARCHAR(5) NOT NULL,
    "bairro" VARCHAR(5),
    "cep" VARCHAR(8),
    "cidade" VARCHAR(20),
    "estado" VARCHAR(2),
    "celular" VARCHAR(13) DEFAULT '(  )    -    ',
    "logradouro" VARCHAR(40),
    "nome" VARCHAR(40),
    "tipo" VARCHAR(1),
    "cpf_cnpj" VARCHAR(14),

    CONSTRAINT "dbdados_vend_pkey" PRIMARY KEY ("codvend")
);

-- CreateTable
CREATE TABLE "dbestoque" (
    "codprod" VARCHAR(6) NOT NULL,
    "arm_id" INTEGER NOT NULL,
    "deposito" VARCHAR(4) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "tipo_deposito" VARCHAR(1) NOT NULL,

    CONSTRAINT "dbestoque_pkey" PRIMARY KEY ("codprod")
);

-- CreateTable
CREATE TABLE "dbestoque_movimento" (
    "codprod" VARCHAR(6) NOT NULL,
    "arm_id" INTEGER NOT NULL,
    "deposito" VARCHAR(4) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "tipo_movimento" VARCHAR(2) NOT NULL,
    "data_registro" DATE NOT NULL,
    "hora_registro" VARCHAR(8) NOT NULL,
    "usuario" VARCHAR(40) NOT NULL,
    "documento" VARCHAR(40) NOT NULL,
    "tipo_documento" VARCHAR(2) NOT NULL,

    CONSTRAINT "dbestoque_movimento_pkey" PRIMARY KEY ("codprod")
);

-- CreateTable
CREATE TABLE "dbfunc_estoque" (
    "matricula" VARCHAR(6) NOT NULL,
    "nome" VARCHAR(50),
    "cargo" VARCHAR(1),

    CONSTRAINT "dbfunc_estoque_pkey" PRIMARY KEY ("matricula")
);

-- CreateTable
CREATE TABLE "dbgpfunc" (
    "codgpf" VARCHAR(5) NOT NULL,
    "descr" VARCHAR(20) NOT NULL,
    "agregado_substituicao" DECIMAL(5,2) DEFAULT 0,
    "gpf_id" DECIMAL,
    "AGREGADO_SUBSTUICAO" DECIMAL(5,2),

    CONSTRAINT "dbgpfunc_pkey" PRIMARY KEY ("codgpf")
);

-- CreateTable
CREATE TABLE "dbgpprod" (
    "codgpp" VARCHAR(5) NOT NULL,
    "codvend" VARCHAR(5),
    "descbalcao" DECIMAL(5,2) DEFAULT 0,
    "dscrev30" DECIMAL(5,2) DEFAULT 0,
    "dscrev45" DECIMAL(5,2) DEFAULT 0,
    "dscrev60" DECIMAL(5,2) DEFAULT 0,
    "dscrv30" DECIMAL(5,2) DEFAULT 0,
    "dscrv45" DECIMAL(5,2) DEFAULT 0,
    "dscrv60" DECIMAL(5,2) DEFAULT 0,
    "dscbv30" DECIMAL(5,2) DEFAULT 0,
    "dscbv45" DECIMAL(5,2) DEFAULT 0,
    "dscbv60" DECIMAL(5,2) DEFAULT 0,
    "dscpv30" DECIMAL(5,2) DEFAULT 0,
    "dscpv45" DECIMAL(5,2) DEFAULT 0,
    "dscpv60" DECIMAL(5,2) DEFAULT 0,
    "descr" VARCHAR(30) NOT NULL,
    "comgpp" DECIMAL(3,2) DEFAULT 0,
    "comgpptmk" DECIMAL(3,2) DEFAULT 0,
    "comgppextmk" DECIMAL(3,2) DEFAULT 0,
    "codseg" VARCHAR(5),
    "diasreposicao" INTEGER DEFAULT 40,
    "codcomprador" VARCHAR(3) DEFAULT '000',
    "ramonegocio" VARCHAR(1) DEFAULT 'S',
    "gpp_id" DECIMAL,
    "p_comercial" INTEGER DEFAULT 0,
    "v_marketing" DECIMAL(5,2) DEFAULT 0,
    "codgpc" VARCHAR(4) DEFAULT '0000',
    "margem_min_venda" DECIMAL(7,2) DEFAULT 10.00,
    "margem_med_venda" DECIMAL(7,2) DEFAULT 10.00,
    "margem_ide_venda" DECIMAL(7,2) DEFAULT 10.00,
    "bloquear_preco" VARCHAR(1) DEFAULT 'S',
    "codgrupai" DECIMAL,
    "codgrupoprod" DECIMAL,
    "DSCBALCAO" DECIMAL(5,2),

    CONSTRAINT "dbgpprod_pkey" PRIMARY KEY ("codgpp")
);

-- CreateTable
CREATE TABLE "dbgpprod_contabil" (
    "codgpc" VARCHAR(4) NOT NULL,
    "descr" VARCHAR(100) NOT NULL,

    CONSTRAINT "dbgpprod_contabil_pkey" PRIMARY KEY ("codgpc")
);

-- CreateTable
CREATE TABLE "dbitvenda" (
    "ref" VARCHAR(20),
    "codprod" VARCHAR(6) NOT NULL,
    "codvenda" VARCHAR(9) NOT NULL,
    "qtd" BIGINT NOT NULL,
    "prunit" DECIMAL(9,2) NOT NULL,
    "demanda" VARCHAR(1),
    "descr" VARCHAR(60),
    "comissao" DECIMAL(5,2),
    "origemcom" VARCHAR(1),
    "codoperador" VARCHAR(5),
    "codvend" VARCHAR(5),
    "prcompra" BIGINT,
    "prmedio" BIGINT,
    "comissaovend" BIGINT,
    "comissao_operador" BIGINT,
    "desconto" BIGINT,
    "codreq" VARCHAR(12),
    "codent" VARCHAR(9),
    "nrequis" VARCHAR(15),
    "nritem" VARCHAR(6),
    "arm_id" BIGINT NOT NULL,

    CONSTRAINT "dbitvenda_pk" PRIMARY KEY ("codprod","codvenda")
);

-- CreateTable
CREATE TABLE "dbmarcas" (
    "codmarca" VARCHAR(5) NOT NULL,
    "descr" VARCHAR(200) NOT NULL,
    "mar_id" DECIMAL,
    "bloquear_preco" VARCHAR(1) DEFAULT 'S',

    CONSTRAINT "dbmarcas_pkey" PRIMARY KEY ("codmarca")
);

-- CreateTable
CREATE TABLE "dbmunicipio" (
    "codmunicipio" VARCHAR(7) NOT NULL,
    "coduf" VARCHAR(2) NOT NULL,
    "descricao" VARCHAR(70) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,

    CONSTRAINT "dbmunicipio_pkey" PRIMARY KEY ("codmunicipio")
);

-- CreateTable
CREATE TABLE "dbpais" (
    "codpais" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "dbpais_pkey" PRIMARY KEY ("codpais")
);

-- CreateTable
CREATE TABLE "dbprod" (
    "codprod" VARCHAR(6) NOT NULL,
    "codgpf" VARCHAR(5),
    "codgpp" VARCHAR(5),
    "codgpe" VARCHAR(5),
    "codmarca" VARCHAR(5),
    "descr" VARCHAR(200),
    "ref" VARCHAR(20),
    "prcompra" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "prvenda" DECIMAL(13,2) DEFAULT 0,
    "prmedio" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "primp" DECIMAL(13,2) DEFAULT 0,
    "pesoliq" DECIMAL(7,2) DEFAULT 0,
    "qtembal" INTEGER DEFAULT 0,
    "local" VARCHAR(15),
    "prfabr" DECIMAL(13,2) DEFAULT 0,
    "concor" DECIMAL(13,2) DEFAULT 0,
    "impfat" DECIMAL(13,2) DEFAULT 0,
    "impfab" DECIMAL(13,2),
    "obs" VARCHAR(100),
    "sit" VARCHAR(1) DEFAULT 'N',
    "unimed" VARCHAR(2),
    "qtest" INTEGER NOT NULL DEFAULT 0,
    "clasfiscal" VARCHAR(10),
    "strib" VARCHAR(3) NOT NULL DEFAULT '000',
    "codbar" VARCHAR(15),
    "trib" VARCHAR(1) DEFAULT 'N',
    "dolar" VARCHAR(1) DEFAULT 'N',
    "est" VARCHAR(1) DEFAULT 'N',
    "ipi" DECIMAL(5,2) DEFAULT 0,
    "reforiginal" VARCHAR(20),
    "dtprcompra" DATE,
    "dtprvenda" DATE,
    "dtprfabr" DATE,
    "dtprimp" DATE,
    "dtprconcor" DATE,
    "dtcompra" DATE,
    "dtvenda" DATE,
    "qtdcompra" INTEGER,
    "qtdreservada" INTEGER NOT NULL DEFAULT 0,
    "qtdinicial" INTEGER DEFAULT 0,
    "percsubst" DECIMAL(7,2) DEFAULT 0,
    "dtinventario" DATE,
    "qtdpromocao" INTEGER,
    "isentopiscofins" VARCHAR(1),
    "prcustoatual" DECIMAL(13,2) DEFAULT 0,
    "local2" VARCHAR(15),
    "dtprcustoatual" DATE,
    "curva" VARCHAR(1),
    "qtestmin" INTEGER DEFAULT 0,
    "inf" VARCHAR(1),
    "nrodi" VARCHAR(15),
    "dtdi" DATE,
    "qtest_filial" INTEGER NOT NULL DEFAULT 0,
    "cumulativo" VARCHAR(1) DEFAULT 'N',
    "pratualdesp" DECIMAL(13,2) DEFAULT 0,
    "pis" DECIMAL(5,2),
    "cofins" DECIMAL(5,2),
    "multiplo" INTEGER NOT NULL DEFAULT 1,
    "aplic_extendida" VARCHAR(255),
    "isentoipi" VARCHAR(1),
    "coddesc" INTEGER,
    "prodepe" VARCHAR(1),
    "hanan" VARCHAR(1),
    "prcomprasemst" DECIMAL(13,2) DEFAULT 0,
    "prcompraf" DECIMAL(13,2) DEFAULT 0,
    "prmediof" DECIMAL(13,2) DEFAULT 0,
    "cmercd" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "cmercf" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "margem" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "tabelado" VARCHAR(1) DEFAULT 'N',
    "margempromo" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "estoque_contabil" VARCHAR(1) DEFAULT '1',
    "curva_fornecedor" VARCHAR(1),
    "prfat_fornecedor" DECIMAL(13,2) DEFAULT 0,
    "qtestmin_sugerido" INTEGER,
    "curva_sugerido" VARCHAR(1),
    "preconf" DECIMAL(13,2) DEFAULT 0,
    "precosnf" DECIMAL(13,2) DEFAULT 0,
    "txdolarfabrica" DECIMAL(13,2) DEFAULT 0,
    "txdolarvenda" DECIMAL(13,2) DEFAULT 0,
    "txdolarcompra" DECIMAL(17,6) DEFAULT 0,
    "txdolarcompramedio" DECIMAL(17,6) DEFAULT 0,
    "naotemst" VARCHAR(1),
    "compradireta" VARCHAR(1),
    "descontopiscofins" VARCHAR(1),
    "pro_id" INTEGER,
    "cmerczf" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "excluido" INTEGER NOT NULL DEFAULT 0,
    "qtestmax" INTEGER NOT NULL DEFAULT 0,
    "qtestmax_sugerido" INTEGER NOT NULL DEFAULT 0,
    "multiplocompra" INTEGER NOT NULL DEFAULT 1,
    "codunico" INTEGER,
    "codrelacionado" VARCHAR(5),
    "tipo" VARCHAR(2) NOT NULL DEFAULT 'ME',
    "nfci" VARCHAR(36),
    "margem_min_venda" DECIMAL(9,2) DEFAULT 0,
    "margem_med_venda" DECIMAL(9,2) DEFAULT 0,
    "margem_ide_venda" DECIMAL(13,6) DEFAULT 0,
    "cest" VARCHAR(7),
    "ii" DECIMAL(9,2),
    "descr_importacao" VARCHAR(200),
    "sem_gtin" INTEGER,
    "consumo_interno" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "dbprod_pkey" PRIMARY KEY ("codprod")
);

-- CreateTable
CREATE TABLE "dbreceb" (
    "cod_receb" VARCHAR(9) NOT NULL,
    "codcli" VARCHAR(5) NOT NULL,
    "cod_venda" VARCHAR(9),
    "cod_conta" VARCHAR(4),
    "cod_fat" VARCHAR(9),
    "nro_doc" VARCHAR(15),
    "valor_pgto" DECIMAL(11,2),
    "valor_rec" DECIMAL(11,2),
    "dt_venc" DATE,
    "dt_pgto" DATE,
    "dt_emissao" DATE,
    "tipo" VARCHAR(1),
    "rec" VARCHAR(1),
    "cancel" VARCHAR(1),
    "nro_docbanco" VARCHAR(5),
    "bradesco" VARCHAR(1),
    "forma_fat" VARCHAR(1),
    "venc_ant" DATE,
    "nrocx" VARCHAR(1),
    "banco" VARCHAR(1) DEFAULT '0',
    "nro_docbrasil" VARCHAR(5),
    "nro_banco" VARCHAR(20),
    "codgp" INTEGER,
    "dtvenc_previsao" DATE,
    "codemp" INTEGER,
    "rec_cof_id" INTEGER DEFAULT 154,
    "import" VARCHAR(1) DEFAULT 'N',

    CONSTRAINT "pkdbreceb" PRIMARY KEY ("cod_receb")
);

-- CreateTable
CREATE TABLE "dbsegmento" (
    "codseg" VARCHAR(5) NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,
    "margem_min_venda" DECIMAL(7,2) DEFAULT 0,
    "margem_med_venda" DECIMAL(7,2) DEFAULT 0,
    "margem_ide_venda" DECIMAL(7,2) DEFAULT 0,

    CONSTRAINT "dbsegmento_pkey" PRIMARY KEY ("codseg")
);

-- CreateTable
CREATE TABLE "dbtipopagtocliente" (
    "codtipo" INTEGER NOT NULL,
    "codcli" VARCHAR(5) NOT NULL,

    CONSTRAINT "dbtipopagtocliente_pkey" PRIMARY KEY ("codtipo")
);

-- CreateTable
CREATE TABLE "dbtransp" (
    "codtransp" VARCHAR(5) NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "nomefant" VARCHAR(50),
    "cpfcgc" VARCHAR(20),
    "tipo" VARCHAR(1),
    "data_cad" DATE,
    "ender" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "uf" VARCHAR(2),
    "iest" VARCHAR(20),
    "isuframa" VARCHAR(20),
    "imun" VARCHAR(20),
    "tipoemp" VARCHAR(2),
    "contatos" VARCHAR(50),
    "cc" VARCHAR(10),
    "n_agencia" VARCHAR(6),
    "banco" VARCHAR(20),
    "cod_ident" VARCHAR(5),
    "cep" VARCHAR(9),
    "codbairro" VARCHAR(5),
    "codmunicipio" VARCHAR(7),
    "numero" VARCHAR(60),
    "referencia" VARCHAR(200),
    "codpais" INTEGER,
    "complemento" VARCHAR(100),
    "codunico" VARCHAR(7),

    CONSTRAINT "dbtransp_pkey" PRIMARY KEY ("codtransp")
);

-- CreateTable
CREATE TABLE "dbvend" (
    "codvend" VARCHAR(5) NOT NULL,
    "nome" VARCHAR(30),
    "valobj" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "comnormal" DECIMAL(6,2),
    "comtele" DECIMAL(6,2),
    "debito" DECIMAL(9,2),
    "credito" DECIMAL(9,2),
    "limite" DECIMAL(9,2),
    "status" VARCHAR(1),
    "codcv" VARCHAR(3),
    "comobj" DECIMAL(6,2),
    "valobjf" DECIMAL(8,2),
    "valobjm" DECIMAL(8,2),
    "valobjsf" DECIMAL(8,2),
    "ra_mat" VARCHAR(6),

    CONSTRAINT "dbvend_pkey" PRIMARY KEY ("codvend")
);

-- CreateTable
CREATE TABLE "dbvend_pst" (
    "id" SERIAL NOT NULL,
    "codvend" VARCHAR(5) NOT NULL,
    "codpst" VARCHAR(4) NOT NULL,
    "local" VARCHAR(3) NOT NULL,

    CONSTRAINT "dbvend_pst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbvenda" (
    "operacao" BIGINT,
    "codvenda" VARCHAR(9) NOT NULL,
    "codusr" VARCHAR(4),
    "nrovenda" VARCHAR(9),
    "codcli" VARCHAR(5) NOT NULL,
    "data" DATE,
    "total" DECIMAL(13,2),
    "nronf" VARCHAR(10),
    "pedido" VARCHAR(30),
    "status" VARCHAR(1),
    "transp" VARCHAR(50),
    "prazo" VARCHAR(40),
    "obs" VARCHAR(100),
    "tipo_desc" VARCHAR(2),
    "tipo" VARCHAR(1) NOT NULL,
    "tele" VARCHAR(1),
    "cancel" VARCHAR(1),
    "statusest" VARCHAR(1),
    "impresso" VARCHAR(1),
    "vlrfrete" DECIMAL(11,2),
    "codtptransp" VARCHAR(3),
    "bloqueada" VARCHAR(1),
    "estoque_virtual" VARCHAR(1),
    "numeroserie" VARCHAR(100),
    "numerocupom" VARCHAR(20),
    "obsfat" VARCHAR(100),

    CONSTRAINT "dbvenda_pkey" PRIMARY KEY ("codvenda")
);

-- CreateTable
CREATE TABLE "dbvenda_orcamento" (
    "operacao" BIGINT,
    "codvenda" VARCHAR(9) NOT NULL,
    "codusr" VARCHAR(4),
    "nrovenda" VARCHAR(9),
    "codcli" VARCHAR(5) NOT NULL,
    "data" DATE,
    "total" DECIMAL(13,2),
    "nronf" VARCHAR(10),
    "pedido" VARCHAR(30),
    "status" VARCHAR(1),
    "transp" VARCHAR(50),
    "prazo" VARCHAR(40),
    "obs" VARCHAR(100),
    "tipo_desc" VARCHAR(2),
    "tipo" VARCHAR(1) NOT NULL,
    "tele" VARCHAR(1),
    "cancel" VARCHAR(1),
    "statusest" VARCHAR(1),
    "impresso" VARCHAR(1),
    "vlrfrete" DECIMAL(11,2),
    "codtptransp" VARCHAR(3),
    "bloqueada" VARCHAR(1),
    "estoque_virtual" VARCHAR(1),
    "numeroserie" VARCHAR(100),
    "numerocupom" VARCHAR(20),
    "obsfat" VARCHAR(100),

    CONSTRAINT "dbvenda_orcamento_pkey" PRIMARY KEY ("codvenda")
);

-- CreateTable
CREATE TABLE "dbvendacomissao" (
    "id" BIGSERIAL NOT NULL,
    "codprod" VARCHAR(6),
    "codvenda" VARCHAR(9),
    "codvend" VARCHAR(5),
    "comissaovend" DECIMAL(9,2),
    "reducaovend" DECIMAL(9,2),
    "codoperador" VARCHAR(5),
    "comissaooperador" DECIMAL(9,2),
    "reducaooperador" DECIMAL(9,2),
    "tiporeducao" VARCHAR(20),
    "nrequis" VARCHAR(15),
    "nritem" VARCHAR(6),

    CONSTRAINT "dbvendacomissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbvendgpp" (
    "codgpp" VARCHAR NOT NULL,
    "codvend" VARCHAR NOT NULL,
    "exclusivo" VARCHAR(1) NOT NULL,
    "comdireta" DECIMAL(5,2) NOT NULL,
    "comindireta" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "dbvendgpp_pkey" PRIMARY KEY ("codgpp","codvend")
);

-- CreateTable
CREATE TABLE "dbvvend" (
    "operador" VARCHAR(1) NOT NULL,
    "codvenda" VARCHAR(9) NOT NULL,
    "codvend" VARCHAR(5) NOT NULL,

    CONSTRAINT "dbvvend_pkey" PRIMARY KEY ("operador","codvenda","codvend")
);

-- CreateTable
CREATE TABLE "dbzona" (
    "codzona" VARCHAR(3) NOT NULL,
    "descr" VARCHAR(20) NOT NULL,

    CONSTRAINT "dbzona_pkey" PRIMARY KEY ("codzona")
);

-- CreateTable
CREATE TABLE "tb_filial" (
    "codigo_filial" VARCHAR NOT NULL,
    "NOME_FILIAL" VARCHAR NOT NULL,

    CONSTRAINT "tb_filial_pkey" PRIMARY KEY ("codigo_filial")
);

-- CreateTable
CREATE TABLE "tb_grupo_Permissao" (
    "id" SERIAL NOT NULL,
    "editar" BOOLEAN NOT NULL,
    "cadastrar" BOOLEAN NOT NULL,
    "remover" BOOLEAN NOT NULL,
    "exportar" BOOLEAN NOT NULL,
    "grupoId" TEXT NOT NULL,
    "tela" INTEGER NOT NULL,

    CONSTRAINT "tb_grupo_Permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_login_access_group" (
    "id_functions" BIGINT NOT NULL,
    "login_group_name" VARCHAR(500) NOT NULL,

    CONSTRAINT "tb_login_access_group_pkey" PRIMARY KEY ("id_functions","login_group_name")
);

-- CreateTable
CREATE TABLE "tb_login_access_user" (
    "id_functions" BIGINT NOT NULL,
    "login_user_login" VARCHAR(500) NOT NULL,

    CONSTRAINT "tb_login_access_user_pkey" PRIMARY KEY ("id_functions","login_user_login")
);

-- CreateTable
CREATE TABLE "tb_login_filiais" (
    "login_user_login" VARCHAR(40) NOT NULL,
    "codigo_filial" VARCHAR(50) NOT NULL,
    "nome_filial" VARCHAR(500) NOT NULL,

    CONSTRAINT "tb_login_filiais_pkey" PRIMARY KEY ("login_user_login","codigo_filial")
);

-- CreateTable
CREATE TABLE "tb_login_functions" (
    "id_functions" SERIAL NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,

    CONSTRAINT "tb_login_functions_pkey" PRIMARY KEY ("id_functions")
);

-- CreateTable
CREATE TABLE "tb_login_group" (
    "LOGIN_GROUP_NAME" VARCHAR NOT NULL,
    "LOGIN_GROUP_IS_ADMIN" BOOLEAN,

    CONSTRAINT "tb_login_group_pkey" PRIMARY KEY ("LOGIN_GROUP_NAME")
);

-- CreateTable
CREATE TABLE "tb_login_user" (
    "login_group_name" VARCHAR(60) NOT NULL,
    "login_user_login" VARCHAR(40) NOT NULL,
    "login_user_password" VARCHAR(40) NOT NULL,
    "login_user_name" VARCHAR(60) NOT NULL,
    "login_user_obs" TEXT,

    CONSTRAINT "tb_login_user_pkey" PRIMARY KEY ("login_user_login")
);

-- CreateTable
CREATE TABLE "tb_pedido_user" (
    "id" SERIAL NOT NULL,
    "id_pedido" VARCHAR(9) NOT NULL,
    "login_user_login" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_pedido_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pedidos" (
    "id" SERIAL NOT NULL,
    "codcli" VARCHAR(50) NOT NULL,
    "codprod" VARCHAR(50) NOT NULL,
    "qtd" INTEGER NOT NULL,
    "prunit" DECIMAL(13,2) NOT NULL,
    "prtotal" DECIMAL(13,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tb_pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_telas" (
    "CODIGO_TELA" SERIAL NOT NULL,
    "NOME_TELA" VARCHAR NOT NULL,
    "PATH_TELA" VARCHAR NOT NULL,

    CONSTRAINT "tb_telas_pkey" PRIMARY KEY ("CODIGO_TELA")
);

-- CreateTable
CREATE TABLE "ven_deposito_venda" (
    "ven_codusuario" VARCHAR(4) NOT NULL,
    "ven_codvenda" VARCHAR(9) NOT NULL,
    "ven_data_venda" DATE,
    "ven_codcli" VARCHAR(5) NOT NULL,
    "ven_valor_venda" DECIMAL(10,2),
    "ven_data_confirma" DATE,
    "ven_status" VARCHAR(1),
    "ven_banco" VARCHAR(1),
    "ven_conta" VARCHAR(15),

    CONSTRAINT "ven_deposito_venda_pkey" PRIMARY KEY ("ven_codvenda","ven_codusuario","ven_codcli")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_cad_armazem_descricao" ON "cad_armazem"("arm_descricao");

-- CreateIndex
CREATE UNIQUE INDEX "uqcec_descricao" ON "cad_centro_custo"("cec_descricao");

-- CreateIndex
CREATE UNIQUE INDEX "uqcof_descricao" ON "cad_conta_financeira"("cof_descricao");

-- CreateIndex
CREATE UNIQUE INDEX "uqgcc_descricao" ON "cad_grupo_centro_custo"("gcc_descricao");

-- CreateIndex
CREATE INDEX "idx_dbclien_codcli_trgm" ON "dbclien" USING GIN ("codcli" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_dbclien_nome_trgm" ON "dbclien" USING GIN ("nome" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "xif141dbctel" ON "dbctel"("cod_credor");

-- CreateIndex
CREATE UNIQUE INDEX "undbgpfuncndescr" ON "dbgpfunc"("descr");

-- CreateIndex
CREATE INDEX "xie1dbgpfunc" ON "dbgpfunc"("descr");

-- CreateIndex
CREATE UNIQUE INDEX "undbgpproddescr" ON "dbgpprod"("descr");

-- CreateIndex
CREATE INDEX "xie1dbgpprod" ON "dbgpprod"("descr");

-- CreateIndex
CREATE INDEX "xif142dbgpprod" ON "dbgpprod"("codvend");

-- CreateIndex
CREATE INDEX "xpkdbgpprod2" ON "dbgpprod"("codseg");

-- CreateIndex
CREATE UNIQUE INDEX "undbmarcasdescr" ON "dbmarcas"("descr");

-- CreateIndex
CREATE INDEX "xie1dbmarcas" ON "dbmarcas"("descr");

-- CreateIndex
CREATE INDEX "xie1dbtransp" ON "dbtransp"("nome");

-- CreateIndex
CREATE INDEX "xie2dbtransp" ON "dbtransp"("nomefant");

-- CreateIndex
CREATE INDEX "codcv" ON "dbvend"("codcv");

-- CreateIndex
CREATE UNIQUE INDEX "dbvend_pst_codvend_key" ON "dbvend_pst"("codvend");

-- CreateIndex
CREATE INDEX "idx_dbvend_pst_codvend" ON "dbvend_pst"("codvend");

-- AddForeignKey
ALTER TABLE "arm_it_transferencia" ADD CONSTRAINT "arm_it_transferencia_itt_codprod_fkey" FOREIGN KEY ("itt_codprod") REFERENCES "dbprod"("codprod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arm_it_transferencia" ADD CONSTRAINT "arm_it_transferencia_itt_tra_id_fkey" FOREIGN KEY ("itt_tra_id") REFERENCES "arm_transferencia"("tra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arm_transferencia" ADD CONSTRAINT "fkarm_transferencia_destino" FOREIGN KEY ("tra_arm_id_destino") REFERENCES "cad_armazem"("arm_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arm_transferencia" ADD CONSTRAINT "fkarm_transferencia_origem" FOREIGN KEY ("tra_arm_id_origem") REFERENCES "cad_armazem"("arm_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cad_centro_custo" ADD CONSTRAINT "fkcec_gcc_id" FOREIGN KEY ("cec_gcc_id") REFERENCES "cad_grupo_centro_custo"("gcc_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cad_conta_financeira" ADD CONSTRAINT "fkcof_cec_id" FOREIGN KEY ("cof_cec_id") REFERENCES "cad_centro_custo"("cec_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cad_credor_regra_faturamento" ADD CONSTRAINT "cad_credor_regra_faturamento_dbcredor_fk" FOREIGN KEY ("crf_id") REFERENCES "dbcredor"("cod_credor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbanalise_gpxcurva" ADD CONSTRAINT "xdbanalisecodgpp" FOREIGN KEY ("codgpp") REFERENCES "dbgpprod"("codgpp") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbbairro" ADD CONSTRAINT "dbbairro_codmunicipio_fkey" FOREIGN KEY ("codmunicipio") REFERENCES "dbmunicipio"("codmunicipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbbairro" ADD CONSTRAINT "dbbairro_codpais_fkey" FOREIGN KEY ("codpais") REFERENCES "dbpais"("codpais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbbairro" ADD CONSTRAINT "dbbairro_codzona_fkey" FOREIGN KEY ("codzona") REFERENCES "dbzona"("codzona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbctel" ADD CONSTRAINT "dbctel_cod_credor_fkey" FOREIGN KEY ("cod_credor") REFERENCES "dbcredor"("cod_credor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbdados_vend" ADD CONSTRAINT "dbdados_vend_codvend_fkey" FOREIGN KEY ("codvend") REFERENCES "dbvend"("codvend") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbestoque" ADD CONSTRAINT "dbestoque_arm_id_fkey" FOREIGN KEY ("arm_id") REFERENCES "cad_armazem"("arm_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbestoque" ADD CONSTRAINT "dbestoque_codprod_fkey" FOREIGN KEY ("codprod") REFERENCES "dbprod"("codprod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbestoque_movimento" ADD CONSTRAINT "dbestoque_movimento_arm_id_fkey" FOREIGN KEY ("arm_id") REFERENCES "cad_armazem"("arm_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbestoque_movimento" ADD CONSTRAINT "dbestoque_movimento_codprod_fkey" FOREIGN KEY ("codprod") REFERENCES "dbprod"("codprod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbitvenda" ADD CONSTRAINT "dbitvenda_codvenda_fkey" FOREIGN KEY ("codvenda") REFERENCES "dbvenda"("codvenda") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbvend" ADD CONSTRAINT "dbvend_codcv_fkey" FOREIGN KEY ("codcv") REFERENCES "dbclassevendedor"("codcv") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbvend_pst" ADD CONSTRAINT "dbvend_pst_codvend_fkey" FOREIGN KEY ("codvend") REFERENCES "dbvend"("codvend") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbvenda" ADD CONSTRAINT "dbvenda_codcli_fkey" FOREIGN KEY ("codcli") REFERENCES "dbclien"("codcli") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dbvendgpp" ADD CONSTRAINT "dbvendgpp_codgpp_fkey" FOREIGN KEY ("codgpp") REFERENCES "dbgpprod"("codgpp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbvendgpp" ADD CONSTRAINT "dbvendgpp_codvend_fkey" FOREIGN KEY ("codvend") REFERENCES "dbvend"("codvend") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_grupo_Permissao" ADD CONSTRAINT "tb_grupo_Permissao_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "tb_login_group"("LOGIN_GROUP_NAME") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_grupo_Permissao" ADD CONSTRAINT "tb_grupo_Permissao_tela_fkey" FOREIGN KEY ("tela") REFERENCES "tb_telas"("CODIGO_TELA") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pedido_user" ADD CONSTRAINT "tb_pedido_user_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "dbvenda"("codvenda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pedido_user" ADD CONSTRAINT "tb_pedido_user_login_user_login_fkey" FOREIGN KEY ("login_user_login") REFERENCES "tb_login_user"("login_user_login") ON DELETE RESTRICT ON UPDATE CASCADE;
