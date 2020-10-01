$(document).ready(function () {
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    $('.tooltipped').tooltip({
        enterDelay: 500
    });
    $(".dropdown-trigger").dropdown({
        constrainWidth: false,
        container: document.getElementById('main'),
    });
    $(".dropdown-trigger-nav").dropdown({
        constrainWidth: false,
        container: document.getElementById('main'),
        hover: true,
        coverTrigger: false
    });
    $('.modal').modal();
    $('.modal-not-dismissible').modal({ dismissible: false });
    $('#modal').modal('open');
    //Create an alert if there is a message waiting on the page.
    if (document.getElementById('message') !== null) {
        message = document.getElementById('message').getAttribute('data-message');
        if ((message !== null) && (message !== '')) {
            alert(message);
        }
    }
});

