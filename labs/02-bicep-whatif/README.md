# Lab 03: Bicep Templates with What-If — Preview Before You Deploy ($0)

> **The Blueprint Preview** — Write Azure infrastructure as code, preview changes, and never deploy blindly.

---

## 🎯 Objective

Write a Bicep template that creates an Azure Storage Account and App Service Plan, then use `what-if` to preview what would happen — all without deploying anything or spending a cent.

**The Analogy:** Bicep `what-if` is like a mirror in a fitting room. You see exactly how the outfit looks before you buy it. You can change your mind as many times as you want — the shop keeper (Azure) never charges you for looking.

---

## 💰 Cost Warning

- **$0.00** — what-if does NOT deploy anything
- what-if only shows what WOULD happen
- No resources are created, modified, or deleted

---

## 📋 Prerequisites

- Lab 00 completed (Azure CLI + Bicep installed)
- An Azure account (free tier is fine) — needed only for what-if authentication
- If you do not have an Azure account, you can still compile and validate Bicep locally

---

## 🔧 Step-by-Step

### Step 1: Create Lab Folder

```bash
mkdir labs/02-bicep-whatif
cd labs/02-bicep-whatif
```

**Expected Output:**
```
(nothing — you are now in the folder)
```

---

### Step 2: Write a Bicep Template

```bash
code main.bicep
```

Paste:
```bicep
@description('Name of the storage account')
param storageAccountName string = 'blueprintstorage'

@description('Location for all resources')
param location string = 'eastus'

@description('Storage account SKU')
param storageSku string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageSku
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

output storageAccountName string = storageAccount.name
output storageAccountId string = storageAccount.id
output primaryEndpoint string = storageAccount.properties.primaryEndpoints.blob
```

Save: `Ctrl + S`

---

### Step 3: Validate the Bicep Template (Syntax Check)

```bash
az bicep build --file main.bicep
```

**Expected Output:**
```
(no output means success — the template compiled without errors)
```

If there is a syntax error, you will see:
```
Error BCP001: The string was missing the closing quote.
```

Fix the error, save, and rebuild.

---

### Step 4: Login to Azure (Only for what-if)

```bash
az login
```

**Expected Output:**
```
[
  {
    "cloudName": "AzureCloud",
    "id": "your-subscription-id",
    "name": "your-subscription-name",
    "state": "Enabled",
    ...
  }
]
```

> ⚠️ This opens a browser window. Log in with your Azure account. You can use the free tier ($200 credit, no charges for what-if).

---

### Step 5: Run What-If (Preview Changes — NO Deployment)

```bash
az deployment group what-if \
  --resource-group test-rg \
  --template-file main.bicep \
  --parameters storageAccountName=blueprintstorage001
```

**Expected Output:**
```
Note: The result may contain false positive warnings (see documentation).
Resource and property changes are indicated with these symbols:
  + Create

The deployment will update the following scope:

Scope: ResourceGroup

  + Microsoft.Storage/storageAccounts/blueprintstorage001 [2023-05-01]
      + apiVersion:                    "2023-05-01"
      + kind:                          "StorageV2"
      + location:                      "eastus"
      + name:                          "blueprintstorage001"
      + properties.accessTier:        "Hot"
      + properties.minimumTlsVersion: "TLS1_2"
      + properties.supportsHttpsTrafficOnly: true
      + sku.name:                      "Standard_LRS"

Resource changes: 1 to create.
```

The `+` symbol means "this resource WILL be created". No resource was actually created — this is just a preview.

---

### Step 6: Add an App Service Plan to the Template

Edit `main.bicep` and add:
```bicep
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'blueprint-plan'
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
    size: 'F1'
    family: 'F'
  }
  properties: {
    reserved: true
  }
}

output appServicePlanName string = appServicePlan.name
```

Save: `Ctrl + S`

---

### Step 7: Run What-If Again (See Both Resources)

```bash
az bicep build --file main.bicep
az deployment group what-if \
  --resource-group test-rg \
  --template-file main.bicep \
  --parameters storageAccountName=blueprintstorage001
```

**Expected Output:**
```
  + Microsoft.Storage/storageAccounts/blueprintstorage001 [2023-05-01]
      + apiVersion:               "2023-05-01"
      ...

  + Microsoft.Web/serverfarms/blueprint-plan [2023-12-01]
      + apiVersion:               "2023-12-01"
      + name:                     "blueprint-plan"
      + sku.name:                 "F1"
      + sku.tier:                 "Free"
      ...

Resource changes: 2 to create.
```

---

### Step 8: Change a Parameter and See What-If Detect It

```bash
az deployment group what-if \
  --resource-group test-rg \
  --template-file main.bicep \
  --parameters storageAccountName=blueprintstorage001 storageSku=Standard_GRS
```

**Expected Output:**
```
  + Microsoft.Storage/storageAccounts/blueprintstorage001 [2023-05-01]
      ...
      + sku.name:                 "Standard_GRS"
      ...
```

Notice it now shows `Standard_GRS` (geo-redundant) instead of `Standard_LRS`. What-if catches every parameter change before you deploy.

---

## ✅ What You Learned

1. Bicep is Azure's native Infrastructure as Code language
2. `az bicep build` validates syntax locally (no Azure account needed)
3. `what-if` previews changes without deploying anything
4. The `+` symbol means create, `~` means modify, `-` means delete
5. You can iterate on infrastructure design infinitely at zero cost

---

## 🧹 Cleanup

No cleanup needed — nothing was deployed.

```bash
cd ..
```

---

## 🚀 Production Note

In production:
1. Use Bicep modules to organize infrastructure (like Terraform modules)
2. Deploy with `az deployment group create` (not just what-if)
3. Store Bicep templates in a Git repo and deploy via GitHub Actions
4. Use Azure CLI parameter files (.bicepparam) for environment-specific values
5. Tag all resources for cost tracking and ownership
