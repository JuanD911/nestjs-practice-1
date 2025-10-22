# NestJS SWAPI CRUD

Este proyecto fue desarrollado como práctica de integración de **NestJS** con **Axios**, consumiendo la [SWAPI API (Star Wars API)](https://www.swapi.tech/) y simulando un **CRUD local** con datos precargados para probar métodos HTTP.

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone git@github.com:JuanD911/nestjs-practice-1.git
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el proyecto

```bash
npm run start:dev
```

La aplicación se ejecutará en:

```
http://localhost:3000
```

---

## Estructura principal del proyecto

```
src/
│
├── app.module.ts
├── main.ts
│
├── api/
│   └── api.module.ts
|   └── api.service.ts        # Conexión centralizada a la API SWAPI
│            
└── swapi/
    ├── people/
    │   ├── people.module.ts
    │   ├── people.controller.ts
    │   ├── people.service.ts
    │   ├── dto/
    │   │   ├── create-person.dto.ts
    │   │   └── update-person.dto.ts
    │   └── interfaces/
    │       └── swapi-person.interface.ts
    │
    └── swapi.module.ts             # Módulo central que agrupa los recursos
```
---

## Cómo se consumió la API de SWAPI

La API de SWAPI se consumió mediante un **adaptador personalizado con Axios**, que centraliza todas las solicitudes HTTP en un solo punto.

```ts
//src/api/api.service.ts

import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ApiService {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://www.swapi.tech/api',
      timeout: 10000,
    });
  }

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new HttpException(
        `Error fetching data from API: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
}

```
El servicio ApiService centraliza la comunicación con la API de SWAPI utilizando Axios.
Dentro del constructor se crea una instancia configurada con un baseURL https://www.swapi.tech/api)
El método genérico get<T> se encarga de realizar peticiones HTTP GET y devolver los datos tipados según el tipo T.
Además, implementa manejo de errores mediante un bloque try...catch: si la solicitud falla, lanza una HttpException personalizada con el mensaje de error y el código de estado devuelto por la API (o 500 por defecto).

---

## Implementación de la paginación

La paginación se implementó tanto en los datos obtenidos de la API como en los registros locales simulados.

### En la API real

La API de SWAPI utiliza parámetros `page` y `limit`. En este proyecto se adaptó para aceptar `offset` desde el cliente y convertirlo internamente a `page`:

```
page = offset / limit + 1

```

### En los datos locales

Se utiliza el método `.slice()` de JavaScript para devolver los elementos según los parámetros enviados:

```ts
 async findAllLocal(page = 1, limit= 5){
      const offset = (page - 1) * limit;
      const start = offset;
      const end = offset + limit;

      const results = this.local.slice(start, end);

      return {
          total: this.local.length,
          limit,
          offset,
          data: results,
      };
    }
```
El método findAllLocal implementa una paginación manual sobre un arreglo local (this.local) para simular el comportamiento de una base de datos o API real. Recibe dos parámetros: page, que indica el número de página, y limit, que define cuántos registros mostrar por página. A partir de ellos calcula el desplazamiento (offset = (page - 1) * limit) y determina el rango de elementos a devolver usando slice(start, end). De esta forma, obtiene solo la porción del arreglo correspondiente a la página solicitada.

---

## Manejo de errores

El proyecto implementa control de errores en los servicios mediante `try...catch` y excepciones personalizadas de NestJS (`NotFoundException`).

Ejemplo para solicitudes HTTP externas:

```ts
//swapi/people/people.service.ts
try{
  const response = await this.api.get<SwapiPersonResponse>(
    `${this.basePath}/${id}`
  )
  return response.result.properties;
  } catch {
  throw new NotFoundException(`Person with id ${id} not found`);
  }
