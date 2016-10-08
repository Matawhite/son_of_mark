
function getQueryVariable(variable) {

		name = document.getElementById('mark_screen_name').value;
		room_name = makeRoom();
		console.log(name + " " + room_name);


		return [name,room_name];
}
