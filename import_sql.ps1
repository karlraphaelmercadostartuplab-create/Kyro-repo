Set-StrictMode -Version Latest
$repo = "C:\xampp\htdocs\repo\Kyro-repo"
Set-Location $repo
$timestamp = (Get-Date -Format "yyyyMMddHHmmss")
if (Test-Path ".env") { Copy-Item .env ".env.bak_$timestamp" }
if (Test-Path "database\database.sqlite") { Copy-Item "database\database.sqlite" "database\database.sqlite.bak_$timestamp" }
$mysql = "C:\\xampp\\mysql\\bin\\mysql.exe"
$dump = "C:/Users/Dansa/Downloads/kyro_db (4).sql"
Write-Host "Using MySQL client: $mysql"
if (-Not (Test-Path $mysql)) { Write-Error "MySQL client not found at $mysql"; exit 1 }
# Create database if missing
& $mysql -u root -e "CREATE DATABASE IF NOT EXISTS `kyro_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create database"; exit 1 }
# Import dump using mysql's source command
& $mysql -u root kyro_db -e "source $dump"
if ($LASTEXITCODE -ne 0) { Write-Error "Import failed"; exit 1 }
# Update .env with DB connection settings (replace or append)
$envPath = ".env"
#$text = Get-Content $envPath -Raw
$text = ""
if (Test-Path $envPath) { $text = Get-Content $envPath -Raw } else { $text = "" }
$replacements = @{
    'DB_CONNECTION'='mysql';
    'DB_HOST'='127.0.0.1';
    'DB_PORT'='3306';
    'DB_DATABASE'='kyro_db';
    'DB_USERNAME'='root';
    'DB_PASSWORD'='';
}
foreach ($k in $replacements.Keys) {
    if ($text -match "(?m)^$k=") {
        $text = $text -replace "(?m)^$k=.*", "$k=$($replacements[$k])"
    } else {
        if ($text -ne "" -and -not $text.EndsWith("`n")) { $text += "`n" }
        $text += "$k=$($replacements[$k])`n"
    }
}
$text | Out-File -Encoding utf8 $envPath
# Clear caches and verify
php artisan config:clear
php artisan cache:clear
php artisan tinker --execute="dump(DB::table('users')->count());"
Write-Host "Import script completed."