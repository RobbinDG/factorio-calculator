// MACROS
var BLOCKSIZE = 32;

// STRUCTURES
var craftTree = create2DArray(1);
var objectList = new Array();

// GLOBALS
var correctedLevel;

function addBlock(item, machineCnt, machineType, location){
	// Adds the block to the display and returns the block id/coordinates
}

function makeBlock(item, machineCnt, machineType, id){
	// Returns string code for div that makes up the block
}

function shiftBranch(startId){
	// shifts a branch from a startId to the right until the tree is correctly spaced
}

function shiftRight(id){
	// Internally shifts the coordinate of a block 1 block to the right
}

function checkAndFixOverlap(/*something here*/){
	// Checks if the given node overlaps with previous ones, and shifts it if needed
}

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

function newPath(parentPath, i, depth){
	return parentPath + (i+1)*Math.pow(10, depth);
}

function createNode(item, reqAmount, depth, position, path, parentRowIndex){
	// Creates a node for internal use, and sets the appropriate data
	// Path is sequence of indexes from child to child, lowest level
	// 	in front
	// reqAmount = total amount required to be made (unaffected by the amount produced and modules)
	var productionQuantity = craftExceptions(item)[1][0].amount;
	var machinesR = recipes[item].craft_time / getCraftSpeed(reqItem) * reqAmount / productionQuantity;

	craftTree[depth].push({
		item: item, 
		amount: reqAmount,
		path: path,
		pos: position,
		parentIndex: parentRowIndex, 
		machines: machinesR,
		machine: recipes[item].machine.type,
		level: correctedLevel,
		modules: 0,
		beacons: 0,
		beaconCnt: 0,
		speedMult:1,
		productivityMult:1,
		energyMult:1,
		pollutionMult:1
	});
}

function getChildren(item){
	if(recipes[item].level == 0)
		return 0;
	return craftExceptions(item)[0].length;
}

function generateDiagram(item, depth, craftMultiplier, 
	childIndex, parentPath, parentRowIndex){
	// Internally generates an (2D-)array to store the diagram data
	// Depth is in indexes, starting from 0
	if(craftTree.length == depth){
		addRow(craftTree);
	}

	var path = newPath(parentPath, childIndex, depth);
	var left, right;
	var children = getChildren(item);
	for(var i = 0; i < children; ++i){
		var child = craftExceptions(item)[0][i];
		var rowIndex = craftTree[depth].length; //node has yet to be added
		var y = Math.max(parentRowIndex - (children-1) + 2*i, 
			(rowIndex == 0 ? Number.MIN_SAVE_INTEGER : rowIndex));
		generateDiagram(child.item, depth+1, craftMultiplier * child.amount,
		 i, path, y);
		if(i == 0) left = y;
		if(i == children-1) right = y;
	}
	createNode(item, craftMultiplier, depth, (left + right)/2, path, parentRowIndex);
}

function displayDiagram(){
	// Renders the diagram to the screen
}

function makeDiagram(){
	// Starts the generation process
	generateDiagram();
	displayDiagram();
}