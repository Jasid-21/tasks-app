const newContact = document.getElementById("newFriendLink");
const newTeam = document.getElementById("newTeamLink");
const colorButton = document.getElementById("colorButton");
const colorItems = document.getElementsByClassName("colorFilter-item");
const carousel = document.querySelector(".my-own-carousel-list");
const removeColor = document.getElementById("removeC");

document.addEventListener('DOMContentLoaded', function(){
	var cont = 0;
	var newTasks = validateFilters(mytasks);
	for(var task of newTasks){
		carousel.appendChild(taskItem(task, cont));
	}
	const color = localStorage.getItem("tasks_app_color_filter");
	if(color){
		colorButton.style.color = color!="yellow"?color:"#D6D31D";
	}
});

removeColor.addEventListener('click', function(e){
	e.preventDefault();

	localStorage.removeItem("tasks_app_color_filter");
	colorButton.style.color = "black";
	carousel.innerHTML = null;
	var newTasks = validateFilters(mytasks);
	var cont = 0;
	for(var task of newTasks){
		carousel.appendChild(taskItem(task, cont));
	}
});

for(var item of colorItems){
	item.addEventListener('click', function(e){
		e.preventDefault();

		const color = this.getAttribute("data-color");
		localStorage.setItem("tasks_app_color_filter", color);
		colorButton.style.color = color!="yellow"?color:"#D6D31D";
		carousel.innerHTML = null;
		var newTasks = validateFilters(mytasks);
		var cont = 0;
		for(var task of newTasks){
			carousel.appendChild(taskItem(task, cont));
		}
	});
}

newContact.addEventListener('click', function(e){
	e.preventDefault();

	const master = document.getElementById("masterContainer");
		const windowContainer = document.createElement("div");
		windowContainer.setAttribute("class", "show-info container-fluid");

			const newContactWindow = document.createElement("form");
			newContactWindow.setAttribute("id", "new-contact-window");
			newContactWindow.setAttribute("class", "new-contact-window");

				const closeNavbar = document.createElement("div");
				closeNavbar.setAttribute("class", "close-navbar container-fluid");
				closeNavbar.style.backgroundColor = "#1C4A8E";

					const closeButton = document.createElement("button");
					closeButton.setAttribute("class", "closeButton");
					closeButton.setAttribute("onclick", "close_black_window()");
					closeButton.innerHTML = "X";
				closeNavbar.appendChild(closeButton);

				const main_content = document.createElement("div");
				main_content.setAttribute("class", "new-contact-main");

					const instruct = document.createElement("h6");
					instruct.style.textAlign = "center";
					instruct.innerHTML = "Type your friend's username:";
				
					const input_friend = document.createElement("input");
					input_friend.type = "text";
					input_friend.placeholder = "E.g. Sefirot Hunter";
					input_friend.setAttribute("class", "friend-name-input");
					input_friend.name = "friendname";

					const hr = document.createElement("hr");

					const error_message = document.createElement("div");
					error_message.setAttribute("class", "container friend-not-found");
					error_message.innerHTML = "User not found...";

					const done_message = document.createElement("div");
					done_message.setAttribute("class", "container friend-added-success");
					done_message.innerHTML = "Friend added successfully!";

					const submit = document.createElement("button");
					submit.type = "submit";
					submit.setAttribute("class", "friend-submit-button");
					submit.innerHTML = "Submit";
				main_content.appendChild(instruct);
				main_content.appendChild(input_friend);
				main_content.appendChild(hr);
				main_content.appendChild(done_message);
				main_content.appendChild(error_message);
				main_content.appendChild(submit);
			newContactWindow.appendChild(closeNavbar);
			newContactWindow.appendChild(main_content);

		windowContainer.appendChild(newContactWindow);
	master.appendChild(windowContainer);

	newContactWindow.addEventListener('submit', function(e){
		e.preventDefault();
		done_message.style.display = "none";
		error_message.style.display = "none";

		const formData = new FormData(this);
		var http = new XMLHttpRequest();
		http.open("POST", "/newFriend");
		http.onreadystatechange = function(){
			if(http.readyState==4 && http.status==200){
				var resp = http.responseText;
				resp = JSON.parse(resp);

				if(resp.status == 1){
					done_message.style.display = "block";
				}else{
					error_message.style.display = "block";
					error_message.innerHTML = resp.message;
				}
			}else{
				handle_http_process(http);
			}
		}
		http.send(formData);
	});
});

