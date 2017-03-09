/*** *** Addition Email Validation *** ***/
$(document).ready(function(){
    ;(function($){
        $.fn.extend({
            donetyping: function(callback,timeout){
                timeout = timeout || 1e3; // 1 second default timeout
                var timeoutReference,
                    doneTyping = function(el){
                        if (!timeoutReference) return;
                        timeoutReference = null;
                        callback.call(el);
                    };
                return this.each(function(i,el){
                    var $el = $(el);

                    $el.is(':input') && $el.on('keyup keypress paste',function(e){

                        if (e.type=='keyup' && e.keyCode!=8) return;

                        if (timeoutReference) clearTimeout(timeoutReference);
                        timeoutReference = setTimeout(function(){
                            doneTyping(el);
                        }, timeout);
                    }).on('blur',function(){
                        doneTyping(el);
                    });
                });
            }
        });
    })(jQuery);
});


$(document).ready(function(){
    var regListvalidation = function(string, regexList, callback){
        if (regexList.length == 1) {
            return callback(regexList[0].test(string));
        }else{
            var newStatuses = new Array;
            for(x in regexList) {
                /*console.log(string,regexList[x],regexList[x].test(string))
                console.log("------------------------------------------------");*/
                newStatuses.push(regexList[x].test(string));
            }
            return callback(newStatuses);
        }
    };

    // check email address form
    var isEmail = function(email, callback) {

        var RegExer = new Array;
        RegExer.push(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);

        regListvalidation(email, RegExer, function(data){
            regExdata = data;

            if (regExdata == true) {

                var invalidRules = new Array;
                // has repeating special characters
                invalidRules.push(/([.+_-]{2,})/);
                // one or more special characters before '@' sign
                invalidRules.push(/([.+_-]{1,})+\@/);
                // one or more special characters after '@' sign
                invalidRules.push(/\@([.+_-]{1,})+/);
                // check if possible domain part is an ip address
                invalidRules.push(/\@{1,1}((\d)+\.*)+/);
                // check if possible username part is an ip address
                // invalidRules.push(/(\.[\d]+)+\@/);

                // multiple top level domains
                invalidRules.push(/(\@([a-zA-Z0-9\-\_\+]*(\.[a-zA-Z0-9]*){3,}))/);

                // starts with special characters
                invalidRules.push(/^([.+_-])+([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);

                regListvalidation(email, invalidRules, function(statuses){
                    if (jQuery.inArray( true, statuses ) >= 0) {
                        return callback(false);
                    }

                    return callback(true);
                });
            }else{
                return callback(false);
            }
        });
    }

    $(document).on('focus','input', function(){

        var thisValidator4Email = function(_thisElem){
            isEmail ( _thisElem.val(), function(emailValue){
                $.validator.methods.email = function( value, element ) {
                    return this.optional( element ) || emailValue;
                }
            });
            _thisElem.valid();
        }

        if ($(this).attr("type") == "email") {
            $(this).donetyping(function(){
                thisValidator4Email($(this));
            },100).blur(function(){
                thisValidator4Email($(this));
            });
        }else{

            if ($(this).hasClass("multiple_emails-input")) {

                var elemAsText = $(this);
                $(this).donetyping(function(){

                    var emailVal = elemAsText.val();

                    isEmail(emailVal, function(emailStatus){

                        if (emailStatus) {
                            elemAsText.removeClass('multiple_emails-error');
                        }else{
                            if (emailVal != "") elemAsText.addClass('multiple_emails-error');
                        }
                    })
                },500).blur(function(){

                    var emailVal = elemAsText.val();

                    isEmail(emailVal, function(emailStatus){

                        if (emailStatus) {
                            elemAsText.removeClass('multiple_emails-error');
                        }else{
                            if (emailVal != "") elemAsText.addClass('multiple_emails-error');
                        }

                        elemAsText.parent(".multiple_emails-container").find(".multiple_emails-ul").each(function(){
                            var elemUl = $(this);

                            elemUl.find(".multiple_emails-email").each(function(){
                                var listItemE = $(this);
                                var listEmail = listItemE.children("span.email_name").data("email");
                                isEmail(listEmail, function(emailStatus){

                                    if (emailStatus == false) {
                                        elemAsText.val(listEmail).focus().addClass('multiple_emails-error');
                                        listItemE.remove();
                                    }
                                });
                            });
                        });

                        return false;
                    })
                }).keyup(function(e) {
                    // enter || esc || spacebar || tab
                    if (e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 32 || e.keyCode == 9) {
                        var emailVal = elemAsText.val();
                        isEmail(emailVal, function(emailStatus){

                            if (emailStatus) {
                                elemAsText.removeClass('multiple_emails-error');
                            }else{
                                if (emailVal != "") elemAsText.addClass('multiple_emails-error');
                            }

                            elemAsText.parent(".multiple_emails-container").find(".multiple_emails-ul").each(function(){
                                var elemUl = $(this);

                                elemUl.find(".multiple_emails-email").each(function(){
                                    var listItemE = $(this);
                                    var listEmail = listItemE.children("span.email_name").data("email");
                                    isEmail(listEmail, function(emailStatus){

                                        if (emailStatus == false) {
                                            elemAsText.val(listEmail).focus().addClass('multiple_emails-error');
                                            listItemE.remove();
                                        }
                                    });
                                });
                            });

                            return false;
                        })
                    }
                });
            }
        }
    });
});
