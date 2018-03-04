<html>
	<head>
		<title>Test</title>
		<link rel="stylesheet" type="text/css" href="style.css">
		 <!-- <script scr="jquery-3.3.1.min.js"></script> -->
	</head>
	<body>
		<div class="input">
			<select id="final" class="final" onchange="update()"></select>
			<input id="amount" class="amount" type="text" value="1" onchange="update()"/> per second
		</div>
		<div class="selection">
			<table style="padding: 0px; width: 100%; height: 100%"><tr>
			<td><center>
			<div id="changeMachineIcon" class="machine" style="position: relative;"></div>
			<select id="changeMachineLevel" class="changeMachine">
				<option>No Options</option>
			</select>
			</center></td>
			<td><center>
				<p>modules</p>
				<div id="modules" class="modules"></div>
			</center></td>
			<td><center>
				<p>beacons</p>
				<div id="beacons" class="modules"></div>
				<input id="beaconAmount" class="beaconAmount" type="number" max="12" value="0"/>
			</center></td>
			</tr><tr><td colspan="3">
				<center><button id="save_changes" onclick="saveChanges()">Save Changes</button></center>
			</td></tr></table>
		</div>
		<div id="frame" class="frame"></div><br>
		<select id="assembling_machine" onchange="update()">
			<option value="1">Level 1</option>
			<option value="2" selected>Level 2</option>
			<option value="3">Level 3</option>
		</select>
		<select id="furnace" onchange="update()">
			<option value="1">Stone Furnace</option>
			<option value="2" selected>Steel Furnace</option>
			<option value="3">Electric Furnace</option>
		</select>
		<select id="fuel" onchange="update()">
			<option value="1" selected>Coal</option>
			<option value="2">Solid Fuel</option>
			<option value="3">Rocket Fuel</option>
			<option value="4">Nuclear Fuel</option>
		</select>
		<select id="mining_drill" onchange="update()">
			<option value="1">Burner Mining Drill</option>
			<option value="2" selected>Electric Mining Drill</option>
		</select>
		<select id="refinery" onchange="update()">
			<option value="1" selected>Oil Processing</option>
			<option value="2">Advanced Oil Processing</option>
			<option value="3">Coal Liquefaction</option>
		</select>
		<p class="below" id="warnings">Warnings: none</p>
		<p class="below" id="requirements">Required Materials: </p>
		<p class="below" id="readyState">Loading...</p>
		<script src="customDropdown.js"></script>
		<script src="generalFunctions.js"></script>
		<script src="macros.js"></script>
		<script src="machineEditor.js"></script>
		<script src="treeGenerator.js"></script>
		<script src="script.js"></script>
	</body>
</html>
