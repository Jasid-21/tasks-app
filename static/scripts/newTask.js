const form = document.getElementById("submitForm");
const cancelButton = document.querySelector('.cancelButton');

form.addEventListener('submit', function(e){
	e.preventDefault();

	const formData = new FormData(this);
	var http = new XMLHttpRequest();
	http.open("POST", `/newTask?team_id=${selectedTeam}`);
	http.onreadystatechange = function(){
		if(http.readyState==4 && http.status==200){
			var resp = http.responseText;
			resp = JSON.parse(resp);

			if(resp.status == 1){
				const inputs = document.querySelectorAll("input");
				const textarea = document.querySelector('textarea');
				console.log(inputs);
				for(var input of inputs){
					if(input.getAttribute("type") != "radio"){
						input.value = null;
					}
				}
				textarea.value = null;
			}
		}else{
			handle_http_process(http);
		}
	}
	http.send(formData);
});

cancelButton.addEventListener('click', function(e){
	e.preventDefault();
	window.location.replace("/");
});