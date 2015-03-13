/*
 *
 *		Created by: Nicolas Sempere
 *		Date Created: 11 March 2015
 *
 */


var login = "KendallRumfelt";
var map;
var marker;
var myInfoWindow = new google.maps.InfoWindow();

function findMyLocation()
{
		if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(fetchCoords, err);
		}
		else {
				document.getElementById("mapCanvas").innerHTML = "<p> Geolocation is not supported </p>";
		}
}


/* Helper functions for findMyLocation() */
function err(position)
{

		var obj = document.getElementById("mapCanvas");
		obj.innerHTML = "<p class = 'otherFeedBack'> We couldn't find your position </p>";
}

function fetchCoords(position) 
{
		pos = "login=" + login + 
		      "&lat=" + position.coords.latitude + 
		      "&lng=" + position.coords.longitude;

		mapMyself(position.coords.latitude, position.coords.longitude);
		sendMyLocation(pos);
}


function mapMyself(lat, lng)
{

		console.log(lat + "   " + lng);
		myPos = new google.maps.LatLng(lat, lng);
		ISolemnlySwearIAmUpToNoGood(myPos);
}

/* Had to make the reference. This function initilaizes a map object and displays it on the page. */
function ISolemnlySwearIAmUpToNoGood(myPos) 
{


	document.getElementById("magic").innerHTML = "The real Maurauder's Maps";

	console.log(myPos);
	myDetails = {
					zoom: 8,
					center: myPos,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

	map = new google.maps.Map(document.getElementById("mapCanvas"), myDetails);

	marker = new google.maps.Marker({ position: myPos, title: login});
	marker.setMap(map);
	google.maps.event.addListener(marker, 'click', function(){

			myInfoWindow.setContent(marker.title);
			myInfoWindow.open(map, marker);
	});

	
	console.log("passed map initialization");
}


function sendMyLocation(position)
{

	request = new XMLHttpRequest();
	var URI = "http://secret-about-box.herokuapp.com/sendLocation";

	request.open("POST", URI, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = parseLocationFeedback;

	request.send(position);

}


function parseLocationFeedback()
{
		if 	(request.readyState == 4 &&	request.status == 200) {
				var peers = JSON.parse(request.response);
				displayOtherUsers(peers);
		}

}

function displayOtherUsers(peers) 
{

		for (var i = 0; i < peers.length; i++) {
		 		var peerPosition = new google.maps.LatLng(peers[i].lat, peers[i].lng);
		 		var peerMarker = new google.maps.Marker({position: peerPosition, title: peers[i].login});
		 		peerMarker.setMap(map);
		};
}
