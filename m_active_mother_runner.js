define(['app/jquery_zr_extension'], function() {

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





});
