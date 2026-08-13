# Lab 04: Virtual Networks and Security Groups with Bicep What-If ($0)

> **The Fence Before the House** — Design Azure networks and security rules in code, preview them, never deploy blindly.

---

## 🎯 Objective

Write Bicep templates that define a Virtual Network, subnets, and Network Security Groups (NSG) with security rules. Preview everything with what-if.

**The Analogy:** A Virtual Network is your compound wall. Subnets are the rooms inside. NSG rules are the security guard — "allow family in, block strangers." You design all of this in code before laying a single brick.

---

## 💰 Cost Warning

- **$0.00** — what-if only previews, nothing is deployed

---

## 📋 Prerequisites

- Lab 02 completed (Bicep basics)
- Azure CLI authenticated

---

## 🔧 Step-by-Step

### Step 1: Create Lab Folder

```bash
mkdir labs/04-vnet-security
cd labs/04-vnet-security
```

---

### Step 2: Write the VNet Bicep Template

```bash
code vnet.bicep
```

Paste:
```bicep
@description('Location for all resources')
param location string = 'eastus'

@description('VNet address space')
param vnetAddressPrefix string = '10.0.0.0/16'

@description('Web subnet prefix')
param webSubnetPrefix string = '10.0.1.0/24'

@description('App subnet prefix')
param appSubnetPrefix string = '10.0.2.0/24'

@description('Database subnet prefix')
param dbSubnetPrefix string = '10.0.3.0/24'

resource vnet 'Microsoft.Network/virtualNetworks@2024-01-01' = {
  name: 'blueprint-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [vnetAddressPrefix]
    }
    subnets: [
      {
        name: 'web-subnet'
        properties: {
          addressPrefix: webSubnetPrefix
          networkSecurityGroup: {
            id: webNsg.id
          }
        }
      }
      {
        name: 'app-subnet'
        properties: {
          addressPrefix: appSubnetPrefix
          networkSecurityGroup: {
            id: appNsg.id
          }
        }
      }
      {
        name: 'db-subnet'
        properties: {
          addressPrefix: dbSubnetPrefix
          networkSecurityGroup: {
            id: dbNsg.id
          }
        }
      }
    ]
  }
}

resource webNsg 'Microsoft.Network/networkSecurityGroups@2024-01-01' = {
  name: 'web-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowHTTP'
        properties: {
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
          destinationPortRange: '80'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'AllowHTTPS'
        properties: {
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
          destinationPortRange: '443'
          access: 'Allow'
          priority: 110
          direction: 'Inbound'
        }
      }
    ]
  }
}

resource appNsg 'Microsoft.Network/networkSecurityGroups@2024-01-01' = {
  name: 'app-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowWebToApp'
        properties: {
          protocol: 'Tcp'
          sourceAddressPrefix: webSubnetPrefix
          sourcePortRange: '*'
          destinationAddressPrefix: appSubnetPrefix
          destinationPortRange: '8080'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
    ]
  }
}

resource dbNsg 'Microsoft.Network/networkSecurityGroups@2024-01-01' = {
  name: 'db-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowAppToDB'
        properties: {
          protocol: 'Tcp'
          sourceAddressPrefix: appSubnetPrefix
          sourcePortRange: '*'
          destinationAddressPrefix: dbSubnetPrefix
          destinationPortRange: '5432'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'DenyAllOther'
        properties: {
          protocol: '*'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
          destinationPortRange: '*'
          access: 'Deny'
          priority: 4000
          direction: 'Inbound'
        }
      }
    ]
  }
}

output vnetName string = vnet.name
output vnetId string = vnet.id
```

Save: `Ctrl + S`

---

### Step 3: Validate the Template

```bash
az bicep build --file vnet.bicep
```

**Expected Output:**
```
(no output = success)
```

---

### Step 4: Preview with What-If

```bash
az deployment group what-if \
  --resource-group test-rg \
  --template-file vnet.bicep
```

**Expected Output:**
```
  + Microsoft.Network/networkSecurityGroups/app-nsg [2024-01-01]
      ...
  + Microsoft.Network/networkSecurityGroups/db-nsg [2024-01-01]
      ...
  + Microsoft.Network/networkSecurityGroups/web-nsg [2024-01-01]
      ...
  + Microsoft.Network/virtualNetworks/blueprint-vnet [2024-01-01]
      + properties.addressSpace.addressPrefixes[0]: "10.0.0.0/16"
      + properties.subnets[0].name: "web-subnet"
      + properties.subnets[0].addressPrefix: "10.0.1.0/24"
      ...

Resource changes: 4 to create.
```

You just designed a 3-tier network architecture (web, app, database) with proper security rules — and previewed it for free.

---

## ✅ What You Learned

1. VNets isolate your Azure resources like a private compound
2. Subnets divide the VNet into zones (web, app, database)
3. NSGs act as firewalls — controlling traffic between subnets
4. The security model follows least-privilege: web is public, app only accepts from web, db only accepts from app
5. Bicep can define complex network topologies and preview them at zero cost

---

## 🧹 Cleanup

No cleanup needed — nothing was deployed.

```bash
cd ..
```

---

## 🚀 Production Note

In production:
1. Add a Bastion subnet for secure SSH access (no public IPs on VMs)
2. Add Application Gateway or Azure Front Door for load balancing
3. Use Azure Firewall for centralized network security
4. Enable VNet flow logs for security auditing
5. Use Private Link for PaaS services instead of public endpoints
