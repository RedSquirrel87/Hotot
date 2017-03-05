if (typeof ui == 'undefined') var ui = {};
ui.Template = {

reg_vaild_preceding_chars: '(?:[^-\\/"\':!=a-zA-Z0-9_]|^)',

reg_url_path_chars_1: '[a-zA-Z0-9!\\*\';:=\\+\\$/%#\\[\\]\\?\\-_,~\\(\\)&\\.`@]',
reg_url_path_chars_2: '[a-zA-Z0-9!\':=\\+\\$/%#~\\(\\)&`@]',

reg_url_proto_chars: '([a-zA-Z]+:\\/\\/|www\\.)',

reg_user_name_chars: '[@＠]([a-zA-Z0-9_]{1,20})',

reg_list_name_template: '[@＠]([a-zA-Z0-9_]{1,20}/[a-zA-Z][a-zA-Z0-9_\\-\u0080-\u00ff]{0,24})',

// from https://si0.twimg.com/c/phoenix/en/bundle/t1-hogan-core.f760c184d1eaaf1cf27535473a7306ef.js
reg_hash_tag_latin_chars: '\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u1e00-\u1eff',
reg_hash_tag_nonlatin_chars: '\u0400-\u04ff\u0500-\u0527\u2de0-\u2dff\ua640-\ua69f\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\ufb12-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4f\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06de-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u06ff\u0750-\u077f\u08a0\u08a2-\u08ac\u08e4-\u08fe\ufb50-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\u200c\u0e01-\u0e3a\u0e40-\u0e4e\u1100-\u11ff\u3130-\u3185\ua960-\ua97f\uac00-\ud7af\ud7b0-\ud7ff\uffa1-\uffdc\u30a1-\u30fa\u30fc-\u30fe\uff66-\uff9f\uff70\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u3041-\u3096\u3099-\u309e\u3400-\u4dbf\u4e00-\u9fff\ua700-\ub73f\ub740-\ub81f\uf800-\ufa1f\u3003\u3005\u303b',
reg_hash_tag_template: '(^|\\s)[#＃]([a-z0-9_{%LATIN_CHARS%}{%NONLATIN_CHARS%}]*)',

reg_hash_tag: null,

reg_is_rtl: new RegExp('[\u0600-\u06ff]|[\ufe70-\ufeff]|[\ufb50-\ufdff]|[\u0590-\u05ff]'),

tweet_t:
'<li id="{%ID%}" tweet_id="{%TWEET_ID%}" class="card {%SCHEME%} {%FAV_CLASS%}" type="tweet" retweet_id="{%RETWEET_ID%}" reply_id="{%REPLY_ID%}" in_thread="{%IN_THREAD%}" reply_name="{%REPLY_NAME%}" screen_name="{%SCREEN_NAME%}" user_name="{%USER_NAME%}" retweetable="{%RETWEETABLE%}" deletable="{%DELETABLE%}" link="{%LINK%}" style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_color_label" style="background-color:{%COLOR_LABEL%}"></div>\
    <div class="tweet_selected_indicator"></div>\
    <div class="tweet_fav_indicator"></div>\
    <div class="deleted_mark"></div>\
    <div class="tweet_retweet_indicator"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <ul class="tweet_bar">\
        <li>\
        <a class="tweet_bar_btn tweet_reply_btn" title="Reply this tweet" href="#reply" data-i18n-title="reply"></a>\
        </li><li>\
        <a class="tweet_bar_btn {%TWEET_BAR_OLD%} tweet_fav_btn" title="{%TRANS_fav_or_un_fav%}" href="#fav" data-i18n-title="like_or_un_like"></a>\
        </li><li>\
        <a class="tweet_bar_btn tweet_retweet_btn" title="Official retweet/un-retweet this tweet" href="#retweet" data-i18n-title="retweet"></a>\
        </li><li>\
        <a class="tweet_bar_btn tweet_more_menu_trigger" href="#more"></a>\
        </li>\
    </ul>\
    <div class="card_body">\
        <div class="who {%RETWEET_MARK%}" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
	<div class="tweet_thread_info" style="display:{%IN_REPLY%}">\
		<a class="btn_tweet_thread" title="{%TRANS_view_hide_conversation%}" href="#"></a>\
		{%REPLY_TEXT%}\
	</div>\
        <div class="text" alt="{%ALT%}" style="font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%TEXT%}</div>\
        <div class="tweet_meta">\
            <div class="tweet_source"> \
                <span class="tweet_timestamp">\
                <a class="tweet_link tweet_update_timestamp" target="_blank" href="{%TWEET_BASE_URL%}/{%TWEET_ID%}" title="{%TIMESTAMP%}">{%SHORT_TIMESTAMP%}</a>\
                </span>\
                {%TRANS_via%}: {%SOURCE%}\
		<div class="tweet_social {%TWEET_SOCIAL_VIEW%}">\
			<img class="icon_liked" src="../image/ic15_liked.png" alt="FAV"><span class="icon_liked_value">{%LIKED%}</span>\
			<img class="icon_rtd" src="../image/ic15_rt.png" alt="RT"/><span class="icon_rtd_value">{%RTD%}</span>\
		</div>\
	    </div>\
	    <div class="retweets" style="display:{%IN_RT%}">{%RETWEET_TEXT%}</div>\
            <div class="status_bar">{%STATUS_INDICATOR%}</div>\
        </div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
    <div class="tweet_thread_wrapper">\
        <div class="tweet_thread_hint">{%TRANS_Loading%}</div>\
        <ul class="tweet_thread"></ul>\
        <a class="btn_tweet_thread_more">{%TRANS_View_more_conversation%}</a>\
    </div>\
</li>',

retweeted_by_t:
'<li id="{%ID%}" tweet_id="{%TWEET_ID%}" class="card {%SCHEME%} {%FAV_CLASS%}" type="tweet"  retweet_id="{%RETWEET_ID%}" reply_id="{%REPLY_ID%}" reply_name="{%REPLY_NAME%}" screen_name="{%SCREEN_NAME%}" user_name="{%USER_NAME%}" retweetable="{%RETWEETABLE%}" deletable="{%DELETABLE%}" style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_active_indicator"></div>\
    <div class="tweet_selected_indicator"></div>\
    <div class="deleted_mark"></div>\
    <div class="tweet_fav_indicator"></div>\
    <div class="tweet_retweet_indicator"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <ul class="tweet_bar">\
        <li>\
        <a class="tweet_bar_btn tweet_reply_btn" title="Reply this tweet" href="#reply" data-i18n-title="reply"></a>\
        </li><li>\
        <a class="tweet_bar_btn {%TWEET_BAR_OLD%} tweet_fav_btn" title="Fav/Un-fav this tweet" href="#fav" data-i18n-title="like_or_un_like"></a>\
        </li><li>\
        <a class="tweet_bar_btn tweet_retweet_btn" title="Official retweet/un-retweet this tweet" href="#retweet" data-i18n-title="retweet"></a>\
        </li><li>\
        <a class="tweet_bar_btn tweet_more_menu_trigger" href="#more"></a>\
        </li>\
    </ul>\
    <div class="card_body">\
        <div class="who {%RETWEET_MARK%}">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
            <div class="tweet_thread_info" style="display:{%IN_REPLY%}">\
                <a class="btn_tweet_thread" href="#"></a>\
                {%REPLY_TEXT%}\
            </div>\
        <div class="text" alt="{%ALT%}" style="font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%TEXT%}</div>\
        <div class="tweet_meta">\
            <div class="tweet_source" style="height:35px"> \
                {%RETWEET_TEXT%} \
                <span class="tweet_timestamp">\
                <a class="tweet_link tweet_update_timestamp" target="_blank" href="{%TWEET_BASE_URL%}/{%TWEET_ID%}" title="{%TIMESTAMP%}">{%SHORT_TIMESTAMP%}</a>\
                </span>\
                {%TRANS_via%}: {%SOURCE%}\
		<div class="tweet_social {%TWEET_SOCIAL_VIEW%}">\
			<img class="icon_liked" src="../image/ic15_liked.png" alt="FAV"><span class="icon_liked_value">{%LIKED%}</span>\
			<img class="icon_rtd" src="../image/ic15_rt.png" alt="RT"/><span class="icon_rtd_value">{%RTD%}</span>\
		</div>\
		<div style="margin-top:5px;">{%TRANS_Retweeted_by%}: <a class="show" href="#" title="{%TRANS_Click_to_show_retweeters%}" tweet_id="{%TWEET_ID%}">{%TRANS_Show_retweeters%}</a></div>\
            </div>\
            <div class="tweet_retweeters" tweet_id="{%TWEET_ID%}"></div>\
            <div class="status_bar">{%STATUS_INDICATOR%}</div>\
        </div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
    <div class="tweet_thread_wrapper">\
        <div class="tweet_thread_hint">{%TRANS_Loading%}</div>\
        <ul class="tweet_thread"></ul>\
        <a class="btn_tweet_thread_more">{%TRANS_View_more_conversation%}</a>\
    </div>\
</li>',

message_t:
'<li id="{%ID%}" tweet_id="{%TWEET_ID%}" class="card {%SCHEME%}" type="message" sender_screen_name="{%SCREEN_NAME%}" user_name="{%USER_NAME%}"   style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_active_indicator"></div>\
    <div class="tweet_selected_indicator"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <ul class="tweet_bar">\
        <li>\
        <a class="tweet_bar_btn tweet_dm_reply_btn" title="Reply them" href="#reply_dm" data-i18n-title="reply"></a>\
        </li><li>\
        <a class="tweet_bar_btn tweet_more_menu_trigger" href="#more"></a>\
        </li>\
    </ul>\
    <div class="card_body">\
        <div class="who">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
        <div class="text" style="font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">\
		<span class="dm_recipient">@<a class="who_href" href="#{%RECIPIENT_SCREEN_NAME%}">{%RECIPIENT_SCREEN_NAME%}</a> </span>{%TEXT%}\
	</div>\
        <div class="tweet_meta">\
            <div class="tweet_source"> \
                <span class="tweet_timestamp tweet_update_timestamp" title="{%TIMESTAMP%}">{%SHORT_TIMESTAMP%}</span>\
            </div>\
        </div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
</li>',

message_header_t:
'<div class="header_frame" style="text-align:left;">\
	<ul class="mochi_list mochi_dm">\
		<li class="mochi_list_item mochi_dm with_trigger">\
			<a id="btn_dm_any" class="trigger mochi_dm page_nav">\
				<span class="widget more"></span>\
				<label for="" class="label" data-i18n-text="any" style="font-weight:bold;font-size:13px;">{%TRANS_any%}</label>\
			</a>\
		</li>\
	</ul><ul id="dm_list" class="mochi_list mochi_dm" ></ul>\
	<div align="right"><button id="dm_load_more" data-i18n-text="load_more" class="mochi_button" style="margin-top:5px;font-weight:bold;">{%TRANS_load_more%}</button></div>\
	</div>\
<div class="sub_header_frame" style="text-align:left;display:none;">\
	<div class="dm_view_users">\
			<button id="dm_write" data-i18n-text="compose" class="mochi_button blue" style="font-weight:bold;">{%TRANS_compose%}</button>\
			<button id="btn_dm_back" data-i18n-text="back" class="mochi_button red" style="float:right;font-weight:bold;">{%TRANS_back%}</button>\
	</div>\
</div>',

favorited_by_t:
'<li id="{%ID%}" tweet_id="{%TWEET_ID%}" favorited_id="{%TWEET_ID%}" class="card {%SCHEME%} {%FAV_CLASS%}" type="tweet"  retweet_id="{%RETWEET_ID%}" reply_id="{%REPLY_ID%}" in_thread="{%IN_THREAD%}" reply_name="{%REPLY_NAME%}" screen_name="{%SCREEN_NAME%}" user_name="{%USER_NAME%}"  retweetable="{%RETWEETABLE%}" deletable="{%DELETABLE%}" link="{%LINK%}" style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_color_label" style="background-color:{%COLOR_LABEL%}"></div>\
    <div class="tweet_selected_indicator"></div>\
    <div class="tweet_fav_indicator"></div>\
    <div class="deleted_mark"></div>\
    <div class="tweet_retweet_indicator"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <div class="card_body">\
        <div class="who" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
            <div class="tweet_thread_info" style="display:{%IN_REPLY%}">\
                <a class="btn_tweet_thread" href="#"></a>\
                {%REPLY_TEXT%}\
            </div>\
        <div class="text" alt="{%ALT%}" style="font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%TEXT%}</div>\
        <div class="tweet_meta">\
            <div class="tweet_source"> \
                {%RETWEET_TEXT%} \
                <span class="tweet_timestamp">\
                <a class="tweet_link tweet_update_timestamp" target="_blank" href="{%TWEET_BASE_URL%}/{%TWEET_ID%}" title="{%TIMESTAMP%}">{%SHORT_TIMESTAMP%}</a>\
                </span>\
                {%TRANS_via%}: {%SOURCE%}\
		<div class="tweet_social {%TWEET_SOCIAL_VIEW%}">\
			<img class="icon_liked" src="../image/ic15_liked.png" alt="FAV"><span class="icon_liked_value">{%LIKED%}</span>\
			<img class="icon_rtd" src="../image/ic15_rt.png" alt="RT"/><span class="icon_rtd_value">{%RTD%}</span>\
		</div>\
		</div>\
            <div class="status_bar">{%STATUS_INDICATOR%}</div>\
        </div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
    <div class="tweet_thread_wrapper">\
        <div class="tweet_thread_hint">{%TRANS_Loading%}</div>\
        <ul class="tweet_thread"></ul>\
        <a class="btn_tweet_thread_more">{%TRANS_View_more_conversation%}</a>\
    </div>\
</li>',

new_follower_t:
'<li id="{%ID%}" tweet_id="{%TWEET_ID%}" class="card {%SCHEME%} {%FAV_CLASS%}" type="tweet"  screen_name="{%SCREEN_NAME%}" user_name="{%USER_NAME%}"  link="{%LINK%}" style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_color_label" style="background-color:{%COLOR_LABEL%}"></div>\
    <div class="tweet_selected_indicator"></div>\
    <div class="deleted_mark"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <div class="card_body">\
        <div class="who" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
        <div class="text" alt="{%ALT%}" style="font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%TEXT%}</div>\
        <div class="tweet_meta">\
            <div class="tweet_source"> \
                <span class="tweet_timestamp">\
                <span class="tweet_update_timestamp" title="{%TIMESTAMP%}">{%SHORT_TIMESTAMP%}</span>\
                </span>\
		</div>\
            <div class="status_bar">{%STATUS_INDICATOR%}</div>\
        </div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
</li>',

quoted_t:
'<li id="{%ID%}" tweet_id="{%TWEET_ID%}" class="card {%SCHEME%} {%FAV_CLASS%}" type="tweet"  retweet_id="{%RETWEET_ID%}" reply_id="{%REPLY_ID%}" in_thread="{%IN_THREAD%}" reply_name="{%REPLY_NAME%}" screen_name="{%SCREEN_NAME%}" user_name="{%USER_NAME%}" retweetable="{%RETWEETABLE%}" deletable="{%DELETABLE%}" link="{%LINK%}" style="font-family: {%TWEET_FONT%};">\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <div class="card_body">\
        <div class="who" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}\n\n{%DESCRIPTION%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
        <div class="text" alt="{%ALT%}" style="font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%TEXT%}</div>\
        <div class="tweet_meta">\
            <div class="tweet_source"> \
                <span class="tweet_timestamp">\
                <a class="tweet_link tweet_update_timestamp" target="_blank" href="{%TWEET_BASE_URL%}/{%TWEET_ID%}" title="{%TIMESTAMP%}">{%SHORT_TIMESTAMP%}</a>\
                </span>\
                {%TRANS_via%}: {%SOURCE%}\
		<div class="tweet_social {%TWEET_SOCIAL_VIEW%}">\
			<img class="icon_liked" src="../image/ic15_liked.png" alt="FAV"><span class="icon_liked_value">{%LIKED%}</span>\
			<img class="icon_rtd" src="../image/ic15_rt.png" alt="RT"/><span class="icon_rtd_value">{%RTD%}</span>\
		</div>\
		</div>\
            <div class="status_bar">{%STATUS_INDICATOR%}</div>\
        </div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
</li>',

search_t:
'<li id="{%ID%}" tweet_id="{%TWEET_ID%}" class="card {%SCHEME%}" type="search" screen_name="{%SCREEN_NAME%}" user_name="{%USER_NAME%}"  link="{%LINK%}" style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_active_indicator"></div>\
    <div class="tweet_selected_indicator"></div>\
    <div class="deleted_mark"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <ul class="tweet_bar">\
        <li>\
        <a class="tweet_bar_btn tweet_reply_btn" title="Reply this tweet" href="#reply" data-i18n-title="reply"></a>\
        </li><li>\
        <a class="tweet_bar_btn {%TWEET_BAR_OLD%} tweet_fav_btn" title="Fav/Un-fav this tweet" href="#fav" data-i18n-title="like_or_un_like"></a>\
        </li><li>\
        <a class="tweet_bar_btn tweet_retweet_btn" title="Official retweet/un-retweet this tweet" href="#retweet" data-i18n-title="retweet"></a>\
        </li><li>\
        <a class="tweet_bar_btn tweet_more_menu_trigger" href="#more"></a>\
        </li>\
    </ul>\
    <div class="card_body">\
        <div class="who">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
        <div class="text" style="font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%TEXT%}</div>\
        <div class="tweet_meta">\
            <div class="tweet_source"> \
                <span class="tweet_timestamp">\
                <a class="tweet_link tweet_update_timestamp" target="_blank" href="{%TWEET_BASE_URL%}/{%TWEET_ID%}" title="{%TIMESTAMP%}">{%SHORT_TIMESTAMP%}</a>\
                </span>\
                {%TRANS_via%}: {%SOURCE%}</div>\
        </div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
</li>',

people_t:
'<li id="{%USER_ID%}" class="people_card card normal" type="people" following={%FOLLOWING%} screen_name={%SCREEN_NAME%} user_name="{%USER_NAME%}"  style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_active_indicator"></div>\
    <div class="tweet_selected_indicator"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="{%USER_NAME%}" style="background-image: url({%PROFILE_IMG%})"></a>\
    <ul class="tweet_bar">\
        <li style="display:none;">\
        <a class="tweet_bar_btn add_to_list_btn" title="Add to list" href="#follow" data-i18n-title="add_to_list"></a>\
        </li><li>\
        <a class="tweet_bar_btn follow_btn" title="Follow them" href="#follow" data-i18n-title="follow"></a>\
        </li><li>\
        <a class="tweet_bar_btn unfollow_btn" title="Unfollow them" href="#unfollow" data-i18n-title="unfollow"></a>\
        </li>\
    </ul>\
    <div class="card_body">\
        <div id="{%USER_ID%}" class="who">\
        <a class="who_href" href="#{%SCREEN_NAME%}" title="{%USER_NAME%}">\
            {%VISIBLE_NAME%}\
        </a>\
        </div>\
        <div class="text" style="font-style:italic font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%DESCRIPTION%}</div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
</li>',

people_vcard_t_orig:
'<div class="header_frame">\
  <div class="people_vcard vcard">\
    <a target="_blank" class="profile_img_wrapper"></a>\
    <div class="vcard_body">\
        <center>\
        <ul class="people_vcard_radio_group mochi_button_group"> \
            <li><a class="mochi_button_group_item selected" href="#people_vcard_info_page" name="">{%TRANS_info%}</a> \
            </li><li><a class="mochi_button_group_item" href="#people_vcard_stat_page">{%TRANS_stat%}</a> \
            </li></ul>\
        </center>\
        <div class="vcard_tabs_pages">\
        <table class="people_vcard_info_page vcard_tabs_page radio_group_page" border="0" cellpadding="0" cellspacing="0"> \
            <tr><td>{%TRANS_name%}: </td><td> \
                <a class="screen_name" target="_blank" href="#"></a> \
                (<span class="name"></span>) </td> \
            </tr> \
            <tr><td>{%TRANS_bio%}: </td> \
                <td><span class="bio"></span></td> \
            </tr> \
            <tr><td>{%TRANS_web%}: </td> \
                <td><a class="web" target="_blank" href="#" class="link"></a></td> \
            </tr> \
            <tr><td>{%TRANS_location%}: </td> \
                <td><span class="location"></span></td> \
            </tr> \
        </table> \
        <table class="people_vcard_stat_page vcard_tabs_page radio_group_page"> \
            <tr><td>{%TRANS_join%}: </td> \
                <td><span class="join"></span></td> \
            </tr> \
            <tr><td>{%TRANS_tweet_cnt%}: </td> \
                <td><span class="tweet_cnt"></span> \
                (<span class="tweet_per_day_cnt"></span> per day)</td> \
            </tr> \
            <tr><td>{%TRANS_follower_cnt%}: </td> \
                <td><span class="follower_cnt"></span></td> \
            </tr> \
            <tr><td>{%TRANS_friend_cnt%}: </td> \
                <td><span class="friend_cnt"></span></td> \
            </tr> \
            <tr><td>{%TRANS_listed_cnt%}: </td> \
                <td><span class="listed_cnt"></span></td> \
            </tr> \
            <tr><td>{%TRANS_relation%}: </td> \
                <td><span class="relation"></span></td> \
            </tr> \
        </table> \
        </div><!-- vcard tabs pages --> \
    </div> <!-- vcard body --> \
    <div class="vcard_ctrl"> \
        <ul class="vcard_action_btns"> \
        <li><a class="vcard_follow mochi_button blue" \
                href="#" >{%TRANS_follow%}</a> \
        </li><li><a class="vcard_block mochi_button red" \
                href="#" >{%TRANS_block%}</a> \
        </li><li> \
            <a class="vcard_edit mochi_button" \
                href="#" style="display:none;">{%TRANS_edit%}</a>\
        </li><li class="people_action_more_trigger"> \
            <a class="vcard_more mochi_button" \
                href="#">{%TRANS_more_actions%} &#x25BE;</a> \
            <ul class="people_action_more_memu hotot_menu">\
                <li><a class="mention_menu_item" \
                    href="#">{%TRANS_mention_them%}</a>\
                </li><li><a class="message_menu_item" \
                    href="#">{%TRANS_message_them%}</a>\
                </li><li><a class="add_to_list_menu_item" \
                    href="#">{%TRANS_add_to_list%}</a>\
                </li><li class="separator"><span></span>\
                </li><li><a class="report_spam_menu_item" \
                    href="#" >{%TRANS_report_spam%}</a>\
                </li><li class="separator"><span></span>\
                </li><li><a class="mute_menu_item" \
                    href="#">{%TRANS_mute%}</a>\
                </li><li><a class="unmute_menu_item"\
                    href="#" >{%TRANS_unmute%}</a>\
		</li><li><a class="no_rt_menu_item" \
                    href="#">{%TRANS_no_rt%}</a>\
                </li><li><a class="yes_rt_menu_item"\
                    href="#" >{%TRANS_yes_rt%}</a>\
		</li>\
            </ul>\
        </li> \
        </ul> \
    </div><!-- #people_vcard_ctrl --> \
</div> <!-- vcard --> \
<div class="expand_wrapper"><a href="#" class="expand">…</a></div>\
<div class="people_view_toggle"> \
    <ol class="people_view_toggle_btns mochi_button_group"> \
        <li><a class="people_view_tweet_btn mochi_button_group_item selected" href="#tweet" title="{%TRANS_timeline_tip%}">{%TRANS_timeline%}</a> \
        </li><li><a class="people_view_own_tweet_btn mochi_button_group_item" href="#owntweet" title="{%TRANS_own_tweets_tip%}">{%TRANS_own_tweets%}</a> \
        </li><li> \
        <a class="people_view_fav_btn mochi_button_group_item" href="#fav">{%TRANS_favs%}</a> \
        </li><li class="people_view_people_trigger"> \
        <a class="people_view_people_btn mochi_button_group_item" href="#people">{%TRANS_fellowship%} &#x25BE;</a> \
        <ul class="people_menu hotot_menu">\
            <li><a class="followers_menu_item" \
                href="#">{%TRANS_followers%}</a>\
            </li><li><a class="friends_menu_item"\
                href="People them is following" >{%TRANS_friends%}</a>\
            </li>\
        </ul>\
        </li><li class="people_view_list_trigger"> \
        <a class="people_view_list_btn mochi_button_group_item" href="#list">{%TRANS_lists%} &#x25BE;\
        </a> \
        <ul class="lists_menu hotot_menu">\
            <li><a class="user_lists_menu_item" \
                href="#">{%TRANS_lists_of_them%}</a>\
            </li><li><a class="listed_lists_menu_item"\
                href="#" >{%TRANS_lists_following_them%}</a>\
            </li><li><a class="create_list_menu_item" \
                href="#" >{%TRANS_create_a_list%}</a>\
            </li>\
        </ul>\
        </li> \
    </ol> \
</div> \
<div class="people_request_hint"> \
    <h1 data-i18n-text="he_she_has_protexted_his_her_tweets">He/She has protected his/her tweets.</span></h1> \
    <p data-i18n-text="you_need_to_go_to_twitter_com_to_send_a_request_before_you_can_start_following_this_persion">You need to go to twitter.com to send a request before you can start following this person...</p> \
    <div style="text-align:center;"> \
    <a class="people_request_btn mochi_button" href="#" target="_blank" data-i18n-text="send_request">Send Request</a> \
    </div> \
</div></div>',

list_t:
'<li id="{%LIST_ID%}" class="list_card card normal" type="list" following={%FOLLOWING%} screen_name={%SCREEN_NAME%} slug={%SLUG%} style="font-family: {%TWEET_FONT%};">\
    <div class="tweet_active_indicator"></div>\
    <div class="tweet_selected_indicator"></div>\
    <a class="profile_img_wrapper" href="{%PROFILE_IMG%}" title="@{%USER_NAME%}/{%SLUG%}" style="background-image: url({%PROFILE_IMG%})">\</a>\
    <ul class="tweet_bar">\
        <li>\
        <a class="tweet_bar_btn follow_btn" title="Follow them" href="#follow" data-i18n-title="follow"></a>\
        </li><li>\
        <a class="tweet_bar_btn unfollow_btn" title="Unfollow them" href="#unfollow" data-i18n-title="unfollow"></a>\
        </li>\
    </ul>\
    <div class="card_body">\
        <div id="{%USER_ID%}" class="who">\
        <a class="list_href" href="#{%SCREEN_NAME%}/{%SLUG%}" title="{%USER_NAME%}/{%SLUG%}">\
            @{%SCREEN_NAME%}/{%SLUG%}\
        </a>\
        </div>\
        <div class="text" style="font-style:italic font-size:{%TWEET_FONT_SIZE%}pt;line-height:{%TWEET_LINE_HEIGHT%}">{%DESCRIPTION%}</div>\
    </div>\
    <span class="shape"></span>\
    <span class="shape_mask"></span>\
</li>',

list_vcard_t:
function list_vcard_t() {
	var ts = {
		TRANS_name : _('name'), 
		TRANS_owner : _('owner'), 
		TRANS_desc : _('description'),
		TRANS_follow : _('follow'),
		TRANS_delete : _('delete'),
		TRANS_edit : _('edit'),
		TRANS_he_she_has_protected_his_her_list : _('he_she_has_protected_his_her_list'),
		TRANS_only_the_owner_can_access_this_list : _('only_the_owner_can_access_this_list')
	};
	
	return ui.Template.render(
'<div class="header_frame"><div class="list_vcard vcard">\
    <a target="_blank" class="profile_img_wrapper"></a>\
    <div class="vcard_body">\
        <div class="vcard_tabs_pages">\
        <table border="0" cellpadding="0" cellspacing="0" class="vcard_tabs_page" style="display:block;"> \
            <tr><td data-i18n-text="name">{%TRANS_name%}: </td><td> \
                <a class="name" target="_blank" href="#"></a></td> \
            </tr> \
            <tr><td>{%TRANS_owner%}: </td> \
                <td><a class="owner" target="_blank" href="#" data-i18n-text="owner"></a></td> \
            </tr> \
            <tr><td data-i18n-text="description">{%TRANS_desc%}: </td> \
                <td><span class="description"></span></td> \
            </tr> \
        </table> \
        </div>\
    </div> <!-- vcard body --> \
    <div class="vcard_ctrl"> \
        <ul class="vcard_action_btns"> \
        <li><a class="vcard_follow mochi_button blue" \
                href="#" data-i18n-text="follow">{%TRANS_follow%}</a> \
        </li><li> \
            <a class="vcard_delete mochi_button red" \
                href="#" data-i18n-text="delete">{%TRANS_delete%}</a> \
        </li><li> \
            <a class="vcard_edit mochi_button" \
                href="#" style="display:none;" data-i18n-text="edit">{%TRANS_edit%}</a>\
        </li> \
        </ul> \
    </div><!-- #list_vcard_ctrl --> \
</div> <!-- vcard --> \
<div class="expand_wrapper"><a href="#" class="expand">…</a></div>\
<div class="list_view_toggle"> \
    <ol class="list_view_toggle_btns mochi_button_group"> \
        <li><a class="list_view_tweet_btn mochi_button_group_item selected" href="#tweet" data-i18n-text="tweets">Tweets</a> \
        </li><li> \
        <a class="list_view_follower_btn mochi_button_group_item" href="#follower" data-i18n-text="followers">Followers</a> \
        </li><li> \
        <a class="list_view_following_btn mochi_button_group_item" href="#following" data-i18n-text="following">Following</a> \
        </li> \
    </ol> \
</div> \
<div class="list_lock_hint"> \
    <h1 data-i18n-text="he_she_has_protected_his_her_list">{%TRANS_he_she_has_protected_his_her_list%}</span></h1> \
    <p data-i18n-text="only_the_owner_can_access_this_list">{%TRANS_only_the_owner_can_access_this_list%}</p> \
</div></div>',ts);
},

tt_vcard_t:
'<div class="header_frame"><div class="tt_list" style="width:95%;margin-top:20px;"></div></div>',

search_header_t:
function search_header_t() {
	var ts = {
		TRANS_type_and_press_enter_to_search : _('type_and_press_enter_to_search'),
		TRANS_one_user_matched : _('one_user_matched'),
		TRANS_detach : _('detach'),
		TRANS_clear : _('remove_all'),
		TRANS_tweets : _('tweets'),
		TRANS_people : _('people'),
		TRANS_your_search : _('your_search'),
		TRANS_did_not_match_any_result : _('did_not_match_any_result'),
		TRANS_suggestions : _('suggestions'),
		TRANS_make_sure_all_words_are_spelled_correctly : _('make_sure_all_words_are_spelled_correctly'),
		TRANS_try_different_keywords : _('try_different_keywords'),
		TRANS_try_more_general_keywords : _('try_more_general_keywords'),
		TRANS_saved_search : _('saved_search'),
		TRANS_delete_saved_search : _('delete_saved_search')
	};
	
	return ui.Template.render(
'<div class="header_frame"> \
    <div class="search_box"> \
    <input class="search_entry mochi_entry" type="text" placeholder="{%TRANS_type_and_press_enter_to_search%}" data-i18n-placeholder="type_and_press_enter_to_search" title="{%TRANS_type_and_press_enter_to_search%}" data-i18n-title="type_and_press_enter_to_search"/> \
    <a href="#" class="search_entry_clear_btn"></a>\
    <div class="search_people_result"> \
        <span data-i18n-text="one_user_matched">{%TRANS_one_user_matched%} </span> <span class="search_people_inner"></span>\
    </div>\
    <div class="saved_searches">\
        <a id="create_saved_search_btn" class="mochi_button" href="#" title="{%TRANS_detach%}" data-i18n-title="detach"> + </a>\
	<a id="delete_saved_search_btn" qid= "" class="mochi_button" style="display:none;" href="#" title="{%TRANS_delete_saved_search%}" data-i18n-title="delete_saved_search"> - </a>\
        <div id="saved_searches_more_trigger">\
            <a id="saved_searches_btn" class="vcard_more mochi_button" title="{%TRANS_saved_search%}" data-i18n-title="saved_search" href="#"> &#x25BC; </a> \
            <ul id="saved_searches_more_menu" class="hotot_menu">\
                <li>\
                    <a class="saved_search_item" href="#">a</a>\
                </li>\
            </ul>\
        </div>\
    </div>\
    <div class="search_view_toggle">\
        <ol class="search_view_toggle_btns mochi_button_group">\
            <li><a class="search_tweet mochi_button_group_item selected" \
                href="#tweet" data-i18n-text="tweets">{%TRANS_tweets%}</a>\
            </li><li> \
                <a class="search_people mochi_button_group_item"\
                href="#people" data-i18n-text="people">{%TRANS_people%}</a>\
            </li> \
        </ol> \
    </div> \
    <div class="search_no_result_hint"> \
        <p><span data-i18n-text="your_search">{%TRANS_your_search%}</span> - <label class="keywords"></label> - <span data-i18n-text="did_not_match_any_result">{%TRANS_did_not_match_any_result%}</span></p> \
        <p><span data-i18n-text="suggestions">{%TRANS_suggestions%}</span>: <br/> \
         - <span data-i18n-text="make_sure_all_words_are_spelled_correctly">{%TRANS_make_sure_all_words_are_spelled_correctly%}</span><br/> \
         - <span data-i18n-text="try_different_keywords">{%TRANS_try_different_keywords%}</span><br/> \
         - <span data-i18n-text="try_more_general_keywords">{%TRANS_try_more_general_keywords%}</span><br/></p> \
    </div> \
    </div> \
</div>',ts);
},

replies_header_t:
'<div class="replies_header_frame"><ul class="tweet_thread"></ul></div>',

retweets_header_t:
'<div class="header_frame"><div class="retweets_view_toggle"> \
    <ol class="retweets_view_toggle_btns radio_group">\
        <li><a class="btn_retweeted_to_me radio_group_btn selected" \
            href="#retweeted_to_me" data-i18n-text="by_others">By Others</a>\
        </li><li> \
            <a class="btn_retweeted_by_me radio_group_btn"\
            href="#retweeted_by_me" data-i18n-text="by_me">By Me</a>\
        </li><li> \
            <a class="btn_retweets_of_me radio_group_btn" \
            href="#retweets_of_me" data-i18n-text="my_tweets_retweeted">My Tweets, Retweeted</a> \
        </li> \
    </ol> \
</div></div>',

common_column_header_t:
function common_column_header_t() {

	var ts = {
		TRANS_auto_update : _('auto_update'), 
		TRANS_notify : _('notify_desktop'), 
		TRANS_sound : _('sound')
	};
	
	return ui.Template.render(
'<div class="column_settings"> \
    <ul class="mochi_list dark">\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#use_auto_update" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="auto_update">{%TRANS_auto_update%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#use_notify" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="notify_desktop">{%TRANS_notify%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#use_notify_sound" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="sound">{%TRANS_sound%}</label>\
    </li>\
    </ul>\
</div>\
', ts);
},

home_column_header_t:
function home_column_header_t() {	
	var ts = {
		TRANS_auto_update : _('auto_update'), 
		TRANS_notify : _('notify_desktop'), 
		TRANS_sound : _('sound'),
		TRANS_home_no_rt : _('home_no_rt'),
		TRANS_home_full_title : _('home_full_title'), 
		TRANS_home_full : _('home_full'), 
		TRANS_home_media_only_title : _('home_media_only_title'), 
		TRANS_home_media_only : _('home_media_only'),
		TRANS_home_exclude_replies_title : _('home_exclude_replies_title'), 
		TRANS_home_exclude_replies : _('home_exclude_replies'),
		TRANS_home_filter : _('home_filter')
	};
	
	return ui.Template.render(
'<div class="column_settings"> \
    <ul class="mochi_list dark">\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#use_auto_update" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="auto_update">{%TRANS_auto_update%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#use_notify" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="notify_desktop">{%TRANS_notify%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#use_notify_sound" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="sound">{%TRANS_sound%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#hide_rt" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="home_no_rt">{%TRANS_home_no_rt%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <ol class="home_view_toggle_btns radio_group dark widget">\
       <li> \
            <a id="home_full" class="radio_group_btn selected"\
            href="#" title="{%TRANS_home_full_title%}" data-i18n-title="home_full_title" data-i18n-text="home_full">{%TRANS_home_full%}</a>\
        </li><li> \
            <a id="home_exclude_replies" class="radio_group_btn" \
            href="#" title="{%TRANS_home_exclude_replies_title%}" data-i18n-title="home_exclude_replies_title" data-i18n-text="home_exclude_replies">{%TRANS_home_exclude_replies%}</a> \
        </li><li> \
            <a id="home_media_only" class="radio_group_btn" \
            href="#" title="{%TRANS_home_media_only_title%}" data-i18n-title="home_media_only_title" data-i18n-text="home_media_only">{%TRANS_home_media_only%}</a> \
        </li> \
    </ol> \
    <label style="color:lightgrey;" class="label" data-i18n-text="home_filter">{%TRANS_home_filter%}</label>\
    </li>\
    </ul>\
</div>\
', ts);
},

tt_column_header_t:
function tt_column_header_t() {	
	var ts = {
		TRANS_auto_update : _('auto_update'),
		TRANS_no_hashtag : _('no_hashtag'),
		TRANS_tt_for : _('trending_for'),
		TRANS_tt_number : _('tt_number'),
		TRANS_tt_font : _('font_size'),
		TRANS_show_volume: _('show_volume')
	};
	
	return ui.Template.render(
'<div class="column_settings"> \
    <ul class="mochi_list dark">\
    <li class="mochi_list_item dark"> \
    <input type="checkbox" href="#use_auto_update" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="auto_update">{%TRANS_auto_update%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <select id="sel_country" class="mochi_combo dark widget" style="width:250px;"></select>\
    <label style="color:lightgrey;" class="label" data-i18n-text="trending_for">{%TRANS_tt_for%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input id="range_prefs_tt_number" class="widget dark" max="50" min="1" value="10" step="1" style="width:200px;" type="range"/>\
    <label style="color:lightgrey;" id="range_prefs_tt_number_st" class="value">13</label>\
    <label style="color:lightgrey;" class="label" data-i18n-text="tt_number">{%TRANS_tt_number%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input id="range_prefs_tt_font_size" class="widget" max="40" min="6" value="13" step="0.5" style="width:200px;" type="range"/>\
    <label style="color:lightgrey;" id="range_prefs_tt_font_size_st" class="value">13px</label>\
    <label style="color:lightgrey;" class="label" data-i18n-text="font_size">{%TRANS_tt_font%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input id="tt_show_volume" type="checkbox" href="#tt_show_volume" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="show_volume">{%TRANS_show_volume%}</label>\
    </li>\
    <li class="mochi_list_item dark"> \
    <input id="tt_no_hashtag" type="checkbox" href="#tt_no_hashtag" class="mochi_toggle dark widget"/>\
    <label style="color:lightgrey;" class="label" data-i18n-text="no_hashtag">{%TRANS_no_hashtag%}</label>\
    </li>\
    </ul>\
</div>\
', ts);
},

view_t:
'<div id="{%ID%}" \
    name="{%NAME%}" class="listview scrollbar_container {%CLASS%} {%ROLE%}"> \
    <div class="scrollbar_track">\
        <div class="scrollbar_slot">\
            <div class="scrollbar_handle"></div>\
        </div>\
    </div>\
    <div class="scrollbar_content listview_content">\
        <div class="listview_header"><div class="header_content">{%HEADER%}</div></div> \
        <ul class="listview_body"></ul> \
        <div class="listview_footer"> \
            <div class="load_more_info"><img src="image/ani_loading_bar.gif"/></div> \
        </div> \
    </div> \
</div>',

indicator_t:
    '<div class="{%STICK%} {%ROLE%}" name="{%TARGET%}" draggable="true"><a class="indicator_btn" href="#{%TARGET%}" title="{%TITLE%}"><img class="icon" src="{%ICON%}"/><div class="icon_alt" style="background-image: url({%ICON%})"></div></a><span class="shape"></span></div>',

status_draft_t:
'<li mode="{%MODE%}" reply_to_id="{%REPLY_TO_ID%}" reply_text="{%REPLY_TEXT%}" recipient="{%RECIPIENT%}"><a class="text">{%TEXT%}</a><a class="btn_draft_clear" href="#"></a></li>',

preview_link_reg: {
'img.ly': {
    reg: new RegExp('http:\\/\\/img.ly\\/([a-zA-Z0-9_\\-]+)','g'),
    base: 'http://img.ly/show/thumb/',
    direct_base: 'http://img.ly/show/full/'
},
'twitpic.com': {
    reg: new RegExp('http:\\/\\/twitpic.com\\/([a-zA-Z0-9_\\-]+)','g'),
    base: 'http://twitpic.com/show/thumb/',
    direct_base: 'http://twitpic.com/show/full/'
},
'twitgoo.com': {
    reg: new RegExp('http:\\/\\/twitgoo.com\\/([a-zA-Z0-9_\\-]+)','g'),
    base: 'http://twitgoo.com/show/thumb/',
    direct_base: 'http://twitgoo.com/show/img/'
},
'yfrog.com': {
    reg: new RegExp('http:\\/\\/yfrog.com\\/([a-zA-Z0-9_\\-]+)','g'),
    tail: '.th.jpg'
},
'moby.to': {
    reg: new RegExp('http:\\/\\/moby.to\\/([a-zA-Z0-9_\\-]+)','g'),
    tail: ':thumbnail'
},
'instagram.com': {
    reg: new RegExp('(?:http|https|)(?::\\/\\/|)(?:www.|)instagram.com\\/p\\/([a-zA-Z0-9_\\-]+)\\/?','g'), //4.0: Fix for instagram https
    tail: 'media?size=m',
    direct_tail: 'media?size=l'
},
'plixi.com': {
    reg: new RegExp('http:\\/\\/plixi.com\\/p\\/([a-zA-Z0-9_\\-]+)','g'),
    base: 'http://api.plixi.com/api/tpapi.svc/imagefromurl?size=thumbnail&url='
},
'picplz.com': {
    reg: new RegExp('http:\\/\\/picplz.com\\/([a-zA-Z0-9_\\-]+)','g'),
    tail: '/thumb/'
},
'raw': {
    reg: new RegExp('[a-zA-Z0-9]+:\\/\\/.+\\/.+\\.(jpg|jpeg|jpe|png|gif)', 'gi')
},
'twipple.jp': {
    reg: new RegExp('http:\\/\\/(?:p.|)(?:twpl|twipple).jp\\/([a-zA-Z0-9_\\-]+)','g'),
    base: 'http://p.twpl.jp/show/thumb/',
    direct_base: 'http://p.twpl.jp/show/orig/'
},
'youtube.com': {
    reg: new RegExp('(?:http|https|)(?::\\/\\/|)(?:www.|)(?:youtu\\.be\\/|youtube\\.com\\/watch\\?.*?v=)([\\w\\-]{11})','g'),
    base: 'http://img.youtube.com/vi/',
    tail: '/default.jpg'
},
'dailymotion.com': {
    reg: new RegExp('(?:dailymotion\.com(?:\/video|\/hub)|dai\.ly)\/([0-9a-z]+)(?:[\-_0-9a-zA-Z]+#video=([a-z0-9]+))?','g'),
    base: 'http://www.dailymotion.com/thumbnail/video/'
},
'twitter_video': {
    reg: new RegExp('(?:http|https|):\/\/amp.twimg.com\/v\/([a-zA-Z0-9_\\-]+)','g'),
    base: '../image/twitter_video.png'
}

},

init:
function init() {
    ui.Template.reg_url = ''//ui.Template.reg_vaild_preceding_chars
    + '('
        + ui.Template.reg_url_proto_chars
        + ui.Template.reg_url_path_chars_1
        + '*'
        + ui.Template.reg_url_path_chars_2
    + '+)';

    ui.Template.reg_user = new RegExp('(^|[^a-zA-Z0-9_!#$%&*@＠?!\/])'
        + ui.Template.reg_user_name_chars, 'g');

    ui.Template.reg_list = new RegExp('(^|[^a-zA-Z0-9_!#$%&*@＠?!\/])'
        + ui.Template.reg_list_name_template, 'ig');

    ui.Template.reg_link = new RegExp(ui.Template.reg_url);

    ui.Template.reg_link_g = new RegExp(ui.Template.reg_url, 'g');

    ui.Template.reg_hash_tag = new RegExp(ui.Template.reg_hash_tag_template
        .replace(new RegExp('{%LATIN_CHARS%}', 'g'), ui.Template.reg_hash_tag_latin_chars)
        .replace(new RegExp('{%NONLATIN_CHARS%}', 'g'), ui.Template.reg_hash_tag_nonlatin_chars)
    , 'ig');

    ui.Template.tweet_m = {
          ID:'', TWEET_ID:'', RETWEET_ID:''
        , REPLY_ID:'',SCREEN_NAME:'',REPLY_NAME:'', USER_NAME:''
        , PROFILE_IMG:'', TEXT:'', SOURCE:'', SCHEME:''
        , IN_REPLY:'', RETWEETABLE:'', REPLY_TEXT:'', RETWEET_TEXT:'', IN_RT:''
        , RETWEET_MARK:'', SHORT_TIMESTAMP:'', TIMESTAMP:'', FAV_CLASS:''
        , DELETABLE:'', TWEET_FONT_SIZE:'', TWEET_FONT: ''
        , TWEET_LINE_HEIGHT:''
        , STATUS_INDICATOR:'', TRANS_Delete:''
        , TRANS_Official_retweet_this_tweet:'', TRANS_Reply_All:''
        , TRANS_Reply_this_tweet:'', TRANS_RT_this_tweet:''
        , TRANS_Send_Message:'', TRANS_Send_Message_to_them:''
        , TRANS_via:'', TRANS_View_more_conversation:'', TRANS_view_hide_conversation: ''
        , TWEET_BASE_URL: '', IN_THREAD: ''
        , COLOR_LABEL: '', TRANS_fav_or_un_fav:''
	, LIKED: '', RTD: '', TWEET_SOCIAL_VIEW: ''
	, TWEET_BAR_OLD: ''
    };

    ui.Template.retweeted_by_m = {
          ID:'', TWEET_ID:'', RETWEET_ID:''
        , REPLY_ID:'',SCREEN_NAME:'',REPLY_NAME:'', USER_NAME:''
        , PROFILE_IMG:'', TEXT:'', SOURCE:'', SCHEME:''
        , IN_REPLY:'', RETWEETABLE:'', REPLY_TEXT:'', RETWEET_TEXT:''
        , RETWEET_MARK:'', SHORT_TIMESTAMP:'', TIMESTAMP:'', FAV_CLASS:''
        , DELETABLE:'', TWEET_FONT_SIZE:'', TWEET_FONT:''
        , TWEET_LINE_HEIGHT:''
        , STATUS_INDICATOR:'', TRANS_Delete:''
        , TRANS_Official_retweet_this_tweet:'', TRANS_Reply_All:''
        , TRANS_Reply_this_tweet:'', TRANS_RT_this_tweet:''
        , TRANS_Send_Message:'', TRANS_Send_Message_to_them:''
        , TRANS_via:'', TRANS_View_more_conversation:''
        , TRANS_retweeted_by:'', TRANS_Show_retweeters:''
        , TRANS_Click_to_show_retweeters:''
        , TWEET_BASE_URL: ''
	, LIKED: '', RTD: '', TWEET_SOCIAL_VIEW: ''
	, TWEET_BAR_OLD: ''
    };

    ui.Template.message_m = {
          ID:'', TWEET_ID:'', SCREEN_NAME:'', RECIPIENT_SCREEN_NAME:''
        , USER_NAME:'', PROFILE_IMG:'', TEXT:''
        , SCHEME:'', TIMESTAMP:''
        , TWEET_FONT_SIZE:'', TWEET_FONT:''
        , TWEET_LINE_HEIGHT:''
        , TRANS_Reply_Them:''
    };
    
    ui.Template.new_follower_m = { 
	ID:'', TWEET_ID:'', SCHEME:'', SCREEN_NAME:'', USER_NAME:'', LINK:'', 
	TWEET_FONT:'', COLOR_LABEL: '', PROFILE_IMG:'', DESCRIPTION:'', 
	VISIBLE_NAME:'', ALT:'', TWEET_FONT_SIZE:'', TWEET_LINE_HEIGHT:'', 
	TEXT:'', TIMESTAMP:'', SHORT_TIMESTAMP:'', STATUS_INDICATOR:''
    };    
    
    ui.Template.quoted_m = {   
          ID:'', TWEET_ID:'', SCHEME:'',FAV_CLASS:'', RETWEET_ID:''
        , REPLY_ID:'', IN_THREAD:'', SCREEN_NAME:'',REPLY_NAME:'', USER_NAME:''
	, RETWEETABLE:'', DELETABLE:'', LINK:'', TWEET_FONT:''
	, DESCRIPTION:'', PROFILE_IMG:'', VISIBLE_NAME:'', ALT:''
	, TWEET_FONT_SIZE:'', TWEET_LINE_HEIGHT:'', TEXT:''
	, TWEET_BASE_URL:'', TIMESTAMP:'', SHORT_TIMESTAMP:''
	, TRANS_via:'', SOURCE:'', TWEET_SOCIAL_VIEW:''
	, LIKED:'', RTD:'', STATUS_INDICATOR:''
    };    

    ui.Template.search_m = {
          ID:'', TWEET_ID:'', SCREEN_NAME:''
        , USER_NAME:'', PROFILE_IMG:'', TEXT:'', SOURCE:''
        , SCHEME:'', SHORT_TIMESTAMP:'', TIMESTAMP:''
        , TWEET_FONT_SIZE:'', TWEET_FONT:''
        , TWEET_LINE_HEIGHT:''
        , TRANS_via:''
        , TWEET_BASE_URL: ''
	, TWEET_BAR_OLD: ''
    };

    ui.Template.people_m = {
          USER_ID:'', SCREEN_NAME:'', USER_NAME:'', DESCRIPTION:''
        , PROFILE_IMG:'', FOLLOWING:'', TWEET_FONT_SIZE:'', TWEET_FONT:''
        , TWEET_LINE_HEIGHT:''
    };

    ui.Template.list_m = {
          LIST_ID:'', SCREEN_NAME:'', SLUG:'', NAME:'', MODE:''
        , DESCRIPTION:'', PROFILE_IMG:'', FOLLOWING:''
        , TWEET_FONT_SIZE:'', TWEET_FONT:''
        , TWEET_LINE_HEIGHT:''
    };

    ui.Template.view_m = {
        ID:'', CLASS:'tweetview', NAME: '', CAN_CLOSE: '', ROLE: ''
    };

    ui.Template.indicator_m = {
        TARGET: '', TITLE: '', ICON: '', ROLE: ''
    };

    ui.Template.status_draft_m = {
          MODE:'', TEXT:'', REPLY_TO_ID: '', REPLY_TEXT: ''
        , RECIPIENT: ''
    };

    ui.Template.update_trans();
},

update_trans:
function update_trans() {
    ui.Template.people_vcard_m = {
          TRANS_info: _('info'), TRANS_stat: _('stat')
        , TRANS_name: _('name'), TRANS_bio: _('bio')
        , TRANS_web: _('web'), TRANS_location: _('location')
        , TRANS_join: _('join'), TRANS_tweet_cnt: _('tweet_cnt')
        , TRANS_tweet_cnt: _('tweet_cnt')
        , TRANS_follower_cnt: _('follower_cnt')
        , TRANS_friend_cnt: _('friend_cnt')
        , TRANS_listed_cnt: _('listed_cnt')
        , TRANS_relation: _('relation')
        , TRANS_edit: _('edit')
        , TRANS_follow: _('follow'), TRANS_more_actions: _('more_actions')
        , TRANS_mention_them: _('mention_them')
        , TRANS_message_them: _('send_message_to_them')
        , TRANS_add_to_list: _('add_to_list')
        , TRANS_block: _('block')
        , TRANS_mute: _('mute') 
        , TRANS_unmute: _('unmute')	
	, TRANS_no_rt: _('no_rt') 
        , TRANS_yes_rt: _('yes_rt')	
        , TRANS_report_spam: _('report_spam')
        , TRANS_tweets: _('tweets'), TRANS_favs: _('likes')
        , TRANS_followers: _('followers'), TRANS_friends: _('friends')
        , TRANS_fellowship: _('fellowship')
        , TRANS_lists: _('lists'), TRANS_lists_of_them: _('lists_of_them')
        , TRANS_lists_following_them: _('lists_following_them')
        , TRANS_create_a_list: _('create_a_list')
	, TRANS_timeline: _('timeline')
	, TRANS_timeline_tip: _('timeline_tip')
	, TRANS_own_tweets: _('own_tweets')
	, TRANS_own_tweets_tip: _('own_tweets_tip')
    };
    ui.Template.people_vcard_t = ui.Template.render(ui.Template.people_vcard_t_orig, ui.Template.people_vcard_m);
    
    ui.Template.message_header_m = {
	TRANS_any: _('any'),
	TRANS_load_more: _('load_more'),
	TRANS_compose: _('compose'),
	TRANS_back: _('back')
    };
    ui.Template.message_header_t = ui.Template.render(ui.Template.message_header_t, ui.Template.message_header_m);
},

form_dm:
function form_dm(dm_obj, pagename) {
    var timestamp = Date.parse(dm_obj.created_at);
    var created_at = new Date();
    created_at.setTime(timestamp);
    var created_at_str = ui.Template.to_long_time_string(created_at);
    var created_at_short_str = ui.Template.to_short_time_string(created_at);
    var text = ui.Template.form_text(dm_obj);

    var m = ui.Template.message_m;
    m.ID = pagename + '-' + dm_obj.id_str;
    m.TWEET_ID = dm_obj.id_str;
    m.SCREEN_NAME = dm_obj.sender.screen_name;
    m.RECIPIENT_SCREEN_NAME = dm_obj.recipient.screen_name;
    m.USER_NAME = dm_obj.sender.name;
    m.VISIBLE_NAME = ui.Template.parse_name(dm_obj.sender.name,dm_obj.sender.screen_name); //4.0: Optimizations
    m.DESCRIPTION = dm_obj.sender.description;
    m.PROFILE_IMG = dm_obj.sender.profile_image_url;
    m.TEXT = text;
    m.SCHEME = 'message';
    m.TIMESTAMP = created_at_str;
    m.SHORT_TIMESTAMP = created_at_short_str;
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;
    m.TWEET_FONT = globals.tweet_font;
    m.TRANS_Reply_Them = _('reply');
    return ui.Template.render(ui.Template.message_t, m);
},

// This function returns the html for the given tweet_obj.
form_tweet:
function form_tweet (tweet_obj, pagename, in_thread) {
    var favorited = false; 
    var retweet_name = '';
    var retweet_str = '';
    var retweet_id = '';
    var id = tweet_obj.id_str;

    if (tweet_obj.hasOwnProperty('favorited_at')) {
	retweet_name = tweet_obj.favorited_by.screen_name;
        retweet_id = tweet_obj.id_str;	
	favorited = true;
    }
        
    if (tweet_obj.hasOwnProperty('retweeted_status')) {
        retweet_name = tweet_obj['user']['screen_name'];
        tweet_obj['retweeted_status'].favorited = tweet_obj.favorited; 
        tweet_obj = tweet_obj['retweeted_status'];
        retweet_id = tweet_obj.id_str;
    }
    var reply_name = tweet_obj.in_reply_to_screen_name;
    var reply_id = tweet_obj.hasOwnProperty('in_reply_to_status_id_str')
            ? tweet_obj.in_reply_to_status_id_str:tweet_obj.in_reply_to_status_id;
    var reply_str = (reply_id != null) ?
        _('in_reply_to') + ' @<a class="who_href" href="#'
            + reply_name + '">'
            + reply_name + '</a>'
        : '';
    var in_thread = in_thread == true ? true: false;

    var timestamp = Date.parse(tweet_obj.created_at);
    var created_at = new Date();
    created_at.setTime(timestamp);
    var created_at_str = ui.Template.to_long_time_string(created_at);
    var created_at_short_str = ui.Template.to_short_time_string(created_at);
    
    var scheme = 'normal';
    if (tweet_obj.user.screen_name == globals.myself.screen_name) {
        scheme = 'me';
    }
    if (retweet_name != '') {
        retweet_str = (favorited ? _('liked_by') : _('retweeted_by'))
	    +  ' @<a class="who_href" href="#'
            + retweet_name + '">'
            + retweet_name + '</a>';
    }

    var alt_text = (tweet_obj.full_text ? tweet_obj.full_text : (tweet_obj.extended_tweet ? tweet_obj.extended_tweet.full_text : tweet_obj.text) );
    var link = ((tweet_obj.entities.urls.length > 0) ? tweet_obj.entities.urls[0].expanded_url : '');
    var text = ui.Template.form_text(tweet_obj);
    
    // if the tweet contains user_mentions (which are provided by the Twitter
    // API, not by the StatusNet API), it will here replace the 
    // contents of the 'who_ref'-a-tag by the full name of this user.

    if (tweet_obj.entities && tweet_obj.entities.user_mentions) {
        for (var i = 0, l = tweet_obj.entities.user_mentions.length; i < l; i+=1)
        {
            var screen_name = tweet_obj.entities.user_mentions[i].screen_name;
            if (screen_name == globals.myself.screen_name) scheme = 'mention';
            var name = tweet_obj.entities.user_mentions[i].name.replace(/"/g, '&quot;');
            var reg_ulink = new RegExp('>(' + screen_name + ')<', 'ig');
            text = text.replace(reg_ulink, ' title="' + name + '">$1<')
        }
        // If we get here, and there are still <a who_href="...">-tags
        // without title attribute, the user name was probably misspelled. 
        // If I then remove the tag, the incorrect user name is not 
        // highlighted any more, which fixes #415 for twitter.
        var re = /\<a class=\"who_href\" href=\"[^"]*\"\>([^<]*)\<\/a\>/gi
        text = text.replace(re, '$1');
    }

    var m = ui.Template.tweet_m;
    m.ID = pagename+'-'+id;
    m.TWEET_ID = id;
    m.RETWEET_ID = retweet_id;
    m.REPLY_ID = reply_id != null? reply_id:'';
    m.IN_THREAD = in_thread;
    m.SCREEN_NAME = tweet_obj.user.screen_name;
    m.VISIBLE_NAME = ui.Template.parse_name(tweet_obj.user.name,tweet_obj.user.screen_name);
    m.REPLY_NAME = reply_id != null? reply_name: '';
    m.USER_NAME = tweet_obj.user.name;
    m.DESCRIPTION = tweet_obj.user.description;
    m.PROFILE_IMG = tweet_obj.user.profile_image_url;
    m.TEXT = text;
    m.ALT = ui.Template.convert_chars(alt_text);
    m.SOURCE = tweet_obj.source.replace('href', 'target="_blank" href');
    m.SCHEME = scheme;
    m.IN_REPLY = (reply_id != null && !in_thread) ? 'block' : 'none';
    m.RETWEETABLE = (tweet_obj.user.protected)? 'false':'true';

    m.COLOR_LABEL = ui.Main.get_user_color(tweet_obj.user.screen_name);

    m.REPLY_TEXT = reply_str;
    m.RETWEET_TEXT = retweet_str;
    m.RETWEET_MARK = retweet_name != ''? 'retweet_mark': '';    
    m.IN_RT = retweet_name != ''? 'block': 'none';    
    m.FAV_CLASS = (favorited || tweet_obj.favorited) ? 'faved': '';
    m.DELETABLE = scheme == 'me'? 'true': 'false';
    m.SHORT_TIMESTAMP = created_at_short_str;
    m.TIMESTAMP = created_at_str;    
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_FONT = globals.tweet_font;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;
    m.STATUS_INDICATOR = ui.Template.form_status_indicators(tweet_obj);
    m.TRANS_Delete = _('delete');
    m.TRANS_Delete_this_tweet = _('delete_this_tweet');
    m.TRANS_Loading = _('loading_dots');
    m.TRANS_Official_retweet_this_tweet = _('official_retweet_this_tweet');
    m.TRANS_Reply_All = _('reply_all');
    m.TRANS_Reply_this_tweet = _('reply_this_tweet');
    m.TRANS_RT_this_tweet = _('rt_this_tweet');
    m.TRANS_Send_Message = _('send_message');
    m.TRANS_Send_Message_to_them = _('send_message_to_them');
    m.TRANS_via = _('via');
    m.TRANS_View_more_conversation = _('view_more_conversation');
    m.TRANS_view_hide_conversation = _('view_hide_conversation');
    m.TWEET_BASE_URL = 'https://twitter.com/' + tweet_obj.user.screen_name + '/status';
    m.LINK = link;
    
    m.LIKED = tweet_obj.favorite_count;
    m.RTD = tweet_obj.retweet_count;
    m.TWEET_SOCIAL_VIEW = (conf.get_current_profile().preferences.show_social ? 'show_block' : '');
    m.TRANS_fav_or_un_fav = _('like_or_un_like');
    m.TWEET_BAR_OLD = '';

    return (favorited ? ui.Template.render(ui.Template.favorited_by_t, m) : ui.Template.render(ui.Template.tweet_t, m));
},

form_new_follower:
function form_new_follower(tweet_obj, pagename) {   
    var id = tweet_obj.id_str;
    var timestamp = Date.parse(tweet_obj.created_at);
    var created_at = new Date();
    var created_at_str = ui.Template.to_long_time_string(created_at);
    var created_at_short_str = ui.Template.to_short_time_string(created_at);
    var scheme = 'normal';

    var m = ui.Template.new_follower_m;
    m.ID = pagename+'-'+id;
    m.TWEET_ID = id;
    m.SCREEN_NAME = tweet_obj.screen_name;
    m.VISIBLE_NAME = ui.Template.parse_name(tweet_obj.name,tweet_obj.screen_name);
    m.USER_NAME = tweet_obj.name;
    m.DESCRIPTION = tweet_obj.description;
    m.PROFILE_IMG = tweet_obj.profile_image_url;
    m.TEXT = _('starts_following_you');
    m.ALT = ui.Template.convert_chars(_('starts_following_you'));
    m.SCHEME = scheme;
    m.COLOR_LABEL = ui.Main.get_user_color(tweet_obj.screen_name);
    m.SHORT_TIMESTAMP = created_at_short_str;
    m.TIMESTAMP = created_at_str;    
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_FONT = globals.tweet_font;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;
    m.STATUS_INDICATOR = ui.Template.form_status_indicators(tweet_obj);
    m.TWEET_BASE_URL = 'https://twitter.com/' + tweet_obj.screen_name + '/status';
    m.LINK = '';
    return ui.Template.render(ui.Template.new_follower_t, m);
},

form_retweeted_by:
function form_retweeted_by(tweet_obj, pagename) {
    var retweet_name = '';
    var retweet_str = '';
    var retweet_id = '';
    var id = tweet_obj.id_str;
    if (tweet_obj.hasOwnProperty('retweeted_status')) {
        retweet_name = tweet_obj['user']['screen_name'];
        tweet_obj['retweeted_status'].favorited = tweet_obj.favorited;
        tweet_obj = tweet_obj['retweeted_status'];
        retweet_id = tweet_obj.id_str;
    }
    var reply_name = tweet_obj.in_reply_to_screen_name;
    var reply_id = tweet_obj.hasOwnProperty('in_reply_to_status_id_str')
            ? tweet_obj.in_reply_to_status_id_str:tweet_obj.in_reply_to_status_id;
    var reply_str = (reply_id != null) ?
        _('reply_to') + ' @<a class="who_href" href="#'
            + reply_name + '">'
            + reply_name + '</a>: '
        : '';

    var timestamp = Date.parse(tweet_obj.created_at);
    var created_at = new Date();
    created_at.setTime(timestamp);
    var created_at_str = ui.Template.to_long_time_string(created_at);
    var created_at_short_str = ui.Template.to_short_time_string(created_at);

    var scheme = 'normal';
    if (tweet_obj.entities && tweet_obj.entities.user_mentions) {
        for (var i = 0, l = tweet_obj.entities.user_mentions.length; i < l; i+=1)
        {
            if (tweet_obj.entities.user_mentions[i].screen_name
                == globals.myself.screen_name)
            {
                scheme = 'mention';
            }
        }
    }
    if (tweet_obj.user.screen_name == globals.myself.screen_name) {
        scheme = 'me';
    }
    if (retweet_name != '') {
        retweet_str = _('retweeted_by') +  ' <a class="who_href" href="#'
            + retweet_name + '">'
            + retweet_name + '</a>, ';
    }

    var m = ui.Template.retweeted_by_m;
    m.ID = pagename+'-'+id;
    m.TWEET_ID = id;
    m.RETWEET_ID = retweet_id;
    m.REPLY_ID = reply_id != null? reply_id:'';
    m.SCREEN_NAME = tweet_obj.user.screen_name;
    m.REPLY_NAME = reply_id != null? reply_name: '';
    m.USER_NAME = tweet_obj.user.name;
    m.VISIBLE_NAME = ui.Template.parse_name(tweet_obj.user.name,tweet_obj.user.screen_name);
    m.PROFILE_IMG = tweet_obj.user.profile_image_url;
    m.TEXT = ui.Template.form_text(tweet_obj);
    m.SOURCE = tweet_obj.source.replace('href', 'target="_blank" href');
    m.SCHEME = scheme;

    m.IN_REPLY = (reply_id != null && pagename.split('-').length < 2) ? 'block' : 'none';
    m.RETWEETABLE = (tweet_obj.user.protected)? 'false':'true';

    m.REPLY_TEXT = reply_str;
    m.RETWEET_TEXT = retweet_str;
    m.RETWEET_MARK = 'retweet_mark';
    m.FAV_CLASS = tweet_obj.favorited ? 'faved': '';
    m.SHORT_TIMESTAMP = created_at_short_str;
    m.TIMESTAMP = created_at_str;
    m.DELETABLE = scheme == 'me'? 'true': 'false';
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_FONT = globals.tweet_font;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;
    m.STATUS_INDICATOR = ui.Template.form_status_indicators(tweet_obj);
    m.TRANS_Delete = _('delete');
    m.TRANS_Delete_this_tweet = _('delete_this_tweet');
    m.TRANS_Loading = _('loading_dots');
    m.TRANS_Official_retweet_this_tweet = _('official_retweet_this_tweet');
    m.TRANS_Reply_All = _('reply_all');
    m.TRANS_Reply_this_tweet = _('reply_this_tweet');
    m.TRANS_RT_this_tweet = _('rt_this_tweet');
    m.TRANS_Send_Message = _('send_message');
    m.TRANS_Send_Message_to_them = _('send_message_to_them');
    m.TRANS_via = _('via');
    m.TRANS_View_more_conversation = _('view_more_conversation');
    m.TRANS_Retweeted_by = _('retweeted_by');
    m.TRANS_Show_retweeters = _('click_to_show');
    m.TRANS_Click_to_show_retweeters = _('click_to_show_retweeters');
    m.TWEET_BASE_URL = 'https://twitter.com/' + tweet_obj.user.screen_name + '/status';
    
    m.LIKED = tweet_obj.favorite_count;
    m.RTD = tweet_obj.retweet_count;    
    m.TWEET_SOCIAL_VIEW = (conf.get_current_profile().preferences.show_social ? 'show_block' : '');
    m.TWEET_BAR_OLD = ''; 

    return ui.Template.render(ui.Template.retweeted_by_t, m);
},

form_quoted:
function form_quoted(tweet_obj) {
    if (tweet_obj.user === undefined) return "";
    var id = tweet_obj.id_str;

    if (tweet_obj.hasOwnProperty('retweeted_status')) {
        tweet_obj['retweeted_status'].favorited = tweet_obj.favorited; 
        tweet_obj = tweet_obj['retweeted_status'];
    }

    var timestamp = Date.parse(tweet_obj.created_at);
    var created_at = new Date();
    created_at.setTime(timestamp);
    var created_at_str = ui.Template.to_long_time_string(created_at);
    var created_at_short_str = ui.Template.to_short_time_string(created_at);

    var alt_text = (tweet_obj.full_text ? tweet_obj.full_text : (tweet_obj.extended_tweet ? tweet_obj.extended_tweet.full_text : tweet_obj.text) );
    var link = '';
    
    var text = ui.Template.form_text(tweet_obj);
    // if the tweet contains user_mentions (which are provided by the Twitter
    // API, not by the StatusNet API), it will here replace the 
    // contents of the 'who_ref'-a-tag by the full name of this user.

    if (tweet_obj.entities && tweet_obj.entities.user_mentions) {
        for (var i = 0, l = tweet_obj.entities.user_mentions.length; i < l; i+=1)
        {
            var screen_name = tweet_obj.entities.user_mentions[i].screen_name;
            var name = tweet_obj.entities.user_mentions[i].name.replace(/"/g, '&quot;');
            var reg_ulink = new RegExp('>(' + screen_name + ')<', 'ig');
            text = text.replace(reg_ulink, ' title="' + name + '">$1<')
        }
        // If we get here, and there are still <a who_href="...">-tags
        // without title attribute, the user name was probably misspelled. 
        // If I then remove the tag, the incorrect user name is not 
        // highlighted any more, which fixes #415 for twitter.
        var re = /\<a class=\"who_href\" href=\"[^"]*\"\>([^<]*)\<\/a\>/gi
        text = text.replace(re, '$1');
    }

    var m = ui.Template.quoted_m;
    m.ID = 'undefined-' + id;
    m.TWEET_ID = id;
    m.SCHEME = 'normal';
    m.FAV_CLASS = (tweet_obj.favorited) ? 'faved': '';
    m.RETWEET_ID = '';
    m.REPLY_ID = '';
    m.IN_THREAD = false;
    m.SCREEN_NAME = tweet_obj.user.screen_name;
    m.REPLY_NAME = '';
    m.USER_NAME = tweet_obj.user.name;
    m.RETWEETABLE = 'false';
    m.DELETABLE = 'false';
    m.LINK = link;
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_FONT = globals.tweet_font;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;
    m.DESCRIPTION = tweet_obj.user.description;
    m.PROFILE_IMG = tweet_obj.user.profile_image_url;
    m.VISIBLE_NAME = ui.Template.parse_name(tweet_obj.user.name,tweet_obj.user.screen_name);
    m.ALT = ui.Template.convert_chars(alt_text);
    m.TEXT = text;
    m.TWEET_BASE_URL = 'https://twitter.com/' + tweet_obj.user.screen_name + '/status';
    m.TIMESTAMP = created_at_str;  
    m.SHORT_TIMESTAMP = created_at_short_str;
    m.TRANS_via = _('via');
    m.SOURCE = tweet_obj.source.replace('href', 'target="_blank" href');
    m.STATUS_INDICATOR = ui.Template.form_status_indicators(tweet_obj);
    m.LIKED = tweet_obj.favorite_count;
    m.RTD = tweet_obj.retweet_count;
    m.TWEET_SOCIAL_VIEW = (conf.get_current_profile().preferences.show_social ? 'show_block' : '');
	
    return (ui.Template.render(ui.Template.quoted_t, m));
},

form_search:
function form_search(tweet_obj, pagename) {
    if (tweet_obj.user != undefined) {
        return ui.Template.form_tweet(tweet_obj, pagename);
    }
    var id = tweet_obj.id_str;
    var source = tweet_obj.source.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '');
    var timestamp = Date.parse(tweet_obj.created_at);
    var created_at = new Date();
    created_at.setTime(timestamp);
    var created_at_str = ui.Template.to_long_time_string(created_at);
    var created_at_short_str = ui.Template.to_short_time_string(created_at);
    var text = ui.Template.form_text(tweet_obj);

    var scheme = 'normal';
    if (text.indexOf(globals.myself.screen_name) != -1) {
        scheme = 'mention';
    }
    if (tweet_obj.from_user == globals.myself.screen_name) {
        scheme = 'me';
    }
    var link = '';
    if (tweet_obj.entities.urls.length > 0) {
        link = tweet_obj.entities.urls[0].expanded_url;
    }

    var m = ui.Template.search_m;
    m.ID = pagename + '-' + id;
    m.TWEET_ID = id;
    m.SCREEN_NAME = tweet_obj.from_user;
    m.USER_NAME = tweet_obj.from_user_name;
    m.VISIBLE_NAME = ui.Template.parse_name(tweet_obj.from_user_name,tweet_obj.from_user); 
    m.PROFILE_IMG = tweet_obj.profile_image_url;
    m.TEXT = text;
    m.SOURCE = source.replace('href', 'target="_blank" href');
    m.SCHEME = scheme;
    m.SHORT_TIMESTAMP = created_at_short_str;
    m.TIMESTAMP = created_at_str;
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_FONT = globals.tweet_font;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;
    m.TRANS_via = _('via');
    m.TWEET_BASE_URL = 'https://twitter.com/' + tweet_obj.from_user + '/status';
    m.LINK = link;
    m.TWEET_BAR_OLD = '';
    
    return ui.Template.render(ui.Template.search_t, m);
},

