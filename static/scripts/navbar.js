const logout = document.getElementById("logOut");
const contacts = document.getElementById("contacts");
const teams = document.getElementById("teams");

logout.addEventListener('click', function(e){
  e.preventDefault();

  var http = new XMLHttpRequest();
  http.open("POST", "/logout");
  http.onreadystatechange = function(){
    if(http.readyState==4 && http.status==200){
      var resp = http.responseText;
      resp = JSON.parse(resp);

      if(resp.status == 1){
        document.cookie = null;
        window.location.replace("/login");
      }else{
        alert(resp.message);
      }
    }else{
      handle_http_process(http);
    }
  }
  http.send(null);
});

contacts.addEventListener('click', function(e){
  e.preventDefault();

  var http = new XMLHttpRequest();
  http.open("GET", "/mycontacts");
  http.onreadystatechange = function(){
    if(http.readyState==4 && http.status==200){
      var resp = http.responseText;
      resp = JSON.parse(resp);

      if(resp.status == 1){
        display_contacts_window(resp.contacts);
      }else{
        alert(resp.message);
      }
    }else{
      handle_http_process(http);
    }
  }
  http.send(null);
});

teams.addEventListener('click', function(e){
  e.preventDefault();

  var http = new XMLHttpRequest();
  http.open("GET", "/myteams");
  http.onreadystatechange = function(){
    if(http.readyState==4 && http.status==200){
      var resp = http.responseText;
      resp = JSON.parse(resp);

      if(resp.status == 1){
        display_teams_window(resp.data);
      }else{
        alert(resp.message);
      }
    }else{
      handle_http_process(http);
    }
  }
  http.send(null);
});

function display_contacts_window(friends){
  const master = document.getElementById("masterContainer");
    const show_info = document.createElement("div");
    show_info.classList.add("container-fluid", "show-info");

      const show_friends_window = document.createElement("div");
      show_friends_window.classList.add("show-friends-window");

        const closeNavbar = document.createElement("div");
        closeNavbar.classList.add("close-navbar");
        closeNavbar.style.backgroundColor = "#3A1B7E";

          const closeButton = document.createElement("button");
          closeButton.classList.add("closeButton");
          closeButton.setAttribute("onclick", "close_black_window()");
          closeButton.innerHTML = "X";
        closeNavbar.appendChild(closeButton);

        const br = document.createElement("br");

        const main_container = document.createElement("div");
        main_container.classList.add("contacts-main", "container-fluid");

          for(var friend of friends){
            const item = document.createElement("div");
            item.classList.add("contact-item", "container-fluid");
            item.innerHTML = friend.username;

            main_container.appendChild(item);
          }
      show_friends_window.appendChild(closeNavbar);
      show_friends_window.appendChild(br);
      show_friends_window.appendChild(main_container);
    show_info.appendChild(show_friends_window);
  master.appendChild(show_info);
}

function display_teams_window(teams){
	const master = document.getElementById("masterContainer");

		const black_window = document.createElement("div");
		black_window.classList.add("show-info", "container-fluid");

			const teams_container = document.createElement("div");
			teams_container.classList.add("teams-container-general");

        const closeNav = document.createElement("div");
        closeNav.classList.add("close-navbar");
        closeNav.style.backgroundColor = "rgb(27, 106, 81)";

          const closeBtn = document.createElement("button");
          closeBtn.classList.add("closeButton");
          closeBtn.setAttribute("onclick", "close_black_window()");
          closeBtn.innerHTML = "X";
        closeNav.appendChild(closeBtn);

        const main_content = document.createElement("div");
        main_content.classList.add("teams-container-main", "container-fluid");

          const label = document.createElement("h6");
          label.style.textAlign = "center";
          label.innerHTML = "Your teams list.";

          const teams_list = document.createElement("ul");
          teams_list.classList.add("teams_list");
          for(var team of teams){
            const team_item = document.createElement("li");
            team_item.classList.add("team-item");
            team_item.setAttribute("data-id", team.Id);

              const team_name = document.createElement("div");
              team_name.classList.add("team-item-name");
              team_name.innerHTML = team.Name;

              const trash = document.createElement("button");
              trash.setAttribute("data-id", team.Id);
              trash.classList.add("trash-item-button");
              trash.setAttribute("onclick", "remove_team(this)");
              trash.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
              </svg>
              `;
            team_item.appendChild(team_name);
            team_item.appendChild(trash);

            teams_list.appendChild(team_item);
          }
        main_content.appendChild(label);
        main_content.appendChild(teams_list);
      teams_container.appendChild(closeNav);
      teams_container.appendChild(main_content);
    black_window.appendChild(teams_container);
  master.appendChild(black_window);
}

function b(){
  showInfo.style.visibility = 'hidden';
}

function remove_team(button){
  if(confirm("Are you sure you want to leave this team?")){
    const team_id = button.getAttribute("data-id");
    
    var http = new XMLHttpRequest();
    http.open("DELETE", `/myteams?team_id=${team_id}`);
    http.onreadystatechange = function(){
      if(http.readyState==4 && http.status==200){
        var resp = http.responseText;
        resp = JSON.parse(resp);

        if(resp.status == 1){
          const parent = button.parentNode;
          parent.remove();
        }else{
          alert(resp.message);
        }
       }else{
        handle_http_process(http);
      }
    }
    http.send(null);
  }
}