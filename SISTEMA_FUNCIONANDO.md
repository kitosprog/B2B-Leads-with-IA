# ✅ Sistema Ejecutándose Correctamente

## 🎉 ¡El sistema está FUNCIONANDO!

### Servicios Activos

```
✅ Backend (API)
   URL: http://localhost:4000
   Modo: DEMO (sin bases de datos)
   Estado: ✓ Running

✅ Frontend (Dashboard)
   URL: http://localhost:3001
   Framework: Next.js 14
   Estado: ✓ Ready
```

---

## 🚀 Cómo Usar el Sistema AHORA

### Paso 1: Abre el Dashboard

**Abre tu navegador** en: **http://localhost:3001**

### Paso 2: Haz una Búsqueda

En el campo de texto escribe, por ejemplo:
```
software companies Barcelona
```

O cualquiera de estos ejemplos:
- `marketing agencies Madrid`
- `restaurants Barcelona`
- `tech startups Spain`
- `consulting firms Barcelona`

### Paso 3: Observa los Logs

En la terminal del backend verás en tiempo real:

```
🔍 Starting deep search for: "software companies Barcelona"
  → Searching: "software companies Barcelona contact email phone"
    ✓ Google: 10 results
    ✓ Bing: 8 results
    ✓ DuckDuckGo: 5 results

🗺️  Phase 2: Searching Google Maps...
  ✓ Found 8 additional businesses

🕷️  Scraping websites...
    🔍 Deep scraping: https://example.com
      [DEBUG] Found 2 emails, 3 phones
    ✅ Saved company ✓

📊 FINAL STATS:
   Companies saved: 18/25
   Success rate: 72.0%
```

### Paso 4: Ver Resultados

1. Click en **"View Results"** en el dashboard
2. Verás tabla con todas las empresas encontradas
3. Puedes:
   - 📋 Copiar emails/teléfonos
   - 🗑️ Eliminar empresas
   - 📤 Exportar todo a CSV

---

## 📊 Ejemplo de Búsqueda Real

### Input
```
Query: software companies Barcelona
Country: Spain (opcional)
```

### Proceso (~8-10 minutos)
```
⏳ Fase 1: Búsqueda (2-3 min)
   - Google, Bing, DuckDuckGo, Maps
   - 25-35 empresas encontradas

⏳ Fase 2: Scraping (5-7 min)
   - Explora cada sitio web
   - Múltiples páginas por sitio
   - Extrae emails y teléfonos

⏳ Fase 3: Guardar (30s)
   - Valida datos
   - Guarda en base de datos
```

### Output
```
✅ 18-25 empresas con contactos
📧 35-50 emails
📞 40-60 teléfonos
⏱️ 8-10 minutos
✅ 60-80% tasa de éxito
```

---

## 🖥️ Terminales Activas

### Terminal 1 - Backend
```bash
# Directorio: backend/
# Comando: npm run dev:demo
# Log location: Ver terminal donde ejecutaste el comando
```

Lo que verás:
```
============================================================
🚀 DEMO MODE - No database required
============================================================

✅ Server running on http://localhost:4000
📊 Environment: development
💾 Storage: In-memory (demo mode)
🔍 Intelligent search: Enabled

[INFO] Server listening at http://0.0.0.0:4000
```

### Terminal 2 - Frontend
```bash
# Directorio: frontend/
# Comando: npm run dev
# URL: http://localhost:3001
```

Lo que verás:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3001
- Environments: .env.local

