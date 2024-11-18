
```
assinatura-api-backend
├─ src
│  ├─ app.js
│  ├─ apps
│  │  ├─ LibRoutes
│  │  │  ├─ data-access
│  │  │  │  └─ libraryService.js
│  │  │  └─ entry-points
│  │  │     └─ api
│  │  │        ├─ downloaderRoutes.js
│  │  │        ├─ getAvailableCategories.js
│  │  │        ├─ getAvailableDates.js
│  │  │        ├─ importerRoutes.js
│  │  │        ├─ index.js
│  │  │        └─ unzipperRoutes.js
│  │  ├─ PacoteA
│  │  │  ├─ data-access
│  │  │  │  └─ aService.js
│  │  │  ├─ domain
│  │  │  │  └─ services
│  │  │  └─ entry-points
│  │  │     └─ api
│  │  │        └─ aRoutes.js
│  │  ├─ PacoteB
│  │  │  ├─ data-access
│  │  │  │  └─ bService.js
│  │  │  ├─ domain
│  │  │  │  └─ services
│  │  │  └─ entry-points
│  │  │     └─ api
│  │  │        └─ bRoutes.js
│  │  ├─ PacoteC
│  │  │  ├─ data-access
│  │  │  │  └─ cService.js
│  │  │  ├─ domain
│  │  │  └─ entry-points
│  │  │     └─ api
│  │  │        └─ cRoutes.js
│  │  ├─ PacoteD
│  │  │  ├─ data-access
│  │  │  │  └─ dService.js
│  │  │  ├─ domain
│  │  │  │  └─ services
│  │  │  └─ entry-points
│  │  │     └─ api
│  │  │        └─ dRoutes.js
│  │  └─ Users
│  │     ├─ data-access
│  │     │  └─ user.js
│  │     └─ entry-points
│  │        └─ api
│  │           └─ userRoutes.js
│  ├─ auth
│  │  └─ jwt.js
│  ├─ bigintExtension.js
│  ├─ errors
│  │  ├─ errorHandler.js
│  │  └─ index.js
│  ├─ libraries
│  │  ├─ downloader
│  │  │  ├─ downloads
│  │  │  │  ├─ Cnae
│  │  │  │  │  └─ Cnaes.zip
│  │  │  │  ├─ Empresas
│  │  │  │  │  ├─ Empresas0.zip
│  │  │  │  │  ├─ Empresas1.zip
│  │  │  │  │  ├─ Empresas2.zip
│  │  │  │  │  ├─ Empresas3.zip
│  │  │  │  │  ├─ Empresas4.zip
│  │  │  │  │  ├─ Empresas5.zip
│  │  │  │  │  ├─ Empresas6.zip
│  │  │  │  │  ├─ Empresas7.zip
│  │  │  │  │  ├─ Empresas8.zip
│  │  │  │  │  └─ Empresas9.zip
│  │  │  │  ├─ Estabelecimentos
│  │  │  │  │  ├─ Estabelecimentos0.zip
│  │  │  │  │  ├─ Estabelecimentos1.zip
│  │  │  │  │  ├─ Estabelecimentos2.zip
│  │  │  │  │  ├─ Estabelecimentos3.zip
│  │  │  │  │  ├─ Estabelecimentos4.zip
│  │  │  │  │  ├─ Estabelecimentos5.zip
│  │  │  │  │  ├─ Estabelecimentos6.zip
│  │  │  │  │  ├─ Estabelecimentos7.zip
│  │  │  │  │  ├─ Estabelecimentos8.zip
│  │  │  │  │  └─ Estabelecimentos9.zip
│  │  │  │  ├─ Municipios
│  │  │  │  │  └─ Municipios.zip
│  │  │  │  ├─ Naturezas
│  │  │  │  │  └─ Naturezas.zip
│  │  │  │  ├─ output_files
│  │  │  │  │  ├─ Cnaes.zip
│  │  │  │  │  ├─ Naturezas.zip
│  │  │  │  │  └─ Socios0.zip
│  │  │  │  ├─ Simples
│  │  │  │  │  └─ Simples.zip
│  │  │  │  └─ Socios
│  │  │  │     ├─ Socios0.zip
│  │  │  │     ├─ Socios1.zip
│  │  │  │     ├─ Socios2.zip
│  │  │  │     ├─ Socios3.zip
│  │  │  │     ├─ Socios4.zip
│  │  │  │     ├─ Socios5.zip
│  │  │  │     ├─ Socios6.zip
│  │  │  │     ├─ Socios7.zip
│  │  │  │     ├─ Socios8.zip
│  │  │  │     └─ Socios9.zip
│  │  │  └─ src
│  │  │     └─ downloader.js
│  │  ├─ importer
│  │  │  └─ src
│  │  │     ├─ databaseImporter.js
│  │  │     ├─ importadorCnae.js
│  │  │     ├─ importadorEmpresa.js
│  │  │     ├─ importadorEstabelecimentos.js
│  │  │     ├─ importadorMunicipios.js
│  │  │     ├─ importadorNaturezas.js
│  │  │     ├─ importadorSimples.js
│  │  │     ├─ importadorSituacaoCadastral.js
│  │  │     └─ importadorSocios.js
│  │  └─ unzipper
│  │     ├─ src
│  │     │  └─ unzipper.js
│  │     └─ unzipped
│  │        ├─ Cnaes
│  │        │  └─ F.K03200$Z.D40713.CNAECSV
│  │        ├─ DESCMOTIVOSITUACAOCADASTRAL.CSV
│  │        ├─ Empresas
│  │        │  ├─ K3241.K03200Y0.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y1.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y2.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y3.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y4.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y5.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y6.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y7.D40713.EMPRECSV
│  │        │  ├─ K3241.K03200Y8.D40713.EMPRECSV
│  │        │  └─ K3241.K03200Y9.D40713.EMPRECSV
│  │        ├─ Estabelecimentos
│  │        │  ├─ K3241.K03200Y0.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y1.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y2.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y3.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y4.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y5.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y6.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y7.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y8.D40713.ESTABELE
│  │        │  ├─ K3241.K03200Y9.D40713.ESTABELE
│  │        │  └─ TESTE.ESTABELE
│  │        ├─ extracted_files
│  │        │  └─ F.K03200$Z.D41012.CNAECSV
│  │        ├─ Municipios
│  │        │  └─ F.K03200$Z.D40713.MUNICCSV
│  │        ├─ Naturezas
│  │        │  └─ F.K03200$Z.D40713.NATJUCSV
│  │        ├─ Simples
│  │        │  └─ F.K03200$W.SIMPLES.CSV.D40713
│  │        └─ Socios
│  │           ├─ K3241.K03200Y0.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y1.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y2.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y3.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y4.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y5.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y6.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y7.D40713.SOCIOCSV
│  │           ├─ K3241.K03200Y8.D40713.SOCIOCSV
│  │           └─ K3241.K03200Y9.D40713.SOCIOCSV
│  ├─ middlewares
│  │  ├─ error-handler.js
│  │  └─ verify-token.js
│  ├─ prismaClient.js
│  ├─ server.js
│  ├─ utils
│  │  ├─ logger.js
│  │  └─ monitoring.js
│  └─ whitelist.js
└─ vite.config.js

```