var checkClickFromDownload = 0;
$('.checkClickFromDownload').click(function(){
    checkClickFromDownload = 1;
});

$('.unCheckClickFromDownload').click(function(){
    checkClickFromDownload = 0;
})


$('#ajaxLoginForm').parsley({
    trigger: 'change',
    successClass: "has-success",
    errorClass: "has-error",
    classHandler: function (el) {
        return el.$element.closest('.form-group'); //working
    },
    errorsWrapper: '<div class="help-block"></div>',
    errorTemplate: '<span></span>',
});

$('#registrationform').parsley({
    trigger: 'change',
    successClass: "has-success",
    errorClass: "has-error",
    classHandler: function (el) {
        return el.$element.closest('.form-group'); //working
    },
    errorsWrapper: '<div class="help-block"></div>',
    errorTemplate: '<span></span>',
});

$('#register_country').change(function () {
    var country = $("#register_country option:selected").val();
    // $('#show_hide_phone').show();
    if (country !== '') {
        $('#show_hide_phone').show();
        $('#register_phone').prop('required', true);
    } else {
        $('#show_hide_phone').hide();
        $('#register_phone').prop('required', false);
    }
    var countryCodeSpan     = 'country-code';
    var countryName         = this.value;
    getCountryCode(countryCodeSpan,countryName);

});
$('#resetForm2').parsley({
    trigger: 'change',
    successClass: "has-success",
    errorClass: "has-error",
    classHandler: function (el) {
        return el.$element.closest('.form-group'); //working
    },
    errorsWrapper: '<div class="help-block"></div>',
    errorTemplate: '<span></span>',
});

/* user login and new changes */
$(".main-login-show-link").click(function () {
    console.log('main-login-show-link')
    $(".login-block").addClass("show");
    $(".sign-up-block").removeClass("show");
});
$(".main-signup-show-link").click(function () {
    console.log('main-signup-show-link')
    $(".sign-up-block").addClass("show");
    $(".login-block").removeClass("show");
});

$(".forgot-password").click(function () {
    $(".sign-up-block").removeClass("show");
    $(".login-block").removeClass("show");
    $('.forget-block').addClass('show');
});

$(".go-back-to-login").click(function () {
    $(".sign-up-block").removeClass("show");
    $(".login-block").addClass("show");
    $('.forget-block').removeClass('show');
});


var checkEmail = $("#registrationform").attr("checkEmail");

window.Parsley.addAsyncValidator('emailAvailable', function (xhr) {
    console.log('alert()' , this.$element); // jQuery Object[ input[name="q"] ]
    if (xhr.status == 404) {
        return false
    } else {
        return true
    }

    // return 404 === xhr.status;
}, checkEmail);

window.Parsley.addAsyncValidator('emailCheck', function (xhr) {
    console.log(this.$element); // jQuery Object[ input[name="q"] ]

    if (xhr.status == 404) {
        return true
    } else {
        return false
    }

    // return 404 === xhr.status;
}, checkEmail);


$("#ajaxLoginForm").submit(function(e){
    return false;
});


