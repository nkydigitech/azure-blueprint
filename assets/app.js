const labs=[
{title:"Lab 1 — Azure Foundations",time:"45–60 minutes",objective:"Create and inspect a resource group and storage account, upload a test file, verify the result, then clean up.",steps:[
["Prerequisites","An Azure subscription, Azure Portal access, Azure CLI installed and authenticated."],
["Windows PowerShell","az login\naz account show\naz group create --name rg-blueprint-lab01 --location eastus"],
["Create storage","Choose a globally unique storage account name. Example:\naz storage account create --name <UNIQUE_NAME> --resource-group rg-blueprint-lab01 --location eastus --sku Standard_LRS --kind StorageV2"],
["Verify","az storage account show --name <UNIQUE_NAME> --resource-group rg-blueprint-lab01 --output table\nThen inspect the resource in the Azure Portal."],
["Cleanup","az group delete --name rg-blueprint-lab01 --yes --no-wait\nVerify the resource group and its resources are gone before considering the lab complete."],
["Cost safety","Storage, transactions and other components can have charges depending on use and current pricing. Check current pricing and clean up after the lab."]
]},
{title:"Lab 2 — Deploy a Linux VM + Nginx",time:"60–90 minutes",objective:"Build the network path for a Linux VM, connect over SSH, install Nginx and validate HTTP traffic.",steps:[
["Prerequisites","Azure CLI, an SSH-capable terminal and an Azure subscription. Use a lab-only VM and monitor costs."],
["Create resources","az group create --name rg-blueprint-lab02 --location eastus\naz vm create --resource-group rg-blueprint-lab02 --name vm-blueprint-web --image Ubuntu2204 --admin-username azureuser --generate-ssh-keys --public-ip-sku Standard"],
["Open HTTP","az vm open-port --resource-group rg-blueprint-lab02 --name vm-blueprint-web --port 80"],
["Connect","az vm show --show-details --resource-group rg-blueprint-lab02 --name vm-blueprint-web --output table\nUse the returned public IP with SSH: ssh azureuser@<PUBLIC_IP>"],
["Install Nginx","On the Linux VM:\nsudo apt-get update\nsudo apt-get install -y nginx\nsudo systemctl enable --now nginx\ncurl -I http://localhost"],
["Verify externally","Open http://<PUBLIC_IP> in a browser. If it fails, inspect the NSG, VM status, Nginx status and local firewall."],
["Cleanup","az group delete --name rg-blueprint-lab02 --yes --no-wait\nDo not leave a lab VM running."]
]},
{title:"Lab 3 — Web App on Azure App Service",time:"60–90 minutes",objective:"Deploy a small web application to managed App Service, configure settings, inspect logs and understand scaling.",steps:[
["Prerequisites","Azure CLI and a small application or sample web app. Confirm the current supported runtime in Azure before creating the app."],
["Create plan","az group create --name rg-blueprint-lab03 --location eastus\naz appservice plan create --name asp-blueprint-lab03 --resource-group rg-blueprint-lab03 --sku B1 --is-linux"],
["Create web app","az webapp create --resource-group rg-blueprint-lab03 --plan asp-blueprint-lab03 --name <UNIQUE_WEBAPP_NAME> --runtime \"NODE:22-lts\""],
["Configuration","az webapp config appsettings set --resource-group rg-blueprint-lab03 --name <UNIQUE_WEBAPP_NAME> --settings APP_ENV=lab"],
["Deploy","Use the current App Service deployment method appropriate to your application. Verify the runtime and deployment command against current Microsoft documentation."],
["Logs","az webapp log config --resource-group rg-blueprint-lab03 --name <UNIQUE_WEBAPP_NAME> --docker-container-logging filesystem\naz webapp log tail --resource-group rg-blueprint-lab03 --name <UNIQUE_WEBAPP_NAME>"],
["Cleanup","Delete the resource group when finished. Confirm the current plan and app are no longer needed."]
]},
{title:"Lab 4 — GitHub → Azure CI/CD",time:"90–120 minutes",objective:"Build a secure CI/CD workflow using GitHub Actions and Azure authentication without hard-coded credentials.",steps:[
["Prerequisites","GitHub repository, Azure subscription, application source and an Azure hosting target."],
["Repository","Create a GitHub repository. Add source code and a README. Do not commit passwords, access keys, client secrets or .env files containing real credentials."],
["Authentication","Prefer a short-lived federated identity/OIDC approach for GitHub Actions where supported. Create the Azure identity and assign the minimum Azure RBAC role and scope needed for deployment."],
["Workflow","Build a workflow with checkout → dependency installation → tests → build/package → Azure authentication → deployment → verification. Store non-public configuration as GitHub/Azure secrets or variables as appropriate."],
["Verification","Review the Actions run, inspect the Azure deployment, open the application, and check logs/monitoring."],
["Security review","Confirm no credential appears in repository history or workflow logs. Rotate and revoke any credential that was accidentally exposed."],
["Cleanup","Remove lab resources and review the identity/role assignment created for the exercise."]
]}];

