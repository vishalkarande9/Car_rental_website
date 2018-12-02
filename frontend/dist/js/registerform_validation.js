var Script = function () {

    $.validator.setDefaults({
        submitHandler: function() { alert("submitted!"); }
    });

    $().ready(function() {
        // validate signup form on keyup and submit
        $("#register-form").validate({
            rules: {
                Name: {
                    required: true,
                    minlength: 6
                },
                age: {
                    required: true,
                    min: 25
                },
                street:{
                    required:true,
                    minlength:15
                },

                zipcode:{
                    requied: true,
                    zipcode: true
                },
                 email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 5,
                    pwcheck: true
                },
                confirm_password: {
                    required: true,
                    minlength: 5,
                    equalTo: "#password"
                },
               
               
            },
            messages: {                
                Name: {
                    required: "Please enter a Full Name.",
                    minlength: "Your Name must consist of at least 6 characters long."
                },
             
                password: {
                    required: "Please provide a password.",
                    minlength: "Your password must be at least 5 characters long."
                },
                confirm_password: {
                    required: "Please provide a password.",
                    minlength: "Your password must be at least 5 characters long.",
                    equalTo: "Please enter the same password as above."
                },
                email: "Please enter a valid email address.",
                
            }
        });
    })
})