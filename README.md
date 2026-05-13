# PokeSearch 🔍

Aplicación web para buscar información de Pokémon usando la [PokéAPI](https://pokeapi.co/). Guarda un historial de búsquedas en base de datos.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML + JavaScript (servido por Nginx) |
| Backend | Node.js + Express |
| Base de datos | MongoDB |
| Orquestación | Docker Compose |

## Estructura del proyecto

```
FirstClass2026/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── index.html
└── backend/
    ├── Dockerfile
    ├── package.json
    └── src/
        └── index.js
```

## Ramas

| Rama | EC2 | Propósito |
|------|-----|-----------|
| `dev` | EC2 #1 | Desarrollo activo |
| `QA` | EC2 #2 | Pruebas y revisión |
| `master` | EC2 #3 | Producción |

> Las ramas `QA` y `master` están protegidas. Todo cambio debe entrar por Pull Request con aprobación del docente.

## Requisitos previos

- Docker y Docker Compose instalados
- Cuenta en [DockerHub](https://hub.docker.com)
- Puertos `8080` y `3000` abiertos en el Security Group de AWS

## Instalación de Docker (Ubuntu t3.micro)

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
newgrp docker
```

## Clonar el repositorio

```bash
git clone https://github.com/JosephP2001/FirstClass2026.git
cd FirstClass2026
```

Cambiar a la rama correspondiente a cada EC2:

```bash
# EC2 #1
git checkout dev

# EC2 #2
git checkout QA

# EC2 #3
git checkout master
```

## Levantar la aplicación

```bash
docker-compose up -d --build
```

Verificar que los contenedores estén corriendo:

```bash
docker ps
```

Debes ver 3 contenedores activos:

```
firstclass2026-frontend   Up   0.0.0.0:8080->80/tcp
firstclass2026-backend    Up   0.0.0.0:3000->3000/tcp
firstclass2026-mongo      Up   27017/tcp
```

Acceder desde el navegador:

```
http://<IP-PUBLICA-EC2>:8080
```

Ver logs:

```bash
docker-compose logs -f
```

Detener:

```bash
docker-compose down
```

## ⚠️ Configuración importante

En `frontend/index.html` hay una variable que apunta al backend:

```javascript
const BACKEND = 'http://localhost:3000'
```

Si accedes desde un navegador externo (no desde la misma máquina), reemplaza `localhost` con la IP pública de la EC2 donde está corriendo el backend.

## Flujo de trabajo Git

```
Cambio en dev (EC2 #1)
    │
    └─► git add . → git commit → git push origin dev
              │
              └─► Pull Request dev → QA (docente aprueba)
                        │
                        └─► git pull en EC2 #2
                                  │
                                  └─► Pull Request QA → master (docente aprueba)
                                            │
                                            └─► git pull en EC2 #3
```

## Tags de DockerHub

Cada rama genera su propio tag de imagen en DockerHub:

| Rama | Tag de imagen | Descripción |
|------|--------------|-------------|
| dev | `usuario/pokesearch-frontend:dev-v1.0` | Build de desarrollo |
| dev | `usuario/pokesearch-backend:dev-v1.0` | Build de desarrollo |
| QA | `usuario/pokesearch-frontend:qa-v1.0` | Validado en QA |
| QA | `usuario/pokesearch-backend:qa-v1.0` | Validado en QA |
| master | `usuario/pokesearch-frontend:prod-v1.0` | Producción |
| master | `usuario/pokesearch-backend:prod-v1.0` | Producción |
| master | `usuario/pokesearch-frontend:latest` | Sinónimo de prod |
| master | `usuario/pokesearch-backend:latest` | Sinónimo de prod |

### Comandos de build y push por rama

**Dev:**
```bash
docker build -t usuario/pokesearch-frontend:dev-v1.0 ./frontend
docker build -t usuario/pokesearch-backend:dev-v1.0 ./backend
docker tag usuario/pokesearch-frontend:dev-v1.0 usuario/pokesearch-frontend:dev
docker tag usuario/pokesearch-backend:dev-v1.0 usuario/pokesearch-backend:dev
docker push usuario/pokesearch-frontend:dev-v1.0
docker push usuario/pokesearch-frontend:dev
docker push usuario/pokesearch-backend:dev-v1.0
docker push usuario/pokesearch-backend:dev
```

**QA:**
```bash
docker pull usuario/pokesearch-frontend:dev-v1.0
docker pull usuario/pokesearch-backend:dev-v1.0
docker tag usuario/pokesearch-frontend:dev-v1.0 usuario/pokesearch-frontend:qa-v1.0
docker tag usuario/pokesearch-backend:dev-v1.0 usuario/pokesearch-backend:qa-v1.0
docker tag usuario/pokesearch-frontend:qa-v1.0 usuario/pokesearch-frontend:qa
docker tag usuario/pokesearch-backend:qa-v1.0 usuario/pokesearch-backend:qa
docker push usuario/pokesearch-frontend:qa-v1.0
docker push usuario/pokesearch-frontend:qa
docker push usuario/pokesearch-backend:qa-v1.0
docker push usuario/pokesearch-backend:qa
```

**Prod (master):**
```bash
docker pull usuario/pokesearch-frontend:qa-v1.0
docker pull usuario/pokesearch-backend:qa-v1.0
docker tag usuario/pokesearch-frontend:qa-v1.0 usuario/pokesearch-frontend:prod-v1.0
docker tag usuario/pokesearch-backend:qa-v1.0 usuario/pokesearch-backend:prod-v1.0
docker tag usuario/pokesearch-frontend:prod-v1.0 usuario/pokesearch-frontend:latest
docker tag usuario/pokesearch-backend:prod-v1.0 usuario/pokesearch-backend:latest
docker push usuario/pokesearch-frontend:prod-v1.0
docker push usuario/pokesearch-frontend:latest
docker push usuario/pokesearch-backend:prod-v1.0
docker push usuario/pokesearch-backend:latest
```

## Sincronizar con GitHub (forzar sobreescritura local)

```bash
git fetch --all
git reset --hard origin/<rama>
```

## Endpoints del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/searches` | Obtiene historial de búsquedas |
| POST | `/searches` | Guarda una nueva búsqueda |
