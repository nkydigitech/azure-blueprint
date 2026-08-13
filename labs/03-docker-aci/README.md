# Lab 03: Docker Containers + Azure Container Instances Preview ($0)

> **From Local Container to Cloud Preview** — Build and test a container locally, then preview what it would look like in Azure.

---

## 🎯 Objective

Build a Docker container locally, run it, then use Bicep what-if to preview deploying it to Azure Container Instances — without deploying or spending anything.

**The Analogy:** You cook a meal at home (Docker local), taste it, then show the menu to the restaurant owner (Azure what-if) to see what it would look like on their menu. You never actually send the food to the restaurant.

---

## 💰 Cost Warning

- **$0.00** — Docker runs locally, what-if does not deploy
- ACI what-if is a preview only

---

## 📋 Prerequisites

- Lab 00 completed
- Lab 02 completed (Bicep basics)
- Docker running

---

## 🔧 Step-by-Step

### Step 1: Create a Simple Web App

```bash
mkdir labs/03-docker-aci
cd labs/03-docker-aci

mkdir app
echo '<html><body><h1>Hello from Azure Blueprint!</h1></body></html>' > app/index.html

cat > app/server.py << 'PYEOF'
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(__file__), **kwargs)

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 80), Handler)
    print('Server running on port 80...')
    server.serve_forever()
PYEOF
```

**Expected Output:**
```
(nothing — files created)
```

---

### Step 2: Write the Dockerfile

```bash
code Dockerfile
```

Paste:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY app/ .
EXPOSE 80
CMD ["python", "server.py"]
```

Save: `Ctrl + S`

---

### Step 3: Build and Run Locally

```bash
docker build -t blueprint-app .
```

**Expected Output:**
```
Step 1/4 : FROM python:3.11-slim
 ---> abc123
Step 2/4 : WORKDIR /app
 ---> def456
Step 3/4 : COPY app/ .
 ---> ghi789
Step 4/4 : EXPOSE 80
 ---> jkl012
Successfully built blueprint-app
```

```bash
docker run -d -p 8080:80 --name blueprint-web blueprint-app
```

**Expected Output:**
```
a1b2c3d4e5f6...
```

---

### Step 4: Verify Locally

```bash
curl http://localhost:8080
```

**Expected Output:**
```
<html><body><h1>Hello from Azure Blueprint!</h1></body></html>
```

---

### Step 5: Write Bicep for Azure Container Instances

```bash
code aci.bicep
```

Paste:
```bicep
param location string = 'eastus'
param containerName string = 'blueprint-app'
param image string = 'python:3.11-slim'

resource aci 'Microsoft.ContainerInstance/containerGroups@2023-05-01' = {
  name: containerName
  location: location
  properties: {
    osType: 'Linux'
    containers: [
      {
        name: 'app'
        properties: {
          image: image
          ports: [
            {
              port: 80
              protocol: 'TCP'
            }
          ]
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 1.5
            }
          }
        }
      }
    ]
    ipAddress: {
      type: 'Public'
      ports: [
        {
          port: 80
          protocol: 'TCP'
        }
      ]
    }
  }
}

output containerFqdn string = aci.properties.ipAddress.fqdn
```

Save: `Ctrl + S`

---

### Step 6: Preview the Deployment with What-If

```bash
az bicep build --file aci.bicep
az deployment group what-if \
  --resource-group test-rg \
  --template-file aci.bicep
```

**Expected Output:**
```
  + Microsoft.ContainerInstance/containerGroups/blueprint-app [2023-05-01]
      + apiVersion:                      "2023-05-01"
      + location:                        "eastus"
      + name:                            "blueprint-app"
      + properties.containers[0].name:   "app"
      + properties.ipAddress.type:        "Public"
      + properties.ipAddress.ports[0].port: 80
      + properties.osType:               "Linux"
      ...

Resource changes: 1 to create.
```

You just previewed deploying a container to Azure without deploying it.

---

## ✅ What You Learned

1. Docker containers work the same locally and in Azure
2. Azure Container Instances (ACI) is the simplest way to run a container in Azure
3. What-if works for ANY Azure resource type, including containers
4. You can develop, test, and preview infrastructure at zero cost
5. The same Docker image runs identically in Docker Desktop and Azure ACI

---

## 🧹 Cleanup

```bash
docker stop blueprint-web
docker rm blueprint-web
cd ..
```

---

## 🚀 Production Note

In production:
1. Push the image to Azure Container Registry (ACR)
2. Reference the ACR image in the Bicep template
3. Use Azure App Service instead of ACI for long-running apps
4. Add liveness probes and auto-restart policies
5. Deploy via GitHub Actions CI/CD pipeline