✓ Ready in 3.6s
```

---

## 🎯 Prueba el Sistema AHORA

### Opción 1: Dashboard Web (Recomendado)
1. Abre: **http://localhost:3001**
2. Escribe: "marketing agencies Barcelona"
3. Click: "Start Scraping"
4. Espera 8-10 minutos
5. Ve a "View Results"

### Opción 2: API Direct (Avanzado)
```powershell
# Crear búsqueda
$body = @{query="software companies Barcelona"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:4000/api/scrape" -Method Post -Body $body -ContentType "application/json"

# Ver resultados (después de unos minutos)
Invoke-RestMethod -Uri "http://localhost:4000/api/results" -Method Get
```

---

## 📺 Lo que Verás en el Dashboard

### Pantalla 1: Buscar
```
┌────────────────────────────────────────┐
│ Find B2B Leads with AI                │
├────────────────────────────────────────┤
│ Query: [___________________________]  │
│        marketing agencies Barcelona    │
│                                        │
│ Country: [_____]                      │
│          Spain                         │
│                                        │
│         [🚀 Start Scraping]           │
└────────────────────────────────────────┘
```

### Pantalla 2: Procesando
```
┌────────────────────────────────────────┐
│ ⏳ Scraping in Progress...            │
├────────────────────────────────────────┤
│ Status: 🔄 Processing                 │
│ Progress: ████████░░░░░░ 65%          │
│ Found: 18 companies                    │
│ Time: 6m 32s                           │
└────────────────────────────────────────┘
```

### Pantalla 3: Resultados
```
┌────────────────────────────────────────┐
│ Results - 25 Companies Found          │
├────────────────────────────────────────┤
│                                        │
│ Company Name         Email      Phone  │
│ ──────────────────────────────────────│
│ Barcelona Dev       info@...   +34... │
│ CodeCraft BCN       hello@...  +34... │
│ Digital Makers      contact... +34... │
│                                        │
│ [📤 Export CSV]   [🔄 Refresh]        │
└────────────────────────────────────────┘
```

---

## ⚠️ Si Algo No Funciona

### Backend no responde
```bash
# Verificar que esté corriendo
curl http://localhost:4000/health

# Si no responde, reiniciar:
cd backend
npm run dev:demo
```

### Frontend no carga
```bash
# Verificar URL correcta
http://localhost:3001

# Si no funciona, reiniciar:
cd frontend
npm run dev
```

### No encuentra contactos
Ver logs del backend - debe mostrar:
```
[DEBUG] Found X emails, Y phones
```

Si no aparece, el scraping no está funcionando.
Revisa que Playwright esté instalado:
```bash
cd backend
npx playwright install chromium
```

---

## 📊 Monitoreo en Tiempo Real

### Ver Logs del Backend
Observa la terminal donde ejecutaste `npm run dev:demo`

Verás:
```
🔍 Starting deep search...
  ✓ Google: 10 results
  ✓ Bing: 8 results

🕷️  Scraping websites...
    🔍 Deep scraping: https://example.com
      [DEBUG] Page loaded, 15432 chars
      [DEBUG] Found 2 emails, 3 phones
    ✅ Saved: Example Company

📊 FINAL STATS:
   Total: 25 companies
   Saved: 18
   Success: 72%
```

---

## 🎉 ¡El Sistema Está Listo!

```
✅ Backend: http://localhost:4000
✅ Frontend: http://localhost:3001
✅ Modo: DEMO (sin bases de datos)
✅ Estado: FUNCIONANDO

🚀 Abre http://localhost:3001 y empieza a buscar!
```

**Tiempo estimado por búsqueda: 8-10 minutos**  
**Resultados esperados: 15-30 empresas con contactos**

---

## 💡 Tips

1. **Primera búsqueda**: Empieza con algo pequeño como "restaurants Barcelona" (toma menos tiempo)
2. **Paciencia**: El scraping toma 8-10 minutos por búsqueda
3. **Logs**: Observa la terminal del backend para ver el progreso
4. **Resultados**: Algunos sitios no tienen contactos públicos, es normal

---

## 🆘 Ayuda

Si necesitas ayuda:
1. Revisa los logs en las terminales
2. Verifica que ambos servicios estén corriendo
3. Lee la documentación en:
   - `DEMO.md` - Ejemplo completo
   - `QUICK_START.md` - Guía rápida
   - `TUTORIAL_VISUAL.md` - Tutorial visual

---

**¡DISFRUTA DEL SISTEMA!** 🎉🚀
