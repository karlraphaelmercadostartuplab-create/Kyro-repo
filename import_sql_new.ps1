Set-StrictMode -Version Latest
$repo = "C:\xampp\htdocs\repo\Kyro-repo"
Set-Location $repo
$timestamp = (Get-Date -Format "yyyyMMddHHmmss")
if (Test-Path ".env") { Copy-Item .env ".env.bak_$timestamp" }
$mysql = "C:\\xampp\\mysql\\bin\\mysql.exe"
$dump = "C:/Users/Dansa/Downloads/kyro_db (4).sql"
$newDb = "kyro_db_imported"
Write-Host "Importing into database: $newDb"
if (-Not (Test-Path $mysql)) { Write-Error "MySQL client not found at $mysql"; exit 1 }
& $mysql -u root -e "CREATE DATABASE IF NOT EXISTS `$newDb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create database $newDb"; exit 1 }
& $mysql -u root $newDb -e "source $dump"
if ($LASTEXITCODE -ne 0) { Write-Error "Import into $newDb failed"; exit 1 }
# Update .env to use new DB name (non-destructive)
$envPath = ".env"
$text = ""
if (Test-Path $envPath) { $text = Get-Content $envPath -Raw } else { $text = "" }
if ($text -match "(?m)^DB_CONNECTION=") { $text = $text -replace "(?m)^DB_CONNECTION=.*", "DB_CONNECTION=mysql" } else { $text += "`nDB_CONNECTION=mysql`n" }
if ($text -match "(?m)^DB_DATABASE=") { $text = $text -replace "(?m)^DB_DATABASE=.*", "DB_DATABASE=$newDb" } else { $text += "DB_DATABASE=$newDb`n" }
if ($text -match "(?m)^DB_HOST=") { $text = $text -replace "(?m)^DB_HOST=.*", "DB_HOST=127.0.0.1" } else { $text += "DB_HOST=127.0.0.1`n" }
if ($text -match "(?m)^DB_PORT=") { $text = $text -replace "(?m)^DB_PORT=.*", "DB_PORT=3306" } else { $text += "DB_PORT=3306`n" }
if ($text -match "(?m)^DB_USERNAME=") { $text = $text -replace "(?m)^DB_USERNAME=.*", "DB_USERNAME=root" } else { $text += "DB_USERNAME=root`n" }
if ($text -match "(?m)^DB_PASSWORD=") { $text = $text -replace "(?m)^DB_PASSWORD=.*", "DB_PASSWORD=" } else { $text += "DB_PASSWORD=`n" }
$text | Out-File -Encoding utf8 $envPath
php artisan config:clear
php artisan cache:clear
php artisan tinker --execute="dump(DB::table('users')->count());"
Write-Host "Imported into $newDb and switched .env to use it."