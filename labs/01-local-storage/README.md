# Lab 01: Blob Storage with Azurite — Upload, List, Download ($0)

> **The Filing Cabinet** — Store files in Azure Blob Storage locally. Same commands, same workflow, zero bill.

---

## 🎯 Objective

Create a local Azure Storage account using Azurite, upload multiple files, list them, download them, and delete them — all without an Azure account.

**The Analogy:** Blob storage is like a big filing cabinet in the cloud. Each drawer is a container, each folder is a blob. You can put files in, find them later, and take them out — all from the command line.

---

## 💰 Cost Warning

- **$0.00** — Azurite runs locally in Docker

---

## 📋 Prerequisites

- Lab 00 completed (Azure CLI + Azurite installed)
- Docker running

---

## 🔧 Step-by-Step

### Step 1: Start Azurite

```bash
docker run -d --name azurite -p 10000:10000 -p 10001:10001 -p 10002:10002 \
  mcr.microsoft.com/azure-storage/azurite
```

**Expected Output:**
```
a1b2c3d4e5f6...
```

> ⚠️ If you get "name already in use" error, run `docker rm -f azurite` first.

---

### Step 2: Set Connection String Variable

```bash
AZURE_CONNECTION="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;QueueEndpoint=http://localhost:10001/devstoreaccount1;TableEndpoint=http://localhost:10002/devstoreaccount1;"
```

**Expected Output:**
```
(nothing — variable is set in your shell)
```

---

### Step 3: Create Multiple Containers

```bash
az storage container create --name images --connection-string "$AZURE_CONNECTION"
az storage container create --name documents --connection-string "$AZURE_CONNECTION"
az storage container create --name backups --connection-string "$AZURE_CONNECTION"
```

**Expected Output (each):**
```
{
  "created": true
}
```

List all containers:
```bash
az storage container list --connection-string "$AZURE_CONNECTION" --output table
```

**Expected Output:**
```
Name         LastModified
-----------  -------------------------
backups      2026-08-13T10:00:00Z
documents    2026-08-13T10:00:00Z
images       2026-08-13T10:00:00Z
```

---

### Step 4: Upload Multiple Files

```bash
# Create test files
echo "Invoice #001" > invoice.txt
echo "Employee data" > employees.csv
echo "<html><body>Hello</body></html>" > index.html

# Upload each to different containers
az storage blob upload --container-name documents --name invoice.txt --file invoice.txt --connection-string "$AZURE_CONNECTION"
az storage blob upload --container-name documents --name employees.csv --file employees.csv --connection-string "$AZURE_CONNECTION"
az storage blob upload --container-name images --name index.html --file index.html --connection-string "$AZURE_CONNECTION"
```

**Expected Output (each):**
```
{
  "etag": "\"0x8D9...\""
}
```

---

### Step 5: List All Blobs in a Container

```bash
az storage blob list --container-name documents --connection-string "$AZURE_CONNECTION" --output table
```

**Expected Output:**
```
Name           BlobType    Length    ContentType
-------------  ----------  --------  -----------
employees.csv  BlockBlob   14        text/csv
invoice.txt    BlockBlob   13        text/plain
```

---

### Step 6: Download a Blob

```bash
az storage blob download --container-name documents --name invoice.txt --file downloaded-invoice.txt --connection-string "$AZURE_CONNECTION"
```

**Expected Output:**
```
{
  "content": "Invoice #001\n"
}
```

Verify:
```bash
cat downloaded-invoice.txt
```

**Expected Output:**
```
Invoice #001
```

---

### Step 7: Delete a Blob

```bash
az storage blob delete --container-name documents --name employees.csv --connection-string "$AZURE_CONNECTION"
```

**Expected Output:**
```
{} (empty response means success)
```

Verify deletion:
```bash
az storage blob list --container-name documents --connection-string "$AZURE_CONNECTION" --output table
```

**Expected Output:**
```
Name          BlobType    Length    ContentType
------------  ----------  --------  -----------
invoice.txt   BlockBlob   13        text/plain
```

---

## ✅ What You Learned

1. Azurite provides a complete local Azure Storage experience
2. Containers organize blobs like folders organize files
3. The connection-string approach is cleaner than passing individual parameters
4. Upload, list, download, and delete are the core blob operations
5. Azure CLI works identically with Azurite and real Azure

---

## 🧹 Cleanup

```bash
docker stop azurite
docker rm azurite
rm invoice.txt employees.csv index.html downloaded-invoice.txt
```

---

## 🚀 Production Note

In production:
1. Use Azure Blob Storage with tiering (Hot, Cool, Archive)
2. Enable lifecycle management to auto-delete or archive old blobs
3. Use SAS tokens for time-limited access instead of account keys
4. Enable soft delete to recover accidentally deleted blobs
5. Set up CDN in front of blob storage for global content delivery
