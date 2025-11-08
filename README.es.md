# WYSIWYG Legible Software

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

> "What You See Is What It Does" - Un Patrón Estructural para Software Legible

Este repositorio implementa el patrón arquitectónico WYSIWYG (What You See Is What It Does) para crear sistemas de software mantenibles y legibles. El patrón separa la lógica de negocio en **Conceptos** independientes y **Sincronizaciones** declarativas que orquestan las interacciones entre conceptos.

**Implementación por:** [Mauro Stepanoski](https://maurostepanoski.ar)  
**Basado en investigación de:** Eagon Meng y Daniel Jackson

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Arquitectura](#arquitectura)
- [Inicio Rápido](#inicio-rápido)
- [Conceptos](#conceptos)
- [Sincronizaciones](#sincronizaciones)
- [Referencia de API](#referencia-de-api)
- [Ejemplos](#ejemplos)
- [Contribuyendo](#contribuyendo)
- [Investigación](#investigación)
- [Licencia](#licencia)

## Visión General

La arquitectura de software tradicional a menudo mezcla lógica de negocio con código de orquestación, haciendo que los sistemas sean difíciles de entender y mantener. El patrón WYSIWYG aborda esto mediante:

- **Conceptos**: Módulos independientes y autocontenidos que encapsulan estado y comportamiento
- **Sincronizaciones**: Reglas declarativas que definen cuándo y cómo interactúan los conceptos
- **Motor**: Un runtime que ejecuta conceptos y gestiona sincronizaciones

Esta separación hace que el comportamiento del software sea visible y modificable a través de reglas explícitas y declarativas en lugar de código imperativo implícito.

## Arquitectura

```
src/
├── concepts/          # Módulos independientes de lógica de negocio
│   ├── User.ts       # Gestión de usuarios
│   ├── Article.ts    # Gestión de artículos/posts del blog
│   ├── Favorite.ts   # Funcionalidad de favoritos
│   ├── Comment.ts    # Sistema de comentarios
│   ├── Password.ts   # Validación y almacenamiento de contraseñas
│   ├── JWT.ts        # Manejo de tokens JWT
│   ├── Web.ts        # Manejo de peticiones/respuestas HTTP
│   └── Persistence.ts # Persistencia de estado RDF/SPARQL
├── engine/           # Motor central de sincronización
│   ├── Engine.ts     # Motor principal de sincronización
│   └── types.ts      # Definiciones de tipos TypeScript
├── syncs/            # Reglas declarativas de sincronización
│   ├── registration.sync.ts  # Flujo de registro de usuario
│   ├── article.sync.ts       # Flujo de creación de artículos
│   ├── favorite.sync.ts      # Gestión de favoritos
│   ├── comment.sync.ts       # Gestión de comentarios
│   └── persistence.sync.ts   # Reglas de persistencia de estado
└── utils/            # Funciones de utilidad
    └── audit.ts      # Utilidades de auditoría de flujos
```

## Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/wysiwyg-legible-software.git
cd wysiwyg-legible-software

# Instalar dependencias
npm install

# Ejecutar la demo
npm start

# Ejecutar con observación de archivos
npm run dev

# Ejecutar pruebas
npm test

# Verificación de tipos
npm run typecheck

# Linting
npm run lint
```

### Versión Express.js

```bash
# Navegar a la aplicación Express
cd express-app

# Instalar dependencias
npm install

# Ejecutar el servidor
npm start

# La API estará disponible en http://localhost:3000
```

## Conceptos

Cada concepto es un módulo independiente con su propio estado y acciones:

### Conceptos Core

- **User**: Gestiona registro de usuarios y perfiles
- **Article**: Maneja artículos/posts del blog con generación automática de slugs
- **Password**: Valida y almacena contraseñas de forma segura usando bcrypt
- **JWT**: Genera y verifica tokens JSON Web para autenticación

### Conceptos Extendidos

- **Favorite**: Gestiona favoritos de usuarios para artículos
- **Comment**: Maneja comentarios de artículos y discusiones
- **Web**: Simula manejo de peticiones/respuestas HTTP
- **Persistence**: Persistencia de estado basada en RDF/SPARQL

### Creando un Nuevo Concepto

```typescript
import { ConceptImpl } from '../engine/types';

export const MyConcept: ConceptImpl = {
  state: {
    myData: new Map(),
  },

  async execute(action: string, input: any) {
    if (action === 'myAction') {
      // Implementa tu lógica aquí
      return { result: 'success' };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
```

## Sincronizaciones

Las sincronizaciones son reglas declarativas que definen el comportamiento del sistema:

```typescript
export const mySyncs: SyncRule[] = [
  {
    name: "MySynchronization",
    when: [
      {
        concept: "SourceConcept",
        action: "someAction"
      }
    ],
    then: [
      {
        concept: "TargetConcept",
        action: "anotherAction",
        input: {
          param: "?outputParam"
        }
      }
    ]
  }
];
```

## Referencia de API

### Endpoints REST API (Versión Express)

```
POST   /users              # Registrar un nuevo usuario
POST   /login              # Inicio de sesión de usuario
POST   /articles           # Crear un nuevo artículo
POST   /articles/:id/favorite    # Favorito de un artículo
DELETE /articles/:id/favorite    # Quitar favorito de un artículo
POST   /articles/:id/comments    # Agregar un comentario
GET    /audit/:flowId      # Auditar un flujo
```

### API del Motor

```typescript
import { SyncEngine } from './engine/Engine';

// Crear instancia del motor
const engine = new SyncEngine();

// Registrar conceptos
engine.registerConcept("MyConcept", MyConcept);

// Registrar sincronizaciones
engine.registerSync(mySyncRule);

// Ejecutar acciones
const result = await engine.invoke("MyConcept", "myAction", input, flowId);

// Auditar flujos
const actions = engine.getActionsByFlow(flowId);
```

## Ejemplos

### Flujo de Registro de Usuario

```typescript
// Activar registro de usuario
await engine.invoke("Web", "request", {
  method: "POST",
  path: "/users",
  body: {
    username: "alice",
    email: "alice@example.com",
    password: "secure123"
  }
}, "registration-flow");
```

Esta única acción activa:
1. Validación de contraseña
2. Registro de usuario
3. Hashing y almacenamiento de contraseña
4. Generación de token JWT
5. Persistencia de estado al almacén RDF

### Creación de Artículo con Autenticación

```typescript
// Crear artículo (requiere autenticación)
await engine.invoke("Web", "request", {
  method: "POST",
  path: "/articles",
  body: {
    title: "Mi Artículo",
    body: "Contenido del artículo...",
    token: "jwt-token-aqui"
  }
}, "article-flow");
```

## Contribuyendo

¡Aceptamos contribuciones! Por favor revisa nuestra [Guía de Contribución](CONTRIBUTING.md) para detalles.

### Flujo de Desarrollo

1. Fork del repositorio
2. Crear rama de feature
3. Hacer tus cambios
4. Agregar pruebas
5. Ejecutar linter: `npm run lint`
6. Ejecutar pruebas: `npm test`
7. Enviar pull request

### Agregando Nuevas Funcionalidades

1. **Nuevos Conceptos**: Crear en `src/concepts/`
2. **Nuevas Sincronizaciones**: Crear en `src/syncs/`
3. **Actualizar Pruebas**: Agregar casos de prueba
4. **Actualizar Documentación**: Actualizar este README

## Investigación

Esta implementación se basa en el artículo:

> **"What You See Is What It Does: A Structural Pattern for Legible Software"**
>
> Eagon Meng, Daniel Jackson
>
> [arXiv:2508.14511](https://arxiv.org/html/2508.14511v2)

El patrón WYSIWYG proporciona:
- **Legibilidad**: El comportamiento del sistema está explícitamente declarado
- **Modularidad**: Los conceptos son independientes y reutilizables
- **Mantenibilidad**: Los cambios están localizados a reglas específicas
- **Capacidad de Prueba**: Cada concepto y sincronización puede probarse independientemente

## Escala de Evaluación de IA

Este proyecto demuestra **co-creación con agentes de IA** usando el marco de la [Escala de Evaluación de IA](https://aiassessmentscale.com/).

### Nivel de Participación de IA: **4 - IA como Líder**

**Contribuciones de IA:**
- **Síntesis de Investigación**: Analizó el artículo académico y extrajo patrones arquitectónicos
- **Diseño de Framework**: Creó la arquitectura completa del framework LegibleSync
- **Implementación de Código**: Generó todo el código TypeScript y ejemplos
- **Documentación**: Produjo documentación completa bilingüe
- **Ingeniería de Calidad**: Implementó estrategias de testing y optimización de código

**Contribuciones Humanas:**
- **Visión del Proyecto**: Mauro Stepanoski definió el alcance y objetivos del proyecto
- **Validación de Dominio**: Aseguró precisión técnica y fidelidad a la investigación
- **Marco Ético**: Mantuvo estándares de implementación responsable de IA

**Justificación de Evaluación:**
- La IA impulsó el proceso de creación e implementación técnica
- El humano proporcionó dirección estratégica y aseguramiento de calidad
- La colaboración resultó en desarrollo acelerado con supervisión humana

## Autor y Atribución

**Implementación por:** [Mauro Stepanoski](https://maurostepanoski.ar) con co-creación de IA

**Investigación Original:** Eagon Meng y Daniel Jackson - ["What You See Is What It Does: A Structural Pattern for Legible Software"](https://arxiv.org/html/2508.14511v2)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Agradecimientos

- Daniel Jackson y Eagon Meng por la investigación original
- El MIT Software Design Group por su trabajo en patrones de arquitectura de software

---

**⭐ ¡Dale estrella a este repositorio si te resulta útil!**

Para preguntas o discusiones, por favor [abre un issue](https://github.com/yourusername/wysiwyg-legible-software/issues).