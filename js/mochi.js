(function() {
    $(document).ready(function() {
        return $(".mochi_toggle").click(function() {
            $(this).attr("checked", this.checked)
        }), $(".mochi_button_group_item").click(function() {
            var a;
            return a = $(this).attr("name"), $(".mochi_button_group_item[name=" + a + "]").not(this).removeClass("selected"), $(this).addClass("selected")
        })
    })
}).call(this);