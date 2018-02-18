var customDropdowns = new Array();
var MODULESLOTBORDER = 2;

function customDropdownInit(x, y, size, maxWidth){
	// x, y, padding size in pixels. maxWidth in blocks
	var id = customDropdowns.length;
	var entries = new Array();
	customDropdowns.push({
		opened: 0,
		entries: 0,
		entryList: entries,
		selectedEntry: -1,
		iconSize: size,
		width: maxWidth
		});
	return "<div id=\"CDD" + id + "\" onClick=\"CDDClickedMain(" + id + ")\" style=\"width: " + size + "; height: " + size + "; left: " + x + "; top: " + y + ";\" class=\"customDropdownMain\"></div>";
}

function customDropdownAddEntry(id, item){
	customDropdowns[id].entryList.push(item);
	customDropdowns[id].entries++;
}

function getCDDById(id){
	return document.getElementById("CDD" + id);
}

function CDDSelect(id, optionId){
	getCDDById(id).innerHTML = document.getElementById("CDDE" + optionId).innerHTML;
	customDropdowns[id].selectedEntry = optionId;
	CDDClose(id);
}

function CDDOpen(id, x, y){
	CDDCloseAll();
	var dropdown = customDropdowns[id];
	var width = (dropdown.entries >= dropdown.width ? dropdown.width : dropdown.entries) * dropdown.iconSize;
	var height = Math.ceil(dropdown.entries / (dropdown.width > 0 ? dropdown.width : 1)) * dropdown.iconSize;
	var entriesCode = "";
	for(var i = 0; i < height/dropdown.iconSize; ++i){
		var rowSize = (dropdown.entries - i*dropdown.width < dropdown.width ? dropdown.entries - i*dropdown.width : dropdown.width);
		for(var j = 0; j < rowSize; ++j){
			var index = i * 3 + j;
			entriesCode += "<div id=\"CDDE" + index + "\" style=\"width:" + dropdown.iconSize + "; height:" + dropdown.iconSize
			+ "; left:" + j*dropdown.iconSize + "; top:" + i*dropdown.iconSize + "\" class=\"customDropdownEntry\" onClick=\"CDDSelect(" + 
			id + ", " + index + ")\"><img src=\"../images/" + scoreToDash(dropdown.entryList[index]) + ".png\" style=\"width:" + dropdown.iconSize + "; height:" + dropdown.iconSize + ";\"></div>";	
		}
	}
	document.body.innerHTML += "<div id=\"CDDOPTIONS" + id 
	+ "\" style=\"width:" + width + "; height:" + height + "; left:" + (x + MODULESLOTBORDER) + "; top:" 
	+ (y + dropdown.iconSize + 3*MODULESLOTBORDER) + ";\" class=\"customDropdownOptions\">" + entriesCode + "</div>";
	dropdown.opened = 1;
}

function CDDClose(id){
	// add functionality to close other opened windows
	if(document.getElementById("CDDOPTIONS" + id) != null){
		var elem = document.getElementById("CDDOPTIONS" + id);
		elem.parentNode.removeChild(elem);
		customDropdowns[id].opened = 0;
	}
}

function CDDCloseAll(){
	for(var i = 0; i < customDropdowns.length; ++i){
		CDDClose(i);
	}
}

function CDDForceSelection(id, optionId){
	var dropdown = customDropdowns[id];
	getCDDById(id).innerHTML = "<img src=\"../images/" + scoreToDash(dropdown.entryList[optionId]) + ".png\" style=\"width:" + dropdown.iconSize + "; height:" + dropdown.iconSize + ";\">";
	customDropdowns[id].selectedEntry = optionId;
}

function CDDClickedMain(id){
	var dropdownID = getCDDById(id);
	var x = getOffsetLeft(dropdownID);
	var y = getOffsetTop(dropdownID);
	customDropdowns[id].opened ? CDDClose(id) : CDDOpen(id, x, y);
}
