//main function of all
var user_text;
var profiledetails;
$(function () {
  var client = ZAFClient.init();
  $("#apiarea").hide();
  var defaultValue=true;
  if(defaultValue)
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
    // thinking(user_text);
    mood(user_text);
    newgraph(user_text)
  });
  //ticket.editor.insert
  client.get('comment.text').then(function(data){
    var typetext=data['comment.text'];
    var cleantypeText = typetext.replace(/(<([^>]+)>)/ig,"");
    var wordcount =cleantypeText.trim().split(' ');
    $('#wordCount').hide();
    if(wordcount.length < 50 ){
      $('#wordCount').show();
       $('#wordcount').html("In order to obtain a reliable result, the individual text samples should contain at least 50 words!");
    }else{
      $('#wordCount').hide();
    }
    
 
    console.log(wordcount);
    $('#comment').text(cleantypeText);
    beforeLogin(cleantypeText);
    //genderGraph(typetext);
    genderGraph1(cleantypeText,null);
  })

});
var client = ZAFClient.init();
client.get('ticket.requester.name').then(function(data) {
  console.log(data); // { "ticket.requester.name": "Mikkel Svane" }
});

function validateAccessKey()
{
  var apiaccesKey=$("input[name='Api-key']").val();
  if(apiaccesKey)
  {
    var client = ZAFClient.init();
    //client.set({'metadata':accessKey:apiaccesKey});
    localStorage.localStorage.setItem('accessKey',apiaccesKey)
    client.metadata().then(function(metadata){

      metadata.accessKey=accessKey;
      console.log(metadata);
    });
  
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
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'x-api-key' : apikey,
     },
     success:function(response){
       debugger;
       console.log("Analyticalresponse");
       console.log(response);
         var useerdetail= response.skills.analytics;
         var widthvalue=Math.abs(parseInt(useerdetail));
         if (useerdetail > 0){
          
   
        console.log(widthvalue);
           var f = $(".f").width(widthvalue +28) / $('.fparent').width() * 100;
          
          $('.f').html( widthvalue + "%");
          console.log();
        var g= $(".g").width(0);
        }else{
         
             var g = $(".g").width((Math.abs(widthvalue))+28) / $('.fparent').parent().width() * 100;  
             var f = $(".f").width(0);
             $('.g').html( widthvalue + "%");
        }
      
        },
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
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'x-api-key' : apikey,
     },
     success:function(response){
            
       profiledetails=response.profile;
        genderGraph1(user_text,profiledetails);
        beforeLogin(user_text,profiledetails);
         var emtionaitly=response.skills.emotionality;
         var width2=Math.abs(parseInt(emtionaitly));
         if (emtionaitly > 0){
          
        
          var f2 = $(".f2").width(( width2)+28) / $('.f2').parent().width() * 100;
        var g2= $(".g2").width(0);
        $('.f2').html( width2 + "%");
        }else{
         
             var g2 = $(".g2").width(Math.abs(width2)+28) / $('.g2').parent().width() * 100;  
             var f2 = $(".f2").width(0);
             
             $('.g2').html( width2 + "%");
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          console.log("not fetching data");
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
      } ,
   
  });
  }  
  console.log(profiledetails);
