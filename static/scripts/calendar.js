const actualDay = moment();

const firstDay = actualDay.startOf('month');
const first = get_first_day(firstDay);
const last = get_last_day(moment(actualDay.endOf('month')));
create_calendar(first, actualDay, last);
for(var task of mytasks){
    const date = moment(task.Date).format('YYYY-MM-DD');
    add_calendar_task(task, date);
}




//FUNCTIONS.
function get_first_day(firstDay){
    var day;
    var moment_day = moment(firstDay);
    for(var i=1; i<8; i++){
        var new_day = moment_day.subtract(i, 'days')
        var string_new_day = new_day.format('dddd');
        string_new_day = string_new_day.toLowerCase();
        if(string_new_day == "monday"){
            day = new_day;
            break;
        }
    }
    return day;
}

function get_last_day(last_day){
    var day;
    var moment_day = moment(last_day);
    for(var i=1; i<8; i++){
        var new_day = moment_day.add(i, 'days')
        var string_new_day = new_day.format('dddd');
        string_new_day = string_new_day.toLowerCase();
        if(string_new_day == "sunday"){
            day = new_day;
            break;
        }
    }
    return day;
}

function create_calendar(first, actual, final){
    const calendar = document.querySelector(".days-box-zone");
    var date = first;
    const difference = final.diff(first, 'days');

    var weeks = new Array();
    for(var i=0; i<difference/7; i++){
        const week = document.createElement('div');
        week.classList.add('calendar-week');
        week.classList.add('container-fluid');

        weeks.push(week);
    }

    var cont = 0;
    for(var i=0; i<=difference; i++){
        const box = document.createElement('div');
        box.classList.add('calendar-box');
        box.classList.add('calendar-general-box');
        box.setAttribute('id', date.format('YYYY-MM-DD'));
            const num_circle = document.createElement('div');
            num_circle.classList.add('num-cirlce');
            num_circle.innerHTML = date.format('DD');

            const day_tasks_container = document.createElement('div');
            day_tasks_container.classList.add('day-tasks-container');
            day_tasks_container.classList.add('container-fluid');

                const tasks_counter = document.createElement('div');
                tasks_counter.classList.add('task-counter');
                var counter = 0;
                for(var task of mytasks){
                    if(moment(task.Date).format('YYYY-MM-DD') == date.format('YYYY-MM-DD')){
                        counter++;
                    }
                }
                if(counter == 0){
                    tasks_counter.style.display = "none";
                }
                tasks_counter.innerHTML = counter;
            day_tasks_container.appendChild(tasks_counter);

        box.appendChild(num_circle);
        box.appendChild(day_tasks_container);

        weeks[cont].appendChild(box);

        if(date.format('dddd').toLowerCase() == 'sunday'){
            cont++;
        }
        date = date.add(1, 'days');
        date = moment(date);
    }

    for(var week of weeks){
        calendar.appendChild(week);
    }
}

function add_calendar_task(task, day){
    const day_box = document.getElementById(day);
    if(day_box){
        const tasks_box_container = day_box.querySelector('.day-tasks-container');
        const color = set_calendar_color(task);

        const task_box = document.createElement('div');
        task_box.classList.add('task-box');
        task_box.classList.add('container');
        task_box.setAttribute('data-color2', color[1]);
        task_box.style.border = `2px solid ${color[0]}`;
        task_box.style.color = color[0];
        task_box.innerHTML = task.Name;

        task_box.addEventListener('mousemove', function(e){
            const color2 = this.getAttribute('data-color2');
            this.style.backgroundColor = color2;
            this.style.cursor = 'pointer';
            this.style.fontWeight = "600";
        });

        task_box.addEventListener('mouseleave', function(e){
            const color2 = this.getAttribute('data-color2');
            this.style.backgroundColor = 'transparent';
            this.style.cursor = 'default';
            this.style.fontWeight = "400";
        });

        tasks_box_container.appendChild(task_box);
    }
}

function set_calendar_color(task){
    const imp = task.Priority;

    if(imp.toLowerCase() == 'relax'){
        return ["#18BFB3", "#AEE6E5"];
    }

    if(imp.toLowerCase() == 'normal'){
        return ["#1846BF", "#ADB8E5"];
    }

    if(imp.toLowerCase() == 'important'){
        return ["#8518BF", "#D1ADE5"];
    }

    if(imp.toLowerCase() == 'very'){
        return ["#BF183B", "#E6AEAE"];
    }
}