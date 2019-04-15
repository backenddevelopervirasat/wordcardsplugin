/**
 * Keyboard Helper
 *
 * @package mod_wordcards
 * @author  Justin Hunt - poodll.com
 * * (based on Paul Raine's APPs 4 EFL)
 */

define([
    'jquery'
], function($) {

    var keyboard={
        string:"",
        letters:[],
        qwerty:[
            ['q','w','e','r','t','y','u','i','o','p'],
            ['a','s','d','f','g','h','j','k','l'],
            ['z','x','c','v','b','n','m']
        ],
        mobile_user:function(){
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                return true;
            }
            else {
                return false;
            }
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
        flash:function(target,classname){
            $(target).addClass(classname);
            setTimeout(function(){
                $(target).removeClass(classname);
            }, 100);
        },
        off:function(){
            $("body").off(keyboard.mobile_user()?'touchstart':'click',".chunk-key").off("click","#delete-chunk-input").off("click","#clear-chunk-input").off("click","#submit-chunk-input").off("keypress").off("keydown");
        },
        clear:function(){
            keyboard.off();
            $("#chunk-input").remove();
        },
        disable:function(){
            keyboard.off();
            $("#chunk-typed-inner").text("");
            $("#chunk-input").addClass("chunk-input-disabled");
        },
        create:function(target,string,id,show_dist,func){
            var distractors=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            keyboard.string=string;
            keyboard.clear();
            keyboard.letters=[];
            $.each(string.split(''),function(i,l){
                if(keyboard.letters.indexOf(l)==-1){
                    keyboard.letters.push(l);
                    distractors.splice(distractors.indexOf(l),1);
                }
            });
            keyboard.shuffle(distractors);
            if(show_dist){
                keyboard.letters=keyboard.letters.concat(distractors.slice(0,3));
            }
            keyboard.letters.sort();
            var code="<div id='chunk-input' data-id='"+id+"' class='noselect'>";
            code+="<div id='chunk-typed'><div id='chunk-typed-inner'></div></div>";
            $.each(keyboard.letters,function(i,letter){
                code+="<div class='chunk-key' data-val='"+letter.charCodeAt(0)+"'><div class='chunk-key-inner'>"+(letter==" "?"&nbsp;":letter)+"</div></div>";
            });
            code+="<div id='chunk-input-controls'>";
            code+="<div id='delete-chunk-input' class='btn-primary chunk-input-control'><i class='fa fa-caret-square-o-left'></i> Delete</div>";
            code+="<div id='submit-chunk-input' class='btn-success chunk-input-control'>Submit <i class='fa fa-arrow-circle-right'></i></div>";
            code+="</div>";

            code+="</div>";
            $("#"+target).html(code);
            $("body").on(keyboard.mobile_user()?'touchstart':'click',".chunk-key",function(){
                var text=$("#chunk-typed-inner").text();
                if(text.length<string.length){
                    //createjs.Sound.play('click');
                    keyboard.press(this,func);
                }
                else{
                    keyboard.flash("#chunk-typed-inner","a4e-incorrect");
                    //createjs.Sound.play('cancel');
                }
            });
            $("body").on("touchmove","#"+target,function(e){
                e.preventDefault();
            });
            $("body").on("click","#delete-chunk-input",function(){
                var text=$("#chunk-typed-inner").text();
                var code=text.slice(-1).charCodeAt(0);
                $("#chunk-typed-inner").text(text.substring(0,text.length-1));
                //$(".chunk-key[data-val='"+code+"'].a4e-key-disabled:last").removeClass('a4e-key-disabled');
            });
            $("body").on("click","#submit-chunk-input",function(){
                var text=$("#chunk-typed-inner").text();
                func(text);
            });
            $("body").on("keydown",function(e){
                var key=e.which;
                if([0,8,46].indexOf(key)!=-1){
                    $("#delete-chunk-input").trigger("click");
                    e.preventDefault();
                }
                else if(e.which==13){
                    $("#submit-chunk-input").trigger("click");
                    e.preventDefault();
                }
            });
            $("body").on('keypress',function(e){

                var text=$("#chunk-typed-inner").text();
                var key=e.which;
                //var button=$(".chunk-key[data-val='"+key+"']:not(.a4e-key-disabled)").first();
                var button=$(".chunk-key[data-val='"+key+"']");
                if(button.length && text.length<string.length){
                    keyboard.press(button,func);
                }
                else{
                    keyboard.flash("#chunk-typed-inner","a4e-incorrect");
                    //createjs.Sound.play('cancel');
                }
                e.preventDefault();

            });
        },
        press:function(target,func){
            var value=String.fromCharCode($(target).data("val"));
            keyboard.flash(target,"a4e-key-pressed");
            var text={old:$("#chunk-typed-inner").text()};
            text.new=text.old+value;
            if(text.new.length<=keyboard.string.length){
                $("#chunk-typed-inner").text(text.new);
                //$(target).addClass('a4e-key-disabled');
            }
            else{
                keyboard.flash("#chunk-typed-inner","a4e-incorrect");
                //createjs.Sound.play('cancel');
            }
        }
    };

    return keyboard;

});