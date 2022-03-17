const calendar_container = document.querySelector('.calendar-container');
const tasks_container = document.querySelector('.calendar-tasks-container');
const month_names = document.querySelectorAll('.month-name-container');
const past_year = document.querySelector('.past-year');
const next_year = document.querySelector('.next-year');
const year_value = document.querySelector('.year-value');

console.log(mytasks);

var curr_month = moment().format('MMMM');
var curr_year = Number(moment().format('YYYY'));
console.log(mytasks);
for(var month of month_names){
    if(month.getAttribute('data-month').toLowerCase() == curr_month.toLowerCase()){
        month.classList.add('active');
    }
}

past_year.addEventListener('click', function(e){
    e.preventDefault();

    curr_year -= 1;
    if(curr_year > 0){
        year_value.innerHTML = curr_year;

    }else{
        curr_year += 1;
    }

    change_date(curr_year, curr_month, calendar_container, tasks_container);
});

next_year.addEventListener('click', function(e){
    e.preventDefault();

    curr_year += 1;
    year_value.innerHTML = curr_year;

    change_date(curr_year, curr_month, calendar_container, tasks_container);
});

console.log(mytasks);

var first = moment().startOf('month');
first = moment(first);
const first_day = get_first_day(first);
create_calendar(first_day, calendar_container);
add_tasks(calendar_container, mytasks);
set_click_event(calendar_container, tasks_container);

month_click_event(month_names, calendar_container, tasks_container);
console.log(mytasks);





//FUNCTIONS.
function get_first_day(first){  //Must be in moment format.
    var checker = first;
    while(checker.format('dddd').toLowerCase() != 'monday'){
        checker = checker.subtract(1, 'days');
        checker = moment(checker);
    }
    return checker;
}

function create_calendar(first, container){
    if(container){
        delete_boxes(container);
        var first_day = first;
        for(var i=0; i<42; i++){
            const calendar_box = document.createElement('div');
            calendar_box.classList.add("calendar-box", "day-value-box");
            calendar_box.setAttribute('data-date', first_day.format('YYYY-MM-DD'));
        
                const day_circle = document.createElement('div');
                day_circle.classList.add('day-circle');
                day_circle.innerHTML = first_day.format('DD');
            calendar_box.appendChild(day_circle);
        
            container.appendChild(calendar_box);
            first_day = first_day.add(1, 'day');
            first_day = moment(first_day);
        }
    }else{
        console.error("Missing calendar container for add calendar boxes");
    }
}

function add_tasks(container, tasks){
    console.log(tasks);
    const boxes = container.querySelectorAll('.day-value-box');
    for(var box of boxes){
        var count = 0;
        console.log(box.getAttribute('data-date'));
        for(var task of tasks){
            const task_date = moment(task.Date.split('T')[0]).format('YYYY-MM-DD');
            console.log(task_date);
            if(box.getAttribute('data-date') == task_date){
                count++;
            }
        }
        console.log("-------------------------");
        if(count > 0){
            const color = setTaskColor(box.getAttribute('data-date'));
            const task_count = document.createElement('div');
            task_count.classList.add('task-count');
            task_count.innerHTML = count;
            task_count.style.color = color;
            task_count.style.borderColor = color;
            box.appendChild(task_count);
        }
    }
}

function delete_boxes(container){
    const boxes = container.querySelectorAll('.day-value-box');
    for(var box of boxes){
        box.remove();
    }
}

function set_click_event(container, tasks_container){
    const boxes = container.querySelectorAll('.day-value-box');
    for(var box of boxes){
        box.addEventListener('click', function(e){
            e.preventDefault();
            tasks_container.innerHTML = null;

            const box_date = this.getAttribute('data-date');
            for(var task of mytasks){
                const task_date = moment(task.Date.split('T')[0]).format('YYYY-MM-DD');
                if(box_date == task_date){
                    const disp_task_container = document.createElement('div');
                    disp_task_container.classList.add('displayed-task-container', 'container');
                        const disp_task = document.createElement('p');
                        disp_task.classList.add('displayed-task', 'h5');
                        disp_task.innerHTML = task.Name + `<span class="disp-task-imp"> (${task.Priority})</span>`;
                    disp_task_container.appendChild(disp_task);
                    tasks_container.appendChild(disp_task_container);
                }
            }
        });
    }
}

function month_click_event(month_names, container, tasks_container){
    for(var month of month_names){
        month.addEventListener('click', function(e){
            e.preventDefault();

            for(var mt of month_names){
                mt.classList.remove('active');
            }
            this.classList.add('active');

            const year = curr_year;
            const month = this.getAttribute('data-month');
            change_date(year, month, container, tasks_container);
        });
    }
}

function change_date(new_year = curr_year, new_month = curr_month, container, tasks_container){
    const date = new_year + "-" + new_month;
    var first = moment(date).startOf('month');
    first = moment(first);

    const first_day = get_first_day(first);
    create_calendar(first_day, container);
    add_tasks(container, mytasks);
    set_click_event(container, tasks_container);
}