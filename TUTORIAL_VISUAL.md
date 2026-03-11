# 📺 Tutorial Visual: Cómo Funciona el Sistema

## 🎬 Simulación de Uso Real

Vamos a simular una búsqueda real paso a paso, como si estuvieras viéndolo en pantalla.

---

## 🖥️ PANTALLA 1: Dashboard Inicial

```
┌──────────────────────────────────────────────────────────────────┐
│ Company Scraper SaaS                                   [Settings] │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│            🔍 Find B2B Leads with AI                              │
│                                                                    │
│       Intelligent search and automated scraping of                │
│            company contact data                                   │
│                                                                    │
│  🔍 Automatic Internet Search  ⚡ AI-Powered                      │
│                                                                    │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │  Intelligent Lead Search                                   │   │
│ │                                                            │   │
│ │  What companies are you looking for?                       │   │
│ │  ┌──────────────────────────────────────────────────────┐ │   │
│ │  │ software development agencies in Barcelona           │ │   │
│ │  └──────────────────────────────────────────────────────┘ │   │
│ │                                                            │   │
│ │  ℹ️ Deep Search Mode: We search Google + Bing +           │   │
│ │     DuckDuckGo in parallel, explore company websites      │   │
│ │     deeply, and extract all available emails and phones.  │   │
│ │                                                            │   │
│ │  Country (optional):                                       │   │
│ │  ┌──────────────────────────────────────────────────────┐ │   │
│ │  │ Spain                                                │ │   │
│ │  └──────────────────────────────────────────────────────┘ │   │
│ │                                                            │   │
│ │                        [🚀 Start Scraping]                 │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  💡 How it works:                                                 │
│  1. 🔍 Search - We find companies matching your query            │
│  2. 🕷️ Scrape - Extract contact data from websites              │
│  3. ✅ Validate - Clean and verify the information               │
│  4. 💾 Store - Save results to database                          │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

**ACCIÓN**: Usuario escribe "software development agencies in Barcelona" y hace click en "Start Scraping"

---

## 🖥️ PANTALLA 2: Procesando (Vista del Usuario)

```
┌──────────────────────────────────────────────────────────────────┐
│ Company Scraper SaaS                                   [Settings] │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ⏳ Scraping in Progress...                                       │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Job Status                                                 │  │
│  │                                                            │  │
│  │  Query: "software development agencies in Barcelona"      │  │
│  │  Status: 🔄 Processing                                     │  │
│  │                                                            │  │
│  │  Progress: ████████████░░░░░░░░░░ 65%                     │  │
│  │                                                            │  │
│  │  Found so far: 18 companies                               │  │
│  │  Time elapsed: 6m 32s                                     │  │
│  │                                                            │  │
│  │  Current step:                                            │  │
│  │  🕷️ Scraping website 18/27                                │  │
│  │  https://tech-agency-bcn.com                              │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Recent activity:                                                 │
│  ✓ Searched Google, Bing, DuckDuckGo                             │
│  ✓ Found 27 company websites                                     │
│  ✓ Scraped 18/27 websites                                        │
│  🔄 Extracting contacts...                                        │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 💻 TERMINAL (Backend - Lo que pasa por detrás)

Mientras el usuario ve el dashboard, en la terminal del backend sucede esto:

