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