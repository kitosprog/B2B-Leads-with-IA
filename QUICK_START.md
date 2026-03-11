# 🚀 Guía Rápida de Inicio

## Opción 1: Inicio Rápido (Demo Mode - SIN bases de datos)

### 1. Instala dependencias

```bash
# Raíz del proyecto
npm install

# O manualmente:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Instala Playwright (para scraping)

```bash
cd backend
npx playwright install chromium
```

### 3. Inicia el backend en modo demo

```bash
cd backend
npm run dev:demo
```

Verás:
```
✓ Backend en modo DEMO (sin PostgreSQL/Redis)
✓ Puerto: 5000
✓ Usando SQLite en memoria
```

### 4. Inicia el frontend

```bash
# En otra terminal
cd frontend
npm run dev
```

Verás:
```
✓ Frontend iniciado
✓ Puerto: 3000
✓ URL: http://localhost:3000
```

### 5. Abre el navegador

Visita: **http://localhost:3000**

### 6. Haz una búsqueda

```
Input: "marketing agencies Barcelona"
Click: Start Scraping
```

### 7. Observa los logs

En la terminal del backend verás en tiempo real:

```
🔍 Starting deep search for: "marketing agencies Barcelona"
  → Searching: "marketing agencies Barcelona contact email phone"
    ✓ Google: 10 results
    ✓ Bing: 8 results
    ✓ DuckDuckGo: 5 results

🗺️  Phase 2: Searching Google Maps...
  ✓ Found 12 additional businesses

🕷️  Scraping 23 websites...
    🔍 Deep scraping: https://example.com
      [DEBUG] Found 2 emails, 3 phones
    ✅ Saved company ✓

📊 FINAL STATS:
   Companies saved: 26/35
   Success rate: 74.3%
```

---

## Opción 2: Producción (Con PostgreSQL + Redis)

### Requisitos

- PostgreSQL 14+
- Redis 6+
- Node.js 18+

### 1. Inicia PostgreSQL y Redis

```bash
# Con Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:14
docker run -d -p 6379:6379 redis:6

# O usa instalación local
```

### 2. Configura variables de entorno

```bash
cd backend
cp .env.example .env

# Edita .env:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/scraper
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Crea la base de datos

```bash
psql -U postgres -c "CREATE DATABASE scraper;"
psql -U postgres -d scraper -f ../database/schema.sql
```

### 4. Inicia el backend

```bash
npm run dev
```

### 5. Inicia el frontend

```bash
cd frontend
npm run dev
```

---

## 🎯 Ejemplo de Uso

### Búsqueda Simple

```
Query: "restaurants Madrid"
→ Encuentra 20-30 restaurantes
→ Extrae teléfonos y emails
→ Tiempo: ~8 minutos
```

### Búsqueda Específica

```
Query: "tech startups Barcelona"
Country: Spain
→ Encuentra 30-40 startups
→ Extrae contactos completos
→ Tiempo: ~12 minutos
```

### Ver Resultados

1. Click en "View Results" en el dashboard
2. Verás tabla con todas las empresas
3. Opciones:
   - 📋 Copiar email/teléfono
   - 🗑️ Eliminar empresa
   - 📤 Exportar todo a CSV

---

## 🐛 Solución de Problemas

### Backend no inicia

```bash
# Verificar puerto
netstat -an | findstr :5000

# Si está ocupado, cambiar en backend/.env:
PORT=5001
```

### Frontend no conecta

```bash
# Verificar NEXT_PUBLIC_API_URL en frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### No encuentra contactos

```bash
# Ver logs detallados en terminal del backend
# Debe mostrar:
# [DEBUG] Found X emails, Y phones

# Si no aparece, revisar:
# 1. Playwright instalado: npx playwright install chromium
# 2. Internet activo
# 3. Sin proxy/firewall bloqueando
```

### Error de TypeScript

```bash
# Limpiar y reinstalar
cd backend
rm -rf node_modules dist
npm install
npm run build
```

---

## 📚 Documentación Completa

- **DEMO.md** - Ver ejemplo completo de cómo funciona
- **README.md** - Documentación principal
- **CONTACT_EXTRACTION.md** - Cómo extrae los contactos
- **INTELLIGENT_SEARCH.md** - Sistema de búsqueda
- **ARCHITECTURE.md** - Arquitectura técnica

---

## ✅ Verificación Rápida

Todo funciona si ves:

1. ✅ Backend: `Server listening on port 5000`
2. ✅ Frontend: `Ready on http://localhost:3000`
3. ✅ Búsqueda: Logs detallados en backend
4. ✅ Resultados: Empresas con contactos en dashboard

---

## 💡 Tips

1. **Usa modo demo primero** - No requiere PostgreSQL/Redis
2. **Observa los logs** - Muestran todo el proceso
3. **Empieza con búsquedas pequeñas** - Ej: "restaurants Barcelona" (en vez de "all restaurants in Spain")
4. **Espera paciencia** - Scraping de 30 empresas toma ~10 minutos

---

## 🆘 Ayuda

¿Problemas? Revisa:
1. Logs de la terminal (backend)
2. Consola del navegador (F12)
3. Documentación en carpeta del proyecto
