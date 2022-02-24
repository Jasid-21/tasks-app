const itemsDiv = document.getElementById('itemsDiv');

var text = '';
var cont = 0;
for(team of teams){
	text += `
	<div class="container-fluid">
		<div class="friend-item">
			<div class="container">
				<p class="h3">${team[1]}</p>
				<div style="display:flex; justify-content:space-between; margin-bottom:2vh;">
					<div id="usersList" class="container-fluid list">`
					var usersTeam = usersforTeams[cont];
					if(usersTeam != "nothing"){
						text += `<strong>Users</strong>`
						for(var n=0; n<usersTeam.length; n++){
							text += `<p class="userName">${usersTeam[n]}</p>`
						}	
					}else{
						text += `<strong>Users</strong>
						<p style="text-decoration-line: none;">No users for show</p>`
					}
					text += `</div>
					<div id="tasksList" class="container-fluid list">
					`
					var tasksTeam = tasksforTeams[cont];
					if(tasksTeam != "nothing"){
						text += `<strong>Tasks</strong>`
						for(var n=0; n<tasksTeam.length; n++){
							text += `<p class="taskName" data-id="${tasksTeam[n][0]}">${tasksTeam[n][1]}</p>`
						}	
					}else{
						text += `<strong>Tasks</strong>
						<p style="text-decoration-line: none;">No tasks for show</p>`
					}
					text += `</div>
				</div>
				<p class="h5" style="margin:0;background-color:#DEDDE1;">Description:</p>
				<p style="margin:0; text-align:justify; background-color:#DEDDE1;">${team[2]}</p>`
		text += `
			</div>
		</div>
	</div>`
	cont++;
}
itemsDiv.innerHTML = text;

const taskNames = document.getElementsByClassName('taskName');
if(!showInfo){
	const showInfo = document.getElementById('showInfo');
}

for(var task of taskNames){
	task.addEventListener('click', function(e){
		e.preventDefault();

		const taskId = this.getAttribute('data-id');
		const userId = localStorage.getItem('userId');
		const token = localStorage.getItem('token');
		const link = '/showTask?userId='+userId+'&token='+token+'&taskId='+taskId;
		
		var http = new XMLHttpRequest();
		http.open('GET', link);
		http.onreadystatechange = function(){
			if(http.readyState==4 && http.status==200){
				var data = http.responseText;
				data = JSON.parse(data);
				showInfo.innerHTML = showTaskFunc(data, taskId);
				showInfo.style.visibility = 'visible';
			}else{
				console.log("readyState: ", http.readyState);
				console.log("status: ", http.status);
			}
		}
		http.send(null);
	});
}

function showTaskFunc(data, taskId){
	var text = '';
	text += `
	<div id="showTask-general">
	  <div class="my-close-navbar">
	    <button class="closeButton" onclick="b();">X</button>
	  </div>
	  <div class="container" id="showTask">
	    <div style="display:flex; justify-content:flex-end;">
	      <div style="justify-self:flex-end;">Nº ${taskId}</div>
	    </div>
	    <div class="container-fluid" style="display:flex; justify-content:center; background-color:#3C9625;">
	      <div class="h4" style="color:white;">${data.name}</div>
	    </div>
	    <div id="priorTeamDate" class="row" style="text-align:center; margin-top:10px;">
	      <div class="h6 col-12 col-sm-4">
	        <div>Priority</div>
	        <p>${data.prior}</p>
	      </div>
	      <div class="h6 col-12 col-sm-4">
	        <div>Team</div>
	        <p>${data.teamName}</p></div>
	      <div class="h6 col-12 col-sm-4" style="border:0px;">
	        <div>Date</div>
	        <p>${data.date}</p>
	      </div>
	    </div>
	    <div style="background-color:#8EE178; min-height:100px;">${data.desc}</div>
	  </div>
	</div>`
	return text;
}