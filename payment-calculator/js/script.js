// JavaScript Document
var p = {

    0: "100K",
    1: "150K",
    2: "200K",
    3: "250K",
    4: "300K",
    5: "350K",
    6: "400K",
    7: "450K",
    8: "500K",
    9: "550K",
    10: "600K",
    11: "650K",
    12: "700K",
    13: "750K",
    14: "800K",
    15: "850K",
    16: "900K",
    17: "950K",
    18: "1,000K",
    19: "1,100K",
    20: "1,200K",
    21: "1,300K",
    22: "1,400K",
    23: "1,500K",
    24: "1,600K",
    25: "1,700K",
    26: "1,800K",
    27: "19,00K",
    28: "2,000K",
};

var t = {

    0: "100000",
    1: "150000",
    2: "200000",
    3: "250000",
    4: "300000",
    5: "350000",
    6: "400000",
    7: "450000",
    8: "500000",
    9: "550000",
    10: "600000",
    11: "650000",
    12: "700000",
    13: "750000",
    14: "800000",
    15: "850000",
    16: "900000",
    17: "950000",
    18: "1000000",
    19: "1100000",
    20: "1200000",
    21: "1300000",
    22: "1400000",
    23: "1500000",
    24: "1600000",
    25: "1700000",
    26: "1800000",
    27: "1900000",
    28: "2000000",

}

/*var obj = {
    '72month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '60month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '48month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '36month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '24month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '12month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
};*/
var obj = {
    '72month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '60month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '48month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '36month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '24month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '18month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    },
    '12month' : {
        '0' : '0.0',
        '4' : '0.04',
        '8' : '0.08'
    }
};

$(document).ready(function() {

    $("#total").val("100000");

    

    $("#slider_amirol").slider({
        range: "min",
        animate: true,

        min: 0,
        max: 28,
        step: 1,
        slide: 
            function(event, ui) 
            {
                update(1,ui.value); //changed
                calculatePrice(ui.value);
            }
    });

    $('.month').on('click',function(event) {
        var id = $(this).attr('id');

        $('.month').removeClass('selected-month');
        $(this).addClass('selected-month');
        $(".month").removeClass("active-month");
        $(this).addClass("active-month");

        $('#month').val(id);

        calculatePrice()
    });

    $('.term').on('click',function(event) {
        var id = $(this).attr('id');

        $('.term').removeClass('selected-term');
        $(this).addClass('selected-term');
        $(".term").removeClass("active-term");
        $(this).addClass("active-term");
        $('#term').val(id);

        calculatePrice()
    });

    update();
    calculatePrice();
});
        

        
function update(slider,val) {

    if(undefined === val) val = 0;
    var amount = p[val];

    $('#sliderVal').val(val);

    $('#slider_amirol a').html('<label><span class="glyphicon glyphicon-chevron-left"></span> '+amount+' <span class="glyphicon glyphicon-chevron-right"></span></label>');
}

function calculatePrice(val){
    
    if(undefined === val)
        val = $('#sliderVal').val();

    var month = $('#month').val();
    var term = obj[month][$('#term').val()];

    month = parseFloat(month);
    term = parseFloat(term);

    var totalPrice = t[val] * term; //total interest per yr
    var interestPerMonth = totalPrice / 12; //interest per month
    var totalInterest = interestPerMonth * month;  //total interest during mortgage
    var totalPayment = parseFloat(t[val]) + totalInterest //total pay + interest
    var finalTotal = parseFloat(totalPayment) / month //total pay per month


    $("#total12").val(interestPerMonth.toFixed(2)); //total interest per month
    $("#finalTotal").val(finalTotal.toFixed(2)); //total pay per month
}