```bash
═══════════════════════════════════════════════════════════════════
🚀 NEW SCRAPING JOB STARTED
═══════════════════════════════════════════════════════════════════

Query: "software development agencies in Barcelona"
Country: Spain
Job ID: #42

─────────────────────────────────────────────────────────────────

📍 PHASE 1: INTELLIGENT SEARCH
─────────────────────────────────────────────────────────────────

🔍 Starting deep search for: "software development agencies in Barcelona"

  → Searching: "software development agencies in Barcelona contact email phone"
    ✓ Google: 12 results
    ✓ Bing: 9 results
    ✓ DuckDuckGo: 6 results

  → Searching: "software development agencies in Barcelona business directory"
    ✓ Google: 5 results
    ✓ Bing: 4 results
    ✓ DuckDuckGo: 3 results

  → Searching: "software development agencies in Barcelona site:linkedin.com"
    ✓ Google: 8 results
    ✓ Bing: 6 results
    ✓ DuckDuckGo: 2 results

  ✓ Found 45 total results from all search engines
  ✓ After deduplication: 27 unique companies

─────────────────────────────────────────────────────────────────

📍 PHASE 2: GOOGLE MAPS SEARCH
─────────────────────────────────────────────────────────────────

🗺️  Searching Google Maps for: "software development agencies in Barcelona"
  ✓ Found 8 additional businesses on Google Maps

📊 Total companies to process: 35 (27 web + 8 maps)

─────────────────────────────────────────────────────────────────

📍 PHASE 3: DEEP SCRAPING
─────────────────────────────────────────────────────────────────

🕷️  Scraping 27 websites...

────────────────────────────────────────────────────────────────
[1/27] https://barcelonadev.com
────────────────────────────────────────────────────────────────

    🔍 Deep scraping: https://barcelonadev.com
      [DEBUG] Page loaded, text length: 18543, HTML length: 67234
      [DEBUG] Initial extraction: 1 emails, 2 phones
      [DEBUG] After HTML extraction: 2 emails, 3 phones
      
      → Exploring: https://barcelonadev.com/contact
        ✓ Found 1 more emails
        ✓ Found 1 more phones
      
      → Exploring: https://barcelonadev.com/about
        (No new contacts)
      
      → Exploring: https://barcelonadev.com/team
        ✓ Found 1 more emails

    ✅ FINAL RESULT for https://barcelonadev.com:
       - Name: Barcelona Dev Solutions
       - Emails found: 4 → info@barcelonadev.com, contact@barcelonadev.com, 
                          hello@barcelonadev.com, team@barcelonadev.com
       - Phones found: 4 → +34933123456, +34600987654, +34933123499, +34666554433
       - Contact page: https://barcelonadev.com/contact
       - LinkedIn: https://linkedin.com/company/barcelona-dev

    ✅ Saved company: Barcelona Dev Solutions (email: ✓, phone: ✓)

────────────────────────────────────────────────────────────────
[2/27] https://codecraft-bcn.com
────────────────────────────────────────────────────────────────

    🔍 Deep scraping: https://codecraft-bcn.com
      [DEBUG] Page loaded, text length: 12432, HTML length: 45123
      [DEBUG] Initial extraction: 2 emails, 1 phones
      [DEBUG] After HTML extraction: 2 emails, 2 phones
      [DEBUG HTML] mailto: 1, tel: 2, JSON-LD: 1
      
      → Exploring: https://codecraft-bcn.com/contacto
        ✓ Found 1 more phones
      
      → Exploring: https://codecraft-bcn.com/nosotros
        (No new contacts)

    ✅ FINAL RESULT for https://codecraft-bcn.com:
       - Name: CodeCraft Barcelona
       - Emails found: 2 → info@codecraft-bcn.com, ventas@codecraft-bcn.com
       - Phones found: 3 → +34932234567, +34691234567, +34932234588
       - Contact page: https://codecraft-bcn.com/contacto
       - LinkedIn: https://linkedin.com/company/codecraft-barcelona

    ✅ Saved company: CodeCraft Barcelona (email: ✓, phone: ✓)

────────────────────────────────────────────────────────────────
[3/27] https://digital-makers.es
────────────────────────────────────────────────────────────────

    🔍 Deep scraping: https://digital-makers.es
      [DEBUG] Page loaded, text length: 9876, HTML length: 34567
      [DEBUG] Initial extraction: 0 emails, 1 phones
      [DEBUG] After HTML extraction: 1 emails, 2 phones
      
      → Exploring: https://digital-makers.es/contact
        ✓ Found 2 more emails
        ✓ Found 1 more phones

    ✅ FINAL RESULT for https://digital-makers.es:
       - Name: Digital Makers
       - Emails found: 3 → hello@digital-makers.es, info@digital-makers.es,
                          projects@digital-makers.es
       - Phones found: 3 → +34934345678, +34625987654, +34934345699
       - Contact page: https://digital-makers.es/contact
       - LinkedIn: https://linkedin.com/company/digital-makers-barcelona

    ✅ Saved company: Digital Makers (email: ✓, phone: ✓)

... [Procesando 24 sitios más] ...

────────────────────────────────────────────────────────────────
[27/27] https://tech-innovators.com
────────────────────────────────────────────────────────────────

    🔍 Deep scraping: https://tech-innovators.com
      [DEBUG] Page loaded, text length: 15234, HTML length: 52345
      [DEBUG] Initial extraction: 1 emails, 0 phones
      [DEBUG] After HTML extraction: 2 emails, 1 phones
      
      → Exploring: https://tech-innovators.com/contact-us
        ✓ Found 2 more phones

    ✅ FINAL RESULT for https://tech-innovators.com:
       - Name: Tech Innovators BCN
       - Emails found: 2 → contact@tech-innovators.com, info@tech-innovators.com
       - Phones found: 3 → +34935456789, +34610123456, +34935456790
       - Contact page: https://tech-innovators.com/contact-us
       - LinkedIn: https://linkedin.com/company/tech-innovators-bcn

    ✅ Saved company: Tech Innovators BCN (email: ✓, phone: ✓)

─────────────────────────────────────────────────────────────────

📍 PHASE 4: GOOGLE MAPS PROCESSING
─────────────────────────────────────────────────────────────────

🗺️  Processing 8 businesses from Google Maps...

1. Software House Barcelona
   📞 +34 931 234 567 (from Maps)
   🌐 https://softwarehouse-bcn.com
   
   🔍 Scraping website for email...
      ✓ Email found: info@softwarehouse-bcn.com
   
   ✅ Saved from Maps: Software House Barcelona (email: ✓, phone: ✓)

2. App Developers BCN
   📞 +34 932 345 678 (from Maps)
   🌐 https://appdev-barcelona.com
   
   🔍 Scraping website for email...
      ✓ Email found: hello@appdev-barcelona.com
   
   ✅ Saved from Maps: App Developers BCN (email: ✓, phone: ✓)

... [6 más] ...

═══════════════════════════════════════════════════════════════════
📊 FINAL STATISTICS
═══════════════════════════════════════════════════════════════════

   Web URLs found: 27
   Google Maps businesses: 8
   Total sources: 35
   Companies saved: 28
   Success rate: 80.0%

   Time taken: 9m 45s
   Average time per company: 20.7s

═══════════════════════════════════════════════════════════════════
✅ JOB COMPLETED SUCCESSFULLY
═══════════════════════════════════════════════════════════════════
```

