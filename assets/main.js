//main function of all
var user_text;
$(function () {
  
  if(localStorage.getItem("accessKey"))
  {
    $("#login").hide();
    $("#suggested").show();
    $("#analysis").hide();
  }
  else
  {
    $("#suggested").hide();
    $("#login").show();
    $("#analysis").hide();
  }
  var client = ZAFClient.init();
  client.invoke('resize', { width: 'auto', height: '500px' });
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
    mood(user_text)
  });
  //ticket.editor.insert
  client.get('comment.text').then(function(data){
    var typetext=data['comment.text'];
    $('#comment').text(typetext);
    console.log(typetext);
    beforeLogin(typetext);
  })
  client.on("api_notification.event_name", function(data) {
    console.log(data.body, data.sender);
  });
  
});


function validateAccessKey()
{
  var accessKey=$("input[name='Api-key']").val();
  if(accessKey)
  {
    localStorage.setItem("accessKey",accessKey);
    $("#suggested").show();
    $("#login").hide();
  }
}
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
        if (useerdetail < 0){
          console.log( "user_text" + useerdetail);
            $('.chart4').segbar([{
              width: "50%",
              height: "50px",
              data: [
                
                {  title: 'spontaneous', value:parseInt(useerdetail),color: '#8E44AD'},
          
              ]}])
        }else{
          console.log("hello" + useerdetail)
          $('.chart1').segbar([{
            width: "50%",
            height: "50px",
            data: [
              { title: 'Analytizch', value: parseInt(useerdetail)},
              
        
            ]}])
        }
        

      
        
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
          width: "100%",
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
  function mood(user_text)
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
         var goomood= response.zindex.posEmo;
         var badmood=response.zindex.negEmo;
       
         console.log(goomood);
         console.log(badmood);
   
        $('.chart3').segbar([{
          width: "100%",
          height: "50px",
        
          data: [
            { title: 'good  mood', value: parseInt(goomood) ,border:'1px solid #000000'},
            {  title: 'bad mood', value: parseInt(badmood) ,color: '#81CFE0',border:'1px solid #000000'},
      
          ]}])
      
       
      },
   
  
      
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          console.log("not fetching data");
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
      } ,
   
  });
  }  

  
var awapikey='cb1d8448-4583-4b39-9e5b-65cb7b5bf73d';
function beforeLogin(typeText)
{
  $.ajax({
    url: "https://dev.100worte.de/v1/api/augmented_writing_customer/analyses",
   method: "post",
   data: JSON.stringify(
    {
        
            "text": typeText,
            "lang": "en",
            "customer-profile-id": "932e6447-8d03-4e05-a712-d37eda447a0b"
            // fa6eff15-3f3e-4a2c-90e1-b6b99fb98e68
          
    }
  ),
  headers: {
    'Content-Type': 'application/json',
    'x-api-key' : awapikey,
   },
   success:function(response){
       var cat= response.scores;
      console.log(cat);
      var scores=[
        cat[ "overall"],
        cat[ "orientation"],
        cat[ "authenticity"],
        cat[ "jointPosAchieve"],
        
        
        cat[ "jointPosAffil"],
        
        cat[ "jointPosPower"],
        cat[ "emotionality"]
      ];
       console.log(awapikey);
      console.log("success");
      var data = {
        datasets: [{
            data: scores,
            backgroundColor: [
                "#FF6384",
                "#4BC0C0",
                "#FFCE56",
                "#E7E9ED",
                "#36A2EB"
            ],
           // label: 'My dataset' // for legend
        }],
        labels: [
          "overall",
          "orientation",
          "emotionality",
          "authenticity",
          "Power",
          "jointPosAchieve",
          "jointPosPower"
        ]
    };
    console.log(data);
    var ctx = $("#myChart");
new Chart(ctx, {
    data: data,
    type: 'polarArea'
});
   },
   
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log("not fetching data");
        console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
    } ,
 
});
}

function showAnalysis()
{
$('#analysis').show();
beforeLogin('Abcdefghijklmnopqrsuvw');
}
//display the data above
//function analysisInfo(response) {
  //var reponser_data = {
    //'analytics': response.skills.analytics,
    //'emotionality': response.skills.emotionality,
//};
//console.log(reponser_data);

//}



