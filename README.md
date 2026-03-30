# SorecAttendanceFrontend

## Versioning

- `V1.1.1`
  - dashboard RH ajuste
  - cartes departements validees
  - page publique stabilisee
  - acces public et retour dashboard finalises

- `v1.1.2`
  - page publique restauree et acces corrige
  - route publique stable
  - topbar publique fixe
  - tableau public avec en-tete fixe et liste scrollable

- `Version 1.2`
  - login page validated
  - RH dashboard premium layout
  - Highcharts trend and pie charts
  - compact sidebar with hover expand
  - notification center

- `Version 1.4`
  - sidebar compacte au scroll et reouverture au survol
  - topbar fixe et layout ajuste
  - details departement avec tableau moderne
  - tableaux harmonises en style data-grid

## Backend Compatibility

Le frontend a maintenant une couche de compatibilite prete pour le backend Spring Boot :

- `src/app/shared/contracts/backend`
  - DTO frontend alignes sur les domaines backend : `Department`, `Employee`, `Site`, `Status`, `Pointeuse`, `WorkSchedule`, `AlertRule`, `SystemConfig`, `Attendance`, `AttendanceRaw`, `AttendanceStats`
- `src/app/core/api/backend-api.config.ts`
  - registre central des endpoints backend
- `src/app/core/services/*-api.service.ts`
  - services HTTP typés correspondant aux controllers backend

Correspondance actuelle :

- `DepartmentController` -> `DepartmentApiService`
- `EmployeeController` -> `EmployeeApiService`
- `PointeuseController` -> `PointeuseApiService`
- `SiteController` -> `SiteApiService`
- `StatusController` -> `StatusApiService`
- `SystemConfigController` -> `SystemConfigApiService`
- `WorkScheduleController` -> `WorkScheduleApiService`
- `AlertRuleController` -> `AlertRuleApiService`

Les services UI historiques (`attendance.ts`, `alert.ts`, `dashboard.ts`) restent en mode mock pour ne pas casser la maquette actuelle.
Quand le backend sera pret, il suffira de remplacer progressivement ces mocks par les services `*-api.service.ts`.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