const glossary=[
["Azure","Microsoft's cloud platform and service ecosystem."],
["Tenant","A Microsoft Entra ID directory boundary containing identities and identity configuration."],
["Subscription","An Azure management and billing container for resources."],
["Resource Group","A logical management boundary for related Azure resources."],
["Resource","An individual Azure service instance or deployable object."],
["Region","A geographic Azure location containing one or more datacenters."],
["Availability Zone","A physically separate location within a supported Azure region designed for fault isolation."],
["VNet","An Azure virtual network used for private IP connectivity and network segmentation."],
["Subnet","A logical IP range inside a VNet."],
["NSG","Network Security Group; a set of network traffic security rules."],
["RBAC","Role-Based Access Control for authorizing access to Azure resources."],
["Microsoft Entra ID","Microsoft's cloud identity and access management service."],
["Managed Identity","An Azure-managed identity that can authenticate to supported services without storing credentials in code."],
["Key Vault","A managed service for secrets, keys and certificates."],
["Blob Storage","Object storage for unstructured data."],
["App Service","Managed hosting for web apps and APIs."],
["AKS","Azure Kubernetes Service, a managed Kubernetes offering."],
["ACR","Azure Container Registry for storing container images and artifacts."],
["Azure Monitor","Azure's monitoring platform for metrics, logs and alerts."],
["Log Analytics","A log analysis environment commonly queried with KQL."],
["IaC","Infrastructure as Code: defining infrastructure in version-controlled configuration."],
["CI/CD","Continuous Integration and Continuous Delivery/Deployment practices for automated software delivery."],
["ARM","Azure Resource Manager, the management layer used to deploy and manage Azure resources."],
["Bicep","Azure-native declarative infrastructure-as-code language."],
["Terraform","Infrastructure-as-code tool used to provision resources across cloud providers."]
];

const quizData=[
{
 question:"Which service is primarily an identity directory?",
 options:["Azure Storage","Microsoft Entra ID","Azure Monitor","Azure DNS"],
 correct:1,
 explanation:"Microsoft Entra ID is Microsoft's cloud identity and access management service. It provides the directory for identities such as users, groups and applications and supports authentication and authorization.",
 topic:"Identity & Access"
},
{
 question:"What is the main purpose of a Resource Group?",
 options:["Encrypt every resource","Organize and manage related resources","Replace a subscription","Create a VM image"],
 correct:1,
 explanation:"A Resource Group is a logical management boundary for related Azure resources. It helps you organize, manage and apply lifecycle operations to resources that belong to the same workload.",
 topic:"Azure Fundamentals"
},
{
 question:"Authentication answers which question?",
 options:["What are you allowed to do?","Who are you?","How much will it cost?","Where is the region?"],
 correct:1,
 explanation:"Authentication verifies the identity of a user, application or service. Authorization is the separate process that determines what that authenticated identity is allowed to access or do.",
 topic:"Identity & Access"
},
{
 question:"Which approach avoids putting long-lived credentials directly in GitHub Actions code?",
 options:["Hard-code a client secret","Commit .env","Use federated/OIDC authentication where supported","Paste a password into YAML"],
 correct:2,
 explanation:"Federated/OIDC authentication can allow GitHub Actions to obtain short-lived Azure access without storing a long-lived client secret directly in the repository or workflow. The exact setup depends on the supported Azure and GitHub configuration.",
 topic:"DevOps & CI/CD"
},
{
 question:"What should you do after a cost-generating lab?",
 options:["Leave everything running","Delete/clean up resources according to billing behavior","Disable the browser","Delete your GitHub account"],
 correct:1,
 explanation:"Cloud labs should always have a cleanup stage. Delete resources you no longer need and verify that dependent resources have also been removed. Some Azure services can continue generating charges depending on their state and configuration.",
 topic:"Cost Management"
},
{
 question:"What does an NSG primarily control?",
 options:["Database schema","Network traffic rules","Git commits","DNS domain ownership"],
 correct:1,
 explanation:"A Network Security Group (NSG) contains security rules that allow or deny supported inbound and outbound network traffic for Azure network interfaces and subnets.",
 topic:"Azure Networking"
}
];

