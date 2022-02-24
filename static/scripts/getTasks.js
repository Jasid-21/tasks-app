function taskItem(task, cont){
	const item_container = document.createElement("li");
	item_container.setAttribute("class", "my-own-carousel-item-container");
	const item = document.createElement("div");
	item.setAttribute("class", "my-own-carousel-item");
	item.setAttribute("data-id", task.Id);

	const container = document.createElement("div");
	container.setAttribute("class", "container-fluid");
	container.style.display = "flex";
	container.style.padding = "0px";

	const p1 = document.createElement("p");
	p1.setAttribute("class", "nameP h4");
	p1.style.width = "90%";
	p1.innerHTML = task.Name;

	const dropdown = document.createElement("div");
	dropdown.setAttribute("class", "dropdown");

	const ghost_btn = document.createElement("button");
	ghost_btn.setAttribute("class", "btn btn-ghost dropdown-toggle");
	ghost_btn.setAttribute("id", `dropdownMenuButton${cont}`);
	ghost_btn.type = "button";
	ghost_btn.setAttribute("data-bs-toggle", "dropdown");
	ghost_btn.setAttribute("aria-expanded", "false");

	const ul = document.createElement("ul");
	ul.setAttribute("class", "dropdown-menu");
	ul.setAttribute("aria-labelledby", `dropdownMenuButton${cont}`);

	const li1 = document.createElement("li");
	const a1 = document.createElement("a");
	a1.setAttribute("class", "dropdown-item viewOption");
	a1.innerHTML = "View";
	li1.appendChild(a1);

	const li2 = document.createElement("li");
	const a2 = document.createElement("a");
	a2.setAttribute("class", "dropdown-item option-item deleteOption");
	a2.setAttribute("href", "#");
	a2.innerHTML = "Delete";
	li2.appendChild(a2);

	ul.appendChild(li1);
	ul.appendChild(li2);

	dropdown.appendChild(ghost_btn);
	dropdown.appendChild(ul);

	container.appendChild(p1);
	container.appendChild(dropdown);

	const days = moment(task.Date.split("T")[0]).diff(moment(), 'days');
	const color = setTaskColor(task.Date.split("T")[0]);

	const p2 = document.createElement("p");
	p2.setAttribute("class", "h6");
	p2.innerHTML = task.Date.split("T")[0];
	p2.style.color = color;
	p2.style.marginBottom = "0px";

	const dateDet = document.createElement("p");
	dateDet.style.fontSize = "12px";
	dateDet.style.fontWeight = "500";
	dateDet.style.color = color;
	dateDet.innerHTML += `(${days<0?days*(-1):days} `;
	dateDet.innerHTML += days<0?"days ago)":"days left)";

	const hr = document.createElement("hr");

	const p3 = document.createElement("p");
	p3.setAttribute("class", "h6");
	p3.innerHTML = task.Description;

	item.appendChild(container);
	item.appendChild(p2);
	item.appendChild(dateDet);
	item.appendChild(hr);
	item.appendChild(p3);
	item_container.appendChild(item);

	a1.addEventListener("click", function(e){
		e.preventDefault();

		var parent = this.parentNode;
		parent = parent.parentNode;
		parent = parent.parentNode;
		parent = parent.parentNode;
		parent = parent.parentNode;
		var taskId = parent.getAttribute('data-id');
		for(var task of mytasks){
			if(task.Id == taskId){
				more_task_info(task, taskId);
				break;
			}
		}
	});

	a2.addEventListener("click", function(e){
		e.preventDefault();

		var parent = this.parentNode;
		parent = parent.parentNode;
		parent = parent.parentNode;
		parent = parent.parentNode;
		parent = parent.parentNode;
		var task_id = parent.getAttribute('data-id');
		if(confirm('Are you sure you want to delete this task?')){
			var http = new XMLHttpRequest();
			http.open("DELETE", `/deleteTask?task_id=${task_id}`);
			http.onreadystatechange = function(){
				if(http.readyState==4 && http.status==200){
					var resp = http.responseText;
					resp = JSON.parse(resp);

					if(resp.status == 1){
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
	});

	return item_container;
}

function setTaskColor(date){
	const nowDate = moment();
	const taskDate = moment(date);
	const days = moment(taskDate).diff(nowDate, 'days');
	var color = "";

	if(days < 0){
		color = "red";
	}

	if(days>=0 && days<1){
		color = "orange";
	}

	if(days>=1 && days<3){
		color = "#D6D31D";
	}

	if(days>=3){
		color = "green";
	}

	return color;
}

function more_task_info(data, taskId){
	const master = document.getElementById("masterContainer");
	const showInfo = document.createElement("div");
	showInfo.setAttribute("class", "show-info container-fluid");


	const showTaskGeneral = document.createElement("div");
	showTaskGeneral.setAttribute("id", "showTask-general");

		const closeNavbar = document.createElement("div");
		closeNavbar.setAttribute("class", "close-navbar");

			const closeButton = document.createElement("button");
			closeButton.setAttribute("class", "closeButton");
			closeButton.setAttribute("onclick", "close_black_window()");
			closeButton.innerHTML = "X";

		closeNavbar.appendChild(closeButton);

		const container = document.createElement("div");
		container.setAttribute("class", "container");
		container.setAttribute("id", "showTask");

			const div1 = document.createElement("div");
			div1.style.display = "flex";
			div1.style.justifyContent = "flex-end";

				const div11 = document.createElement("div");
				div11.style.justifySelf = "flex-end";
				div11.innerHTML = `N° ${taskId}`;

			div1.appendChild(div11);

			const div2 = document.createElement("div");
			div2.setAttribute("class", "container-fluid");
			div2.style.display = "flex";
			div2.style.justifyContent = "center";
			div2.style.backgroundColor = "#3C9625";

				const div21 = document.createElement("div");
				div21.setAttribute("class", "h4");
				div21.style.color = "white";
				div21.innerHTML = data.Name;

			div2.appendChild(div21);

			const div3 = document.createElement("div");
			div3.setAttribute("id", "priorTeamDate");
			div3.setAttribute("class", "row");
			div3.style.textAlign = "center";
			div3.style.marginTop = "10px";

				const div31 = document.createElement("div");
				div31.setAttribute("class", "h6 col-12 col-sm-4");

					const div311 = document.createElement("div");
					div311.innerHTML = "Priority";
					const priorP = document.createElement("p");
					priorP.innerHTML = data.Priority;

				div31.appendChild(div311);
				div31.appendChild(priorP);

				const div32 = document.createElement("div");
				div32.setAttribute("class", "h6 col-12 col-sm-4");
				
					const div321 = document.createElement("div");
					div321.innerHTML = "Team";

					const p321 = document.createElement("p");
					p321.innerHTML = "None";
				
				div32.appendChild(div321);
				div32.appendChild(p321);

				const div33 = document.createElement("div");
				div33.setAttribute("class", "h6 col-12 col-sm-4");

					const div331 = document.createElement("div");
					div331.innerHTML = "Date";

					const p331 = document.createElement("p");
					p331.innerHTML = data.Date;

				div33.appendChild(div331);
				div33.appendChild(p331);
			div3.appendChild(div31);
			div3.appendChild(div32);
			div3.appendChild(div33);

			const div4 = document.createElement("div");
			div4.style.backgroundColor = "#8EE178";
			div4.style.minHeight = "100px";
			div4.innerHTML = data.Description;

		container.appendChild(div1);
		container.appendChild(div2);
		container.appendChild(div3);
		container.appendChild(div4);

	showTaskGeneral.appendChild(closeNavbar);
	showTaskGeneral.appendChild(container);

	showInfo.appendChild(showTaskGeneral);
	master.appendChild(showInfo);
}

function validateFilters(tasks){
	const color = localStorage.getItem("tasks_app_color_filter");
	const prior = localStorage.getItem("tasks_app_prior_filter");

	var colorArray = new Array();
	var priorArray = new Array();

	if(color){
		var limits = new Array();
		if(color == "red"){
			limits[0] = -Infinity;
			limits[1] = 0;
		}

		if(color == "orange"){
			limits[0] = 0;
			limits[1] = 1;
		}

		if(color == "yellow"){
			limits[0] = 1;
			limits[1] = 3;
		}

		if(color == "green"){
			limits[0] = 3;
			limits[1] = Infinity;
		}

		for(var task of tasks){
			const taskDate = moment(task.Date);
			const nowDate = moment();
			const days = taskDate.diff(nowDate, 'days');

			if(days >= limits[0] && days < limits[1]){
				colorArray.push(task);
			}
		}
	}else{
		colorArray = tasks;
	}

	if(prior){
		for(var task of tasks){
			if(task.Priority == prior){
				priorArray.push(task);
			}
		}
	}else{
		priorArray = tasks;
	}

	var finalItems = new Array();
	if(colorArray.length>0 && priorArray.length>0){
		for(var item of colorArray){
			for(var item2 of priorArray){
				if(item.Id == item2.Id){
					finalItems.push(item);
				}
			}
		}
	}

	return finalItems;
}

var mytasks = new Array();