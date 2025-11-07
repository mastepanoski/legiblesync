# What You See Is What It Does: Un Patrón Estructural para Software Legible

Este repositorio implementa el patrón arquitectónico "What You See Is What It Does" para crear sistemas de software legibles. El patrón separa la lógica de negocio en **Conceptos** independientes y **Sincronizaciones** declarativas que orquestan las interacciones entre conceptos.

## Visión General de la Arquitectura

El patrón "What You See Is What It Does" consiste en:

- **Conceptos**: Módulos independientes que encapsulan estado y comportamiento
- **Sincronizaciones**: Reglas declarativas que activan acciones cuando se cumplen ciertas condiciones
- **Motor**: El runtime que ejecuta conceptos y gestiona sincronizaciones

## Estructura del Proyecto

```
src/
├── concepts/          # Módulos independientes de lógica de negocio
│   ├── User.ts       # Gestión de usuarios
│   ├── Article.ts    # Gestión de artículos/posts del blog
│   ├── Favorite.ts   # Funcionalidad de favoritos
│   ├── Password.ts   # Validación y almacenamiento de contraseñas
│   ├── JWT.ts        # Manejo de tokens JWT
│   └── Web.ts        # Manejo de peticiones/respuestas HTTP
├── engine/           # Motor central de sincronización
│   ├── Engine.ts     # Motor principal de sincronización
│   └── types.ts      # Definiciones de tipos TypeScript
└── syncs/            # Reglas declarativas de sincronización
    ├── registration.sync.ts  # Flujo de registro de usuario
    └── article.sync.ts       # Flujo de creación de artículos
```

## Inicio Rápido

Ver [QUICK_START.md](./QUICK_START.md) para una guía rápida de inicio.

## Conceptos

Cada concepto es un módulo independiente con su propio estado y acciones:

### Concepto User
Maneja el registro y gestión de usuarios.

### Concepto Article
Gestiona artículos/posts del blog con generación automática de slugs.

### Concepto Favorite
Gestiona los favoritos de usuarios para artículos.

### Concepto Password
Valida y almacena contraseñas (simplificado para demo).

### Concepto JWT
Maneja la generación y verificación de tokens JWT (simplificado para demo).

### Concepto Web
Simula el manejo de peticiones/respuestas HTTP.

## Sincronizaciones

Las sincronizaciones son reglas declarativas que definen cuándo y cómo interactúan los conceptos:

### Sincronización de Registro
Orquesta el proceso de registro de usuario:
1. Valida los requisitos de contraseña
2. Registra al usuario
3. Establece la contraseña
4. Genera un token JWT

### Sincronización de Artículos
Maneja la creación de artículos con autenticación:
1. Verifica el token JWT
2. Crea el artículo con el slug apropiado

## Desarrollo

### Scripts Disponibles

- `npm start` - Ejecuta la aplicación principal
- `npm run dev` - Ejecuta con observación de archivos
- `npm run build` - Compila TypeScript
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Revisa el código
- `npm run typecheck` - Verifica tipos sin emitir archivos

### Agregar Nuevos Conceptos

1. Crear un nuevo archivo en `src/concepts/`
2. Implementar la interfaz `ConceptImpl`
3. Registrar el concepto en la aplicación principal

### Agregar Nuevas Sincronizaciones

1. Crear un nuevo archivo en `src/syncs/`
2. Definir reglas de sincronización usando el tipo `SyncRule`
3. Registrar las sincronizaciones en la aplicación principal

## Antecedentes de Investigación

Esta implementación se basa en el artículo ["What You See Is What It Does: A Structural Pattern for Legible Software"](https://arxiv.org/html/2508.14511v2) de Eagon Meng y Daniel Jackson.

El patrón "What You See Is What It Does" busca hacer los sistemas de software más legibles mediante:
- Separar las preocupaciones en conceptos independientes
- Usar sincronizaciones declarativas en lugar de orquestación imperativa
- Hacer el comportamiento del sistema visible a través de reglas explícitas

## Escala de Evaluación de IA

Este proyecto fue desarrollado mediante **co-creación con agentes de IA**, siguiendo el marco de la [Escala de Evaluación de IA](https://aiassessmentscale.com/).

### Nivel de Participación de IA: **4 - IA como Líder**

**Cómo Contribuyó la IA:**
- **Análisis de Investigación**: Los agentes de IA analizaron el artículo académico y extrajeron conceptos clave
- **Diseño de Arquitectura**: Diseño completo del framework y estrategia de implementación
- **Generación de Código**: Todo el código TypeScript, documentación y ejemplos
- **Documentación**: Documentación completa bilingüe y guías
- **Control de Calidad**: Revisión de código, estrategias de testing y optimización

**Rol Humano:**
- **Dirección Estratégica**: Mauro Stepanoski proporcionó la visión del proyecto y requisitos
- **Experiencia en el Dominio**: Validación de decisiones técnicas y precisión de la investigación
- **Supervisión Ética**: Garantizando la implementación responsable de los conceptos

**Por qué Nivel 4:**
- La IA lideró la implementación técnica y el proceso creativo
- El humano proporcionó supervisión esencial y conocimiento del dominio
- Resultado: Desarrollo acelerado con resultados alineados con lo humano

## Autor y Atribución

**Implementación por:** [Mauro Stepanoski](https://maurostepanoski.ar) con co-creación de IA

**Investigación Original:** Eagon Meng y Daniel Jackson - ["What You See Is What It Does: A Structural Pattern for Legible Software"](https://arxiv.org/html/2508.14511v2)

## Licencia

Licencia MIT - Copyright (c) 2025 Mauro Stepanoski