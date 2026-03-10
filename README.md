         ___        ______     ____ _                 _  ___  
        / \ \      / / ___|   / ___| | ___  _   _  __| |/ _ \ 
       / _ \ \ /\ / /\___ \  | |   | |/ _ \| | | |/ _` | (_) |
      / ___ \ V  V /  ___) | | |___| | (_) | |_| | (_| |\__, |
     /_/   \_\_/\_/  |____/   \____|_|\___/ \__,_|\__,_|  /_/ 
 ----------------------------------------------------------------- 


# 🎵 Chinook Music Store — AWS Full Stack App

Aplicación web full stack desplegada en AWS Academy que permite buscar canciones y realizar compras, construida con FastAPI, React y PostgreSQL sobre una arquitectura de tres capas en la nube.

---

## 🏗️ Arquitectura

```
Internet
   │
   ├── EC2 Frontend (subred pública) ──→ React + Vite (puerto 3000)
   │
   └── EC2 Backend (subred pública)  ──→ FastAPI + Uvicorn (puerto 8000)
                                               │
                                    RDS Aurora PostgreSQL
                                    (subred privada — sin acceso público)
```

---

## ☁️ Infraestructura AWS

| Recurso | Detalle |
|--------|---------|
| VPC | `chinook-vpc` — 4 subredes, 2 zonas de disponibilidad |
| EC2 Frontend | Ubuntu, subred pública us-east-1a, puerto 3000 |
| EC2 Backend | Ubuntu, subred pública us-east-1b, puerto 8000 |
| RDS | Aurora PostgreSQL, subred privada, sin acceso público |
| Security Groups | Frontend SG, Backend SG, RDS SG (acceso por capas) |

---

## 🔧 Stack Tecnológico

**Backend**
- Python 3.10
- FastAPI + Uvicorn
- SQLAlchemy 2.0
- PostgreSQL (psycopg2-binary)
- PyTest + pytest-cov

**Frontend**
- Node 22
- React 19
- Vite 7
- Axios
- Jest + React Testing Library

**Infraestructura**
- AWS VPC, EC2, RDS Aurora PostgreSQL
- AWS Cloud9 (entorno de desarrollo)
- GitHub Actions (CI/CD)
- systemd (gestión de servicios)

---

## 📁 Estructura del Proyecto

```
chinook-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD
├── backend/
│   ├── app/
│   │   ├── main.py             # Aplicación FastAPI
│   │   ├── database.py         # Conexión a PostgreSQL
│   │   ├── models.py           # Modelos SQLAlchemy
│   │   ├── schemas.py          # Esquemas Pydantic
│   │   └── routers/
│   │       ├── tracks.py       # Endpoints de canciones
│   │       ├── customers.py    # Endpoints de clientes
│   │       └── purchases.py    # Endpoints de compras
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_tracks.py
│   │   └── test_purchases.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── SearchBar.jsx
    │   │   ├── TrackCard.jsx
    │   │   ├── PurchaseModal.jsx
    │   │   └── Alert.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── pages/
    │   │   └── Home.jsx
    │   └── __tests__/
    │       ├── SearchBar.test.jsx
    │       └── TrackCard.test.jsx
    └── package.json
```

---

## 🚀 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/tracks/` | Listar canciones (búsqueda por `?q=`) |
| GET | `/tracks/{id}` | Detalle de una canción |
| GET | `/customers/` | Listar clientes |
| POST | `/purchases/` | Realizar una compra |

Documentación interactiva disponible en: `http://IP_BACKEND:8000/docs`

---

## ✅ Pruebas

**Backend — PyTest**
```bash
cd backend
source venv/bin/activate
pytest tests/ -v --cov=app --cov-report=term-missing
```
Resultado: **7/7 tests passed** ✅

**Frontend — Jest**
```bash
cd frontend
npm test
```
Resultado: **6/6 tests passed** ✅

---

## 🔄 Pipeline CI/CD

El pipeline se activa automáticamente con cada `git push` a la rama `main` y ejecuta los siguientes pasos en orden:

```
git push → Backend Tests → Frontend Tests → Deploy Backend → Deploy Frontend
                ✅                ✅               ✅                ✅
```

1. **Backend Tests** — instala dependencias Python y corre PyTest con SQLite
2. **Frontend Tests** — instala dependencias Node y corre Jest
3. **Deploy Backend** — SSH a EC2 Backend, git pull, reinicia servicio systemd
4. **Deploy Frontend** — SSH a EC2 Frontend, git pull, npm build, reinicia servicio systemd

> El deploy solo ocurre si **todos** los tests pasan. Si algún test falla, el pipeline se detiene y no despliega.

---

## 🗄️ Base de Datos

La base de datos Chinook contiene:
- **3503 canciones** de múltiples géneros y artistas
- **59 clientes** registrados
- Schema completo con tracks, albums, artists, customers, invoices

---

## 🔐 Seguridad

- La base de datos RDS está en una **subred privada** sin acceso público
- El backend solo acepta conexiones del Security Group del frontend en el puerto 8000
- La base de datos solo acepta conexiones del Security Group del backend en el puerto 5432
- Las credenciales sensibles están almacenadas en **GitHub Secrets** y archivos `.env`

---

## 👥 Equipo

**UnicornTechnologiesTeam** — Parcial I — Computación en la Nube
