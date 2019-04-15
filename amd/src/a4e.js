/**
 * Apps4EFL module.
 *
 * @package mod_wordcards
 * @author  Justin Hunt - poodll.com
 * (based on Paul Raine's APPs 4 EFL)
 */


define([
    'jquery',
    'core/ajax',
    'mod_wordcards/flip',
    'mod_wordcards/textfit'
], function($, Ajax,flip,textFit) {

    var a4e = {

        register_events: function(){
          $('.mod_wordcards_matching_reversebtn').on('click',function(){
              $(".a4e-flashcards-container .a4e-card").flip(true);
          });
         $('.mod_wordcards_matching_frontbtn').on('click',function(){
            $(".a4e-flashcards-container .a4e-card").flip(false);
         });
        },

        shuffle:function(a) {
            var j, x, i;
            for (i = a.length; i; i -= 1) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        },
        pretty_print_secs:function(time){
            var minutes = Math.floor(time / 60);
            var seconds = time - minutes * 60;
            return a4e.str_pad_left(minutes,'0',2)+':'+a4e.str_pad_left(seconds,'0',2);
        },
        list_quizlet_vocab:function(target,terms){

            var code='<div class="a4e-flashcards-container">';
            code+="<button style='margin:5px;width:40%;display:inline-block;' class='btn btn-block btn-lg btn-danger mod_wordcards_matching_reversebtn'>&#8634; Reverse</button>";
            code+="<button style='margin:5px;width:40%;display:inline-block;' class='btn btn-block btn-lg btn-primary mod_wordcards_matching_frontbtn'>&#8635; Front</button>";

            $.each(terms,function(i,o){
                if(o.image && o.definition!=""){
                    code+='<div class="a4e-card a4e-noselect"><div style="background-image: url('+o.image.url+');" class="front a4e-img-def"><div class="front-label">'+o.definition+'</div></div><div class="back">'+o.term+'</div></div>';
                }
                else if(o.image && o.definition==""){
                    code+='<div class="a4e-card a4e-noselect"><div style="background-image: url('+o.image.url+');" class="front a4e-no-def"></div><div class="back">'+o.term+'</div></div>';
                }
                else if(!o.image && o.definition!=""){
                    code+='<div class="a4e-card a4e-noselect"><div class="front"><div class="front-label-no-img">'+o.definition+'</div></div><div class="back">'+o.term+'</div></div>';
                }
            });

            code+="</div>";

            $(target).html(code);

            var cards =  $(".a4e-flashcards-container .a4e-card");
            var faces = $(".front-label,.front-label-no-img,.back");
            setTimeout(function(){
                cards.flip();
                textFit(faces,{multiLine: true, maxFontSize: 50, alignHoriz: true, alignVert: true});
            },100);

        },
        basic_feedback:function(results){

            var total=0;
            var total_time=0;

            $.each(results,function(i,o){
                if(o.time!=null){
                    total_time+=o.time;
                }
                if(o.points!=undefined){
                    total+=o.points;
                }
            });
            var code="<div class='a4e-basic_feedback'><h2>";
            code+="<i class='fa fa-trophy'></i> "+total+" points";
            if(total_time!=0){code+="<hr/><i class='fa fa-clock-o'></i> "+a4e.pretty_print_secs(total_time)};
            code+="</h2></div>";
            return code;

        },
        detailed_feedback:function(results){

            var code="<div style='text-align:center;'>", color;

            $.each(results,function(i,o){

                color="";

                if(o.points>0){
                    color="a4e-correct";
                }
                else{
                    color="a4e-incorrect";
                }

                code+="<div class='a4e-detailed_feedback_div "+color+"'>";
                code+="<h3 style='margin-bottom:10px;margin-top:5px;'>"+(i+1)+"</h3>";
                $.each(o,function(k,v){
                    if(k=="time"){
                        code+="<p><strong>"+a4e.ucfirst(k)+"</strong>:<br/>"+a4e.pretty_print_secs(v)+"</p>";
                    }
                    else{
                        code+="<p><strong>"+a4e.ucfirst(k)+"</strong>:<br/>"+(v==""?"N/A":v)+"</p>";
                    }
                });
                code+="</div>";
            });

            code+="</div>";

            return code;

        },

        str_pad_left:function(string,pad,length) {
            return (new Array(length+1).join(pad)+string).slice(-length);
        },

        ucfirst:function (str) {
            str += ''
            var f = str.charAt(0).toUpperCase()
            return f + str.substr(1)
        }

    };

    return a4e;

});