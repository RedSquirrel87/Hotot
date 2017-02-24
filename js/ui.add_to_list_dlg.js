if (typeof ui == 'undefined') var ui = {};
ui.AddToListDlg = {

id: '',

tpl: '<li class="mochi_list_item with_trigger"> \
        <a href="#" list_id="{%ID%}" class="trigger page_nav"> \
            <span class="widget more"></span> \
            <label for="" class="label">{%NAME%}</label> \
        </a> \
    </li>',

load:
function load(name) {
    $('#add_to_list_dlg').find('.trigger').unbind();
    var container = $('#add_to_list_dlg ul').empty();
    var arr = [];
    for (var i = 0; i < globals.my_lists.length; i += 1) {
        var html = ui.AddToListDlg.tpl.replace(/{%ID%}/, globals.my_lists[i].id_str);
        html = html.replace(/{%NAME%}/g, globals.my_lists[i].name);
        arr.push(html);
    }
    container.append(arr.join('\n'));
    container.find('.trigger').click(function () {
        var id = $(this).attr('list_id');
        globals.twitterClient.create_list_member(
            id, name,
            function () {
                toast.set(_('added') + ' @' + name + ' ' + _('to_list') + '.').show(); 
            },
            function () {
                toast.set(_('failed_to_add') + ' @' + name + ' ' + _('to_list') + '.').show(); 
            });
        globals.add_to_list_dialog.close();
    });
}

}
    