var awapikey='8aec0765-bb8a-4d5c-baa4-bf7ed6f86f89';
var chart1='';
function beforeLogin()
{
  var commentText=$('#comment').val();
  $.ajax({
    url: "https://dev.100worte.de/v1/api/augmented_writing_customer/analyses",
   method: "post",
   data: JSON.stringify(
    {
        
            "text": commentText,
            "lang": "en",
            "customer-profile-id": "932e6447-8d03-4e05-a712-d37eda447a0b",
            // "932e6447-8d03-4e05-a712-d37eda447a0b"
            // fa6eff15-3f3e-4a2c-90e1-b6b99fb98e68
          
    }
  ),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'x-api-key' : awapikey,
   },
   success:function(response){
    
       var cat= response.scores;
      //  console.log("scores")
      // console.log(cat);
      var sidebarNotes=response.sidebarNotes;
      console.log(sidebarNotes);
      // var highlightText=sidebarNotes.map(c=>{return c.text});
      var highlightWords=sidebarNotes.map(c=>{return c.addwords});


      var html = "";
$.each(sidebarNotes ,function (index, item) {
    console.log(item.title);
    var dataTitle=JSON.stringify(item.title)
    var dataContent=JSON.stringify(item.content)
    
   if(item.addwords==undefined)
   {
    html += "<li class='highightli'  data-titles="+dataTitle+" data-content="+dataContent+" data-adWords="+String(item.addwords)+"  onclick='on(this)'>" + item.text +"<button type='button'  class='btn btn-secondary buttonappear' data-toggle='tooltip' data-placement='bottom' title='Tooltip on top' style='background-color:#fff;color:#000;border-color:#fff'></button>";
   }
   else
   {
    html += "<li class='highightli'  data-titles="+dataTitle+" data-content="+dataContent+" data-adWords="+String(item.addwords)+"  onclick='on(this)'>" + item.text +"<button type='button'  class='btn btn-secondary buttonappear' data-toggle='tooltip' data-placement='bottom' title='Tooltip on top' style='background-color:#fff;color:#000;border-color:#fff'><i class='fa fa-plus' id='appl'></i></button>";
   }
    
    if((item.addwords)==undefined){
      $("#appl").css("display","none")
      console.log("success");
     }
     else{
      $("#appl").show();
      console.log("fail");
     } 
    html += "</li>";
    
      html +="<hr>";
});
var overallscorce=parseInt((response.scores.overall)*100);

$(".overall").html("Over All Scorce"+ "" +":"+overallscorce +"%")
$("#uldisplay").append(html);
      
      var scores=[
        cat[ "jointPosAchieve"],
        cat[ "analytics"],
        cat[ "orientation"],
        cat[ "emotionality"],
        
        
        cat[ "authenticity"],
        
        cat[ "jointPosPower"],
        cat[ "jointPosAffil"]
      ];
       console.log(awapikey);
      console.log("success");
      var data = {
        datasets: [{
            data: scores,
            backgroundColor: [
                "#FEF075",
                "#FFEDDA",
                "#B7FFEE",
                "#F9B09F",
                "#FDCE82",
                "#4EC3F7",
                "#AED580"
            ],
           // label: 'My dataset' // for legend
        }],
      
    };
    console.log(data);
    if(chart1)
    {
      chart1.destroy();
    }
    // this is my <canvas> element
    
    var ctx = document.getElementById("myChart").getContext('2d');
    
  chart1=new Chart(ctx, {
  centerText:{
    display:true,
    text:280
  },
    options: {
      cutoutPercentage: 20,
      onClick:function(event,item)
      {
         console.log("bar chart clicked"+event+item);
      },
      scale:{
       ticks:{
         beginAtZero:true,
         max:1,
         stepSize:1,
         callback: function(value){return value+ "%"}
       }
                      },
      
      plugins: {
        
      labels: {

        arc: true,
        render: 'label',
        fontColor: '#000',
        position: 'outside'
      }
    },
      legend: {
      display: false
      
    },
  },
    data: data,
    type: 'polarArea',
    label:'percentage',
    
    
});
Chart.pluginService.register({
  beforeDraw: function(chart) {
    var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;

    ctx.restore();
    var fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    var text = "75%",
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
});
localStorage.clear();
   },
   
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log("not fetching data");
        console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
    } ,
 
});
}
$("#menu").hide();
function publicComment()
{
  var client = ZAFClient.init();
  client.get('comment.text').then(function(data){
    var comments=(data['comment.text']);
    console.log(comments);
    var cleanText = comments.replace(/(<([^>]+)>)/ig,"");
    //var wordcount = comments.replace(regex, ' ').split(' ').length;
   $('#comment').val(cleanText);
  

  
    $("#menu").show();
  });
}
$("#loginform").submit(function(event) {

  event.preventDefault();

  var $form = $(this),
    url = $form.attr('action');

  var posting = $.post(url, {
    name: $('#name').val(),
    name2: $('#name2').val()
  });
  $('#apiarea').show();

  posting.done(function(data) {
    $('#apiarea').show();
  });
});
function showApiArea()
{
  console.log("ShowArea called");
  $('#apiarea').show();
}
function on(d) {
  var titlesides=d.getAttribute("data-titles");
  var contentside=d.getAttribute("data-content");
  $("#Contentsidenote").text(contentside);
  
  $("#Titlesidenote").html(titlesides);
  var addWords=d.getAttribute("data-adwords").split(",");
  


   $('#text').text(addWords);
      
      $('#text').each(function(){
     
        var txt = $(this).text();
       
        $(this).html('<ul id="Submenu"><li>' + txt.replace(/,/g,'</li><li>') + '</li></ul>');
    });

  document.getElementById("overlay").style.display = "block";

}

