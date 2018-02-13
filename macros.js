function craftExceptions(itemF){
	var objectInput, objectOutput;
	if(itemF == "petrolium" || itemF == "light_oil" || itemF == "heavy_oil"){
		var e = document.getElementById("refinery");
		var input = "input" + e.options[e.selectedIndex].value;
		var output = "output" + e.options[e.selectedIndex].value;
		if(e.options[e.selectedIndex].value == 3){ warnings[0] = 1; }
		objectInput = recipes[itemF][input];
		objectOutput = recipes[itemF][output];
	} else {
		objectInput = recipes[itemF].input;
		objectOutput = recipes[itemF].output;
	}
	return [objectInput, objectOutput];
}

function getMineSpeed(resource, level){
	if(level == 1 && resource == "uranium_ore"){ warnings[1] = 1; level = 2}
	var hardness = 0.9, time = 2, power = 3, speed = 0.5;
	switch(resource){
		case "stone":
			hardness = 0.4;
			break;
		case "uranium_ore":
			time = 4;
			break;
		default:
			break;
	}
	if(level == 1){ power = 2.5, speed = 0.35 }
	return ((power - hardness) * speed / time);
}

//pointed variable
var correctedLevel;

function getCraftSpeed(item){
	correctedLevel = 1;
	var machine = recipes[item].machine.type;
	switch(machine){
		case "assembling_machine":
			var e = document.getElementById("assembling_machine");
			var level = e.options[e.selectedIndex].value * 1;
			if(level < recipes[item].machine.level) { warnings[2] = 1; level = recipes[item].machine.level; }
			correctedLevel = level;
			switch(level){
				case 1:
					return 0.5;
					break;
				case 2:
					return 0.75;
					break;
				case 3:
					return 1.25;
					break;
				default:
					break;
			}
			break;
		case "furnace":
			var e = document.getElementById("furnace");
			var level = e.options[e.selectedIndex].value * 1;
			correctedLevel = level;
			switch(level){
				case 1:
					return 1;
					break;
				default:
					return 2;
					break;
			}
			break;
		case "mining_drill":
			var e = document.getElementById("mining_drill");
			var level = e.options[e.selectedIndex].value;
			correctedLevel = level;
			return getMineSpeed(item, level);
			break;
		default:
			return 1;
			break;
	}
	alert("Unable to get craft speed");
}

