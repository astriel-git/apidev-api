
```
apidev-api
├─ .eslintrc.json
├─ .nvmrc
├─ create-prisma-base-api.ps1
├─ docker-compose.yml
├─ nodemon.json
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
│  │  ├─ 20250219232106_
│  │  │  └─ migration.sql
│  │  ├─ 20250221054324_recuperacao_table_added
│  │  │  └─ migration.sql
│  │  ├─ 20250221190919_
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ app.ts
│  ├─ config
│  │  ├─ prismaClient.ts
│  │  ├─ vite.config.ts
│  │  └─ whitelist.ts
│  ├─ core
│  │  ├─ auth
│  │  │  ├─ api-dev-449113-5e2b303b5710.json
│  │  │  └─ jwt.ts
│  │  ├─ errors
│  │  │  ├─ customErrors.ts
│  │  │  ├─ errorHandler.ts
│  │  │  └─ errorMiddleware.ts
│  │  ├─ extensions
│  │  │  └─ bigintExtension.ts
│  │  ├─ middlewares
│  │  │  ├─ recaptcha-enterprise.ts
│  │  │  └─ verify-token.ts
│  │  └─ utils
│  │     ├─ email.ts
│  │     ├─ logger.ts
│  │     ├─ monitoring.ts
│  │     └─ templates
│  │        ├─ assets
│  │        │  ├─ logo-black.svg
│  │        │  ├─ logo-white.svg
│  │        │  ├─ logo.svg
│  │        │  └─ pretty-logo.png
│  │        └─ recovery-email.hbs
│  ├─ global.d.ts
│  ├─ modules
│  │  ├─ PacoteA
│  │  │  ├─ data-access
│  │  │  │  └─ aRepo.ts
│  │  │  ├─ routes
│  │  │  │  └─ aRoutes.ts
│  │  │  └─ services
│  │  │     └─ aService.ts
│  │  ├─ PacoteB
│  │  │  ├─ data-access
│  │  │  │  └─ bService.ts
│  │  │  ├─ routes
│  │  │  │  └─ bRoutes.ts
│  │  │  └─ services
│  │  │     └─ bService.ts
│  │  ├─ PacoteC
│  │  │  ├─ data-access
│  │  │  │  └─ cService.ts
│  │  │  ├─ routes
│  │  │  │  └─ cRoutes.ts
│  │  │  └─ services
│  │  │     └─ cServices.ts
│  │  ├─ PacoteD
│  │  │  ├─ data-access
│  │  │  │  └─ dService.ts
│  │  │  └─ routes
│  │  │     └─ dRoutes.ts
│  │  ├─ Users
│  │  │  ├─ data-access
│  │  │  │  └─ userRepo.ts
│  │  │  ├─ routes
│  │  │  │  └─ userRoutes.ts
│  │  │  └─ services
│  │  │     └─ userService.ts
│  │  └─ Utilities
│  │     ├─ data-access
│  │     │  └─ utilsRepo.ts
│  │     └─ routes
│  │        ├─ downloaderRoutes.ts
│  │        ├─ getAvailableCategories.ts
│  │        ├─ getAvailableDates.ts
│  │        ├─ importerRoutes.ts
│  │        ├─ index.ts
│  │        └─ unzipperRoutes.ts
│  ├─ routes
│  │  └─ index.ts
│  ├─ server.ts
│  └─ utils
│     ├─ downloader
│     │  └─ src
│     │     └─ downloader.ts
│     ├─ importer
│     │  └─ src
│     │     ├─ databaseImporter.ts
│     │     ├─ importadorCnae.ts
│     │     ├─ importadorEmpresa.ts
│     │     ├─ importadorEstabelecimentos.ts
│     │     ├─ importadorMunicipios.ts
│     │     ├─ importadorNaturezas.ts
│     │     ├─ importadorSimples.ts
│     │     ├─ importadorSituacaoCadastral.ts
│     │     └─ importadorSocios.ts
│     └─ unzipper
│        ├─ src
│        │  └─ unzipper.ts
│        └─ unzipped
│           └─ DESCMOTIVOSITUACAOCADASTRAL.CSV
└─ tsconfig.json

```