function handle_http_process(http){
    console.log(`readyState: ${http.readyState}`);
    console.log(`status: ${http.status}`);
}

function close_black_window(){
    const black_window = document.querySelector(".show-info");
    black_window.remove();
}