form_people:
function form_people(user_obj, pagename) {
    var m = ui.Template.people_m;
    m.USER_ID = pagename + '-' + user_obj.id_str;
    m.SCREEN_NAME = user_obj.screen_name;
    m.USER_NAME = user_obj.name;
    m.VISIBLE_NAME = ui.Template.parse_name(user_obj.name,user_obj.screen_name); 
    m.DESCRIPTION = user_obj.description;
    m.PROFILE_IMG = user_obj.profile_image_url;
    m.FOLLOWING = user_obj.following;
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_FONT = globals.tweet_font;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;

    return ui.Template.render(ui.Template.people_t, m);
},

form_list:
function form_list(list_obj, pagename) {
    var m = ui.Template.list_m;
    m.LIST_ID = pagename + '-' + list_obj.id_str;
    m.SCREEN_NAME = list_obj.user.screen_name;
    m.SLUG = list_obj.slug;
    m.NAME = list_obj.name;
    m.MODE = list_obj.mode;
    m.DESCRIPTION = list_obj.description;
    m.PROFILE_IMG = list_obj.user.profile_image_url;
    m.FOLLOWING = list_obj.following;
    m.TWEET_FONT_SIZE = globals.tweet_font_size;
    m.TWEET_FONT = globals.tweet_font;
    m.TWEET_LINE_HEIGHT = globals.tweet_line_height;
    return ui.Template.render(ui.Template.list_t, m);
},

