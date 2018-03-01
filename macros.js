function craftExceptions(itemF){
	var objectInput, objectOutput;
	if(itemF == "petrolium_gas" || itemF == "light_oil" || itemF == "heavy_oil"){
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


