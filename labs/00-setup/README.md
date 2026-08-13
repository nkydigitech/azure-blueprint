# Lab 00: Setup — Azure CLI + Azurite (Free Local Environment)

> **Your Practice Cloud** — Set up Azure tools locally without an Azure account or credit card.

---

## 🎯 Objective

Install the Azure CLI and Azurite (Azure Storage emulator) on your machine. At the end, you will have a working local Azure development environment at zero cost.

**The Analogy:** Setting up Azurite is like building a practice kitchen in your house. You cook the same meals, use the same recipes, but nothing goes to the real restaurant (Azure Cloud). No bill, no risk, full learning.

---

## 💰 Cost Warning

- **$0.00** — Everything runs locally
- No Azure account needed
- No credit card needed

---

## 📋 Prerequisites

- A computer running Windows, Mac, or Linux
- VS Code installed
- Docker running (for Azurite)

---

## 🔧 Step-by-Step

### Step 1: Install Azure CLI

**Windows (using winget):**
```bash
winget install -e Microsoft.AzureCLI
```

**Expected Output:**
```
Successfully installed Microsoft.AzureCLI
```

**Mac (using Homebrew):**
```bash
brew install azure-cli
```

**Expected Output:**
```
==> Pouring azure-cli--2.x.x.bottle.tar.gz
🍺  azure-cli was successfully installed!
```

**Linux (Ubuntu/Debian):**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

**Expected Output:**
```
Reading package lists... Done
azure-cli (2.x.x) is now installed.
```

---

### Step 2: Verify Azure CLI

```bash
az --version
```

**Expected Output:**
```
azure-cli                         2.62.0
core                              2.62.0
telemetry                          1.1.0
Extensions:
  ...
```

---

### Step 3: Install Bicep (Azure's IaC Language)

```bash
az bicep install
```

**Expected Output:**
```
(Installed successfully. Tool path: ~/.azure/bin/bicep)
```

Verify:
```bash
az bicep version
```

**Expected Output:**
```
Bicep CLI version 0.26.x
```

---

### Step 4: Install Azurite (Azure Storage Emulator) via Docker

```bash
docker run -d --name azurite -p 10000:10000 -p 10001:10001 -p 10002:10002 \
  mcr.microsoft.com/azure-storage/azurite
```

**Expected Output:**
```
Unable to find image 'mcr.microsoft.com/azure-storage/azurite' locally
latest: Pulling from azure-storage/azurite
...
Status: Downloaded newer image for mcr.microsoft.com/azure-storage/azurite:latest
a1b2c3d4e5f6...
```

Verify it is running:
```bash
docker ps | grep azurite
```

**Expected Output:**
```
a1b2c3d4   mcr.microsoft.com/azure-storage/azurite   Up 5 seconds   0.0.0.0:10000-10002->10000-10002/tcp   azurite
```

---

### Step 5: Connect to Azurite (Test Local Storage)

```bash
# Create a test container using Azure CLI against local Azurite
az storage container create \
  --name test-container \
  --account-name devstoreaccount1 \
  --account-key Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw== \
  --blob-endpoint http://localhost:10000/devstoreaccount1
```

**Expected Output:**
```
{
  "created": true
}
```

---

### Step 6: Upload a Test File

```bash
echo "Hello from Azurite!" > test.txt

az storage blob upload \
  --container-name test-container \
  --name test.txt \
  --file test.txt \
  --account-name devstoreaccount1 \
  --account-key Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw== \
  --blob-endpoint http://localhost:10000/devstoreaccount1
```

**Expected Output:**
```
{
  "etag": "\"0x8D9...\""
}
```

---

### Step 7: List Blobs to Verify

```bash
az storage blob list \
  --container-name test-container \
  --account-name devstoreaccount1 \
  --account-key Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw== \
  --blob-endpoint http://localhost:10000/devstoreaccount1 \
  --output table
```

**Expected Output:**
```
Name       BlobType    Length    ContentType
---------  ----------  --------  -----------
test.txt   BlockBlob   23        text/plain
```

---

## ✅ What You Learned

1. Azure CLI works locally without an Azure account
2. Bicep is Azure's Infrastructure as Code language (like Terraform for Azure)
3. Azurite emulates Azure Storage locally in Docker at zero cost
4. You can create containers and upload files to local Azurite
5. The devstoreaccount1 is the universal local storage account name

---

## 🧹 Cleanup

```bash
# Stop and remove Azurite container
docker stop azurite
docker rm azurite

# Remove test file
rm test.txt
```

**Expected Output:**
```
azurite
azurite
```

---

## 🚀 Production Note

In production, you would:
1. Use a real Azure Storage account instead of Azurite
2. Store the connection string in Azure Key Vault
3. Use Managed Identities instead of account keys
4. Enable soft delete and versioning on the storage account