form_view:
function form_view(name, title, cls) {
    var m = ui.Template.view_m;
    m.ID = name + '_tweetview';
    m.NAME = name;
    m.CLASS = cls;
    if (name == 'home') {
        m.CAN_CLOSE = 'none';
    } else {
        m.CAN_CLOSE = 'block';
    }
    if (ui.Slider.system_views.hasOwnProperty(name)) {
        m.ROLE = 'system_view';
    } else {
        m.ROLE = 'custom_view';
    }
    return ui.Template.render(ui.Template.view_t, m);
},

form_indicator:
function form_indicator(target, title, icon) {
    var m = ui.Template.indicator_m;
    m.TARGET = target
    m.TITLE = title;
    m.ICON = icon;
    if (ui.Slider.system_views.hasOwnProperty(target)) {
        m.ROLE = 'system_view';
    } else {
        m.ROLE = 'custom_view';
    }
    return ui.Template.render(ui.Template.indicator_t, m);
},

form_status_draft:
function form_status_draft(draft) {
    var m = ui.Template.status_draft_m;
    m.MODE = draft.mode;
    m.TEXT = draft.text.replace(/</g, "&lt;").replace(/>/g,"&gt;");
    if (m.MODE == ui.StatusBox.MODE_REPLY) {
        m.REPLY_TO_ID = draft.reply_to_id;
        m.REPLY_TEXT = draft.reply_text
    } else if (m.MODE == ui.StatusBox.MODE_DM) {
        m.RECIPIENT = draft.recipient;
    } else if (m.MODE == ui.StatusBox.MODE_IMG) {

    }
    return ui.Template.render(ui.Template.status_draft_t, m);
},