/*Login User*/
$('#userLogin').on('click', function(e) {
    if($('#ajaxLoginForm').parsley().validate()) {
        $('#innerLoader').show();
        $('#black-loader').show();
        $('#error_div').html('')
        var username  =  $('#username').val();
        var password  =  $('#password').val();
        $.ajax({
            data: {_username: username, _password: password},
            type: 'POST',
            url: login_check,
            success: function (data, status, object) {
                if (data.success) {
                    // login button and enable download btn
                    $('.btn-lg').hide();
                    $('.btn-print-studio').hide();
                    $('#img-preview-btn').show();
                    $('#download-btn').show();
                    $('.close').click();
                    $('.close').click();
                    loginInfo = 'yeslogin';
                    // change header show user login start
                    $.ajax({
                        data: {logoStatus: 'purchasedLogos'},
                        type: 'POST',
                        url: get_user_info_header,
                        success: function (data, status, object) {
                            if (data) {
                                $('.main-header-login-block ul.list-inline').html(data);
                                $('.main-header-login-block').addClass('user-account-block').removeClass('main-header-login-block');
                            }
                        }
                    });											
                    // change header show user login end
                    
                    if(afterlogin = "yes") {
                        // show users upload logos start
                        $.ajax({
                            data: {logoStatus: 'purchasedLogos'},
                            type: 'POST',
                            url: getLogoDataForbc,
                            success: function (data, status, object) {
                                if (data) {
                                    $('#logoGallery').html(data);
                                    $('#viewMoreLogosGalleryDiv').show();
                                }
                            }
                        });
                        // show users upload logos end
                        
                        // show users upload images start
                        $('#show_hide').show();
                        $('#upload').html($('#divcodeLogin').html());
                        
                        if(afterlogin_upload == "yes"){

                            $.ajax({
                                type: "POST",
                                url: onLoadUserimages,
                                beforeSend: function() {
                                    $(".tools-scrollbar").mCustomScrollbar("destroy");
                                },
                                success: function (data) {

                                console.log(data);

                                var parsedData = JSON.parse(data);

                                if (typeof parsedData['userImages'] == 'undefined') {
                                $('#show_hide').hide();
                                return;
                                }

                                loadMoreImages = parsedData['userImages'].length;

                                var list = "<ul class='studio-gallery-liststyle-2 clearfix'>";
                                $.each(parsedData['userImages'], function (key, value) {

                                list += "<div id=" + 'parent_' + value + " class='parent_'><li class='upload_list'><span class='content_thumb'><a class='ancAbsl'><img class='imgdel' src='/images/close-Icon.png'    + width='16' height='16' /></a><img style='display: none' src='/images/close-Icon.png' id=" + value + "   />" +
                                "<img class='img-responsive' id=" + value + " +  src=" + parsedData['uploads'] + '/' + parsedData['folderName'] + '/thumb/' + value + " />" +
                                "</span></li></div>";

                                });
                                list += "</ul>";
                                $('.parent_ li:lt(' + loadMoreImages + ')').hide();
                                $('#UploadImages').html(list);
                                $('.parent_ li:lt(' + total_li + ')').show();
                                $('#show_hide').hide();

                                (loadMoreImages > total_li) ? $('#loadMore').show() : $('#loadMore').hide();
                                
                                
                                $(document).on("click", '.loadmoreupload', function(event) { 
                                    //alert(loadMoreImages+'='+total_li);
                                    total_li = (total_li + 3 <= loadMoreImages) ? total_li + 3 : loadMoreImages;
                                    $('.parent_ li:lt(' + total_li + ')').show();
                                    (loadMoreImages > total_li) ? $('#loadMore').show() : $('#loadMore').hide();
                                });
                                
                                

                                },
                                complete: function () { 
                                    $(".tools-scrollbar").mCustomScrollbar({axis: "y", theme: "minimal-dark", scrollbarPosition: "inside"});  
                                }
                            });
                        }
                        
                        // show users upload images end
                    }
                    
                    $('#gridSystemModal').modal('hide');
                    if(checkClickFromDownload == 1)
                    {
                        window.location.hash = 'checkoutedit';
                        if (typeof downloadbtnname === 'undefined') {
                            document.getElementById('download-btn').click();
                            $('#innerLoader').show();
                            $('#black-loader').show();
                        } else {
                            document.getElementById(downloadbtnname).click();

                            $('#innerLoader').show();
                            $('#black-loader').show();
                            //stylish studio
                            $('#downloadjpg').trigger('click');
                        }
                    } else {
                        $('#innerLoader').hide();
                        $('#black-loader').hide();
                    }
                }else{
                    $('#innerLoader').hide();
                    $('#black-loader').hide();
                    $('#error_div').html(data.message)
                    console.log('else' , data)
                }

            }
        });
    }
});

$(document).on("submit", "#resetForm2", function(e){
    e.preventDefault();
    return false;
});	

