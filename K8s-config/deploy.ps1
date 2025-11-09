param(
    [switch]$SkipBuild,
    [switch]$DryRun,
    [string]$ManifestDir = ".."
)

# Stop on first error
$ErrorActionPreference = 'Stop'

Write-Host "Deploy script starting..." -ForegroundColor Cyan

# Helper: check command exists
function Command-Exists($cmd) {
    $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

if (-not (Command-Exists minikube)) {
    Write-Host "Warning: 'minikube' not found in PATH. If you're not using minikube this is fine." -ForegroundColor Yellow
}
if (-not (Command-Exists kubectl)) {
    Write-Host "Error: 'kubectl' is required but not found in PATH." -ForegroundColor Red
    exit 1
}

# Optionally build images if requested and if build paths exist
if (-not $SkipBuild) {
    Write-Host "Attempting to build images (SkipBuild=false)..." -ForegroundColor Cyan

    $builds = @(
        @{Tag='shell-app:latest'; Path='..\shell-app\UI'},
        @{Tag='products-service:latest'; Path='..\shell-app\backend\products-service'},
        @{Tag='auth-app-ui:latest'; Path='..\user-management\UI'},
        @{Tag='auth-service:latest'; Path='..\user-management\backend\auth-service'}
    )

    foreach ($b in $builds) {
        if (Test-Path $b.Path) {
            Write-Host "Building image $($b.Tag) from $($b.Path)" -ForegroundColor Cyan
            docker build -t $($b.Tag) $($b.Path)
        }
        else {
            Write-Host "Build path not found for $($b.Tag): $($b.Path) - skipping" -ForegroundColor Yellow
        }
    }

    if (Command-Exists minikube) {
        Write-Host "Loading built images into Minikube..." -ForegroundColor Cyan
        foreach ($b in $builds) {
            try {
                minikube image load $($b.Tag) | Out-Null
            }
            catch {
                Write-Host "Warning: failed to load image $($b.Tag) into minikube: $_" -ForegroundColor Yellow
            }
        }
    }
}
else {
    Write-Host "Skipping image builds (SkipBuild=true)." -ForegroundColor Cyan
}

# Prepare kubectl apply options
$applyArgs = @('apply')
if ($DryRun) { $applyArgs += '--dry-run=client' }

# Ordered manifest list - update or extend as new manifests appear
$orderedManifests = @(
    'mongodb-claim1-persistentvolumeclaim.yaml',
    'mongodb-data-persistentvolumeclaim.yaml',
    'mongodb-deployment.yaml',
    'mongodb-service.yaml',
    'auth-service-deployment.yaml',
    'auth-service-service.yaml',
    'products-service-deployment.yaml',
    'products-service-service.yaml',
    'shell-app-deployment.yaml',
    'shell-app-service.yaml',
    'auth-app-ui-deployment.yaml',
    'auth-app-ui-service.yaml'
)

Write-Host "Applying Kubernetes manifests from '$ManifestDir'..." -ForegroundColor Cyan

foreach ($m in $orderedManifests) {
    $full = Join-Path -Path $ManifestDir -ChildPath $m
    if (Test-Path $full) {
        Write-Host "Applying $m" -ForegroundColor Cyan
        $args = @($applyArgs + ("-f", $full))
        & kubectl @args
    }
    else {
        Write-Host "Manifest not found, skipping: $m" -ForegroundColor DarkGray
    }
}

# Also apply any other yaml files that are present but not listed above
$allYaml = Get-ChildItem -Path $ManifestDir -Filter *.yaml -File | ForEach-Object { $_.Name }
$remaining = $allYaml | Where-Object { $orderedManifests -notcontains $_ }
if ($remaining.Count -gt 0) {
    Write-Host "Applying remaining manifests..." -ForegroundColor Cyan
    foreach ($r in $remaining) {
        $full = Join-Path -Path $ManifestDir -ChildPath $r
        Write-Host "Applying $r" -ForegroundColor Cyan
        $args = @($applyArgs + ("-f", $full))
        & kubectl @args
    }
}

Write-Host "Manifests applied." -ForegroundColor Green

# Optionally restart deployments to pick up new images (commented out by default)
 Write-Host "Restarting deployments to pick up new images..." -ForegroundColor Cyan
 kubectl rollout restart deployment --all

Write-Host "Deployment script finished." -ForegroundColor Green

if (Command-Exists minikube) {
    Write-Host "Minikube service list:" -ForegroundColor Cyan
    minikube service list
}
