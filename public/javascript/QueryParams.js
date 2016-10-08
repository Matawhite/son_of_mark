// function getQueryVariable(variable) {


//     var query = window.location.search.substring(1);
//     var vars = query.split('&');
//     for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split('=');
//         if (decodeURIComponent(pair[0]) == variable) {
//             return decodeURIComponent(pair[1].replace(/\+/g, ' '));
//         }
//     }
    
//     return undefined;



function getQueryVariable(variable) {

		name = document.getElementById('mark_screen_name').value;
		//room_name = document.getElementById('room_name').value;
		room_name = makeRoom();
		console.log(name + " " + room_name);


		return [name,room_name];
}
