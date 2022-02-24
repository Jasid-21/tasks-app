const form = document.getElementById("form");

form.addEventListener('submit', function(e){
	e.preventDefault();

	const formData = new FormData(this);
	var http = new XMLHttpRequest();
	http.open("POST", "/login");
	http.onreadystatechange = function(){
		if(http.readyState==4 && http.status==200){
			var resp = http.responseText;
			resp = JSON.parse(resp);

			if(resp.status == 1){
				const cookieName = resp.cookieName,
                cookieValue = resp.cookieValue,
                cookieTime = resp.cookieTime;
                const newCookie = `${cookieName}=${cookieValue}; expires = ${cookieTime}`;

                document.cookie = newCookie;
                localStorage.setItem("STR_session_object", JSON.stringify({
                    user_id: resp.user_id,
                    username: resp.username
                }));
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