$('.reset-password-button').on('click', function(e) {
    if($('#resetForm2').parsley().validate()) {
        $('#innerLoader').show();
        $('#black-loader').show();
        var postData = $('#resetForm2').serializeArray();
        var formURL = resetForm;
        $.ajax(
            {
                url: formURL,
                type: "POST",
                data: postData,
                success: function (response, textStatus, jqXHR) {
                    console.log(response);
                    console.log(response.success);
                    if (response.success == 1) {

                        $('.resp-msg').addClass('form-success-msg');
                        $('.resp-msg').html(response.msg);
                        $('#forgot_password_email').val('');
                        $('#innerLoader').hide();
                        $('#black-loader').hide();

                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#innerLoader').hide();
                    $('#black-loader').hide();
                }
            });
    }
});


/*Register User*/
$(document).on("submit", "#registrationform", function(e){
    e.preventDefault();
    return false;
});

$('#callme').on('click', function(e){

    var phoneVal = $('#register_phone').val();
    if(phoneVal != '' && phoneVal.length < 7){
        $('.phoneDiv').show();
        $('.phoneDiv').html('Phone Number Is Not Valid');
        return false;
    }else{
        $('.phoneDiv').hide();
    }
    
    $('#registrationform').parsley().validate();
    if ($('#registrationform').parsley().isValid()) {
        $('#innerLoader').show();
        $('#black-loader').show();
        var postData = $('#registrationform').serializeArray();
        $.ajax(
            {
                url: registerForm,
                type: "POST",
                data: postData,
                success: function (response, textStatus, jqXHR) {
                    //signup
                    //console.log(response);
                    if (response.status == 1) {
                        // login button and enable download btn
                        $('.btn-lg').hide();
                        $('.btn-print-studio').hide();
                        $('#img-preview-btn').show();
                        $('#download-btn').show();
                        $('.close').click();
                        $('.close').click();
                         loginInfo = 'yeslogin';
                        // change header show user login start
                        $.ajax({
                            data: {logoStatus: 'purchasedLogos'},
                            type: 'POST',
                            url: get_user_info_header,
                            success: function (data, status, object) {
                                if (data) {
                                    $('.main-header-login-block ul.list-inline').html(data);
                                    $('.main-header-login-block').addClass('user-account-block').removeClass('main-header-login-block');
                                    // login button and enable download btn
                                    $('.btn-lg').hide();
                                    $('.btn-print-studio').hide();
                                    $('#img-preview-btn').show();
                                    $('#download-btn').show();
                                    $('#gridSystemModal').modal('hide');
                                    if(afterlogin = "yes") {
                                        // show users upload logos start
                                        $.ajax({
                                            data: {logoStatus: 'purchasedLogos'},
                                            type: 'POST',
                                            url: getLogoDataForbc,
                                            success: function (data, status, object) {
                                                if (data) {
                                                    $('#logoGallery').html(data);
                                                    $('#viewMoreLogosGalleryDiv').show();
                                                }
                                            }
                                        });
                                        // show users upload logos end
                                        
                                        // show users upload images start
                                        $('#show_hide').show();
                                        $('#upload').html($('#divcodeLogin').html());
                                        
                                        if(afterlogin_upload == "yes"){

                                            $.ajax({
                                                type: "POST",
                                                url: onLoadUserimages,
                                                beforeSend: function() {
                                                    $(".tools-scrollbar").mCustomScrollbar("destroy");
                                                },
                                                success: function (data) {

                                                console.log(data);

                                                var parsedData = JSON.parse(data);

                                                if (typeof parsedData['userImages'] == 'undefined') {
                                                $('#show_hide').hide();
                                                return;
                                                }

                                                loadMoreImages = parsedData['userImages'].length;

                                                var list = "<ul class='studio-gallery-liststyle-2 clearfix'>";
                                                $.each(parsedData['userImages'], function (key, value) {

                                                list += "<div id=" + 'parent_' + value + " class='parent_'><li class='upload_list'><span class='content_thumb'><a class='ancAbsl'><img class='imgdel' src='/images/close-Icon.png'    + width='16' height='16' /></a><img style='display: none' src='/images/close-Icon.png' id=" + value + "   />" +
                                                "<img class='img-responsive' id=" + value + " +  src=" + parsedData['uploads'] + '/' + parsedData['folderName'] + '/thumb/' + value + " />" +
                                                "</span></li></div>";

                                                });
                                                list += "</ul>";
                                                $('.parent_ li:lt(' + loadMoreImages + ')').hide();
                                                $('#UploadImages').html(list);
                                                $('.parent_ li:lt(' + total_li + ')').show();
                                                $('#show_hide').hide();

                                                (loadMoreImages > total_li) ? $('#loadMore').show() : $('#loadMore').hide();
                                                
                                                
                                                $(document).on("click", '.loadmoreupload', function(event) { 
                                                    //alert(loadMoreImages+'='+total_li);
                                                    total_li = (total_li + 3 <= loadMoreImages) ? total_li + 3 : loadMoreImages;
                                                    $('.parent_ li:lt(' + total_li + ')').show();
                                                    (loadMoreImages > total_li) ? $('#loadMore').show() : $('#loadMore').hide();
                                                });
                                                
                                                

                                                },
                                                complete: function () { 
                                                    $(".tools-scrollbar").mCustomScrollbar({axis: "y", theme: "minimal-dark", scrollbarPosition: "inside"});  
                                                }
                                            });
                                        }
                                    }
                                    // show users upload images end
                                    if(checkClickFromDownload == 1)
                                    {
                                        window.location.hash = 'checkoutedit';
                                        if (typeof downloadbtnname === 'undefined') {
                                            document.getElementById('download-btn').click();
                                            $('#innerLoader').show();
                                            $('#black-loader').show();
                                        } else {
                                            document.getElementById(downloadbtnname).click();
                                            $('#innerLoader').show();
                                            $('#black-loader').show();
                                            $('#downloadjpg').trigger('click');
                                        }
                                    }
                                }
                            }
                        });											
                        // change header show user login end

                        
                        //window.location.replace(response.url);
                        //$('.freeLogoSubmit').trigger('click')
                        //$('#user_creds').hide();
                        //$('#div_free_download').show();
                        if(checkClickFromDownload != 1 ){
                            $('#innerLoader').hide();
                            $('#black-loader').hide();
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#innerLoader').hide();
                    $('#black-loader').hide();
                }
            });
        e.preventDefault();
        e.stopImmediatePropagation();
        /**/
    }
});
/* user login and new changes */

function callsimilarlogin()
{
    // login button and enable download btn
    $('.btn-lg').hide();
    $('.btn-print-studio').hide();
    $('#img-preview-btn').show();
    $('#download-btn').show();
    // change header show user login start
    $.ajax({
        data: {logoStatus: 'purchasedLogos'},
        type: 'POST',
        url: get_user_info_header,
        success: function (data, status, object) {
            if (data) {
                $('.main-header-login-block ul.list-inline').html(data);
                $('.main-header-login-block').addClass('user-account-block').removeClass('main-header-login-block');
            }
        }
    });											
    // change header show user login end
    if(afterlogin = "yes") {
        // show users upload logos start
        $.ajax({
            data: {logoStatus: 'purchasedLogos'},
            type: 'POST',
            url: getLogoDataForbc,
            success: function (data, status, object) {
                if (data) {
                    $('#logoGallery').html(data);
                    $('#viewMoreLogosGalleryDiv').show();
                }
            }
        });
        // show users upload logos end
        
        // show users upload images start
        $('#show_hide').show();
        $('#upload').html($('#divcodeLogin').html());
        
        if(afterlogin_upload == "yes"){

            $.ajax({
                type: "POST",
                url: onLoadUserimages,
                beforeSend: function() {
                    $(".tools-scrollbar").mCustomScrollbar("destroy");
                },
                success: function (data) {

                console.log(data);

                var parsedData = JSON.parse(data);

                if (typeof parsedData['userImages'] == 'undefined') {
                $('#show_hide').hide();
                return;
                }

                loadMoreImages = parsedData['userImages'].length;

                var list = "<ul class='studio-gallery-liststyle-2 clearfix'>";
                $.each(parsedData['userImages'], function (key, value) {

                list += "<div id=" + 'parent_' + value + " class='parent_'><li class='upload_list'><span class='content_thumb'><a class='ancAbsl'><img class='imgdel' src='/images/close-Icon.png'    + width='16' height='16' /></a><img style='display: none' src='/images/close-Icon.png' id=" + value + "   />" +
                "<img class='img-responsive' id=" + value + " +  src=" + parsedData['uploads'] + '/' + parsedData['folderName'] + '/thumb/' + value + " />" +
                "</span></li></div>";

                });
                list += "</ul>";
                $('.parent_ li:lt(' + loadMoreImages + ')').hide();
                $('#UploadImages').html(list);
                $('.parent_ li:lt(' + total_li + ')').show();
                $('#show_hide').hide();

                (loadMoreImages > total_li) ? $('#loadMore').show() : $('#loadMore').hide();
                
                
                $(document).on("click", '.loadmoreupload', function(event) { 
                    //alert(loadMoreImages+'='+total_li);
                    total_li = (total_li + 3 <= loadMoreImages) ? total_li + 3 : loadMoreImages;
                    $('.parent_ li:lt(' + total_li + ')').show();
                    (loadMoreImages > total_li) ? $('#loadMore').show() : $('#loadMore').hide();
                });
                
                

                },
                complete: function () { 
                    $(".tools-scrollbar").mCustomScrollbar({axis: "y", theme: "minimal-dark", scrollbarPosition: "inside"});  
                }
            });
        }
        
        // show users upload images end
    }
    $('#gridSystemModal').modal('hide');
    if(checkClickFromDownload == 1)
    {
        window.location.hash = 'checkoutedit';
        if (typeof downloadbtnname === 'undefined') {
            document.getElementById('download-btn').click();
            $('#innerLoader').show();
            $('#black-loader').show();
        } else {
            document.getElementById(downloadbtnname).click();
            $('#innerLoader').show();
            $('#black-loader').show();
        }
    } else {
        $('#innerLoader').hide();
        $('#black-loader').hide();
    }
}

/*=====================================================================================================*/
                                    /* google js start */
/*=====================================================================================================*/


function update_user_data(response)
{
    //alert('google'+response);
    $('#innerLoader').show();
    $('#black-loader').show();
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: response,
        url: process_social,
        success: function(msg) {
            if(msg.success == 0 || msg.userid == '' )
            {
                alert('Something Went Wrong!');
            } else {
                callsimilarlogin();
            }
        }
    });
}

function Google_signIn(googleUser) {
    $('#innerLoader').show();
    $('#black-loader').show();
    
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    localStorage.setItem("googlelogin", "yes");
    //pass information to server to insert or update the user record
    
    var dataPost = {
        id : profile.getId(),
        name : profile.getName(),
        email : profile.getEmail(),
        firstname : profile.getGivenName(),
        lastname : profile.getFamilyName()
    };
    googleUser.disconnect(); /* restrict google from auto login. */
    update_user_data(dataPost);
}



/*=====================================================================================================*/
                                        /* google js end */
/*=====================================================================================================*/


/*=====================================================================================================*/
                                        /* facebook js start */
/*=====================================================================================================*/

window.fbAsyncInit = function() {
    FB.init({
        appId: fbappid,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v3.3'
    });
};


(function() {
    var e = document.createElement('script');
    e.async = true;e.src = document.location.protocol +'//connect.facebook.net/en_US/all.js';
    var myEle = document.getElementById("fb-root");
    if(myEle){
        document.getElementById('fb-root').appendChild(e);
    }
    

}());


function AjaxResponse(data)
{   
    $('#innerLoader').hide();
    $('#black-loader').hide();
    var myData = data; //For demo, we will pass a post variable, Check process_facebook
    $.ajax({
        type: "POST",
        url: process_fb,
        dataType:"html",
        data:myData,
        success:function(response){
            console.log(response);
            callsimilarlogin();
        },
        error:function (xhr, ajaxOptions, thrownError){
            $("#results").html('<fieldset style="padding:20px;color:red;">'+thrownError+'</fieldset>'); //Error
        } 
    }); 
}



function CallAfterLogin(){
    FB.login(function(response) {		
        if (response.status === "connected") 
        {
            console.log('accessToken=');
            console.log(response.authResponse.accessToken);
            FB.api('/me?fields=email,first_name,last_name', function(data) {
                console.log(data);
                if(data.email == null)
                {
                    //Facbeook user email is empty, you can check something like this.
                    alert("You must allow us to access your email id!"); 
                }else{
                    AjaxResponse(data);
                }
            });
        }
    },
    {scope:'email',return_scopes: true});
}



/*=====================================================================================================*/
                                        /* facebook js end */
/*=====================================================================================================*/