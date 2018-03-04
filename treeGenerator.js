// MACROS
var BLOCKSIZE = 64;

// STRUCTURES
var craftTree;
var objectList = new Array();

// GLOBALS
var correctedLevel;


function makeBlock(object, depth, index, leftmost, leftCorrection){
	// Returns string code for div that makes up the block
	return "<div id=\"" + depth + "-" + index + "\" onClick=\"openEditor('" + 
		depth + "-" + index + "')\" class=\"machine\" style=\"left: " +
		((object.pos - leftmost)*BLOCKSIZE + leftCorrection )+ "; top: " + depth*2*BLOCKSIZE + ";\">" +
		toReadable(object.item) + "<br>" + toReadable(object.machine) + " "
		+ Math.ceil(object.machines) + "</div>";
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
	var machinesR = recipes[item].craft_time / getCraftSpeed(item) * reqAmount / productionQuantity;

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

function clearDiagram(){
	craftTree = "";
	craftTree = create2DArray(1);
	document.getElementById("frame").innerHTML = "";
}

function generateDiagram(item, depth, craftMultiplier, 
	childIndex, parentPath, parentRowIndex, parentPos){
	// Internally generates an (2D-)array to store the diagram data
	// Depth is in indexes, starting from 0
	if(craftTree.length == depth){
		addRow(craftTree);
	}

	var path = newPath(parentPath, childIndex, depth);
	var rowIndex = craftTree[depth].length; //node has yet to be added
	// left/right initially are the proposed position for THIS node
	// they change later to adjust for the children
	var left, right;
	left = right = Math.max(parentPos, (rowIndex == 0 ? Number.MIN_SAFE_INTEGER : (craftTree[depth][rowIndex-1].pos + 2)));
	var children = getChildren(item);
	for(var i = 0; i < children; ++i){
		var child = craftExceptions(item)[0][i];
		var p = generateDiagram(child.item, depth+1, craftMultiplier * child.amount,
		 i, path, rowIndex, left);
		if(i == 0) left = p;
		if(i == children-1) right = p;
	}
	var pos = Math.ceil((left + right)/2);
	createNode(item, craftMultiplier, depth, pos, path, parentRowIndex);
	return pos;
}

function getLeftmost(){
	var leftmost = Number.MAX_SAFE_INTEGER;
	for(var i = 0; i < craftTree.length; ++i){
		leftmost = Math.min(leftmost, craftTree[i][0].pos);
	}
	return leftmost;
}

function getRightmost(){
	var rightmost = Number.MIN_SAFE_INTEGER;
	for(var i = 0; i < craftTree.length; ++i){
		rightmost = Math.max(rightmost, craftTree[i][craftTree[i].length-1].pos);
	}
	return rightmost;
}

function displayDiagram(){
	// Renders the diagram to the screen
	var leftmost = getLeftmost();
	var rightmost = getRightmost();
	var frame = document.getElementById("frame");
	for(var i = 0; i < craftTree.length; ++i){
		var leftCorrection = (frame.offsetWidth >= (rightmost+1)*BLOCKSIZE ? (frame.offsetWidth - (rightmost+1)*BLOCKSIZE)/2 : 0);
		for(var j = 0; j < craftTree[i].length; ++j){
			frame.innerHTML += makeBlock(craftTree[i][j], i, j, leftmost, leftCorrection);
		}
	}
	if(frame.offsetWidth < (rightmost+1)*BLOCKSIZE)
		frame.scrollTo((craftTree[0][0].pos - leftmost + 1/2)*BLOCKSIZE - frame.offsetWidth/2, 0);
}

function makeDiagram(item, amount){
	// Starts the generation process
	clearDiagram();
	generateDiagram(item, 0, amount, 0, 0, -1, 0);
	displayDiagram();
}