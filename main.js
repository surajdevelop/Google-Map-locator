	var prev_infowindow = false;

	function initMap(){
		
		// Initial Location through IP Address using ipinfo.io
		var request = new XMLHttpRequest();
		var apiCall = "https://ipinfo.io/json";
		request.open('GET',apiCall,true);
		request.onload = function(){
		 	var data = JSON.parse(request.responseText);
		 	var latLong = data.loc.split(",");
    		var Latitude = latLong[0];
    		var Longitude = latLong[1];
    		var coords = new google.maps.LatLng(Latitude,Longitude); // Setting initial Marker Co-ordinates.

			var map = new google.maps.Map(document.getElementById("map"),{
				zoom:2,
				center: coords
			});

			var marker = new google.maps.Marker({
				position: coords,
				map: map
			});
		
			map.addListener('click', function(e){
		
				getWeatherConditions(e.latLng, map);
			});

		}
		request.send(null);
		
	}

	   function getWeatherConditions(latLng,map){
	   	// Getting Weather Details using open weather map
		var request = new XMLHttpRequest();
		var apiCall = "https://api.openweathermap.org/data/2.5/weather?lat="+latLng.lat()+"&lon="+latLng.lng()+"&appid=e980d8d2a13a7b5fbe9c75b7af3571a9";
		request.open('GET',apiCall,true);
		request.onload = function(){
		 	var data = JSON.parse(request.responseText);
    		var description = data.weather[0].description;	
    		var temp = data.main.temp ;
    		getDateTime(latLng,map,description,temp);
    		
		 }
		request.send(null);

	}
	
	  function getDateTime(latLng, map, desc, temp){
	  	// Getting Date and Time by using google timezone api, and converting offset to Real Date and Time.
		var request = new XMLHttpRequest();
		var targetDate = new Date();
		var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset()*60;
		var apiCall = "https://maps.googleapis.com/maps/api/timezone/json?location="+latLng.lat()+","+latLng.lng()+"&timestamp="+timestamp+"&key=AIzaSyAlOqeWZDcS4f5PVebZph1sFCCWUgPekS8";
		request.open('GET',apiCall,true);
		var dst,raw,offsets,localDate;
		request.onload = function(){
			var data = JSON.parse(request.responseText);
        	dst = data.dstOffset;
			raw =  data.rawOffset;
			offsets = dst*1000 + raw*1000;
			localDate = new Date(timestamp*1000+offsets);
			var dateAndTime =  localDate.toLocaleString().split(", ");
			var date = dateAndTime[0];
			var time = dateAndTime[1];
			showInfoWindow(latLng,map,desc,temp,date,time);
		}
		request.send(null);

	}

	function showInfoWindow(latLng,map, desc,temp,date,time){
		// Showing Collected Data on Window
		var contentString = document.getElementById("window");
		var h1 = document.getElementById("date");
		var h2 = document.getElementById("localTime");
		h1.innerHTML = 'Current Date: ' + date;
		h2.innerHTML = 'Current Time: ' + time;
		var weatherDetails = document.getElementById("weather");
		var description = document.getElementById("desc");
		var temperature = document.getElementById("temp");
		weatherDetails.innerHTML = " <br> Weather Details ";
		description.innerHTML = 'Condition : ' + desc;
		temperature.innerHTML = 'Temperature : ' + temp + " K";
		 if( prev_infowindow ) {
           prev_infowindow.close();
       		}
		var infowindow = new google.maps.InfoWindow({
    	content: contentString
  		});
  		infowindow.setPosition({lat: latLng.lat(), lng: latLng.lng()});
  		infowindow.open(map);
  		prev_infowindow = infowindow;
	}
