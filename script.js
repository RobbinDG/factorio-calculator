/* TODOs:
 * - implement oil cracking if possible for the craft (depeding on excess oil products)
 * - create functionality for module slots
 * - check if module changes are added by percent, or multiplied factors
 * - draw lines between parent-child relations in the craft tree
 * 	- make perfect ratio's a golden color ( ceil(machinesR) == machinesR )
 * */

// Global variables
var recipes = {};
var warnings = [];
var itemLevelCount = 4;
var padding = 16;
// level 0: raw resources, 1: processed resources, 2: intermediate items, 3: processed intermediate items
var requiredResources = create2DArray(itemLevelCount)

function printJSON(){
	// prints the json string of recipes.json
	var jsonString = JSON.stringify(recipes);
	document.getElementById("test").innerHTML = jsonString;
}

function populateDropdown(){
	var select = document.getElementById("final");
	for(x in recipes){
		var opt = document.createElement("option");
		opt.textContent = toReadable(x);
		opt.value = x;
		select.appendChild(opt);
	}
}

function displayWarnings(){
	var warningsList = document.getElementById("warnings");
	warningsList.innerHTML = "Warnings: ";
	for(var i = 0; i < warnings.length; ++i){
		if(warnings[i] == 1){
			switch(i){
				// current size set to 10
				case 0: warningsList.innerHTML += "<br> - Coal Liquefaction requires some Heavy Oil to start the positive feedback loop"; break;
				case 1: warningsList.innerHTML += "<br> - Uranium Ore can only be mined with an Electric Mining Drill. Showing data for using Electric Mining Drills"; break;
				case 2: warningsList.innerHTML += "<br> - Some items require higher level Assembling Machines than the currently selected one. Showing data for using upgraded Assembling Machines"; break;
				default: warningsList.innerHTML += "<br> !!! UNKNOWN WARNING"; break;
			}
		}
	}
}

// Define: ratio = items/sec cTime = sec/item
function getRatio(item){
	// amount/time
	return (recipes[item].output[0].amount / recipes[item].craft_speed);
}

function sRR(item, multiplier){
	if(recipes[item].level){
		for(x in recipes[item].input){
			reqItem = recipes[item].input[x].item;
			reqAmount = recipes[item].input[x].amount * multiplier;
			var mult = 0;
			for(var i = 0; i < requiredResources[recipes[reqItem].level].length; ++i){
				if(requiredResources[recipes[reqItem].level][i].item == reqItem){
					requiredResources[recipes[reqItem].level][i].amount += reqAmount;
					mult = 1;
					break;
				}
			}
			if(!mult){requiredResources[recipes[reqItem].level].push({item: reqItem, amount: reqAmount});}
			sRR(recipes[item].input[x].item, reqAmount / recipes[reqItem].output[0].amount);
		}
	}
}

function showRequirements(item, amount){
	clear2DArray(requiredResources, itemLevelCount);
	document.getElementById("requirements").innerHTML = "Required Materials: ";
	if(recipes[item].level){
		sRR(item, amount);
	}
	for(var i = 0; i < itemLevelCount; ++i){
		document.getElementById("requirements").innerHTML += "<br>";
		for(var j = 0; j < requiredResources[i].length; ++j){
			document.getElementById("requirements").innerHTML += requiredResources[i][j].amount + " x " + toReadable(requiredResources[i][j].item) + ", ";
		}
	}
}

function getMeetNodeDepth(depthF, indexF){
	if(craftTree[depthF][indexF-1].parentIndex == craftTree[depthF][indexF].parentIndex){
		var topIndex = indexF;
		return depthF;
	}
	return getMeetNodeDepth(depthF-1, craftTree[depthF][indexF].parentIndex);
}

// pointed variables
var shifts = 0;

function shiftBranch(depth, index){
	var meetDepth = getMeetNodeDepth(depth, index);
	while(depth >= meetDepth){
		craftTree[depth][index].position++;
		index = craftTree[depth][index].parentIndex;
		depth--;
	}
}

function getProductivity(i, j){
	if(i < 0){return 1;}
	return craftTree[i][j].productivityMult * getProductivity(i-1, craftTree[i][j].parentIndex);
}

function recalculate(){
	for(var i = 0; i < craftTree.length; ++i){
		for(var j = 0; j < craftTree[i].length; ++j){
			var d = craftTree[i][j];
			var productionQuantity = craftExceptions(d.item)[1][0].amount;
			var prodMult = getProductivity(i, j);
			var machinesR = recipes[d.item].craft_time / getCraftSpeed(d.item) * d.amount / productionQuantity / d.speedMult / prodMult;
			d.machines = machinesR;
		}
	}
	displayDiagram();
}

function update(){
	var e = document.getElementById("final");
	var value = e.options[e.selectedIndex].value;
	warnings = new Array(10);
	warnings.fill(0);
	//showRequirements(value, document.getElementById("amount").value);
	document.getElementById("readyState").innerHTML = "Generating Diagram";	
	makeDiagram(value, document.getElementById("amount").value);
	document.getElementById("readyState").innerHTML = "Finding Warnings";
	displayWarnings();
	document.getElementById("readyState").innerHTML = "Ready";
}

function setDefaults(){
	document.getElementById("final").value = "processing_unit";
	update();
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		document.getElementById("readyState").innerHTML = "Retrieving Data";
        recipes = JSON.parse(this.responseText);
		populateDropdown();
		setDefaults();
    }
};
xmlhttp.open("GET", "recipes.json", true);
xmlhttp.send();