function off() {
  document.getElementById("overlay").style.display = "none";
}

function genderGraph1(cleantypeText,profiledetails)
{
//   $.ajax({
//     url: "https://dev.100worte.de/v1/api/augmented_writing_customer/analyses",
//    method: "post",
//    data: JSON.stringify(
//     {
        
//             "text": cleantypeText,
//             "lang": "en",
//             "customer-profile-id": "932e6447-8d03-4e05-a712-d37eda447a0b"
//             // fa6eff15-3f3e-4a2c-90e1-b6b99fb98e68
          
//     }
//   ),
//   headers: {
//     'Content-Type': 'application/json',
//     'x-api-key' : awapikey,
//    },
//    success:function(response){
//     var genderBalance=response.scores.genderBalance;
// var genderper=((genderBalance)*100);
// console.log(genderBalance);
//       if (genderBalance > 0 && genderBalance < 0.5){
          
        
//         var f3 = $(".f3").width((parseInt(genderper))) / $('.f3').parent().width() * 128;
//       var g3= $(".g3").width(0);
//       console.log("i am male");
//       console.log(genderper);
//       }else if (genderBalance > 0.5){
       
//            var g3 = $(".g3").width(Math.abs(parseInt(genderper))) / $('.g3').parent().width() * 128;  

//            var f3 = $(".f3").width(0);
//            console.log("i am female");
//            console.log(genderBalance);
//       }
//       else{
//         var g3= $(".g3").width(0); 
//         var f3 = $(".f3").width(0);
//       }
//    },
   
//     error: function(XMLHttpRequest, textStatus, errorThrown) { 
//         console.log("not fetching data");
//         console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
//     } ,
 
// });
// profiledetails= {
//   "stds": {
//     "jointPosAchieve": 0,
//     "jointPosAffil": 0,
//     "jointPosPower": 0,
//     "analytics": 0,
//     "authenticity": 0,
//     "emotionality": 0,
//     "orientation": 0
//   },
//   "means": {
//     "jointPosAchieve": 0,
//     "jointPosAffil": 0,
//     "jointPosPower": 0,
//     "analytics": 0,
//     "authenticity": 0,
//     "emotionality": 0,
//     "orientation": 0
//   }
// };

$.ajax({
  url: "https://dev.100worte.de/v1/api/augmented_writing_customer/analyses_temp_profile",
 method: "post",
 data: JSON.stringify(
  {
      
          "text": cleantypeText,
          "lang": "en",
          "customer-profile":profiledetails ,
          
          // fa6eff15-3f3e-4a2c-90e1-b6b99fb98e68
        
  }
),
headers: {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'x-api-key' : awapikey,
 },
 success:function(response){
  var genderBalance=response.scores.genderBalance;
var genderper=((genderBalance)*100);
console.log(genderBalance);
    if (genderBalance > 0 && genderBalance < 0.5){
        
      
      var f3 = $(".f3").width((parseInt(genderper))) / $('.f3').parent().width() * 128;
    var g3= $(".g3").width(0);
    console.log("i am male");
    console.log(genderper);
    }else if (genderBalance > 0.5){
     
         var g3 = $(".g3").width(Math.abs(parseInt(genderper))) / $('.g3').parent().width() * 128;  

         var f3 = $(".f3").width(0);
         console.log("i am female");
         console.log(genderBalance);
    }
    else{
      var g3= $(".g3").width(0); 
      var f3 = $(".f3").width(0);
    }
 },
 
  error: function(XMLHttpRequest, textStatus, errorThrown) { 
      console.log("not fetching data");
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
  } ,

});
}
function newgraph(user_text)
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
       
       var orientation=response.skills.orientation;
      var width1=(Math.abs(parseInt(orientation)))
   
         if (orientation > 0){
          
        
          var f1 =$(".f1").width((width1)+28) / $('.f1').parent().width() * 100;
         
        var g1= $(".g1").width(0);
        $(".f1").text(width1 +"%")
        }else{
         
             var g1 = $(".g1").width(Math.abs(width1)+28) / $('.g1').parent().width() * 100;  

             var f1 = $(".f1").width(0);
             $(".g1").text(width1 +"%")
        }
        },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
          console.log("not fetching data");
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
      } ,
   
  });
  }