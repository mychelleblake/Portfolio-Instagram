$(document).ready (function() {

  var Title = Backbone.Model.extend({
    initialize: function () {
    },
    defaults: {
      URL: null,
      Title: null,
      Detail: null
    },
      _parse_class_name: "Title",
  });

  var newPhoto = new Title();

  var Photos = Backbone.Collection.extend({
      model: Title,
      _parse_class_name: "Title"
  })

  var PhotoCollection = new Photos();

  PhotoCollection.fetch({
    success: function(resp) {
      var dataObj = {"data": resp.toJSON()};
      console.log(dataObj);
      var photoTemplate = $("#photoTemplate").text();
      var photoHTML = Mustache.render(photoTemplate, dataObj);
      $("#photoInject").html(photoHTML);
      console.log("success: ", resp);
    }, error: function (err) {
      console.log("error: ", err);
    }
  });

  $("#submit").on("click", function(e){
    e.preventDefault();
    var newDog = new Title();
    newPhoto.set({
      URL: $("#URL").val(),
      Detail: $("#Detail").val(),
      Title: $("#Title").val()
    })
    $("#URL").val(""),
    $("#Detail").val(""),
    $("#Title").val("");   
      newPhoto.save(null,{
        success: function(resp){
          PhotoCollection.fetch({
            success: function(resp){
            }, error: function(err){
          }
        }) 
        }, error: function (err) {
          console.log("error: ", err);
        }
      })
      location.href="/"
  });


  $(document).on("click", "#submitEditButton", function(){
    var dog = new Title();
    dog.set({
      Title: $("#editData #Title").val(),
      objectId: $("#editData #objectId").val(),
      Detail: $("#editData #Detail").val(),
      URL: $("#editData #URL").val()
    })
    console.log(dog);
    $("#editData #objectId").val("");
    $("#editData #Detail").val("");
    $("#editData #URL").val("");
    $("#editData #Title").val("");
    dog.save(null, {
      success: function(resp){
        console.log(resp);
      }, error: function(err){
        console.log("error: ", err);
      }
    });
    router.navigate('/', {trigger: true});
  });

  var Router = Backbone.Router.extend({
    initialize: function () {
      Backbone.history.start({pushState: false});
    },
    routes: {
      "dog/:objectId": "dog",
      "add": "add",
      "edit/:objectId": "edit",
      "":"index"
    }
  });

  var router = new Router();

  router.on("route:dog", function(objectId) {
    var dog = new Title({objectId: objectId});
    dog.fetch({
      success: function(resp) {
        var detailObj = {"detailData": resp.toJSON()};
        var detailTemplate = $("#detailTemplate").text();
        var detailHTML = Mustache.render(detailTemplate, detailObj);
        $("#detailInject").html(detailHTML);
        $("#photoInject").hide();
        $("#detailInject").show();
      }, error: function(err) {
        console.log("error ", err);
      }
    })
  });

  router.on("route:index", function () {    
    $("#detailInject").hide();
    $("#addData").hide(); 
    $("#photoInject").show();     
  });

  router.on("route:add", function () { 
    $("#addData").toggleClass();
    $("#photoInject").hide();
    $("#detailInject").hide();
    $("#addData").show();
  });


  $("body").on("click", "a", function(e) {
    e.preventDefault();
    var href = $(this).attr("href");
    href = href.substr(1);
    router.navigate(href, {trigger:true});
  });
});


