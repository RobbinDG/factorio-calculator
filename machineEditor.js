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

function addModuleListToDropdown(id){
	customDropdownAddEntry(id, "effectivity_module");
	customDropdownAddEntry(id, "effectivity_module_2");
	customDropdownAddEntry(id, "effectivity_module_3");
	customDropdownAddEntry(id, "speed_module");
	customDropdownAddEntry(id, "speed_module_2");
	customDropdownAddEntry(id, "speed_module_3");
	customDropdownAddEntry(id, "productivity_module");
	customDropdownAddEntry(id, "productivity_module_2");
	customDropdownAddEntry(id, "productivity_module_3");
}

function displayModuleSlots(machine, level, item){
	// TODO: some items do not allow productivity modules
	// TODO: remove module from machine if one is selected
	var slotSize = 32, padding = 4, borderSize;
	document.getElementById("modules").innerHTML = "";
	document.getElementById("modules").style.height = 2*(slotSize+2) + 4*padding;
	document.getElementById("modules").style.width = 2*(slotSize+2) + 4*padding;
	var slots = getModuleCapacity(machine, level);
	var rows = Math.ceil(slots/2), bottomRows = (slots >= 2 ? slots - 2 : 0), topRows = slots - bottomRows;
	for(var i = 0; i < 2; ++i){
		if(i < topRows){
			var left = (i + (topRows%2)/2) * slotSize + (i*2 + 1 - (topRows%2)) * padding;
			document.getElementById("modules").innerHTML += customDropdownInit(left, padding, slotSize, 3);
			addModuleListToDropdown(customDropdowns.length-1);
			moduleSlotIds.push(customDropdowns.length-1);
		}
		if(i < bottomRows){
			var left = (i + (bottomRows%2)/2) * slotSize + (i*2 + 1 + (bottomRows%2)) * padding;
			document.getElementById("modules").innerHTML += customDropdownInit(left, ((slotSize+2) + 3*padding), slotSize, 3);
			moduleSlotIds.push(customDropdowns.length-1);
		}
	}
}

function loadMachineEditor(machine, level, item, location){
	currentInEditor = location;

	// load machine level selector
	document.getElementById("changeMachineLevel").innerHTML = "<option>No Options</option>";
	if(machine != "chemical_plant" && machine != "centrifuge" && machine != "offshore_pump"){
		document.getElementById("changeMachineLevel").innerHTML = document.getElementById(machine).innerHTML;
	}
	document.getElementById("changeMachineLevel").selectedIndex = (level-1).toString();
	var op = document.getElementById("changeMachineLevel").getElementsByTagName("option");
	for(var i = 1; i < recipes[item].machine.level; ++i){
		op[i-1].disabled = true;
	}
	
	// load module slots (functionality yet to be implemented)
	displayModuleSlots(machine, level, item);
}

function saveChanges(){
	var m = decodeLocation(currentInEditor);
	var data = craftTree[m[0]][m[1]];
	for(var i = 0; i < moduleSlotIds.length; ++i){
		dropdown = customDropdowns[moduleSlotIds[i]];
		alert(dropdown.selectedEntry);
		switch(dropdown.selectedEntry){
			case 0: data.modules += 100000000; break;
			case 1: data.modules += 10000000; break;
			case 2: data.modules += 1000000; break;
			case 3: data.modules += 100000; break;
			case 4: data.modules += 10000; break;
			case 5: data.modules += 1000; break;
			case 6: data.modules += 100; break;
			case 7: data.modules += 10; break;
			case 8: data.modules += 1; break;
			default: break;
		}
	}
	alert(data.modules);

}
