//main function of all
var user_text;
$(function zendesk_app_init() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '500px' });
  client.get('ticket.requester.id').then(
	function(data) {
    var user_id = data['ticket.requester.id'];
        requestUserInfo(client, user_id );    
	}
  );
  //description of the customer
  client.get('ticket.description').then(function(data) {
     user_text=data['ticket.description'];
    console.log(user_text);
    afterLogin(user_text);
    thinking(user_text);
    risk(user_text)
  });
  //ticket.editor.insert
  client.get('comment.text').then(function(data){
    var comment=data["comment.text"];
    console.log(comment);

  })
  //ticket user image
  client.get('user_photo.requester.avatarUrl').then(function(){
    var imageshow='user_photo.requester.avatarUrl';
    console.log(imageshow);

  })
  
  client.get('comment.attachments.0.filename')
  //TICKETCOMMENT.TYPE
  client.get('comment.type').then(function(data){
    var typetext=data['comment.type'];
    console.log(typetext);
  })
});
//call the data of user
function requestUserInfo(client, id ) {
  var settings = {
    url: '/api/v2/users/' + id + '.json',
    type:'GET',
    dataType: 'json',
  };

  client.request(settings).then(
    function(data) {
      showInfo(data);

    },
    function(response) {
      showError(response);
    }
  );
  
}
//this used to display the data in table by calling them
function showInfo(data) {
  var requester_data = {
    'name': data.user.name,
    'tags': data.user.tags,
    //'description': data.user.ticket.description,
    'created_at': formatDate(data.user.created_at),
    'last_login_at':formatDate(data.user.last_login_at)
  };
  var source = $("#requester-template").html();
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  $("#content").html(html);
}

function showError(response) {
  var error_data = {
    'status': response.status,
    'statusText': response.statusText
  };
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}

function formatDate(date) {
  var cdate = new Date(date);
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  date = cdate.toLocaleDateString("en-us", options);
  return date;
}
/*call api for data analysis*/
//var apiKey = 'f0f1575d-fd13-4db0-a0db-ac7e18cdfea2';
// var hundredwortesession;
 
//   $.ajax({
//     url: "https://dev.100worte.de/v1/login",
//     method: "post",
//     data: JSON.stringify(
//       {
//         "email": "alice@100worte.de",
//         "password": "100worte"
//       }
//     ),
//     headers: {
//      'Content-Type': 'application/json',
//      'x-api-key' : apiKey,
//     },
   
//     success:function(_data, textStatus, request,response){
//        hundredwortesession=request.getResponseHeader('session');
//         debugger;
//       console.log(hundredwortesession);
//       afterLogin();
//       },
//      error: function(XMLHttpRequest, textStatus, errorThrown) { 
//       console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
//      } ,
  
//   });
  var apikey='bc1ef63c-0c08-464e-a44c-ef6c66fa6859'
  function afterLogin(user_text)
  {
    $.ajax({
      url: "https://dev.100worte.de/v1/api/customer_intelligence/analyse",
     method: "put",
     data: JSON.stringify(
      {
        "text":user_text,
      }
    ),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key' : apikey,
     },
     success:function(response){
         var useerdetail= response.skills.analytics;
         console.log(apikey);
         console.log( useerdetail);
        console.log("success");
        console.log(user_text);

        $('.chart1').segbar([{
          width: "60%",
          height: "50px",
          data: [
            { title: 'Analytizch', value: parseInt(useerdetail)},
            {  title: 'spontaneous', value: parseInt(100-useerdetail.toString())},
      
          ]}])
        },
          
        //analysisInfo(response);
  
      
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          console.log("not fetching data");
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
      } ,
   
  });
  }
  var apikey='bc1ef63c-0c08-464e-a44c-ef6c66fa6859'
  function thinking(user_text)
  {
    $.ajax({
      url: "https://dev.100worte.de/v1/api/customer_intelligence/analyse",
     method: "put",
     data: JSON.stringify(
      {
        "text":user_text,
      }
    ),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key' : apikey,
     },
     success:function(response){
         var useeremotionality= response.skills.emotionality;
         var text1='Diese Grapefruitsaft kostet nur 3,90 Euro und ist damit deutlich preiswerter als die Säfte von anderen Anbietern" "Der Zuckeranteil ist sehr vorteilhaft, da nur 99% der Inhaltsstoffe natürlichen Ursprungs sind.';
         if(useeremotionality > 1.0){
           console.log(text1);          
         }
         console.log(apikey);
         console.log( useeremotionality);
        console.log("success");

        $('.chart2').segbar([{
          width: "80%",
          height: "50px",
          data: [
            { title: 'gewinn orientiert', value: parseInt(useeremotionality) ,color: '#8E44AD'},
            {  title: 'verlustorientiert', value: parseInt(100-useeremotionality.toString()) ,color: '#81CFE0'},
      
          ]}])
        },
          
        //analysisInfo(response);
  
      
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          console.log("not fetching data");
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
      } ,
   
  });
  }
  var apikey='bc1ef63c-0c08-464e-a44c-ef6c66fa6859'
  function risk(user_text)
  {
    $.ajax({
      url: "https://dev.100worte.de/v1/api/customer_intelligence/analyse",
     method: "put",
     data: JSON.stringify(
      {
        "text":user_text,
      }
    ),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key' : apikey,
     },
     success:function(response){
         var useerrisk= response.skills.orientation;
         var posi=response.zindex.posEmo;
       
         console.log(posi);
         console.log(useerrisk);
        console.log("success");
       

        $('.chart3').segbar([{
          width: "80%",
          height: "50px",
          data: [
            { title: 'gut gelaunt', value: parseInt(useerrisk) ,color: '#8E44AD'},
            {  title: 'Schlecht gelaunt', value: parseInt(100%-useerrisk.toString()) ,color: '#81CFE0'},
      
          ]}])
        },
          
        //analysisInfo(response);
  
      
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          console.log("not fetching data");
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
      } ,
   
  });
  }  
//display the data above
//function analysisInfo(response) {
  //var reponser_data = {
    //'analytics': response.skills.analytics,
    //'emotionality': response.skills.emotionality,
//};
//console.log(reponser_data);

//}



