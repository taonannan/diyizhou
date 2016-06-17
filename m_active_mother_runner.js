define(['app/jquery_zr_extension'], function() {


    var form_text=$('#mother-lists-input').focus(function(){
        $('.form-error').html('').hide()
    });
    var mother_list_left=$('.mother-list-photos-left');
    var mother_list_right=$('.mother-list-photos-right');
    var mother_page=$('#mother-runner-hidden');
    url = window.location.href, obj = {}, reg = /([^?=&]+)=([^?=&]+)/g;
    url.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    var code = obj.code;
    /*搜素功能*/
    $('.mother-search').click(function(){
        $.ajax({
            url: '/activities/motherR/get-babies',
            type: 'GET',
            dataType:'JSON',
            data:{'keywords':form_text.val(),'index':'0'}
        }).done(function(data){
            if(data.success){
                if(data.babies.length==1){
                    window.location.href='/activities/motherR/baby-home?user_id='+data.babies[0].user_id;
                }else if(data.babies.length>1){
                    mother_list_left.html('');
                    mother_list_right.html('');
                    for(var i=0;i<data.babies.length;i++){
                        mother_page.val(data.max);
                        var haml = '<div class="mother-photos-all"> <div class="mother-photos-content" >'+
                            '<div class="mother-photos-img">'+
                            '<a href="/activities/motherR/baby-home?user_id='+data.babies[i].user_id+'">'+
                            '<img src="'+data.babies[i][data.babies[i].img_show + '_img_path']+'" />'+
                            '</a>'+
                            '</div>'+
                            '<div class="mother-photos-icon">'+data.babies[i].vote_index+'</div>'+
                            '</div>'+
                            '<div class="mother-runner-depict">'+
                            '<div class="mother-photos-name">'+data.babies[i].baby_name+'</div>'+
                            '<div class="mother-photos-vote">'+data.babies[i].vote_count_total+'票</div>'+
                            '</div>'+
                            '<div class="mother-photos-button">'+
                            '<button class="vote-button" data-userId='+data.babies[i].user_id+'>投票</button>'+
                            '</div>'+
                            '</div>'
                        if(i%2==0){
                            mother_list_left.append(haml);
                        }else{
                            mother_list_right.append(haml);
                        }
                    }

                }else {
                    $('.form-error').html('请输入正确的名字或编号').show();
                }
            }
        })
    })


    var loadDataFlag = true;
    function startFn(e){
        var touch = e.targetTouches[0];
        this.endPosition = this.startPosition = touch.clientY;
        document.addEventListener("touchmove",moveFn,false);
        document.addEventListener("touchend",endFn,false);

    }

    function moveFn (e){
        var touch = e.targetTouches[0];
        this.endPosition=touch.clientY;
    }

    function endFn(e){

        if(this.endPosition+10 <this.startPosition){
            var height = getWin("scrollHeight");
            var top = getWin("scrollTop")+getWin("clientHeight")+20;
            if(top>=height) {
                if(loadDataFlag){
                    $(".loadding").show().stop().animate({"opacity":1},500);
                    var page = parseInt($('#mother-runner-hidden').attr('data-page'));
                    clearTimeout(this.timmer);
                    this.timmer = setTimeout(function(){
                        newInitData(form_text.val(),mother_page.val());
                    },1200)

                }else{
                    $(".loadding-box").hide().filter(".all-data-tip").show();
                    $(".loadding").show().stop().animate({"opacity":1},500,function(){
                        clearTimeout(this.timmer2);
                        this.timmer2 = setTimeout(function(){
                            $(".loadding").show().stop().animate({"opacity":0},500,function(){
                                $(".loadding").hide();
                            })
                        },500);

                    });
                }

                return false;
            }
        }
        document.removeEventListener("touchmove",moveFn,false);
        document.removeEventListener("touchend",endFn,false);

    }
    document.addEventListener("touchstart",startFn,false);

    /*加载宝宝投票列表*/
    newInitData('',0);

    function newInitData(keyword,page){
        loadDataFlag=false;
        $.ajax({
            url: '/activities/motherR/get-babies',
            type: 'GET',
            dataType:'JSON',
            data:{'keywords':keyword,'index':page}
        }).done(function(data){
            if(data.success){
                if(data.babies.length==0){
                    loadDataFlag=false;
                    $(".loadding-box").hide().filter(".all-data-tip").show();
                    $(".pull-down").html("已加载完全部");
                    $(".loadding").stop().animate({"opacity":0},500,function(){
                        $(".loadding").hide();
                    });

                    return ;
                }
                for(var i=0;i<data.babies.length;i++){
                    mother_page.val(data.max);

                    var haml = '<div class="mother-photos-all">'+
                        '<div class="mother-photos-content" >'+
                        '<a href="/activities/motherR/baby-home?user_id='+data.babies[i].user_id+'">'+
                        '<div class="mother-photos-img">'+
                        '<img src="'+data.babies[i][data.babies[i].img_show + '_img_path']+'" />'+
                        '</div></a>'+
                        '<div class="mother-photos-icon">'+data.babies[i].vote_index+'</div>'+
                        '</div>'+
                        '<div class="mother-runner-depict">'+
                        '<div class="mother-photos-name">'+data.babies[i].baby_name+'</div>'+
                        '<div class="mother-photos-vote">'+data.babies[i].vote_count_total+'票</div>'+
                        '</div>'+
                        '<div class="mother-photos-button">'+
                        '<button class="vote-button" data-userId='+data.babies[i].user_id+'>投票</button>'+
                        '</div>'+
                        '</div>'
                    if(i%2==0){
                        mother_list_left.append(haml);
                    }else{
                        mother_list_right.append(haml);
                    }
                }

            }
            loadDataFlag=true;
            $(".loadding").stop().animate({"opacity":0},500,function(){
                $(".loadding").hide();
            });
        })

    }


    $(".share-button").on("click",function(){
        isWxShare();
    })

    // 分享邀请
    function isWxShare(){
        if (is_weixin) {
            showShareScreen();
        } else {
            $.ext_dialog.open({
                contentHTML: "<div class='mt20'>请到微信浏览器中打开</div>",
                hideTitle: true,
                width: 288
            });
        }
    }
    // 分享邀请弹出层
    function showShareScreen() {
        var cont = $("<div class='h5-share-bg'><span></span></div>"),
            $span = cont.find("span");

        if ($(".h5-share-bg").length > 0) {
            $(".h5-share-bg").remove();
        }
        $("body").append(cont);
        $span.delegate("", "click", function() {
            cont.remove();
        });
    }

    // 分享列表
    var jsApiList = ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ'];
    // 分享config

    // 初始化微信配置项
    var initConfig = function (config) {
        // 支持列表
        if (typeof config.jsApiList == 'undefined') {
            config.jsApiList = jsApiList;
        }
        // 非调试模式
        if (config.debug) {
            config.debug = false;
        }
        return config;
    };
    var share_config_fn=function() {
        share_config = {
            title: "心都萌化了！最可爱的日历宝宝，等你投票！还能抽大奖哦！",
            desc: "心都萌化了！最可爱的日历宝宝，等你投票！还能抽大奖哦！",
            link: location.origin + "/activities/motherR/mother-runner?_adv=0nt_mm2_001",
            imgUrl: location.origin + '/public/images/m/active/mother/mother-share-icon.jpg',
            success: function () {
                //alert($.cookie('is_share_config'));
                //if(!$.cookie('is_share_config')){
                    /*DOTO 孙博 微信朋友圈分享接口*/
                    $.ajax({
                        url:'/activities/motherR/share-after',
                        Type:'post',
                        dataType:'JSON',
                        data:{openid:$.cookie('mother-appID')}
                    }).done(function(data){
                        if(data.success){
                            if(data.has_login){
                                $('.mother-runner-button').hide();
                                if(data.reward_type=="1"){
                                    $.ext_dialog.open({
                                        contentHTML: "<div class='red-envelope-title'><img src='/public/images/m/active/mother/red-envelope-dialog.png' alt=''/></div><div class='red-envelope'>恭喜您获得"+data.reward_desc+"<br/>请到官网“积分记录”中查看</div><button class='dialog-runner-button-goto'><a href='/account/membership/record'>去查看奖励</a></button>",
                                        hideTitle: true,
                                        width: 288,
                                        final: function() {
                                            $('.dialog-runner-button-goto').click(function(){
                                                location.href="/account/membership/record"
                                            })
                                            $(this).parent().addClass('mother-runner-share-dialog');
                                        }
                                    });
                                }else if(data.reward_type=="2"||data.reward_type=="3"){
                                    $.ext_dialog.open({
                                        contentHTML: "<div class='red-envelope-title'><img src='/public/images/m/active/mother/red-envelope-dialog.png' alt=''/></div><div class='red-envelope'>恭喜您获得"+data.reward_desc+"<br/>请到官网“我的奖励”中查看</div><button class='dialog-runner-button-goto'><a href='/account/reward'>去查看奖励</a></button>",
                                        hideTitle: true,
                                        width: 288,
                                        final: function() {
                                            $('.dialog-runner-button-goto').click(function(){
                                                location.href="/account/reward"
                                            })
                                            $(this).parent().addClass('mother-runner-share-dialog');
                                        }
                                    });
                                }else if(data.reward_type>="4"){
                                    $.ext_dialog.open({
                                        contentHTML: "<div class='red-envelope-title'><img src='/public/images/m/active/mother/red-envelope-dialog.png' alt=''/></div><div class='red-envelope'>恭喜您获得"+data.reward_desc+"大奖</div><button class='dialog-runner-button-goto'><a href='https://www.zrcaifu.com/account/reward/cash-prize'>去填写联系地址</a></button>",
                                        hideTitle: true,
                                        width: 288,
                                        final: function() {
                                            $('.dialog-runner-button-goto').click(function(){
                                                location.href="https://www.zrcaifu.com/account/reward/cash-prize"
                                            })
                                            $(this).parent().addClass('mother-runner-share-dialog');
                                        }
                                    });
                                }
                            }else {
                                $.ext_dialog.open({
                                    contentHTML: "<div></div><div class='red-envelope'>登录“中瑞财富”官网后<br/>第一次分享至朋友圈即可抽奖100%中奖！</div><button class='dialog-button-close'>我知道了</button><button class='dialog-button-goto'>去登录</button>",
                                    hideTitle: true,
                                    width: 288,
                                    final: function() {
                                        $(this).find('.dialog-button-close').click(function() {
                                            $.ext_dialog.close();
                                        });
                                        $(this).find('.dialog-button-goto').click(function() {
                                            location.href='/login?t=' + location.href;
                                        });
                                        $(this).parent().addClass('mother-success-dialog');
                                    }
                                });
                            }

                           // $.cookie('is_share_config', 'is_share_config', { expires: 10 });
                        }
                    })
                //}

            }
        }
        share_config_friend = {
            title: "心都萌化了！最可爱的日历宝宝，等你投票！",
            desc: "投票还能抽大奖，100%中奖！膳魔师、乐扣、京东卡等多重好礼等你拿！",
            link: location.origin + "/activities/motherR/mother-runner?_adv=0nt_mm2_001",
            imgUrl: location.origin + '/public/images/m/active/mother/mother-share-icon.jpg',
        }
    }

    var wxBindEvents = function () {
        // 朋友圈
        var share_config_moments = $.extend({}, share_config);
        // 其它
        var share_config_friends = $.extend({}, share_config_friend);

        wx.ready(function(){
            // 分享到朋友圈
            wx.onMenuShareTimeline(share_config_moments);
            // 分享给朋友
            wx.onMenuShareAppMessage(share_config_friends);
            // 分享到QQ
            wx.onMenuShareQQ(share_config_friends);
        });

        // 错误处理
        wx.error(function(res){
            // alert(JSON.stringify(res))
            // console.log("配置失败",res);
        });
    };

    // 获取签名
    function wxShare() {
        $.ajax({
            url: "/weixin/shares",
            type: 'GET',
            data: {
                'url': location.href.split('#')[0]
            },
            success: function(data) {
                if (data.success) {
                    var wx_config = initConfig(data['wx-config']);

                    wx.config(wx_config);
                    share_config_fn();
                    wxBindEvents();
                }
            }
        });
    }
    // 微信分享结束


    wxShare();
    /*投票功能*/
    $("body").on("click",".vote-button",function(){
        var _this=this;
        var user_id=$(_this).attr("data-userId");
        if (is_weixin) {

            if($.cookie('mother-appID')){
                $(_this).attr('disabled','disabled');
                 $.ajax({
                    url:'/activities/motherR/vote',
                    Type:'GET',
                    dataType:'JSON',
                    data:{openid:$.cookie('mother-appID'),user_id:user_id}
                 }).done(function(data){
                    if(data.success){
                        $(_this).parent().prev().find('.mother-photos-vote').html(data.mu.vote_count_total+"票");
                        $(_this).addClass('button-disable').attr('disabled','disabled');
                        if(!data.is_shared){
                            $.ext_dialog.open({
                                contentHTML: "<div class='red-envelope'><div class='red-envelope-title'><img src='/public/images/m/active/mother/mother-dialog-icon.png' alt=''/>投票成功</div>分享给小伙伴，帮你支持的宝宝加油<br/>还可获得额外奖励哦，100%中奖！</div><button class='dialog-button-goto'>分享给小伙伴</button>",
                                hideTitle: true,
                                width: 288,
                                final: function() {
                                    $('.dialog-button-goto').click(function(){
                                        $.ext_dialog.close();
                                        isWxShare();
                                    })
                                    $(this).parent().addClass('mother-envelope-dialog');
                                }
                            });
                        }else{
                            $.ext_dialog.open({
                                contentHTML: "<div class='red-envelope'><div class='red-envelope-title'><img src='/public/images/m/active/mother/mother-dialog-icon.png' alt=''/>投票成功</div>分享给小伙伴<br/>帮你支持的宝宝加油吧！</div><button class='dialog-button-goto'>分享给小伙伴</button>",
                                hideTitle: true,
                                width: 288,
                                final: function() {
                                    $('.dialog-button-goto').click(function(){
                                        $.ext_dialog.close();
                                        isWxShare();
                                    })
                                    $(this).parent().addClass('mother-envelope-dialog');
                                }
                            });
                        }
                    } else {
                        if(data.errors.code == 1){
                            $.ext_dialog.open({
                                contentHTML: "<div class='red-envelope'>关注“中瑞财富”公众号<br/>即可参与投票及抽奖</div><button class='dialog-button-goto'>一键关注</button>",
                                hideTitle: true,
                                width: 288,
                                final: function() {
                                    $('.dialog-button-goto').click(function(){
                                        $.ext_dialog.close();
                                        var str = '<p style="padding-top: 15px;color: #ff6699;font-size:1.1em;font-weight: bold;">关注“中瑞财富”公众号<br/>即可参与投票及抽奖</p>';
                                        openDialog(str)
                                        function openDialog(htmlStr){
                                            var dialogHtml = '<div>';
                                            if(typeof htmlStr == "string"){
                                                dialogHtml += htmlStr;
                                            }
                                            dialogHtml += '<p style="padding: 15px 0 5px 0;color: #585858;">方法一：长按下方二维码 关注公众号</p>';
                                            dialogHtml += '<div style="width: 60%;margin: 10px auto;border: 3px solid #f0e6ca;"><img src="/public/images/m/active/mother/mother-wx-qrcode.jpg" alt=""/></div>';
                                            dialogHtml += '<p style="padding: 10px 25px 5px ;color: #585858;">方法二：打开微信，搜索公众号<b style=" font-size: 15px;color: #000;">中瑞财富（zrcaifu）</b>，点击关注</p>';
                                            dialogHtml += '</div>'
                                            $.ext_dialog.open({
                                                contentHTML: dialogHtml,
                                                hideTitle: true,
                                                width: 300,
                                                final:function(){
                                                    $(this).parent().addClass('mother-follow-dialog');
                                                }

                                            });
                                        }

                                    })
                                    $(this).parent().addClass('mother-envelope-dialog');
                                }
                            });
                        }
                        else {
                            $.ext_dialog.open({
                                contentHTML: "<div class='red-envelope'>"+data.errors.msg+"</div><button class='dialog-button-goto'>我知道了</button>",
                                hideTitle: true,
                                width: 288,
                                final: function() {
                                    $('.dialog-button-goto').click(function(){
                                        $.ext_dialog.close();

                                    })
                                    $(this).parent().addClass('mother-envelope-dialog');
                                }
                            });
                        }
                        $(_this).removeAttr('disabled');
                    }
                 })
             }
        } else {
            $.ext_dialog.open({
                contentHTML: "<div class='mt20'>请到微信浏览器中打开</div>",
                hideTitle: true,
                width: 288
            });
        }
    });

    // 是否为微信浏览器
    var is_weixin =  (function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    })();

    //获得属性值
    function getWin(attr){
        return document.documentElement[attr]||document.body[attr]
    };


    /*获取微信oppenid*/
    function auth() {
        $.ajax({
            url: "/weixin/get-user-msg",
            data: "code=" + code,
            type: "get",
            dataTyoe: "json",
            success: function (data) {
                var expiresDate= new Date();
                expiresDate.setTime(expiresDate.getTime() + (10 * 24 * 60 * 60 * 1000));
                $.cookie('mother-appID', data['openid']);


            }
        })
    }



    /*获取微信appid*/
    function notAuth() {
        $.ajax({
            url: "/weixin/getappid?url=https://m.zrcaifu.com",
            type: "get",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.success) {
                    var appId = data['appid'];
                    /*/!*var appId='wx0290cc2004b61c97';*!/*/
                    var loginUrl = encodeURIComponent(window.location.origin+"/activities/motherR/mother-runner");
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + loginUrl + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
                }
            }
        })
    }
    if (is_weixin) {
       if(!$.cookie('mother-appID')){
           if(code){
               auth();
           }else {
               notAuth();
           }
       }

    }

});
