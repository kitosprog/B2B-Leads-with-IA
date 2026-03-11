# 📘 Guía de Git: Commit y Push

## 🎯 Diferencia Entre `git commit` y `git push`

### `git commit` - Guardar Cambios LOCALMENTE

```bash
git commit -m "mensaje descriptivo"
```

**¿Qué hace?**
- ✅ Guarda tus cambios en tu computadora (LOCAL)
- ✅ Crea un "checkpoint" o punto de guardado
- ✅ NO envía nada a GitHub todavía
- ✅ Puedes hacer muchos commits antes de subir

**Ejemplo:**
```bash
# 1. Modificas archivos
# 2. Los agregas al staging
git add archivo.txt

# 3. Los guardas localmente
git commit -m "agregar nueva funcionalidad"

# ❌ Todavía NO está en GitHub
```

---

### `git push` - Enviar Cambios a GITHUB

```bash
git push
```

**¿Qué hace?**
- ✅ Envía tus commits locales a GitHub
- ✅ Sube el código al servidor remoto
- ✅ Otros pueden ver tus cambios
- ✅ El código queda respaldado en la nube

**Ejemplo:**
```bash
# Después de hacer commits locales...
git push

# ✅ Ahora SÍ está en GitHub
```

---

## 📊 Flujo Completo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  TU COMPUTADORA (LOCAL)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Modificas archivos                                      │
│     ├─ editas código                                        │
│     ├─ creas archivos nuevos                                │
│     └─ borras archivos                                      │
│                                                             │
│  2. git add .                                               │
│     └─ Preparar archivos para commit                        │
│                                                             │
│  3. git commit -m "mensaje"                                 │
│     └─ Guardar cambios LOCALMENTE                           │
│         ✅ Guardado en tu PC                                │
│         ❌ Todavía NO en GitHub                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         ↓
                    git push
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  GITHUB (REMOTO/NUBE)                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Código subido                                           │
│  ✅ Visible en internet                                     │
│  ✅ Respaldado en la nube                                   │
│  ✅ Otros pueden verlo/clonarlo                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Típico

### Cuando Trabajas en Tu Proyecto:

```bash
# 1. Hacer cambios
# (editas archivos en tu editor)

# 2. Ver qué cambió
git status

# 3. Agregar cambios al staging
git add .
# O agregar archivos específicos:
git add archivo1.js archivo2.ts

# 4. Hacer commit (guardar localmente)
git commit -m "descripción de lo que hiciste"

# 5. Enviar a GitHub (cuando quieras)
git push
```

---

## 💡 Cuándo Usar Cada Uno

### `git commit` - Úsalo:
✅ Después de terminar una funcionalidad
✅ Después de arreglar un bug
✅ Cada vez que quieras guardar tu progreso
✅ ANTES de hacer experimentos arriesgados
✅ Varias veces al día

**Tip:** Puedes hacer muchos commits antes de hacer push

---

### `git push` - Úsalo:
✅ Al final del día
✅ Cuando termines una feature completa
✅ Cuando quieras respaldar tu trabajo
✅ Cuando quieras compartir tu código
✅ Antes de cambiar de computadora

**Tip:** No necesitas push después de cada commit

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Trabajar Durante el Día

```bash
# 9:00 AM - Empiezas a trabajar
git pull  # Traer últimos cambios

# 10:00 AM - Terminas una función
git add .
git commit -m "feat: agregar búsqueda de usuarios"

# 12:00 PM - Arreglas un bug
git add .
git commit -m "fix: corregir error en validación"

# 2:00 PM - Agregas tests
git add .
git commit -m "test: agregar tests para búsqueda"

# 5:00 PM - Fin del día, subes TODO a GitHub
git push

# Resultado:
# - Hiciste 3 commits locales
# - 1 push que subió los 3 commits a GitHub
```

---

### Ejemplo 2: Cambio Rápido

```bash
# Haces un cambio pequeño
git add .
git commit -m "docs: actualizar README"
git push

# Todo junto porque es un cambio simple
```

---

### Ejemplo 3: Proyecto Nuevo (Como Hicimos)

```bash
# 1. Crear proyecto completo
# 2. Hacer primer commit
git add .
git commit -m "Initial commit: proyecto completo"

# 3. Agregar más features
git add .
git commit -m "feat: agregar scraping profundo"

# 4. Agregar más features
git add .
git commit -m "feat: integración Google Maps"

# 5. Subir TODO de una vez
git push

# Resultado: 
# - Varios commits locales
# - 1 push que subió todos los commits
```

---

## 🎯 Tu Situación Actual

En tu proyecto **B2B-Leads-with-IA**:

```bash
✅ Tienes 5 commits hechos
✅ Ya hiciste push de todos
✅ Todo está en GitHub
✅ Repo sincronizado

Estado actual: Todo está al día ✓
```

---

## 📋 Comandos Git Útiles

### Ver Estado
```bash
git status              # Ver archivos modificados
git log --oneline       # Ver historial de commits
git log --oneline -5    # Ver últimos 5 commits
```

### Hacer Cambios
```bash
git add .               # Agregar todos los archivos
git add archivo.txt     # Agregar archivo específico
git commit -m "mensaje" # Commit con mensaje
git push                # Subir a GitHub
```

### Ver Diferencias
```bash
git diff                # Ver cambios sin agregar
git diff --staged       # Ver cambios agregados
```

### Deshacer Cambios
```bash
git restore archivo.txt # Descartar cambios locales
git reset HEAD~1        # Deshacer último commit (mantiene cambios)
```

---

## 🚨 Errores Comunes

### "Changes not staged for commit"
```bash
# Significa: hiciste cambios pero no los agregaste
# Solución:
git add .
git commit -m "mensaje"
```

### "Your branch is ahead of origin/main"
```bash
# Significa: tienes commits locales sin subir
# Solución:
git push
```

### "Updates were rejected"
```bash
# Significa: GitHub tiene cambios que no tienes localmente
# Solución:
git pull
git push
```

---

## ✅ Buenas Prácticas

### Mensajes de Commit:

**❌ Malos:**
```bash
git commit -m "cambios"
git commit -m "fix"
git commit -m "asdf"
```

**✅ Buenos:**
```bash
git commit -m "feat: agregar búsqueda de empresas"
git commit -m "fix: corregir error en scraping"
git commit -m "docs: actualizar README con ejemplos"
git commit -m "refactor: mejorar performance del scraper"
```

### Prefijos Útiles:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Formato (no afecta código)
- `refactor:` - Refactorización
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

---

## 🎓 Resumen Rápido

```
┌──────────────────────────────────────────────────────┐
│  git add     →  Preparar archivos                    │
│  git commit  →  Guardar en TU computadora (LOCAL)    │
│  git push    →  Subir a GitHub (REMOTO)              │
└──────────────────────────────────────────────────────┘

Flujo normal:
1. Haces cambios
2. git add .
3. git commit -m "mensaje"
4. git push (cuando quieras subir)
```

---

## 🔄 Tu Próximo Cambio

Cuando hagas cambios en el futuro:

```bash
# 1. Ver qué cambió
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "descripción clara del cambio"

# 4. Push (cuando quieras)
git push
```

---

**¡Ahora ya entiendes la diferencia entre commit y push!** 🎉

- **commit** = Guardar en tu PC 💾
- **push** = Subir a GitHub ☁️
