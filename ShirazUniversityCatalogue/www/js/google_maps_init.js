function initialize()
{
	console.log("load completed!");
	console.log("what?!");
  	call_all_waiting_function();
  	var elems = jQuery('.maps-placeholder');
  	elems.hide();
}
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';

  
  document.body.appendChild(script);
}

window.onload = loadScript;