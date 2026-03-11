/**
 * DEMO: Cómo Funciona el Sistema de Scraping
 * 
 * Este script demuestra el funcionamiento completo del sistema:
 * 1. Búsqueda inteligente en internet
 * 2. Scraping profundo de sitios web
 * 3. Extracción de emails y teléfonos
 * 4. Integración con Google Maps
 */

const { SearchService } = require('./backend/dist/services/searchService');
const { WebScraper } = require('./backend/dist/scrapers/webScraper');
const { GoogleMapsService } = require('./backend/dist/services/googleMapsService');

async function runDemo() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   🚀 DEMO: Sistema de Scraping de Contactos Empresariales  ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Configuración del demo
  const query = 'software companies in Barcelona';
  const maxResults = 3; // Limitar a 3 para el demo

  try {
    // ═══════════════════════════════════════════════════════════
    // FASE 1: BÚSQUEDA INTELIGENTE EN INTERNET
    // ═══════════════════════════════════════════════════════════
    console.log('📍 FASE 1: BÚSQUEDA INTELIGENTE EN INTERNET');
    console.log('─'.repeat(60));
    console.log(`Query: "${query}"\n`);

    const searchService = new SearchService();
    console.log('⏳ Buscando en Google, Bing y DuckDuckGo...\n');
    
    const searchResults = await searchService.searchCompanies(query, 'Spain');
    const urls = await searchService.extractUrls(searchResults);

    console.log(`\n✅ Resultados de búsqueda:`);
    console.log(`   - URLs encontradas: ${urls.length}`);
    console.log(`   - Mostrando primeras ${Math.min(maxResults, urls.length)}:\n`);

    urls.slice(0, maxResults).forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });

    // ═══════════════════════════════════════════════════════════
    // FASE 2: SCRAPING PROFUNDO DE CADA SITIO
    // ═══════════════════════════════════════════════════════════
    console.log('\n\n📍 FASE 2: SCRAPING PROFUNDO DE SITIOS WEB');
    console.log('─'.repeat(60));

    const scraper = new WebScraper();
    await scraper.init();

    const scrapedData = [];

    for (let i = 0; i < Math.min(maxResults, urls.length); i++) {
      const url = urls[i];
      console.log(`\n🔍 Scraping ${i + 1}/${Math.min(maxResults, urls.length)}: ${url}`);
      console.log('   ⏳ Analizando página principal...');
      console.log('   ⏳ Explorando páginas de contacto...');
      console.log('   ⏳ Buscando en HTML, JSON-LD, meta tags...\n');

      try {
        const data = await scraper.scrapeWebsite(url);
        
        if (data) {
          scrapedData.push(data);
          
          console.log('   ╔═══════════════════════════════════════════════════╗');
          console.log(`   ║ ✅ DATOS EXTRAÍDOS                                 ║`);
          console.log('   ╚═══════════════════════════════════════════════════╝');
          console.log(`   📌 Empresa: ${data.name}`);
          console.log(`   🌐 Website: ${data.website}`);
          console.log(`   📧 Email: ${data.email || '❌ No encontrado'}`);
          console.log(`   📞 Teléfono: ${data.phone || '❌ No encontrado'}`);
          console.log(`   📄 Página contacto: ${data.contact_page || 'N/A'}`);
          console.log(`   💼 LinkedIn: ${data.linkedin || 'N/A'}`);
          
          // Mostrar estado
          const hasEmail = data.email ? '✅' : '❌';
          const hasPhone = data.phone ? '✅' : '❌';
          console.log(`\n   Estado: Email ${hasEmail} | Teléfono ${hasPhone}`);
        } else {
          console.log('   ❌ No se pudo extraer información de este sitio');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }

    await scraper.close();

    // ═══════════════════════════════════════════════════════════
    // FASE 3: BÚSQUEDA EN GOOGLE MAPS (OPCIONAL)
    // ═══════════════════════════════════════════════════════════
    console.log('\n\n📍 FASE 3: BÚSQUEDA EN GOOGLE MAPS');
    console.log('─'.repeat(60));
    console.log('⏳ Buscando negocios adicionales en Google Maps...\n');

    try {
      const mapsService = new GoogleMapsService();
      const mapsResults = await mapsService.searchGoogleMaps(query, 'Spain');

      console.log(`✅ Encontrados ${mapsResults.length} negocios en Google Maps`);
      
      if (mapsResults.length > 0) {
        console.log('\nPrimeros 3 resultados de Google Maps:\n');
        mapsResults.slice(0, 3).forEach((business, index) => {
          console.log(`   ${index + 1}. ${business.name}`);
          console.log(`      📞 ${business.phone || 'N/A'}`);
          console.log(`      🌐 ${business.website || 'N/A'}`);
          console.log(`      📍 ${business.address || 'N/A'}`);
          if (business.rating) {
            console.log(`      ⭐ ${business.rating}/5`);
          }
          console.log('');
        });
      }
    } catch (error) {
      console.log(`⚠️  Google Maps: ${error.message}`);
    }

    // ═══════════════════════════════════════════════════════════
    // RESUMEN FINAL
    // ═══════════════════════════════════════════════════════════
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   📊 RESUMEN FINAL                                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const companiesWithEmail = scrapedData.filter(d => d.email).length;
    const companiesWithPhone = scrapedData.filter(d => d.phone).length;
    const companiesWithBoth = scrapedData.filter(d => d.email && d.phone).length;
    const successRate = ((companiesWithBoth / scrapedData.length) * 100).toFixed(1);

    console.log(`   Total de empresas procesadas: ${scrapedData.length}`);
    console.log(`   ├─ Con email: ${companiesWithEmail} (${((companiesWithEmail/scrapedData.length)*100).toFixed(1)}%)`);
    console.log(`   ├─ Con teléfono: ${companiesWithPhone} (${((companiesWithPhone/scrapedData.length)*100).toFixed(1)}%)`);
    console.log(`   └─ Con ambos: ${companiesWithBoth} (${successRate}%)`);
    console.log('');

    console.log('   🎯 Capacidades del sistema:');
    console.log('   ✓ Búsqueda multi-motor (Google + Bing + DuckDuckGo)');
    console.log('   ✓ Crawling profundo (hasta 8 páginas por sitio)');
    console.log('   ✓ Extracción multi-capa (texto, HTML, JSON-LD, meta tags)');
    console.log('   ✓ Integración con Google Maps');
    console.log('   ✓ Validación y normalización de datos');
    console.log('   ✓ Soporte para emails ofuscados');
    console.log('   ✓ 10+ formatos de teléfono');
    console.log('');

    // ═══════════════════════════════════════════════════════════
    // DATOS EXTRAÍDOS PARA USAR
    // ═══════════════════════════════════════════════════════════
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   💾 DATOS LISTOS PARA EXPORTAR                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('   Empresas encontradas:\n');
    scrapedData.forEach((company, index) => {
      console.log(`   ${index + 1}. ${company.name}`);
      if (company.email) console.log(`      ✉️  ${company.email}`);
      if (company.phone) console.log(`      📱 ${company.phone}`);
      console.log('');
    });

    console.log('\n✅ Demo completado exitosamente!\n');
    console.log('💡 Tip: En producción, estos datos se guardarían en PostgreSQL');
    console.log('    y estarían disponibles para exportar a CSV desde el dashboard.\n');

  } catch (error) {
    console.error('\n❌ Error en el demo:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar el demo
console.log('\n');
runDemo().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
