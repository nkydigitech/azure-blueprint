# Azure Blueprint

A static, beginner-to-hero Azure learning platform designed for GitHub Pages.

## Included

- Azure fundamentals and architecture
- Networking, compute, storage, databases
- Microsoft Entra ID, RBAC, managed identity and Key Vault
- DevOps, GitHub Actions and Infrastructure as Code concepts
- Monitoring, reliability and cost management
- Windows setup guidance
- Azure CLI Command Center
- 4 progressive hands-on labs
- Browser-based assessment
- Lab and capstone rubrics
- Troubleshooting center
- Searchable glossary
- Career roadmap
- Browser localStorage progress tracking
- Responsive UI and light/dark theme toggle

## Run locally

No build system is required.

### Option 1: open the file

Open `index.html` in a browser.

### Option 2: use a local web server

PowerShell:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages

1. Create a GitHub repository, for example `azure-blueprint`.
2. Copy the contents of this folder into the repository.
3. Commit and push:

```powershell
git init
git add .
git commit -m "Build Azure Blueprint learning platform"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/azure-blueprint.git
git push -u origin main
```

4. In GitHub: **Settings → Pages**.
5. Select **Deploy from a branch**.
6. Select `main` and `/ (root)`.
7. Save and wait for GitHub Pages to publish.

## Important content note

Azure service capabilities, pricing, quotas, free-tier terms, CLI syntax and supported runtimes can change. Before teaching or running a lab, verify time-sensitive details against current Microsoft documentation.

## Suggested learner workflow

Start Here → Fundamentals → Architecture → Networking → Compute → Storage → Databases → Identity & Security → DevOps → Monitoring → Cost → CLI → Labs → Assessments → Capstone → Career.

## License

Add the license you want for your educational project before publishing if this repository will be shared publicly.
