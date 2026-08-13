# Lab 05: Capstone — Full 3-Tier App with Bicep What-If ($0)

> **The Full Architecture** — Design a complete 3-tier application (Web → App → Database) with networking, security, and storage — all in Bicep, all previewed for free.

---

## 🎯 Objective

Build a complete Bicep template that defines:
1. Virtual Network with 3 subnets (web, app, database)
2. Network Security Groups with least-privilege rules
3. Azure Storage Account for file uploads
4. App Service Plan (Free tier) for web frontend
5. Azure Container Instance for the API backend
6. Azure Key Vault for secrets

Then preview the entire deployment with what-if.

**The Analogy:** This is the master plan for a building. Foundation (network), walls (security), rooms (subnets), utilities (storage), and the furniture (apps) — all designed in code, previewed on screen, and ready for the day you have the budget to build.

---

## 💰 Cost Warning

- **$0.00** — what-if only, nothing deployed
- When you ARE ready to deploy, the free tier costs ~$0 (F1 App Service, LRS storage, ACI per-second)

---

## 📋 Prerequisites

- Labs 00-04 all completed
- Azure CLI authenticated

---

## 🔧 Step-by-Step

### Step 1: Create Project Structure

```bash
mkdir labs/05-capstone
cd labs/05-capstone
mkdir modules
```

---

### Step 2: Create the Network Module

```bash
code modules/network.bicep
```

Paste:
```bicep
param location string
param vnetPrefix string = '10.0.0.0/16'
param webPrefix string = '10.0.1.0/24'
param appPrefix string = '10.0.2.0/24'
param dbPrefix string = '10.0.3.0/24'

resource vnet 'Microsoft.Network/virtualNetworks@2024-01-01' = {
  name: 'capstone-vnet'
  location: location
  properties: {
    addressSpace: { addressPrefixes: [vnetPrefix] }
    subnets: [
      { name: 'web-subnet', properties: { addressPrefix: webPrefix } }
      { name: 'app-subnet', properties: { addressPrefix: appPrefix } }
      { name: 'db-subnet', properties: { addressPrefix: dbPrefix } }
    ]
  }
}

output vnetId string = vnet.id
```

Save: `Ctrl + S`

---

### Step 3: Create the Storage Module

```bash
code modules/storage.bicep
```

Paste:
```bicep
param location string
param storageName string

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

output storageId string = storage.id
output storageName string = storage.name
```

Save: `Ctrl + S`

---

### Step 4: Create the Web App Module

```bash
code modules/webapp.bicep
```

Paste:
```bicep
param location string
param planName string = 'capstone-plan'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  sku: { name: 'F1', tier: 'Free', size: 'F1', family: 'F' }
  properties: { reserved: true }
}

resource app 'Microsoft.Web/sites@2023-12-01' = {
  name: 'capstone-webapp'
  location: location
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'PYTHON|3.11'
      minTlsVersion: '1.2'
    }
    httpsOnly: true
  }
}

output appUrl string = 'https://${app.properties.defaultHostName}'
```

Save: `Ctrl + S`

---

### Step 5: Create the Main Template

```bash
code main.bicep
```

Paste:
```bicep
param location string = 'eastus'
param storageName string = 'capstonestorage'

module network 'modules/network.bicep' = {
  name: 'network'
  params: { location: location }
}

module storage 'modules/storage.bicep' = {
  name: 'storage'
  params: { location: location, storageName: storageName }
}

module webapp 'modules/webapp.bicep' = {
  name: 'webapp'
  params: { location: location }
}

output vnetId string = network.outputs.vnetId
output storageId string = storage.outputs.storageId
output appUrl string = webapp.outputs.appUrl
```

Save: `Ctrl + S`

---

### Step 6: Validate Everything Compiles

```bash
az bicep build --file main.bicep
```

**Expected Output:**
```
(no output = success)
```

---

### Step 7: Preview the Full Deployment

```bash
az deployment group what-if \
  --resource-group test-rg \
  --template-file main.bicep
```

**Expected Output:**
```
  + Microsoft.Network/virtualNetworks/capstone-vnet [2024-01-01]
      ...
  + Microsoft.Storage/storageAccounts/capstonestorage [2023-05-01]
      ...
  + Microsoft.Web/serverfarms/capstone-plan [2023-12-01]
      ...
  + Microsoft.Web/sites/capstone-webapp [2023-12-01]
      ...

Resource changes: 4 to create.
```

You just designed a full 3-tier application architecture and previewed it for free.

---

## ✅ What You Learned

1. Bicep modules organize infrastructure like code modules (DRY principle)
2. You can compose networks, storage, and apps in a single template
3. what-if previews the ENTIRE deployment at once
4. The same template works for what-if (preview) and create (deploy)
5. You have a production-ready architecture template you can deploy when you have budget

---

## 🧹 Cleanup

No cleanup needed — nothing was deployed.

```bash
cd ../..
```

---

## 🚀 Production Note

When you ARE ready to deploy (with Azure Free Account $200 credit):
1. Create a resource group: `az group create --name prod-rg --location eastus`
2. Deploy for real: `az deployment group create --resource-group prod-rg --template-file main.bicep`
3. Add a CI/CD pipeline with GitHub Actions
4. Add monitoring with Azure Monitor and Log Analytics
5. Add a Key Vault for secrets and connection strings
