$(document).ready(function(){
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    $('.tooltipped').tooltip();
    $('.modal').modal();
    $('.modal-not-dismissible').modal({ dismissible: false});
    $('#modal').modal('open');

    message = document.getElementById('message').value;
    console.log(message)
    if ((message !== null) && (message != undefined)){
        alert(message);
    }
});

