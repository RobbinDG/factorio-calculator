var currentInEditor = "";
var moduleSlotIds = new Array();

function getModuleCapacity(machine, level){
	machine += level;
	switch(machine){
		case "assembling_machine2": return 2;
		case "assembling_machine3": return 4;
		case "furnace3": return 2;
		case "mining_drill2": return 3;
		case "pumpjack1": return 2;
		case "refinery1": return 3;
		case "chemical_plant1": return 3;
		case "centrifuge1": return 2;
		case "rocket_silo1": return 4;
		default: return 0;
	}
}

function addModuleListToDropdown(id, item){
	var allowProd = ((item != "beacon" && (recipes[item].level == 2 || recipes[item].level == 0)) ? true : false);
	customDropdownAddEntry(id, "effectivity_module");
	customDropdownAddEntry(id, "effectivity_module_2");
	customDropdownAddEntry(id, "effectivity_module_3");
	customDropdownAddEntry(id, "speed_module");
	customDropdownAddEntry(id, "speed_module_2");
	customDropdownAddEntry(id, "speed_module_3");
	if(allowProd){
		customDropdownAddEntry(id, "productivity_module");
		customDropdownAddEntry(id, "productivity_module_2");
		customDropdownAddEntry(id, "productivity_module_3");
	}
}

function getMultiplierModifications(index){
	var s = 0, pr = 0, e = 0, po = 0;
	switch(index){
		case 0: e -= 0.3; break;
		case 1: e -= 0.4; break;
		case 2: e -= 0.5; break;
		case 3: s += 0.2; e += 0.5; break;
		case 4: s += 0.3; e += 0.6; break;
		case 5: s += 0.5; e += 0.7; break;
		case 6: s -= 0.15; pr += 0.04; e += 0.4; po += 0.05; break;
		case 7: s -= 0.15; pr += 0.06; e += 0.6; po += 0.075; break;
		case 8: s -= 0.15; pr += 0.1; e += 0.8; po += 0.1; break;
		default: break;
	}
	return [s, pr, e, po];
}

var slotSize = 32, bPadding = 4;

function displayModuleSlots(machine, level, item){
	// TODO: remove module from machine if one is selected
	moduleSlotIds = [];
	document.getElementById("modules").innerHTML = "";
	document.getElementById("modules").style.height = 2*(slotSize+2) + 4*bPadding;
	document.getElementById("modules").style.width = 2*(slotSize+2) + 4*bPadding;
	var slots = getModuleCapacity(machine, level);
	var rows = Math.ceil(slots/2), bottomRows = (slots >= 2 ? slots - 2 : 0), topRows = slots - bottomRows;
	for(var i = 0; i < 2; ++i){
		if(i < topRows){
			var left = (i + (topRows%2)/2) * slotSize + (i*2 + 1 - (topRows%2)) * bPadding;
			document.getElementById("modules").innerHTML += customDropdownInit(left, bPadding, slotSize, 3);
			addModuleListToDropdown(customDropdowns.length-1, item);
			moduleSlotIds.push(customDropdowns.length-1);
		}
		if(i < bottomRows){
			var left = (i + (bottomRows%2)/2) * slotSize + (i*2 + 1 + (bottomRows%2)) * bPadding;
			document.getElementById("modules").innerHTML += customDropdownInit(left, ((slotSize+2) + 3*bPadding), slotSize, 3);
			addModuleListToDropdown(customDropdowns.length-1, item);
			moduleSlotIds.push(customDropdowns.length-1);
		}
	}
	// load modules
	var c = decodeLocation(currentInEditor);
	var n = craftTree[c[0]][c[1]];
	var f = 8; m = n.modules;
	for(var i = moduleSlotIds.length-1; i >= 0; --i){
		if(m == 0) break;
		while(pow(10, f) > m && m != 0){
			f--;
		}
		CDDForceSelection(moduleSlotIds[i], f);
		m -= pow(10,f);
	}
}

function displayBeacons(){
	beaconSlotIds = [];
	document.getElementById("beacons").style.width = 2*(slotSize+2) + 4*bPadding;
	document.getElementById("beacons").style.height = (slotSize+2) + 2*bPadding;
	document.getElementById("beacons").innerHTML += customDropdownInit(bPadding, bPadding, slotSize, 3);
	addModuleListToDropdown(customDropdowns.length-1, "beacon");
	beaconSlotIds.push(customDropdowns.length-1);
	document.getElementById("beacons").innerHTML += customDropdownInit(slotSize + 3*bPadding, bPadding, slotSize, 3);
	addModuleListToDropdown(customDropdowns.length-1, "beacon");
	beaconSlotIds.push(customDropdowns.length-1);
}

function loadMachineEditor(machine, level, item, location){
	currentInEditor = location;

	// load machine level selector
	document.getElementById("changeMachineLevel").innerHTML = "<option>No Options</option>";
	if(machine != "chemical_plant" && machine != "centrifuge" && machine != "offshore_pump" && machine != "pumpjack"){
		document.getElementById("changeMachineLevel").innerHTML = document.getElementById(machine).innerHTML;
	}
	document.getElementById("changeMachineLevel").selectedIndex = (level-1).toString();
	var op = document.getElementById("changeMachineLevel").getElementsByTagName("option");
	for(var i = 1; i < recipes[item].machine.level; ++i){
		op[i-1].disabled = true;
	}
	
	// load module slots
	displayModuleSlots(machine, level, item);

	// load beacon slots
	displayBeacons();
}

function openEditor(str){
	var i = decodeLocation(str);
	var data = craftTree[i[0]][i[1]];
	document.getElementById("changeMachineIcon").innerHTML = document.getElementById(str).innerHTML;
	loadMachineEditor(data.machine, data.level, data.item, str);
	CDDCloseAll();
}

function saveChanges(){
	var m = decodeLocation(currentInEditor);
	var data = craftTree[m[0]][m[1]];
	data.modules = 0;
	data.speedMult = 1;
	data.productivityMult = 1;
	data.energyMult = 1;
	data.pollutionMult = 1;
	for(var i = 0; i < moduleSlotIds.length; ++i){
		dropdown = customDropdowns[moduleSlotIds[i]];
		if(dropdown.selectedEntry >= 0){
			data.modules += pow(10, dropdown.selectedEntry);
			var mods = getMultiplierModifications(dropdown.selectedEntry);
			data.speedMult += mods[0];
			data.productivityMult += mods[1];
			data.energyMult += mods[2];
			data.pollutionMult += mods[3];
		}
	}
	document.getElementById("changeMachineIcon").innerHTML = "";
	document.getElementById("changeMachineLevel").innerHTML = "";
	document.getElementById("modules").innerHTML = "";
	document.getElementById("beacons").innerHTML = "";
	document.getElementById("beaconAmount").value = 0;
	recalculate();
}