fill_people_vcard:
function fill_people_vcard(user_obj, vcard_container) {
    var created_at = new Date(Date.parse(user_obj.created_at));
    var now = new Date();
    var differ = Math.floor((now-created_at)/(1000 * 60 * 60 * 24));

    var created_at_str = ui.Template.to_long_time_string(created_at);

    vcard_container.find('.profile_img_wrapper')
        .attr('href', user_obj.profile_image_url.replace(/_normal/, ''))
        .attr('style', 'background-image:url('+user_obj.profile_image_url+');');
    vcard_container.find('.screen_name')
        .attr('href', conf.get_current_profile().preferences.base_url + user_obj.screen_name)
        .text(user_obj.screen_name);
    vcard_container.find('.name').text(user_obj.name);
    vcard_container.find('.tweet_cnt').text(user_obj.statuses_count);
    vcard_container.find('.tweet_per_day_cnt').text(
        Math.round(user_obj.statuses_count / differ * 100)/ 100);
    vcard_container.find('.follower_cnt').text(user_obj.followers_count);
    vcard_container.find('.friend_cnt').text(user_obj.friends_count);
    vcard_container.find('.listed_cnt').text(user_obj.listed_count);
    vcard_container.find('.bio').unbind().empty().html(
        ui.Template.form_text_raw(user_obj.description));
    ui.Main.bind_tweet_text_action(vcard_container.find('.bio'));
    vcard_container.find('.location').text('').text(user_obj.location);
    vcard_container.find('.join').text(created_at_str);
    if (user_obj.url) {
        vcard_container.find('.web').text(user_obj.url)
        vcard_container.find('.web').attr('href', user_obj.url);
    } else {
        vcard_container.find('.web').text('')
        vcard_container.find('.web').attr('href', '#');
    }
    vcard_container.find('.people_vcard_radio_group .mochi_button_group_item').attr('name', 'people_'+user_obj.screen_name+'_vcard')
    vcard_container.find('.people_view_toggle .mochi_button_group_item').attr('name', 'people_'+user_obj.screen_name+'_views')
},

