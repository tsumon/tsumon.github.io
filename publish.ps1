# Publish this static site to GitHub Pages.
# Requires: git, GitHub CLI (https://cli.github.com/)
# Usage:  .\publish.ps1
#         .\publish.ps1 -User yourname
# Creates <username>.github.io  ->  https://<username>.github.io/

param(
  [string]$User = "",
  [string]$Repo = ""
)

Set-Location -Path $PSScriptRoot

function Need($cmd, $hint) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    Write-Host "Missing $cmd. $hint" -ForegroundColor Red
    exit 1
  }
}

Need "git" "Install Git: https://git-scm.com/download/win"
Need "gh"  "Install GitHub CLI: https://cli.github.com/  then run: gh auth login"

gh auth status 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Not logged in. Starting gh auth login..." -ForegroundColor Yellow
  gh auth login
}

if (-not $User) {
  $User = (gh api user --jq ".login").Trim()
}
if (-not $User) {
  Write-Host "Cannot read GitHub username. Run: .\publish.ps1 -User YOUR_USERNAME" -ForegroundColor Red
  exit 1
}
if (-not $Repo) { $Repo = "$User.github.io" }

$email = git config --get user.email 2>$null
if (-not $email) {
  git config user.email "$User@users.noreply.github.com"
  git config user.name $User
}

if (-not (Test-Path ".git")) {
  git init
}
git checkout -B main

git add -A
$pending = git status --porcelain
if ($pending) {
  git commit -m "Publish Transformer illustrated guide"
}

$origin = git remote get-url origin 2>$null
if (-not $origin) {
  gh repo create "$User/$Repo" --public --source=. --remote=origin --push
  if ($LASTEXITCODE -ne 0) {
    git remote add origin "https://github.com/$User/$Repo.git" 2>$null
    git push -u origin HEAD:main
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
} else {
  git push -u origin HEAD:main
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

gh api "repos/$User/$Repo/pages" 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  gh api --method POST "repos/$User/$Repo/pages" `
    -H "Accept: application/vnd.github+json" `
    -f "source[branch]=main" `
    -f "source[path]=/"
}

if ($Repo -eq "$User.github.io") {
  $url = "https://$User.github.io/"
} else {
  $url = "https://$User.github.io/$Repo/"
}
Write-Host ""
Write-Host "Pushed. Pages is usually live in 1-2 minutes:" -ForegroundColor Green
Write-Host "  $url"
Write-Host "Repo: https://github.com/$User/$Repo"
