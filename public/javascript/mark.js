function myFunction() {
    var x = document.getElementById("mySelect").selectedIndex;
    // console.log(x);
    if (x == 3) {
        var room_name = "Private" + Math.floor((Math.random() * 100000) + 1);
        document.getElementById('room_name').value = room_name;
        console.log(room_name);
    }
    
    else if(x == 4) {
        var room_name = "Private" + document.getElementById('room_to_join').value;
        document.getElementById('room_name').value = room_name;
        console.log(room_name);
    }
    else {
        document.getElementById('room_name').value = document.getElementsByTagName("option")[x].value;
        console.log(document.getElementsByTagName("option")[x].value);
    }
    console.log(x);
}
var room_name;

function makeRoom(){
            room_name = Math.floor((Math.random() * 3) + 1);
            console.log(room_name);

            if (room_name == 1) {
                room_name = "room 1" ;
            }
            else if (room_name == 2 ) {
                room_name = "room 2" ;
            }
            else{
                room_name = "room 3" ;
            }


        //document.getElementById('room_name').value = room_name;
        console.log(room_name);
        return room_name;
}