newTeam.addEventListener('click', function(e){
	e.preventDefault();

	var http = new XMLHttpRequest();
	http.open("GET", "/mycontacts");
	http.onreadystatechange = function(){
		if(http.readyState==4 && http.status==200){
		var resp = http.responseText;
		resp = JSON.parse(resp);

		if(resp.status == 1){
			display_new_team(resp.contacts);
		}else{
			alert(resp.message);
		}
		}else{
			handle_http_process(http);
		}
	}
	http.send(null);
});

function display_new_team(contacts){
	const master = document.getElementById("masterContainer");
		const blackWindow = document.createElement("div");
		blackWindow.classList.add("show-info", "container-fluid");

			const form = document.createElement("form");
			form.classList.add("new-team-form");

				const closeNav = document.createElement("div");
				closeNav.classList.add("close-navbar");
				closeNav.style.backgroundColor = "rgb(18, 124, 60)";

					const closeBtn = document.createElement("button");
					closeBtn.setAttribute("onclick", "close_black_window()");
					closeBtn.classList.add("closeButton");
					closeBtn.innerHTML = "X";
				closeNav.appendChild(closeBtn);

				const main_content = document.createElement("div");
				main_content.classList.add("new_team_main", "container-fluid");

					const h6 = document.createElement("h6");
					h6.style.textAlign = "center";
					h6.innerHTML = "Select contacts";

					const friendsList = document.createElement("div");
					friendsList.classList.add("friends-list");

					var cont = 1;
					for(var contact of contacts){
							const checkDiv = document.createElement("div");
							checkDiv.classList.add("check-friend-container", "container-fluid");
								const checkItem = document.createElement("input");
								checkItem.type = "checkbox";
								checkItem.name = "contact_" + cont;
								checkItem.value = contact.Id;
								checkItem.classList.add("friend-item-check");

								const label = document.createElement("label");
								label.setAttribute("for", contact.Id);
								label.classList.add("friend-item-label");
								label.innerHTML = contact.username;
							checkDiv.appendChild(checkItem);
							checkDiv.appendChild(label);
						friendsList.appendChild(checkDiv);
						cont++;
					}
					const team_name = document.createElement("input");
					team_name.type = "text";
					team_name.name = "team_name";
					team_name.required = "true";
					team_name.classList.add("new-team-name");
					team_name.placeholder = "Type the team name";

					const br = document.createElement("br");

					const submit = document.createElement("button");
					submit.type = "submit";
					submit.classList.add("new-team-submit");
					submit.innerHTML = "Submit";
				main_content.appendChild(h6);
				main_content.appendChild(friendsList);
				main_content.appendChild(team_name);
				main_content.appendChild(br);
				main_content.appendChild(submit);
			form.appendChild(closeNav);
			form.appendChild(main_content);
		blackWindow.appendChild(form);
	master.appendChild(blackWindow);

	form.addEventListener('submit', function(e){
		e.preventDefault();

		const formData = new FormData(this);
		var http = new XMLHttpRequest();
		http.open("POST", "/newTeam");
		http.onreadystatechange = function(){
			if(http.readyState==4 && http.status==200){
				var resp = http.responseText;
				resp = JSON.parse(resp);

				if(resp.status == 1){
					close_black_window();
				}else{
					alert(resp.message);
				}
			}else{
				handle_http_process(http);
			}
		}
		http.send(formData);
	});
}