//VAREIABLES AND MODULES.
const express = require('express');
const app = express();
const multer = require("multer");
const moment = require('moment');
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
require("dotenv").config();

//CONFIGURATION.
const storage = multer.diskStorage({
	destination: "static/database",
	filename: "file"
})
const upload = multer({
	storage: storage
})
const connection = mysql.createPool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(cookieParser());

//ROUTES.
app.get("/login", function(req, resp){
	resp.render("login");
});

app.post("/login", upload.single(""), function(req, resp){
	const username = req.body.username;
	const password = req.body.password;

	connection.query(`SELECT * FROM users WHERE username = '${username}'`, function(error, data){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error trying to login into your account..."});
		}else{
			if(data.length > 0){
				const dbPass = data[0].password;
				bcrypt.compare(password, dbPass, function(error, result){
					if(error){
						console.log(error);
						resp.send({status: 0, message: "Error trying to login into your account..."});
					}else{
						if(result == true){
							const session_id = createToken(30);
							connection.query(`INSERT INTO sessions (session_id, user_id) VALUES ('${session_id}', '${data[0].Id}')`, function(error2){
								if(error2){
									console.log(error2);
									resp.send({status: 0});
								}else{
									resp.send({
										status: 1,
										username: username,
										cookieName: "session_cookie",
										cookieValue: session_id,
										cookieTime: new Date(2025, 0, 1).toUTCString(),
										user_id: data.Id
									});
								}
							});
						}else{
							resp.send({status: 0, message: "Error in username or password. Check it and try again..."});
						}
					}
				});
			}else{
				resp.send({status: 0, message: "User not found..."});
			}
		}
	});
});

app.post("/logout", validateSession, function(req, resp){
	const user_id = req.id;
	const session_id = req.cookies.session_cookie;

	connection.query(`SELECT * FROM sessions WHERE session_id = '${session_id}' AND user_id = '${user_id}'`, function(error, data){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error trying to logout. Please try later..."});
		}else{
			if(data.length > 0){
				connection.query(`DELETE FROM sessions WHERE session_id = '${session_id}'`, function(error2){
					if(error2){
						console.log(error2);
						resp.send({status: 0, message: "Error trying to logout. Please try later..."});
					}else{
						resp.send({status: 1});
					}
				});
			}else{
				resp.send({status: 0, message: "Session not found..."});
			}
		}
	});
});

app.get("/signup", function(req, resp){
	resp.render("signUp");
});

app.post("/signup", upload.single(""), function(req, resp){
	console.log(req.body);
	const username = req.body.username;
	const password1 = req.body.password1;
	const password2 = req.body.password2;

	if(password1 === password2){
		connection.query(`SELECT username FROM users WHERE username = '${username}'`, function(error, data){
			if(error){
				console.log(error);
				resp.send({status: 0, message: "Error trying to register user..."});
			}else{
				if(data.length > 0){
					resp.send({status: 0, message: "This username is already used..."});
				}else{
					const newPass = bcrypt.hash(password1, 10, function(error, hash){
						if(error){
							console.log(error);
							resp.send({status: 0, message: "Error trying to create user. Please, try again later..."});
						}else{
							createUser(username, hash).then(function(response){
								console.log(response);
								if(response.done == true){
									resp.send({status: 1, username: username, user_id: response.user_id});
								}else{
									resp.send({status: 0, message: "Error trying to create user..."});
								}
							}).catch(function(error){
								console.log(error);
								resp.send({status: 0, message: "Error trying to create user..."});
							});
						}
					});
				}
			}
		});
	}else{
		resp.send({status: 0, message: "Passwords doesn't match..."})
	}
});

app.get("/", validateSession, function(req, resp){
	const user_id = req.id;

	connection.query(`SELECT * FROM 
	(Users_Teams 
	INNER JOIN Teams_Tasks 
	ON Users_Teams.team_id = Teams_Tasks.team_id)
	INNER JOIN Tasks
	ON Teams_Tasks.task_id = Tasks.Id 
	AND Users_Teams.user_id = '${user_id}'`, function(error, data){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error geting tasks..."});
		}else{
			resp.render('home', {tasks: data});
		}
	});
});

app.get('/newTask', validateSession, function(req, resp){
	const user_id = req.id;
	connection.query(`SELECT * FROM Users_Teams 
	INNER JOIN Teams
	ON Users_Teams.team_id = Teams.Id
	AND Users_Teams.user_id = '${user_id}'`, function(error, data){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error trying to get your teams..."});
		}else{
			resp.render('newTaskForm', {teamNames: data, userId: user_id});
		}
	});
});

app.post('/newTask', [validateSession, upload.single("")], function(req, resp){
	const name = req.body.name,
	priority = req.body.priority,
	date = req.body.date,
	desc = req.body.desc,
	team_id = req.query.team_id;

	//Crear la tarea.
	connection.query(`INSERT INTO Tasks (Name, Priority, Date, Description) VALUES ('${name}', '${priority}', '${date}', '${desc}')`, function(error, ret){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error trying to save your task..."});
		}else{
			const task_id = ret.insertId;
			connection.query(`INSERT INTO Teams_Tasks (team_id, task_id) VALUES ('${team_id}', '${task_id}')`, function(error){
				if(error){
					console.log(error);
					resp.send({status: 0, message: "Erroy trying to save your task..."});
				}else{
					resp.send({status: 1});
				}
			});
		}
	});
});

