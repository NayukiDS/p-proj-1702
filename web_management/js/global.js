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
                opacity: '1'
                // color: 'white'
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

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}