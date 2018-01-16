function panel_toggle() {
    var desk_obj = $('#desk');
    if(desk_obj.hasClass('left_container_full')){
        desk_obj.removeClass('left_container_full');
        desk_obj.addClass('left_container_half');
    }else{
        desk_obj.removeClass('left_container_half');
        desk_obj.addClass('left_container_full');
    }
}

function animation_blink_hide(obj, autohide) {
    var color_o = obj.css('color');
    obj.css('display','block');
    obj.animate({
        opacity: '1'
    },50, function () {
        obj.animate({
            opacity: '0'
        },50, function () {
            obj.animate({
                opacity: '1',
                color: 'white'
            },50, function () {
                obj.animate({
                    opacity: '0'
                },50, function () {
                    obj.animate({
                        opacity: '1',
                        color: color_o
                    },50, function () {
                        if(autohide===true){
                            setTimeout(function () {
                                obj.animate({
                                    opacity: '0'
                                },200);
                                setTimeout(function () {
                                    obj.css('display','none');
                                },200);
                            },3000)
                        }
                    })
                })
            })
        })
    })
}