fill_list_vcard:
function fill_list_vcard(view, list_obj) {
    var vcard_container = view._header;
    vcard_container.find('.profile_img_wrapper')
        .attr('style', 'background-image:url('
            + list_obj.user.profile_image_url + ');');
    vcard_container.find('.name')
	.attr('href', conf.get_current_profile().preferences.base_url + list_obj.user.screen_name + '/' + list_obj.slug)
        .text(list_obj.slug);
    vcard_container.find('.owner')
        .attr('href', conf.get_current_profile().preferences.base_url + list_obj.user.screen_name)
        .text(list_obj.user.screen_name);
    vcard_container.find('.description').text(list_obj.description);
},

convert_chars:
function convert_chars(text) {
    text = text.replace(/"/g, '&#34;');
    text = text.replace(/'/g, '&#39;');
    text = text.replace(/\$/g, '&#36;');
    return text;
},

parse_emoji:
function parse_emoji(text) {
	text = twemoji.parse(
		text, 
		{	
			attributes: function(icon, variant) {
				return {
					style: 'height: ' + conf.get_current_profile().preferences.emoji_size + 
					((conf.get_current_profile().preferences.emoji_size > 3) ? 'px; ' : 'em; ') + 
					'background-color: ' + (conf.get_current_profile().preferences.emoji_backcolor ? 'white; ' : 'transparent;') +
					'margin: 0 .05em 0 .1em; vertical-align: -0.1em;'
				};
			},
			base: '../image/',
			folder: 'emoji'
		}
	);
	return text;
},

// This function applies some basic replacements to tweet.text, and returns
// the resulting string.
// This is not the final text that will appear in the UI, form_tweet will also do
// some modifications. from_tweet will search for the a-tags added in this
// function, to do the modifications.
form_text:
function form_text(tweet) {

    if (tweet.extended_tweet) {
	tweet.text = tweet.extended_tweet.full_text;
	tweet.entities = tweet.extended_tweet.entities;
    }
    
    text = (tweet.full_text ? tweet.full_text : tweet.text);
    
    var entities = JSON.parse(JSON.stringify(tweet.entities));
    var options = {	
		hashtagClass: 'hash_href',
		hashtagUrlBase: '#',
		cashtagClass: 'hash_href',
		cashtagUrlBase: '$',
		listClass: 'list_href',
		listUrlBase: '#',
		usernameClass: 'who_href',
		usernameUrlBase: '#',
		urlTarget: '_blank'
    };
    
    text = twttr.txt.autoLinkWithJSON(text, entities, options);
    
    text = ui.Template.parse_emoji(text);
        
    text = text.replace(/href="www/g, 'href="http://www');
    
    if (conf.get_current_profile().preferences.free_support) {
	$("<div>" + text + "</div>").find('a[title*="amazon\."]').each(function() {
		var href = this.href;
		var url = this.title;
		text = text.replace(new RegExp(href,'g'), function() {
			if (url.indexOf("amazon.it/") > -1) {
				url = util.updateURLParameter(url,"tag","hotot-21")
			} else if (url.indexOf("amazon.com/") > -1) {
				url = util.updateURLParameter(url,"tag","hotot-20");	
			} else if (url.indexOf("amazon.es/") > -1) {
				url = util.updateURLParameter(url,"tag","hototes-21");
			} else if (url.indexOf("amazon.fr/") > -1) {
				url = util.updateURLParameter(url,"tag","hototfr-21");
			} else if (url.indexOf("amazon.de/") > -1) {
				url = util.updateURLParameter(url,"tag","hototde-21");
			} else if (url.indexOf("amazon.co.uk/") > -1) {
				url = util.updateURLParameter(url,"tag","hototcouk-21");
			} else {
				url = href;
			}
			return url;
		});
	});
    }  
  
    text = text.replace(/title="(http:\/\/hotot.in\/(\d+))"/g, 'full_text_id="$2" title="$1"');
    
    text = text.replace(/title="(http:\/\/tl.gd\/(\S+))"/g, 'twitlonger="$2" title="$1"');
    
    text = text.replace(/title="(https:\/\/twitter.com\/.*?\/(?:status|statuses|)\/(\d+))"/g, 'twit="$2" title="$1"');
    
    text = text.replace(/title="((?:http|https|):\/\/vine.co\/v\/(\S+))"/g, 'vine="$1" title="$1"');
    
    text = text.replace(/[\r\n]\s+[\r\n]/g, '\n\n');

    text = text.replace(/\n/g, '<br/>');

    if (ui.Template.reg_is_rtl.test(text)) {
        text = '<div class="text_inner" align="right" dir="rtl">' + text + '</div>';
    } else {
        text = '<div class="text_inner">' + text + '</div>';
    }
    
    if (conf.get_current_profile().preferences.autoload_quoted && tweet.quoted_status) {
	text = text.replace(new RegExp('twit="' + tweet.quoted_status.id_str + '"', 'g'), 'twit="' + tweet.quoted_status.id_str + '" style="display:none;"');	
	text += '<div class="quoted_tweet"><ul>' + ui.Template.form_quoted(tweet.quoted_status) + '</ul></div>';
    }    
    
    if (conf.get_current_profile().preferences.use_media_preview) {
        text += '<div class="preview">' + ui.Template.form_preview(tweet) + '</div>';
	if (conf.get_current_profile().preferences.hide_media_link) {
		text = text.replace(/>pic\.twitter\.com\/.*?</g, '><');
	}
    }    
    
    return text;
    		
},

form_text_raw:
function form_text_raw(raw_text) {
    var text = raw_text;
    
    var options = {	
		hashtagClass: 'hash_href',
		hashtagUrlBase: '#',
		cashtagClass: 'hash_href',
		cashtagUrlBase: '$',
		listClass: 'list_href',
		listUrlBase: '#',
		usernameClass: 'who_href',
		usernameUrlBase: '#',
		urlTarget: '_blank'
    };

        
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
        	
    text = twttr.txt.autoLink(text, options);
        
    text = ui.Template.parse_emoji(text);
    
    text = text.replace(/href="www/g, 'href="http://www');
    
    if (conf.get_current_profile().preferences.free_support) {
	$("<div>" + text + "</div>").find('a[href*="amazon\."]').each(function() {
		var href = this.href;
		var url = href;
		text = text.replace(new RegExp(href,'g'), function() {
			if (url.indexOf("amazon.it/") > -1) {
				url = util.updateURLParameter(url,"tag","hotot-21")
			} else if (url.indexOf("amazon.com/") > -1) {
				url = util.updateURLParameter(url,"tag","hotot-20");	
			} else if (url.indexOf("amazon.es/") > -1) {
				url = util.updateURLParameter(url,"tag","hototes-21");
			} else if (url.indexOf("amazon.fr/") > -1) {
				url = util.updateURLParameter(url,"tag","hototfr-21");
			} else if (url.indexOf("amazon.de/") > -1) {
				url = util.updateURLParameter(url,"tag","hototde-21");
			} else if (url.indexOf("amazon.co.uk/") > -1) {
				url = util.updateURLParameter(url,"tag","hototcouk-21");
			}
			return url;
		});
	});
    }  
  
    text = text.replace(/href="(http:\/\/hotot.in\/(\d+))"/g, 'full_text_id="$2" href="$1"');
    
    text = text.replace(/href="(http:\/\/tl.gd\/(\S+))"/g, 'twitlonger="$2" href="$1"');
    
    text = text.replace(/href="(https:\/\/twitter.com\/.*?\/(?:status|statuses|)\/(\d+))"/g, 'twit="$2" href="$1"');

    text = text.replace(/href="((?:http|https|):\/\/vine.co\/v\/(\S+))"/g, 'vine="$1" href="$1"');
    
    text = text.replace(/[\r\n]\s+[\r\n]/g, '\n\n');

    text = text.replace(/\n/g, '<br/>');

    if (ui.Template.reg_is_rtl.test(text)) {
        text = '<div class="text_inner" align="right" dir="rtl">' + text + '</div>';
    } else {
        text = '<div class="text_inner">' + text + '</div>';
    }
    
    text = text.replace(/(pic\.twitter\.com\/(\S+))/g,'<a href="http://$1" target="_blank">$1</a>'); 
    
    return text;
},


form_media:
function form_media(href, src, direct_url, yt) {
    var maxheight = (conf.get_current_profile().preferences.thumb_preview ? '150px' : 'none');
    switch (yt) {
	case 0:
		return '<a youtube_id="'+direct_url+'" href="'+href+'"><img style="max-height:' + maxheight + ';" src="'+ src +'" /></a>';
	break;
	case 1:
		return '<iframe class="yt_iframe"\
			width="' + (globals.tweet_block_width-100) + '" \
			height="' + ((globals.tweet_block_width-100)/16*9+32) + '" \
			src="http://www.youtube.com/embed/' + src + '?rel=0" frameborder="0" allowfullscreen></iframe>';
	break;
	case 2:
		return '<a dailymotion_id="'+direct_url+'" href="'+href+'"><img style="max-height:' + maxheight + ';" src="'+ src +'" /></a>';
	break;
	case 3:
		return '<a twitter_video="'+direct_url+'" href="'+href+'"><img style="max-height:' + maxheight + ';" src="'+ src +'" /></a>';
	break;
	case 4:
		return '<a hls="'+direct_url+'" href="#" type="'+href+'"><img style="max-height:' + maxheight + ';" src="'+ src +'" /></a>';
	break;
	default:
		if (direct_url != undefined) {
		        return '<a direct_url="'+direct_url+'" href="'+href+'"><img style="max-height:' + maxheight + ';" src="'+ src +'" /></a>';
		} else {
			return '<a href="'+href+'" target="_blank"><img style="max-height:' + maxheight + ';" src="'+ src +'" /></a>';
		}
	break;
    }
},

form_preview:
function form_preview(tweet) {
    var html_arr = [];
    var link_reg = ui.Template.preview_link_reg; 

    if (tweet.extended_tweet) {
	tweet.text = tweet.extended_tweet.full_text;
	tweet.entities = tweet.extended_tweet.entities;
    }
        
    var text = tweet.full_text ? tweet.full_text : tweet.text;
        
    if (tweet.entities && tweet.entities.urls) {
        var urls = null;
	urls = tweet.entities.urls;
        if (tweet.entities.media) {
            urls = tweet.entities.urls.concat(tweet.entities.media);
        } else {
            urls = tweet.entities.urls;
        }
        for (var i = 0, l = urls.length; i < l; i += 1) {
            var url = urls[i];
            if (url.url && url.expanded_url) {
		if (url.type) {
			text = text.replace(url.url, url.display_url);
		} else {
			text = text.replace(url.url, url.expanded_url);
		}
            }
        }
    }
       
    for (var pvd_name in link_reg) {
        var match = link_reg[pvd_name].reg.exec(text);
        while (match != null) {
            switch (pvd_name) {
            case 'img.ly':
            case 'twitgoo.com':
                html_arr.push(ui.Template.form_media(match[0], link_reg[pvd_name].base + match[1], link_reg[pvd_name].direct_base + match[1]));
            break;
            case 'twitpic.com':
                html_arr.push(ui.Template.form_media(match[0], link_reg[pvd_name].base + match[1], link_reg[pvd_name].direct_base + match[1]));
            break;
            case 'instagram.com':
                html_arr.push(ui.Template.form_media(match[0], match[0] + link_reg[pvd_name].tail, match[0] + link_reg[pvd_name].direct_tail));
            break;
            case 'yfrog.com':
            case 'moby.to':
            case 'picplz.com':
                html_arr.push(ui.Template.form_media(match[0], match[0] + link_reg[pvd_name].tail));
            break;
            case 'plixi.com':
                html_arr.push(ui.Template.form_media(match[0], link_reg[pvd_name].base + match[0]));
            break;
            case 'raw':
		if (conf.get_current_profile().preferences.hide_raw_previews != true) html_arr.push(ui.Template.form_media(match[0], match[0], match[0]));
            break;
	    case 'twipple.jp':
                html_arr.push(ui.Template.form_media(match[0], link_reg[pvd_name].base + match[1], link_reg[pvd_name].direct_base + match[1]));
            break;
            case 'youtube.com':
		if (conf.get_current_profile().preferences.show_youtube)
		{
			html_arr.push(ui.Template.form_media("", match[1], "", 1));
		} else {
			html_arr.push(ui.Template.form_media(match[0], link_reg[pvd_name].base + match[1] + link_reg[pvd_name].tail, match[1], 0));
		}
            break;
	    case 'dailymotion.com':
		html_arr.push(ui.Template.form_media(match[0], link_reg[pvd_name].base + match[1], match[1], 2));
	    break;
	    case 'twitter_video':
		html_arr.push(ui.Template.form_media(match[0], link_reg[pvd_name].base, match[1], 3));
	    break;
	    
            }
            match = link_reg[pvd_name].reg.exec(text);
        }
    }

    if (tweet.extended_entities && tweet.extended_entities.media) {
        for (var i = 0; i < tweet.extended_entities.media.length; i += 1) {
            var media = tweet.extended_entities.media[i];
	    if (media.type == 'photo') {
		if (media.expanded_url && media.media_url) {
	                html_arr.push(
			ui.Template.form_media(
	                        tweet.extended_entities.media[i].expanded_url,
				tweet.extended_entities.media[i].media_url + (conf.get_current_profile().preferences.thumb_preview ? ':thumb' : ':large'),
				tweet.extended_entities.media[i].media_url + ':large'
				));
		}
	    } else {
		if (media.video_info) {
			var mp4url = "", m3u8url = "";
			for (var x = 0; x < media.video_info.variants.length; x += 1) {
				if (media.video_info.variants[x].content_type == 'video/mp4') {
					mp4url = media.video_info.variants[x].url;
				} else if (media.video_info.variants[x].content_type == 'application/x-mpegURL') { 
					m3u8url = media.video_info.variants[x].url;
				}
			}
			if (m3u8url != "") {
				html_arr.push(ui.Template.form_media("application/x-mpegURL", '../image/twitter_video.png', m3u8url, 4));
			} else {
				html_arr.push('<video loop controls preload="metadata" style="max-width:100%;margin-top:5px;"><source src="' + mp4url + '" type="video/mp4"></video>');
			}
		}
	    }
        }
    } else // Just in case
    if (tweet.entities && tweet.entities.media) {
        for (var i = 0; i < tweet.entities.media.length; i += 1) {
            var media = tweet.entities.media[i];
            if (media.expanded_url && media.media_url) {
                html_arr.push(
                    ui.Template.form_media(
                        tweet.entities.media[i].expanded_url,
                        tweet.entities.media[i].media_url + (conf.get_current_profile().preferences.thumb_preview ? ':thumb' : ':large'),
                        tweet.entities.media[i].media_url + ':large'
                        ));
            }
        }
    }
    
    if (conf.get_current_profile().preferences.filter_nsfw_media && text.match(/nsfw/ig))
        html_arr = ['[NSFW]'];
    if (html_arr.length != 0) {
        return '<p class="media_preview">'+ html_arr.join('')+'</p>';
    }
    return '';
},


form_status_indicators:
function form_status_indicators(tweet) {
	return ui.GMaps.on_form_indicator(tweet);
},

render:
function render(tpl, map) {
    var text = tpl
    for (var k in map) {
        text = text.replace(new RegExp('{%'+k+'%}', 'g'), map[k]);
    }
    return text;
},

to_long_time_string:
function (datetime) {
    return moment(datetime).toLocaleString();
},

to_short_time_string:
function (dataObj) {
    var is_human = conf.get_current_profile().preferences.show_relative_timestamp,
    show_seconds = conf.get_current_profile().preferences.show_seconds_in_timestamp,
    now = moment(),
    mobj = moment(dataObj),
    time_str;

    if (is_human) {
        try {
            mobj.locale(i18n.current);
            mobj.locale();
        } catch (e) {
            mobj.locale(false);
        }

        if(now.diff(mobj, 'hours', true) > 6) {
            time_str = mobj.calendar();
        } else {
            time_str = mobj.fromNow();
        }
    } else {
        if(now.diff(mobj, 'days', true) > 1) {
            time_str = mobj.format(show_seconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm');
        } else {
            time_str = mobj.format(show_seconds ? 'HH:mm:ss' : 'HH:mm');
        }
    }

    return time_str;
},

parse_name:
function parse_name(user,screen) {
    var name = "";
    switch (conf.get_current_profile().preferences.screen_name)
    {
	case "both1":
		name = user + " (@" + screen + ")";    
		break;
	case "both2":
		name = user + " (" + screen + ")";    
		break;
	case "both3":
		name = "@" + screen + " (" + user + ")";    
		break;
	case "both4":
		name = screen + " (" + user + ")";    
		break;	
	case "user":
		name = user;    
		break;		
	case "screen@": 
		name = "@" + screen;    
		break;
	default: 
		name = screen;    
		break;
    }
    return name;
}


}
