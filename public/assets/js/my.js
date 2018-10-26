$(document).ready(function(){
    $("#content").keyup(function(e){
        if(e.which == 13){
            storeData();
        }
    });
    $("#save").click(function(e){
        e.preventDefault();
        storeData();
    });
    $("#hapus").click(function(e){
        hoodie.store.removeAll();
        renderItem();
    });
    $(document).on("click", ".delete", function(e){
        deleteItem($(this).data("id"), $(this).data("name"));
    });
    function storeData(){
        let konten = $("#content").val();
        $("#content").val("");

        if(!konten){
            return;
        }
        hoodie.store.add({konten});
    }
    function renderItem() {
        hoodie.store.findAll().then(function(data){
            $(".list").empty();
            $.each(data, function( key, value ) {
                $(".list").append('<li>'+value.konten+'<i data-id="'+value._id+'" data-name="'+value.konten+'"  class="delete fa fa-times"></i></li>');
            });
        });  
    }
    function showOffline(){
        $("body").css("cssText", "background: #eee !important;");
    }
    function showOnline(){
        $("body").css("cssText", "background: #88D279 !important;");
    }

    function showAuthenticated() {
        $(".unauthorized").hide();
        $(".authorized").show();
    }

    function showAnonymous() {
        $(".unauthorized").show();
        $(".authorized").hide();
    }

    function signUp() {
        var userName = $("#username").val();
        var passWord = $("#password").val();

        hoodie.account.signUp({
          username: userName,
          password: passWord
        })
        .then(function() {
        return hoodie.account.signIn({
            username: userName,
            password: passWord
        });
        })
        .then(function() {
            showAuthenticated();
        })
        .catch(function(error) {
        alert('Ooops, something went wrong: ' + error.message);
        })
    }

    function signIn() {
        var userName = $("#username").val();
        var passWord = $("#password").val();
        
        hoodie.account.signIn({
            username: userName,
            password: passWord
        })
        .then(function(accountProperties) {
            alert('Welcome ' + accountProperties.username);
            showAuthenticated();
        })
        .catch(function(error) {
            alert('ooops: ' + error.message);
        });
    }

    function signOut(){
        hoodie.account.signOut()
        .then(function(accountProperties) {
            alert('Goodbye ' + accountProperties.username);
            $(".list").empty();
            showAnonymous();
        })
        .catch(function(error) {
            alert('ooops: ' + error.message);
        });
    }

    function deleteItem(itemId, Name) {
        hoodie.store.remove(itemId).then(function() {
            alert('Delete ' + Name);
        })
        .catch(function(error) {
            alert('ooops: ' + error.message);
        });
    }

    $("#signup").click(function(e){
        e.preventDefault();
        signUp();
    });

    $("#signin").click(function(e){
        e.preventDefault();
        signIn();
    });

    $("#signout").click(function(e){
        e.preventDefault();
        signOut();
    });
    
    $("#destroy").click(function(e){
        e.preventDefault();
        hoodie.account.destroy().then(function (accountProperties) {
            alert('Deleted account for ' + accountProperties.username)
        }).catch(function (error) {
            alert(error)
        });
        showAnonymous();
    });   

    hoodie.account.get('session').then(function (session) {
        if (session) {
            showAuthenticated();
        } else {
            showAnonymous();
        }
    });

    hoodie.connectionStatus.on('disconnect', showOffline);
    hoodie.connectionStatus.on('reconnect', showOnline);
    hoodie.connectionStatus.startChecking({interval: 1000});


    hoodie.store.on('change', renderItem);
    hoodie.store.on('pull', renderItem);
    renderItem();

    // if ("serviceWorker" in navigator) {
    //     navigator.serviceWorker
    //     .register("hworker.js")
    //     .then(console.log)
    //     .catch(console.error);
    // }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
        .register("hworker.js")
        .then(alert("support service worker"))
        .catch(console.error);
    }
});