# Test del Sistema de Scraping
# Este script simula una búsqueda

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 DEMO: Sistema de Scraping en Acción" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📍 Backend: http://localhost:4000" -ForegroundColor Green
Write-Host "📍 Frontend: http://localhost:3001" -ForegroundColor Green
Write-Host "`n"

Write-Host "🔍 Iniciando búsqueda de prueba..." -ForegroundColor Yellow
Write-Host "Query: 'software companies Barcelona'`n" -ForegroundColor White

# Crear job de scraping
$body = @{
    query = "software companies Barcelona"
    country = "Spain"
} | ConvertTo-Json

Write-Host "⏳ Enviando solicitud al backend..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/scrape" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ Job creado exitosamente!" -ForegroundColor Green
    Write-Host "   Job ID: $($response.id)" -ForegroundColor White
    
    $jobId = $response.id
    
    Write-Host "`n🔄 Monitoreando progreso..." -ForegroundColor Yellow
    
    # Monitorear el job
    $maxAttempts = 30
    $attempt = 0
    
    do {
        Start-Sleep -Seconds 2
        $attempt++
        
        try {
            $jobStatus = Invoke-RestMethod -Uri "http://localhost:4000/api/jobs/$jobId" -Method Get
            
            $status = $jobStatus.job.status
            $resultsCount = $jobStatus.job.results_count
            
            Write-Host "   [$attempt/$maxAttempts] Status: $status | Resultados: $resultsCount" -ForegroundColor Cyan
            
            if ($status -eq "completed") {
                Write-Host "`n✅ ¡Búsqueda completada!" -ForegroundColor Green
                Write-Host "   Empresas encontradas: $resultsCount" -ForegroundColor White
                break
            } elseif ($status -eq "failed") {
                Write-Host "`n❌ Error en la búsqueda" -ForegroundColor Red
                if ($jobStatus.job.error_message) {
                    Write-Host "   Error: $($jobStatus.job.error_message)" -ForegroundColor Red
                }
                break
            }
        } catch {
            Write-Host "   ⚠️  Error al consultar status: $_" -ForegroundColor Yellow
        }
        
    } while ($attempt -lt $maxAttempts)
    
    if ($attempt -ge $maxAttempts) {
        Write-Host "`n⏱️  Timeout alcanzado (este proceso puede tomar varios minutos)" -ForegroundColor Yellow
        Write-Host "   Puedes revisar el progreso en: http://localhost:3001" -ForegroundColor White
    }
    
    # Obtener resultados
    if ($status -eq "completed" -and $resultsCount -gt 0) {
        Write-Host "`n📊 Obteniendo resultados..." -ForegroundColor Yellow
        
        try {
            $results = Invoke-RestMethod -Uri "http://localhost:4000/api/results" -Method Get
            
            Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
            Write-Host "║  EMPRESAS ENCONTRADAS                                  ║" -ForegroundColor Cyan
            Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
            
            $count = 1
            foreach ($company in $results.companies | Select-Object -First 5) {
                Write-Host "  $count. $($company.name)" -ForegroundColor White
                if ($company.email) {
                    Write-Host "     📧 $($company.email)" -ForegroundColor Green
                }
                if ($company.phone) {
                    Write-Host "     📞 $($company.phone)" -ForegroundColor Green
                }
                if ($company.website) {
                    Write-Host "     🌐 $($company.website)" -ForegroundColor Gray
                }
                Write-Host ""
                $count++
            }
            
            if ($results.companies.Count -gt 5) {
                Write-Host "  ... y $($results.companies.Count - 5) empresas más`n" -ForegroundColor Gray
            }
        } catch {
            Write-Host "⚠️  No se pudieron obtener los resultados" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "❌ Error al iniciar búsqueda: $_" -ForegroundColor Red
    Write-Host "`n💡 Asegúrate de que el backend esté ejecutándose en http://localhost:4000" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎯 Accede al Dashboard Web" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   👉 http://localhost:3001`n" -ForegroundColor Green

Write-Host "💡 En el dashboard puedes:" -ForegroundColor Yellow
Write-Host "   • Hacer nuevas búsquedas" -ForegroundColor White
Write-Host "   • Ver todas las empresas encontradas" -ForegroundColor White
Write-Host "   • Copiar emails y teléfonos" -ForegroundColor White
Write-Host "   • Exportar a CSV`n" -ForegroundColor White