const quizFeedbackStyles=`
.answer-review{
  margin-top:16px;
  padding:16px;
  border-radius:12px;
  border:1px solid var(--border,#d9e5ee);
  background:var(--surface,#ffffff);
}

.answer-review.correct{
  border-left:5px solid #198754;
}

.answer-review.incorrect{
  border-left:5px solid #c62828;
}

.answer-status{
  font-weight:800;
  margin-bottom:10px;
}

.answer-review.correct .answer-status{
  color:#198754;
}

.answer-review.incorrect .answer-status{
  color:#c62828;
}

.answer-explanation{
  margin-top:12px;
  padding:12px;
  border-radius:9px;
  background:var(--surface-soft,#f3f7fa);
}

.answer-topic{
  margin-top:12px;
  font-size:14px;
  font-weight:600;
}

.assessment-summary{
  margin-top:24px;
  padding:22px;
  border-radius:14px;
  background:var(--surface-soft,#eef7ff);
  border:1px solid var(--border,#d9e5ee);
  text-align:center;
}

.assessment-summary h3{
  margin-top:0;
}

.assessment-score{
  font-size:42px;
  font-weight:900;
}

.assessment-percentage{
  font-size:22px;
  font-weight:800;
}

.assessment-review{
  margin-top:20px;
}

.question-feedback{
  margin-top:12px;
}
`;

function loadState(){
 try{
   return JSON.parse(localStorage.getItem("azureBlueprint")||"{}");
 }catch{
   return {};
 }
}

let state=loadState();

function save(){
 localStorage.setItem("azureBlueprint",JSON.stringify(state));
 updateProgress();
}

function updateProgress(){
 const checks=[...document.querySelectorAll("[data-check]")];
 const done=checks.filter(x=>x.checked).length;
 const pct=checks.length?Math.round(done/checks.length*100):0;

 const progressBar=document.getElementById("progressBar");
 const progressText=document.getElementById("progressText");

 if(progressBar){
   progressBar.style.width=pct+"%";
 }

 if(progressText){
   progressText.textContent=pct+"%";
 }
}

function renderQuiz(){

 const quiz=document.getElementById("quiz");

 if(!quiz){
   return;
 }

 quiz.innerHTML=quizData.map((q,i)=>`
   <div class="quiz-card" id="question-${i}">

     <b>${i+1}. ${q.question}</b>

     ${q.options.map((answer,j)=>`
       <label>
         <input type="radio" name="q${i}" value="${j}">
         ${answer}
       </label>
     `).join("")}

     <div id="feedback-${i}" class="question-feedback" hidden></div>

   </div>
 `).join("")+

 `<button class="btn primary" id="gradeQuiz">
    Grade assessment
 </button>

 <div id="quizResult" class="quiz-result"></div>`;

 document.getElementById("gradeQuiz").onclick=gradeQuiz;
}

function gradeQuiz(){

 let score=0;
 let answered=0;

 quizData.forEach((q,i)=>{

   const selected=document.querySelector(
     `input[name="q${i}"]:checked`
   );

   const feedback=document.getElementById(`feedback-${i}`);

   if(selected){
     answered++;
   }

   const selectedAnswer=selected
     ? Number(selected.value)
     : null;

   const isCorrect=selectedAnswer===q.correct;

   if(isCorrect){
     score++;
   }

   const yourAnswer=selected
     ? q.options[selectedAnswer]
     : "Not answered";

   const correctAnswer=q.options[q.correct];

   feedback.hidden=false;

   feedback.innerHTML=`

     <div class="answer-review ${isCorrect?"correct":"incorrect"}">

       <div class="answer-status">
         ${isCorrect ? "✓ Correct" : "✗ Needs Review"}
       </div>

       <p>
         <strong>Your answer:</strong>
         ${yourAnswer}
       </p>

       <p>
         <strong>Correct answer:</strong>
         ${correctAnswer}
       </p>

       <div class="answer-explanation">
         <strong>Why?</strong>
         <p>${q.explanation}</p>
       </div>

       <div class="answer-topic">
         <strong>Review topic:</strong>
         ${q.topic}
       </div>

     </div>
   `;
 });

 const percentage=Math.round(
   score/quizData.length*100
 );

 let message;

 if(score===quizData.length){

   message=
   "Excellent! You answered every question correctly. You are ready to continue.";

 }else if(score>=5){

   message=
   "Strong work! You have a good foundation. Review the question you missed before moving to the labs.";

 }else if(score>=4){

   message=
   "Good attempt. Review the marked questions and strengthen those concepts before continuing.";

 }else{

   message=
   "Keep learning. Review the marked explanations and try the assessment again.";

 }

 document.getElementById("quizResult").innerHTML=`

   <div class="assessment-summary">

     <h3>Assessment Results</h3>

     <div class="assessment-score">
       ${score}/${quizData.length}
     </div>

     <div class="assessment-percentage">
       ${percentage}%
     </div>

     <p>
       ${answered}/${quizData.length} questions answered.
     </p>

     <p>${message}</p>

     <button
       class="btn primary"
       id="retakeQuiz"
       type="button">
       Retake Assessment
     </button>

   </div>

   <div class="assessment-review">

     <h3>Review Your Answers</h3>

     <p>
       Read the explanation under each question,
       especially the questions marked
       <strong>Needs Review</strong>.
     </p>

   </div>
 `;

 document.getElementById("retakeQuiz").onclick=()=>{

   renderQuiz();

   document
     .getElementById("quiz")
     .scrollIntoView({
       behavior:"smooth",
       block:"start"
     });

 };

 state.quizScore=score;
 state.quizPercentage=percentage;
 state.quizCompleted=true;

 save();
}

