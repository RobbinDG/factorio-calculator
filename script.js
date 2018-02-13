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
var pixelsPerBlock = 64;
// level 0: raw resources, 1: processed resources, 2: intermediate items, 3: processed intermediate items
var requiredResources = create2DArray(itemLevelCount);
var craftTree;

function clicked(str){
	var i = decodeLocation(str);
	var data = craftTree[i[0]][i[1]];
	document.getElementById("changeMachineIcon").innerHTML = document.getElementById(str).innerHTML;
	loadMachineEditor(data.machine, data.level, data.item, str);
	CDDCloseAll();
}

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

function gDR(itemF, amountF, depth, parentPos, parentIndexF, multiplier){
	if(recipes[itemF].level == 0){ return; }
	if(craftTree.length < depth+1){ addRow(craftTree); }
	var objIO = craftExceptions(itemF);
	var objectInput = objIO[0], objectOutput = objIO[1];
	var children = objectInput.length;
	for(var i = 0; i < children; ++i){
		var pos = parentPos - (children-1) + 2*i;
		var reqItem = objectInput[i].item;
		var reqAmount = objectInput[i].amount;
		var productionQuantity = craftExceptions(reqItem)[1][0].amount;
		var machinesR = recipes[reqItem].craft_time / getCraftSpeed(reqItem) * reqAmount / productionQuantity * multiplier;
		var nextMultiplier = reqAmount / productionQuantity * multiplier;
		craftTree[depth].push({
			item: reqItem, 
			amount: reqAmount * multiplier, 
			position: pos, parentIndex: parentIndexF, 
			machines: machinesR,
			machine: recipes[reqItem].machine.type,
			level: correctedLevel,
			modules: 0,
			speedMult:1,
			productivityMult:1,
			energyMult:1,
			polutionMult:1
		});
		if(craftTree[depth].length == 1){ leftmost = pos; }
		while(craftTree[depth].length-1 > 0 && craftTree[depth][craftTree[depth].length-2].position + 1 >= craftTree[depth][craftTree[depth].length-1].position){
			shiftBranch(depth, craftTree[depth].length-1);
			shifts++;
		}
		gDR(reqItem, reqAmount, depth+1, craftTree[depth][craftTree[depth].length-1].position, craftTree[depth].length-1, nextMultiplier);
	}
}

function generateDiagram(itemF, amountF){
	var machinesR = recipes[itemF].craft_time * amountF / getCraftSpeed(itemF);
	shifts = 0;
	craftTree = 0;
	craftTree = create2DArray(1);
	craftTree[0][0] = {
		item: itemF, 
		amount: amountF, 
		position: 0, 
		parentIndex: -1, 
		machines: machinesR,
		machine: recipes[itemF].machine.type,
		level: correctedLevel,
		modules: 0,
		speedMult:1,
		productivityMult:1,
		energyMult:1,
		polutionMult:1
	};
	var objIO = craftExceptions(itemF);
	var objectOutput = objIO[1];
	gDR(itemF, amountF, 1, 0, 0, amountF / objectOutput[0].amount);
}

function displayDiagram(){
	document.getElementById("frame").innerHTML = "";
	var width = document.getElementById("frame").offsetWidth;
	var center = (craftTree.length > 1 ? (craftTree[1][0].position + craftTree[1][craftTree[1].length-1].position)/2 : 0);
	var leftmost = 0, rightmost = 0;
	for(var i = 0; i < craftTree.length; ++i){
		for(var j = 0; j < craftTree[i].length; ++j){
			for(var n = 0; n < craftTree.length; ++n){
				if(craftTree[n][0].position < leftmost) { leftmost = craftTree[n][0].position; }
				if(craftTree[n][craftTree[n].length-1].position > rightmost) { rightmost = craftTree[n][craftTree[n].length-1].position; }
			}
			var left = (i == 0 ? center - leftmost : craftTree[i][j].position - leftmost) * pixelsPerBlock;
			var top = 2 * i * pixelsPerBlock;
			if((rightmost - leftmost)*pixelsPerBlock <= width){ left += (width-(rightmost-leftmost)*pixelsPerBlock)/2; }
			document.getElementById("frame").innerHTML += "<div id=\"" + i + "-" + j + "\"class=\"machine\" onClick=\"clicked(\'" 
			+ i + "-" + j + "\')\" style=\"left: " + left + "px; top: " + top + "px;\" ><center>" 
			+ toReadable(craftTree[i][j].item) + "<br>" + toReadable(recipes[craftTree[i][j].item].machine.type) + " " 
			+ Math.ceil(craftTree[i][j].machines) + "</center></div>";
		}
	}
	document.getElementById("frame").scrollTo((center - leftmost) * pixelsPerBlock - (width + pixelsPerBlock)/2, 0);
}

function update(){
	var e = document.getElementById("final");
	var value = e.options[e.selectedIndex].value;
	warnings = new Array(10);
	warnings.fill(0);
	//showRequirements(value, document.getElementById("amount").value);
	document.getElementById("readyState").innerHTML = "Generating Diagram";	
	generateDiagram(value, document.getElementById("amount").value);
	document.getElementById("readyState").innerHTML = "Rendering Diagram";
	displayDiagram();
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