```

---

## Endpoints disponibles

| Método HTTP | Ruta | Descripción |
|--------------|------|--------------|
| **GET** | `/people/all?limit=10&offset=30` | Obtener personajes desde la API real de SWAPI |
| **GET** | `/people/:id` | Obtener un personaje de SWAPI por su ID |
| **GET** | `/people/local/all?page=1&limit=5` | Obtener personajes locales simulados con paginación |
| **GET** | `/people/local/:id` | Obtener un personaje local por su ID |
| **POST** | `/people/create-person` | Crear un nuevo personaje local (simulado) |
| **PATCH** | `/people/local/update/:id` | Actualizar un personaje local (simulado) |
| **DELETE** | `/people/local/:id` | Eliminar un personaje local (simulado) |

---

## Ejemplos de peticiones y respuestas

### 1. GET ALL — SWAPI (API real)

**Ruta:**
```
GET http://localhost:3000/people/all?limit=10&offset=30
```

**Respuesta:**
```json
{ 
    {
      "uid": "32",
      "name": "Qui-Gon Jinn",
      "url": "https://www.swapi.tech/api/people/32"
    },
    {
        "uid": "33",
        "name": "Nute Gunray",
        "url": "https://www.swapi.tech/api/people/33"
    },
    ...
}
```

---

### 2. GET BY ID — SWAPI (API real)

**Ruta:**
```
GET http://localhost:3000/people/34
```

**Respuesta:**
```json
{
  {
    "created": "2025-10-22T06:59:34.728Z",
    "edited": "2025-10-22T06:59:34.728Z",
    "name": "Finis Valorum",
    "gender": "male",
    "skin_color": "fair",
    "hair_color": "blond",
    "height": "170",
    "eye_color": "blue",
    "mass": "unknown",
    "homeworld": "https://www.swapi.tech/api/planets/9",
    "birth_year": "91BBY",
    "vehicles": [],
    "starships": [],
    "films": [
        "https://www.swapi.tech/api/films/4"
    ],
    "url": "https://www.swapi.tech/api/people/34"
  }
}
```

---

### 3. GET ALL LOCAL — (Simulado)

**Ruta:**
```
GET http://localhost:3000/people/local/all?page=1&limit=5
```

**Respuesta:**
```json
{
    "total": 15,
    "limit": 5,
    "offset": 0,
    "data": [
        {
            "id": "401",
            "name": "Kara Velorin",
            "birth_year": "42 BBY",
            "gender": "female",
            "height": "168",
            "homeworld": "Nal Hutta"
        },
        {
            "id": "402",
            "name": "Darin Solas",
            "birth_year": "19 ABY",
            "gender": "male",
            "height": "183",
            "homeworld": "Corulag"
        },
        {
            "id": "403",
            "name": "Ryn Talvos",
            "birth_year": "55 BBY",
            "gender": "male",
            "height": "190",
            "homeworld": "Ord Mantell"
        },
        {
            "id": "404",
            "name": "Mira Kaen",
            "birth_year": "12 ABY",
            "gender": "female",
            "height": "160",
            "homeworld": "Corellia"
        },
        {
            "id": "405",
            "name": "Tovan Krell",
            "birth_year": "7 BBY",
            "gender": "non-binary",
            "height": "175",
            "homeworld": "Dantooine"
        }
    ] 
}
```

---

### 4. GET BY ID LOCAL — (Simulado)

**Ruta:**
```
GET http://localhost:3000/people/local/401
```

**Respuesta:**
```json
{
  "id": "401",
  "name": "Kara Velorin",
  "birth_year": "42 BBY",
  "gender": "female",
  "height": "168",
  "homeworld": "Nal Hutta"
}
```

---

### 5. POST CREATE PERSON — (Simulado)

**Ruta:**
```
POST http://localhost:3000/people/create-person
```

**Body:**
```json
{
  "name": "Juan Shung",
  "birthYear": "445 BBY",
  "gender": "Unknown",
  "height": "210",
  "homeworld": "Javin"
}
```

**Respuesta:**
```json
{
  "message": "Person Juan Shung created locally",
  "person": {
    "id": "785",
    "name": "Juan Shung",
    "birthYear": "445 BBY",
    "gender": "Unknown",
    "height": "210",
    "homeworld": "Javin"
  }
}
```

---

### 6. PATCH UPDATE PERSON — (Simulado)

**Ruta:**
```
PATCH http://localhost:3000/people/local/update/401
```

**Body:**
```json
{
  "name": "Sapito Espacial",
  "height": "200",
  "homeworld": "Earth"
}
```

**Respuesta:**
```json
{
  "message": "Person with id 401 successfully updated",
  "updated": {
    "id": "401",
    "name": "Sapito Espacial",
    "birth_year": "42 BBY",
    "gender": "female",
    "height": "200",
    "homeworld": "Earth"
  }
}
```

---

### 7. DELETE PERSON — (Simulado)

**Ruta:**
```
DELETE http://localhost:3000/people/local/401
```

**Respuesta:**
```json
{
  "message": "Person with id 401 successfully deleted",
  "person": {
      "id": "401",
      "name": "Sapito Espacial",
      "birth_year": "42 BBY",
      "gender": "female",
      "height": "200",
      "homeworld": "Earth"
    }
}
```

---

## Autor

**Juan Duarte**  
_Primer Taller Práctico NestJS — 2025_  
Desarrollado con [NestJS](https://nestjs.com/) y [SWAPI.tech](https://www.swapi.tech/)
