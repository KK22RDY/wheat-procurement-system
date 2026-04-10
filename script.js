const API = "http://localhost:3000";
let farmers = [];
let isAdmin = false;

/* LOGIN */


document.getElementById("welcome").style.display="flex";


/* START */
function startApp(){
document.getElementById("welcome").style.display="none";
document.getElementById("sidebar").style.display="block";
document.getElementById("main").style.display="block";


showPage("dashboard");
loadFarmers();
}

/* LOAD */
async function loadFarmers(){

let res = await fetch(API+"/farmers");

if(res.status===403){
alert("Unauthorized!");
return;
}

farmers = await res.json();

updateTable();
updateAssignTable();
updateDashboard();
}

/* REGISTER */
async function registerFarmer(){

let name=document.getElementById("name").value;
let qty=document.getElementById("qty").value;

if(name=="" || qty==""){
document.getElementById("msg").innerHTML="Fill all fields!";
return;
}

await fetch(API+"/addFarmer",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name, quantity:qty})
});

document.getElementById("msg").innerHTML="Farmer Added!";
loadFarmers();
}

/* TABLE */
function updateTable(){

let table=document.getElementById("farmerTable");

table.innerHTML=`
<tr>
<th>Name</th>
<th>Quantity</th>
<th>Status</th>
<th>Slot</th>
<th>Time</th>
</tr>`;

farmers.forEach(f=>{
table.innerHTML+=`
<tr>
<td>${f.name}</td>
<td>${f.quantity}</td>
<td>${f.status}</td>
<td>${f.slot}</td>
<td>${f.time}</td>
</tr>`;
});

}

/* ASSIGN TABLE (ADMIN ONLY) */
function updateAssignTable(){

if(!isAdmin) return;

let table=document.getElementById("assignTable");

table.innerHTML=`
<tr>
<th>Name</th>
<th>Assign</th>
</tr>`;

farmers.forEach(f=>{
table.innerHTML+=`
<tr>
<td>${f.name}</td>
<td>
<button onclick="assign('${f._id}')">Assign</button>
</td>
</tr>`;
});

}

/* ASSIGN */
async function assign(id){

if(!isAdmin){
alert("Admin only");
return;
}

let slot = document.getElementById("slotNo").value;
let time = document.getElementById("slotTime").value;

if(!slot || !time){
alert("Enter slot & time");
return;
}

await fetch(API+"/assign",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({id, slot, time})
});

loadFarmers();
}

/* DASHBOARD */
function updateDashboard(){

document.getElementById("totalFarmers").innerHTML=farmers.length;

let total=0;
farmers.forEach(f=> total+=Number(f.quantity));

document.getElementById("totalWheat").innerHTML=total+" Q";

}