---

## 🖥️ PANTALLA 3: Resultados Completos

```
┌──────────────────────────────────────────────────────────────────┐
│ Company Scraper SaaS                                   [Settings] │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ✅ Scraping Complete!                                            │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Job Summary                                                │  │
│  │                                                            │  │
│  │  Query: "software development agencies in Barcelona"      │  │
│  │  Status: ✅ Completed                                      │  │
│  │                                                            │  │
│  │  📊 Results:                                               │  │
│  │  • Companies found: 28                                     │  │
│  │  • Success rate: 80.0%                                     │  │
│  │  • Time taken: 9m 45s                                     │  │
│  │                                                            │  │
│  │                  [📋 View Results] [🔄 New Search]         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

**ACCIÓN**: Usuario hace click en "View Results"

---

## 🖥️ PANTALLA 4: Tabla de Resultados

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Results - 28 Companies Found                         [🏠 Dashboard] [Export] │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Showing 28 results from "software development agencies in Barcelona"         │
│  [📤 Export to CSV]                                  [🔄 Refresh]             │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │ Company Name             Email                    Phone        Actions   │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ Barcelona Dev Solutions  info@barcelonadev.com   +34 933 12...  📋 🗑️  │ │
│  │ 🌐 barcelonadev.com     💼 LinkedIn                                      │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ CodeCraft Barcelona      info@codecraft-bcn.com  +34 932 23...  📋 🗑️  │ │
│  │ 🌐 codecraft-bcn.com    💼 LinkedIn                                      │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ Digital Makers           hello@digital-makers.es +34 934 34...  📋 🗑️  │ │
│  │ 🌐 digital-makers.es    💼 LinkedIn                                      │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ Software House Barcelona info@softwarehouse...   +34 931 23...  📋 🗑️  │ │
│  │ 🌐 softwarehouse-bcn... 💼 LinkedIn             [From Google Maps]       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ Tech Innovators BCN      contact@tech-innov...  +34 935 45...  📋 🗑️  │ │
│  │ 🌐 tech-innovators.com  💼 LinkedIn                                      │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │ ... 23 more companies ...                                                │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  💡 Click 📋 to copy contact info | Click 🗑️ to delete                       │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**ACCIÓN**: Usuario hace click en 📋 para copiar email

```
┌─────────────────────────────────┐
│  ✓ Email copied to clipboard!  │
│  info@barcelonadev.com          │
└─────────────────────────────────┘
```

**ACCIÓN**: Usuario hace click en "Export to CSV"

---

## 📄 ARCHIVO CSV EXPORTADO

```csv
name,website,email,phone,contact_page,linkedin,created_at
"Barcelona Dev Solutions","https://barcelonadev.com","info@barcelonadev.com","+34933123456","/contact","https://linkedin.com/company/barcelona-dev","2026-03-11 14:23:45"
"CodeCraft Barcelona","https://codecraft-bcn.com","info@codecraft-bcn.com","+34932234567","/contacto","https://linkedin.com/company/codecraft-barcelona","2026-03-11 14:24:12"
"Digital Makers","https://digital-makers.es","hello@digital-makers.es","+34934345678","/contact","https://linkedin.com/company/digital-makers-barcelona","2026-03-11 14:24:38"
"Software House Barcelona","https://softwarehouse-bcn.com","info@softwarehouse-bcn.com","+34931234567",null,"https://linkedin.com/company/software-house-bcn","2026-03-11 14:28:15"
"Tech Innovators BCN","https://tech-innovators.com","contact@tech-innovators.com","+34935456789","/contact-us","https://linkedin.com/company/tech-innovators-bcn","2026-03-11 14:29:42"
... (23 más)
```

---

## 📊 RESUMEN VISUAL

```
╔══════════════════════════════════════════════════════════════════╗
║                     PROCESO COMPLETO                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  INPUT                                                           ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ "software development agencies in Barcelona"               │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                            ↓                                     ║
║  FASE 1: BÚSQUEDA (2-3 min)                                     ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ Google:      12 resultados                                 │ ║
║  │ Bing:         9 resultados                                 │ ║
║  │ DuckDuckGo:   6 resultados                                 │ ║
║  │ Google Maps:  8 negocios                                   │ ║
║  │ ────────────────────────────                               │ ║
║  │ TOTAL:       35 fuentes                                    │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                            ↓                                     ║
║  FASE 2: SCRAPING (6-7 min)                                     ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ Sitio 1: ✓ 4 emails, 4 teléfonos                          │ ║
║  │ Sitio 2: ✓ 2 emails, 3 teléfonos                          │ ║
║  │ Sitio 3: ✓ 3 emails, 3 teléfonos                          │ ║
║  │ ...                                                         │ ║
║  │ Sitio 27: ✓ 2 emails, 3 teléfonos                         │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                            ↓                                     ║
║  FASE 3: VALIDACIÓN (30s)                                       ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ ✓ Validar formato emails                                   │ ║
║  │ ✓ Normalizar teléfonos                                     │ ║
║  │ ✓ Eliminar duplicados                                      │ ║
║  │ ✓ Guardar en base de datos                                 │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                            ↓                                     ║
║  OUTPUT                                                          ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ 📊 28 empresas con contactos completos                     │ ║
║  │ 📧 56 emails totales                                       │ ║
║  │ 📞 84 teléfonos totales                                    │ ║
║  │ ⏱️ 9m 45s tiempo total                                     │ ║
║  │ ✅ 80% tasa de éxito                                       │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                            ↓                                     ║
║  ACCIONES DISPONIBLES                                            ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ 📋 Copiar contactos                                        │ ║
║  │ 📤 Exportar CSV                                            │ ║
║  │ 🗑️ Eliminar empresas                                       │ ║
║  │ 🔄 Nueva búsqueda                                          │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## ✅ CONCLUSIÓN

**De 20+ horas de trabajo manual → 10 minutos automáticos**

### Lo que hiciste:
1. Escribiste una consulta
2. Hiciste 1 click

### Lo que el sistema hizo:
1. Buscó en 4 fuentes (Google, Bing, DuckDuckGo, Maps)
2. Encontró 35 empresas
3. Exploró ~140 páginas web (4-5 por empresa)
4. Extrajo ~140 contactos
5. Validó y limpió todos los datos
6. Guardó en base de datos
7. Generó CSV exportable

**TODO AUTOMÁTICO** 🚀
