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
	var allowProd = ((recipes[item].level == 2 || recipes[item].level == 0) ? true : false);
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

function displayModuleSlots(machine, level, item){
	// TODO: some items do not allow productivity modules
	// TODO: remove module from machine if one is selected
	var slotSize = 32, padding = 4, borderSize;
	moduleSlotIds = [];
	document.getElementById("modules").innerHTML = "";
	document.getElementById("modules").style.height = 2*(slotSize+2) + 4*padding;
	document.getElementById("modules").style.width = 2*(slotSize+2) + 4*padding;
	var slots = getModuleCapacity(machine, level);
	var rows = Math.ceil(slots/2), bottomRows = (slots >= 2 ? slots - 2 : 0), topRows = slots - bottomRows;
	for(var i = 0; i < 2; ++i){
		if(i < topRows){
			var left = (i + (topRows%2)/2) * slotSize + (i*2 + 1 - (topRows%2)) * padding;
			document.getElementById("modules").innerHTML += customDropdownInit(left, padding, slotSize, 3);
			addModuleListToDropdown(customDropdowns.length-1, item);
			moduleSlotIds.push(customDropdowns.length-1);
		}
		if(i < bottomRows){
			var left = (i + (bottomRows%2)/2) * slotSize + (i*2 + 1 + (bottomRows%2)) * padding;
			document.getElementById("modules").innerHTML += customDropdownInit(left, ((slotSize+2) + 3*padding), slotSize, 3);
			addModuleListToDropdown(customDropdowns.length-1, item);
			moduleSlotIds.push(customDropdowns.length-1);
		}
	}
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
	for(var i = 0; i < moduleSlotIds.length; ++i){
		dropdown = customDropdowns[moduleSlotIds[i]];
		if(dropdown.selectedEntry >= 0){
			data.modules += pow(10, dropdown.selectedEntry);
		}
	}
}
