/*call api for data analysis*/
var apiKey = 'f0f1575d-fd13-4db0-a0db-ac7e18cdfea2';
var hundredwortesession;
 
  $.ajax({
    url: "https://dev.100worte.de/v1/login",
    method: "post",
    data: JSON.stringify(
      {
        "email": "alice@100worte.de",
        "password": "100worte"
      }
    ),
    headers: {
     'Content-Type': 'application/json',
     'x-api-key' : apiKey,
    },
   
    success:function(_data, textStatus, request,response){
       hundredwortesession=request.getResponseHeader('session');
        debugger;
      console.log(hundredwortesession);
      afterLogin();
      },
     error: function(XMLHttpRequest, textStatus, errorThrown) { 
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
     } ,
  
  });
 
  function afterLogin(user_text)
  {
    $.ajax({
      url: "https://dev.100worte.de/v1/customerIntelligence/analyse",
     method: "post",
     data: JSON.stringify(
      {
        "job-profile-id": "de4535e7-c822-466a-a6c4-e575946c81ec",
        "text":user_text,
      }
    ),
    headers: {
      'Content-Type': 'application/json',
       'session' : hundredwortesession,
     },
     success:function(response){
         var useerdetail= response.skills.analytics;
         console.log( useerdetail);
        console.log("success");
        //analysisInfo(response);
  
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          console.log("not fetching data");
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
      } ,
   
  });
  }
  function fn(){
    console.log("Hello! Uncle Namaste...Chalo Kaaam ki Baat p Aate h...");
 }
//main function of all
$(function() {
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
    var user_text=data['ticket.description'];
    console.log(user_text);
    afterLogin(user_text);
   
  });
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

//display the data above
// function analysisInfo(response) {
//   var reponser_data = {
//     'analytics': response.skills.analytics,
//     'emotionality': response.skills.emotionality,
// };
// console.log(reponser_data);

// }