document.addEventListener("DOMContentLoaded",()=>{

 const style=document.createElement("style");
 style.textContent=quizFeedbackStyles;
 document.head.appendChild(style);

 document.querySelectorAll("[data-check]").forEach(x=>{
   x.checked=!!state[x.dataset.check];

   x.addEventListener("change",()=>{
     state[x.dataset.check]=x.checked;
     save();
   });
 });

 const glossaryGrid=document.getElementById("glossaryGrid");

 if(glossaryGrid){
   glossaryGrid.innerHTML=glossary.map(([t,d])=>
     `<article class="glossary-item"
       data-term="${t.toLowerCase()} ${d.toLowerCase()}">
       <b>${t}</b>
       <p>${d}</p>
     </article>`
   ).join("");
 }

 const glossarySearch=document.getElementById("glossarySearch");

 if(glossarySearch){
   glossarySearch.addEventListener("input",e=>{
     const q=e.target.value.toLowerCase();

     document.querySelectorAll(".glossary-item").forEach(x=>{
       x.style.display=
         x.dataset.term.includes(q)
         ?"block"
         :"none";
     });
   });
 }

 renderQuiz();

 const copyButton=document.querySelector(".copy-btn");

 if(copyButton){

   copyButton.onclick=async()=>{

     const terminal=document.querySelector(".terminal pre");

     if(!terminal){
       return;
     }

     const text=terminal.innerText;

     try{

       await navigator.clipboard.writeText(text);

       copyButton.textContent="Copied ✓";

       setTimeout(
         ()=>copyButton.textContent="Copy commands",
         1500
       );

     }catch{

       copyButton.textContent="Copy failed";

     }
   };
 }

 const themeToggle=document.getElementById("themeToggle");

 if(themeToggle){
   themeToggle.onclick=()=>{
     document.body.classList.toggle("dark");
   };
 }

 const mobileMenu=document.getElementById("mobileMenu");

 if(mobileMenu){

   mobileMenu.onclick=()=>{
     document
       .getElementById("sidebar")
       ?.classList.toggle("open");
   };
 }

 const searchInput=document.getElementById("searchInput");

 if(searchInput){

   searchInput.addEventListener(
     "input",
     e=>searchSite(e.target.value)
   );
 }

 updateProgress();

});

function searchSite(q){

 const box=document.getElementById("searchResults");

 if(!box){
   return;
 }

 q=q.trim().toLowerCase();

 if(!q){
   box.classList.remove("show");
   return;
 }

 const items=[...document.querySelectorAll("section[id]")]
   .map(s=>({
     id:s.id,
     title:s.querySelector("h2")?.innerText||s.id,
     text:s.innerText.toLowerCase()
   }))
   .filter(x=>x.text.includes(q))
   .slice(0,8);

 box.innerHTML=items.length
   ?items.map(x=>`<a href="#${x.id}">${x.title}</a>`).join("")
   :`<a>No matching lesson found</a>`;

 box.classList.add("show");
}

function openLab(i){

 const lab=labs[i];

 document.getElementById("labContent").innerHTML=`

   <span class="eyebrow">HANDS-ON LAB</span>

   <h2>${lab.title}</h2>

   <p>
     <b>Estimated time:</b>
     ${lab.time}
   </p>

   <p>${lab.objective}</p>

   ${lab.steps.map((s,n)=>`
     <div class="step">
       <b>${n+1}. ${s[0]}</b>
       <pre>${s[1]}</pre>
     </div>
   `).join("")}

   <div class="callout warning">
     <b>Lab safety:</b>
     Verify current Azure pricing and clean up resources when finished.
     Never place real secrets in source control.
   </div>
 `;

 document
   .getElementById("labModal")
   .classList.add("show");

 document
   .getElementById("labModal")
   .setAttribute("aria-hidden","false");
}

function closeLab(){

 document
   .getElementById("labModal")
   .classList.remove("show");

 document
   .getElementById("labModal")
   .setAttribute("aria-hidden","true");
}

document.addEventListener("click",e=>{

 if(e.target.id==="labModal"){
   closeLab();
 }

});