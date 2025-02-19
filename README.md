
```
apidev-api
├─ .eslintrc.json
├─ .nvmrc
├─ create-prisma-base-api.ps1
├─ docker-compose.yml
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20240726131348_aded_estabelecimentos_simples_socios_municipio_and_naturezas
│  │  │  └─ migration.sql
│  │  ├─ 20240726131537_municipio_to_municipios
│  │  │  └─ migration.sql
│  │  ├─ 20240726133439_allow_null_ente_federativo_responsavel
│  │  │  └─ migration.sql
│  │  ├─ 20240726133550_everything_is_optional
│  │  │  └─ migration.sql
│  │  ├─ 20240730134622_cnpj_na_tabela_empresas_agora_e_cnpjbasico
│  │  │  └─ migration.sql
│  │  ├─ 20240730142401_
│  │  │  └─ migration.sql
│  │  ├─ 20240730205343_
│  │  │  └─ migration.sql
│  │  ├─ 20240809123654_tabela_situacao_cadastral
│  │  │  └─ migration.sql
│  │  ├─ 20241111191753_too_many_updates
│  │  │  └─ migration.sql
│  │  ├─ 20250219052328_lowercase_column_names
│  │  │  └─ migration.sql
│  │  ├─ 20250219060112_user_table_updates
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
└─ src
   ├─ app.js
   ├─ config
   │  ├─ prismaClient.js
   │  ├─ vite.config.js
   │  └─ whitelist.js
   ├─ core
   │  ├─ auth
   │  │  └─ jwt.js
   │  ├─ errors
   │  │  ├─ errorHandler.js
   │  │  ├─ errorMiddleware.js
   │  │  └─ index.js
   │  ├─ extensions
   │  │  └─ bigintExtension.js
   │  ├─ middlewares
   │  │  └─ verify-token.js
   │  └─ utils
   │     ├─ logger.js
   │     └─ monitoring.js
   ├─ modules
   │  ├─ PacoteA
   │  │  ├─ data-access
   │  │  │  └─ aRepo.js
   │  │  ├─ routes
   │  │  │  └─ aRoutes.js
   │  │  └─ services
   │  │     └─ aService.js
   │  ├─ PacoteB
   │  │  ├─ data-access
   │  │  │  └─ bService.js
   │  │  ├─ routes
   │  │  │  └─ bRoutes.js
   │  │  └─ services
   │  │     └─ bService.js
   │  ├─ PacoteC
   │  │  ├─ data-access
   │  │  │  └─ cService.js
   │  │  ├─ routes
   │  │  │  └─ cRoutes.js
   │  │  └─ services
   │  │     └─ cServices.js
   │  ├─ PacoteD
   │  │  ├─ data-access
   │  │  │  └─ dService.js
   │  │  └─ routes
   │  │     └─ dRoutes.js
   │  ├─ Users
   │  │  ├─ data-access
   │  │  │  └─ userRepo.js
   │  │  ├─ routes
   │  │  │  └─ userRoutes.js
   │  │  └─ services
   │  │     └─ userService.js
   │  └─ Utilities
   │     ├─ data-access
   │     │  └─ utilsRepo.js
   │     └─ routes
   │        ├─ downloaderRoutes.js
   │        ├─ getAvailableCategories.js
   │        ├─ getAvailableDates.js
   │        ├─ importerRoutes.js
   │        ├─ index.js
   │        └─ unzipperRoutes.js
   ├─ routes
   │  └─ index.js
   ├─ server.js
   └─ utils
      ├─ downloader
      │  └─ src
      │     └─ downloader.js
      ├─ importer
      │  └─ src
      │     ├─ databaseImporter.js
      │     ├─ importadorCnae.js
      │     ├─ importadorEmpresa.js
      │     ├─ importadorEstabelecimentos.js
      │     ├─ importadorMunicipios.js
      │     ├─ importadorNaturezas.js
      │     ├─ importadorSimples.js
      │     ├─ importadorSituacaoCadastral.js
      │     └─ importadorSocios.js
      └─ unzipper
         ├─ src
         │  └─ unzipper.js
         └─ unzipped
            └─ DESCMOTIVOSITUACAOCADASTRAL.CSV

```