const form = document.getElementById("form");

form.addEventListener('submit', function(e){
	e.preventDefault();

	const formData = new FormData(this);
	var http = new XMLHttpRequest();
	http.open("POST", "/signup");
	http.onreadystatechange = function(){
		if(http.readyState==4 && http.status==200){
			var resp = http.responseText;
			resp = JSON.parse(resp);
			console.log(resp);
			if(resp.status == 1){
				window.location.replace("/");
			}else{
				alert(resp.message);
			}
		}else{
			handle_http_process(http);
		}
	}
	http.send(formData);
});