jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

$('[data-toggle="tooltip"]').tooltip();

var monthAvailable = [];
var dateFinal = '';
var timeFinal = '';

fetchAvailableDays();

console.log(monthAvailable);

$(document).ready(function() {

    $('#calendar').datepicker({
        inline: true,
        firstDay: 1,
        showOtherMonths: true,
        selectOtherMonths: false,
        prevText: "<i class='fa fa-arrow-left'></i>",
        nextText: "<i class='fa fa-arrow-right'></i>",
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        beforeShowDay: highlightDays,
        onSelect: function(date, inst){
            dateFinal = date;

            initTimeModal();

            $('#myModal').modal('show');
        }
    });

    var timeStart = 0;
    var timeStop = 0;
    var isSelected = false;

    $(".tile").click(function(){
        if($(this).hasClass('tile-free')){

            if($(this).hasClass('tile-selected')){
                isSelected = false;
                $(this).removeClass('tile-selected');
                timeFinal = $(this).attr("title");
                $(".selectedTime").html(timeFinal);
            }else{
                if(!isSelected){
                    isSelected = true;
                    $(this).addClass('tile-selected');
                    timeStart = $(this).attr("data-start");
                    timeStop = $(this).attr("data-stop");
                    $(".selectedTime").html(timeStart + " - " + timeStop);
                }else{
                    $('.tile-selected').removeClass('tile-selected');
                    $(this).addClass('tile-selected');
                    timeStart = $(this).attr("data-start");
                    timeStop = $(this).attr("data-stop");
                    $(".selectedTime").html(timeStart + " - " + timeStop);
                }
            }  
        }
    });

    $("#submitTime").click(function(event) {
        timeFinal = timeStart + " - " + timeStop;
        $('#myModal').modal('hide');
        $('#modalEnd #dateTime').html(dateFinal + " " + timeFinal);
        $('#modalEnd').modal('show');
    });


});

function initTimeModal(){

    var json = '';

    for(var i = 1; i <= 12; i++){
        if(Math.random() < 0.3){
            json += ('"'+ i +'": false,');
            console.log(json);
        }else{
            json += ('"'+ i +'": true,');
        }
    }

    $.mockjax({
        url: '/api/day/',
        responseTime: 0,
        responseText: "{"+json.substring(0, json.length-1)+"}"
    });

    $.ajaxSetup({
        async: false
    });
 
    $.getJSON("/api/day/", function(data){
         $.each(data, function(index, value) {
            if(value == true){
                $("#tile"+index+"").addClass('tile-free');
                $("#tile"+index+"").html("<i class='fa fa-calendar-check-o fa-2x'></i>");
            }else{
                $("#tile"+index+"").html("<i class='fa fa-calendar-times-o fa-2x'></i>");
            }
        });
    });
}

function fetchAvailableDays(year, month)
{
    var start_date = '';
 
    // if a month and year were supplied, build a start_date in yyyy-mm-dd format
    if (year != undefined && month != undefined) {
      start_date = year +'-';
      start_date += month +'-';
      start_date += '01';
    }

    var json = "";

    for(var i = 1; i <= 31; i++){
        if(Math.random() < 0.3){
            json += ('"'+ i +'": false,');
            console.log(json);
        }else{
            json += ('"'+ i +'": true,');
        }
    }

    $.mockjax({
        url: '/api/*',
        responseTime: 0,
        responseText: "{"+json.substring(0, json.length-1)+"}"
    });

    $.ajaxSetup({
        async: false
    });
 
    $.getJSON("/api/"+ year + "/" + month, function(data){
        monthAvailable = [];
         $.each(data, function(index, value) {
            monthAvailable.push(value); // add this date to the freeDays array
        });
    });
}

// runs for every day displayed in datepicker, adds class and tooltip if matched to days in freeDays array
function highlightDays(date)
{
    for(var i = 1; i <= 31; i++){
        // console.log(date.getDate() + "==" + i);
        if(date.getDate() == i){
            // console.log(monthAvailable[i] + "#" + i);
            if(!monthAvailable[i]){
                return [true, 'free-day'];
            }else{
                return [false, ''];
            }
        }
    }

    return [true, 'free-day'];
}