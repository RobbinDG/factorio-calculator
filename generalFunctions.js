function create2DArray(x){
	// x is height, width is unknown
	var arr = new Array(x);
	for(var i = 0; i < x; ++i){
		arr[i] = new Array();
	}
	return arr;
}

function addRow(arr){
	arr[arr.length] = new Array();
	return arr;
}

function clear2DArray(arr, x){
	for(var i = 0; i < x; ++i){
		arr[i] = [];
	}
	return arr;
}

function toReadable(str){
	var out = "", letterIndex = 0;
	for(let letter of str){
		if(letterIndex == 0){
			var letterCode = letter.charCodeAt(0);
			var newLetter = (letterCode >= 48 && letterCode <= 57) ? letterCode : (letterCode-32);
			letter = String.fromCharCode(newLetter);
			letterIndex++;
		} else if(letter == "_"){
			letter = " ";
			letterIndex = 0;
		}
		out += letter;
	}
	return out;
}

function scoreToDash(str){
	var out = "";
	for(let letter of str){
		if(letter == '_'){
			letter = '-';
		}
		out += letter;
	}
	return out;
}

function decodeLocation(str){
	var i = str.indexOf("-");
	return [str.slice(0, i), str.slice(i+1)];
}

function getOffsetLeft( elem )
{
    var offsetLeft = 0;
    do {
		if ( !isNaN( elem.offsetLeft ) )
		{
			offsetLeft += elem.offsetLeft;
		}
    } while( elem = elem.offsetParent );
    return offsetLeft;
}

function getOffsetTop( elem )
{
    var offsetTop = 0;
    do {
		if ( !isNaN( elem.offsetTop ) )
		{
			offsetTop += elem.offsetTop;
		}
    } while( elem = elem.offsetParent );
    return offsetTop;
}