app.delete('/deleteTask', validateSession, function(req, resp){
	const task_id = req.query.task_id;
	connection.query(`DELETE FROM Tasks WHERE Id = '${task_id}'`, function(error){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error trying to delete task..."});
		}else{
			connection.query(`DELETE FROM Teams_Tasks WHERE task_id = '${task_id}'`, function(error){
				if(error){
					console.log(error);
					resp.send({status: 0, message: "Error trying to delete task..."});
				}else{
					resp.send({status: 1});
				}
			});
		}
	});
});

app.post("/newFriend", [validateSession, upload.single("")], function(req, resp){
	const user_id = req.id;
	const friendname = req.body.friendname;

	connection.query(`SELECT Id FROM users WHERE username = '${friendname}'`, function(error, data){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error searching your friend's name..."});
		}else{
			if(data.length > 0){
				const friend_id = data[0].Id;
				if(friend_id != user_id){
					connection.query(`SELECT * FROM Contacts 
					WHERE user_id_1 = '${user_id}' AND user_id_2 = '${friend_id}' 
					OR user_id_1 = '${friend_id}' AND user_id_2 = '${user_id}'`, function(error, data){
						if(error){
							console.log(error);
							resp.send({status: 0, message: "Error searching this contact..."});
						}else{
							if(data.length > 0){
								resp.send({status: 0, message: "This contact alredy exist..."});
							}else{
								const date = moment().format("YYYY-MM-DD");
								connection.query(`INSERT INTO Contacts (user_id_1, user_id_2, date) VALUES ('${user_id}', '${friend_id}', '${date}')`, function(error){
									if(error){
										console.log(error);
										resp.send({status: 0, message: "Error inserting new contact..."});
									}else{
										resp.send({status: 1});
									}
								});
							}
						}
					});
				}else{
					resp.send({status: 0, message: "Your contact matches with your user id..."});
				}
			}else{
				resp.send({status: 0, message: "User not found..."});
			}
		}
	});
});

app.get("/mycontacts", validateSession, function(req, resp){
	const user_id = req.id;

	connection.query(`SELECT * FROM 
	(SELECT * FROM Contacts WHERE Contacts.user_id_1 = '${user_id}' OR Contacts.user_id_2 = '${user_id}') AS subtable
	INNER JOIN users
	ON subtable.user_id_1 = users.Id OR subtable.user_id_2 = users.Id`, function(error, data){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error geting your contacts..."});
		}else{
			if(data.length > 0){
				var contacts = new Array();
				for(var contact of data){
					if(contact.Id != user_id){
						contacts.push(contact);
					}
				}
				resp.send({status: 1, contacts: contacts});
			}else{
				resp.send({status: 0, message: "Contacts not found..."});
			}
		}
	});
});

app.post("/newTeam", [validateSession, upload.single("")], function(req, resp){
	const user_id = req.id;
	const body = req.body;

	connection.query(`INSERT INTO Teams (Name) VALUES ('${body.team_name}')`, function(error, ret){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Inserting team name failed..."});
		}else{
			const team_id = ret.insertId;
			var query = `INSERT INTO Users_Teams (user_id, team_id) VALUES (${user_id}, ${team_id})`;
			for(var item in body){
				if(item != "team_name"){
					query += `, ('${body[item]}', '${team_id}')`;
				}
			}
			connection.query(query, function(error){
				if(error){
					console.log(error);
					resp.send({status: 0, message: "Error inserting group members..."});
				}else{
					resp.send({status: 1});
				}
			});
		}
	});
});

app.get("/myteams", validateSession, function(req, resp){
	const user_id = req.id;

	connection.query(`SELECT * FROM Users_Teams 
	INNER JOIN Teams
	ON Users_Teams.team_id = Teams.Id
	AND Users_Teams.user_id = '${user_id}'`, function(error, data){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error geting teams..."});
		}else{
			resp.send({status: 1, data: data});
		}
	});
});

app.delete("/myteams", validateSession, function(req, resp){
	const user_id = req.id;
	const team_id = req.query.team_id;

	connection.query(`DELETE FROM Users_Teams WHERE user_id='${user_id}' AND team_id='${team_id}'`, function(error){
		if(error){
			console.log(error);
			resp.send({status: 0, message: "Error removing group from your list"});
		}else{
			resp.send({status: 1});
		}
	});
});





//FUNCTIONS
function createToken(tamToken){
	const charsA = "abcdefghijklmnopqrstuvwxyz";
	const charsB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charsC = "0123456789";
	const totalChars = charsA + charsB + charsC;
	const tamString = totalChars.length;
	var finalToken = "";

	for(var n=0; n<tamToken; n++){
		finalToken += totalChars.charAt(Math.round(Math.random()*tamString));
	}

	return finalToken;
}

function createUser(username, password){
	return new Promise(function(resolve, reject){
		connection.query(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`, function(error, ret){
			if(error){
				console.log(error);
				reject(Error({done: false}));
			}else{
				const user_id = ret.insertId;
				connection.query(`INSERT INTO Teams (name) VALUES ('myself')`, function(error, ret){
					if(error){
						console.log(error);
						reject(Error({done: false}));
					}else{
						const team_id = ret.insertId;
						connection.query(`INSERT INTO Users_Teams (user_id, team_id) VALUES ('${user_id}', '${team_id}')`, function(error){
							resolve({done: true, user_id: user_id});
						});
					}
				});
			}
		});
	});
}

async function validateSession(req, resp, next){
	const session_id = req.cookies.session_cookie;
	connection.query(`SELECT * FROM sessions WHERE session_id = '${session_id}'`, function(error, data){
		if(error){
			console.log(error);
			resp.redirect("/login");
		}else{
			if(data.length > 0){
				req.id = data[0].user_id;
				next();
			}else{
				resp.redirect("/login");
			}
		}
	});
}

app.listen(app.get('port'), function(){
	console.log("Server listening in port: ", app.get('port'));
});