//main function of all
var user_text;
var profiledetails;
var key;
var dataTitle;
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
    $('#comment').text(cleantypeText);
    beforeLogin(cleantypeText);
    //genderGraph(typetext);
    genderGraph1(cleantypeText,null);
  })

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
//Global Variables
var sideNotes='';
//End Global variables
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

  var apikey='b95d349b-e97c-4a32-acf5-4b42dce99b74'
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
         var useerdetail= response.skills.analytics;
         var widthvalue=Math.abs(parseInt(useerdetail));
         if (useerdetail > 0){
           var f = $(".f").width(widthvalue +28) / $('.fparent').width() * 100;
          $('.f').html( widthvalue + "%");
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
  var apikey='b95d349b-e97c-4a32-acf5-4b42dce99b74'
 
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
var awapikey='321b67e1-b2b0-473b-8cb4-0113bcc9849f';
var chart1='';
var chart2='';
function beforeLogin(text)
{
  var commentText=$('#comment').val();
  console.log(commentText);
  $.ajax({
    url: "https://dev.100worte.de/v1/api/augmented_writing_customer/analyses_temp_profile",
   method: "post",
   data: JSON.stringify(
    {
        
            "text": commentText,
            "lang": "en",
            "customer-profile": profiledetails
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
     sideNotes=response;
       var cat= response.scores;
      var sidebarNotes=response.sidebarNotes;
      var highlightWords=sidebarNotes.map(c=>{return c.addwords});
       var key=response.sidebarNotes.map(c=>{return c.key})
      var html = "";
$.each(sidebarNotes ,function (index, item) {
  var dataTitle=JSON.stringify(item.title)
    var dataContent=JSON.stringify(item.content)
      var key=response.sidebarNotes.map(c=>{return c.key})
   if(item.title== undefined || item.content==undefined   &&  item.addwords==undefined  ) 
   {
    console.log(dataTitle);
    html += "<li class='highightli' id="+item.key+" data-titles="+dataTitle+" data-content="+dataContent+" data-adWords="+String(item.addwords)+" >" + item.text ;
   }else if(item.addwords==undefined ) {
     console.log(dataTitle);
    html += "<li class='highightli' id="+item.key+" data-titles="+dataTitle+" data-content="+dataContent+" data-adWords="+String(item.addwords)+" onclick='on(this)' >" + item.text +"<button type='button'  class='btn btn-secondary buttonappear' data-toggle='tooltip' data-placement='bottom' title='Tooltip on top' style='background-color:#fff;color:#000;border-color:#fff'></button>";
   }
   else 
   {
    html += "<li class='highightli' id="+item.key+"  data-titles="+dataTitle+" data-content="+dataContent+" data-adWords="+String(item.addwords)+"  onclick='on(this)'>" + item.text +"<button type='button'  class='btn btn-secondary buttonappear' data-toggle='tooltip' data-placement='bottom' title='Tooltip on top' style='background-color:#fff;color:#000;border-color:#fff'><i class='fa fa-plus' id='appl'></i></button>";
   }
    
    if((item.addwords)==undefined){
      $("#appl").css("display","none")
     }
     else{
      $("#appl").show();
     } 
    html += "</li>";
    
      html +="<hr>";
});


$(".overall").html("Over All Scorce"+ "" +":"+overallscorce +"%")
$('#uldisplay').empty();
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
    if(chart1)
    {
      chart1.destroy();
    }
    // this is my <canvas> element
    
    var ctx = document.getElementById("c2").getContext('2d');

  chart1=new Chart(ctx, {
  centerText:{
    display:true,
    text:280
  },
    options: {
      cutoutPercentage: 20,
      onClick:function(event,item)
      {
        var takeKeyValue=item[0]._index;
        var keyData=(takeKeyValue==0)?"jointPosAchieve":
                    (takeKeyValue==1)?"analytics":
                    (takeKeyValue==2)?"orientation":
                    (takeKeyValue==3)?"emotionality":
                    (takeKeyValue==4)?"authenticity":
                    (takeKeyValue==5)?"jointPosPower":
                    (takeKeyValue==6)?"jointPosAffil":"";
        // console.log(takeKeyValue);
        // console.log(keyData);
        // console.log(JSON.stringify(sideNotes));
        //  console.log("bar chart clicked"+event+item);
      if (key ) {
          
       on(document.getElementById(keyData));
             
      }
      else{
        console.log("not successful");
      }
      },
      scale:{
       ticks:{
         beginAtZero:true,
         min:0,
         max:1,
         stepSize:2,
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
    var fontSize = (height / 114).toFixed(1.5);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    var text = "",
        textX = Math.round((width - ctx.measureText(text).width) / 1.5),
        textY = height / 1.5;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
});

var overallscorce=parseInt((response.scores.overall)*100);

var scores=[
  cat[ parseInt("jointPosAchieve")],
  cat[ "analytics"],
  cat[ "orientation"],
  cat[ "emotionality"],
  
  
  cat[ "authenticity"],
  
  cat[ "jointPosPower"],
  cat[ "jointPosAffil"]
];
var data = [{"label":"Achievement <br> Speech","colour":"#FEF075","score":parseInt(cat[("jointPosAchieve")]*100),"index":0},
            {"label":"Analytic Speechs","colour":"#FFEDDA","score": parseInt(cat[ "analytics"]*100),"index":1 },
            {"label":"Reward Focus","colour":"#B7FFEE","score":parseInt(cat[ "orientation"]*100),"index":2},
            {"label":"Positvie Mood","colour":"#F9B09F","score":parseInt(cat[ "emotionality"]*100),"index":3},
            {"label":"Authentic Speech","colour":"#FDCE82","score":parseInt(cat[ "authenticity"]*100),"index":4},
            {"label":"Power Speech","colour":"#4EC3F7","score": parseInt(cat[ "jointPosPower"]*100),"index":5},
            {"label":"Affiliation Speech","colour":"#AED580","score":parseInt(cat[ "jointPosAffil"]*100),"index":6}];
            if(chart2)
            {
              chart2.destroy();
            }
 chart2 = new G2.Chart({
  id: 'myChart',
  forceFit: false,
 right:96,
  width:380,
   height: 350,

});
chart2.source(data,{
  score:{
    min:0,
    max:100
  }
});
chart2.coord('polar', {
  inner: 0.3,
  radius: 0.6
});

chart2.position,
chart2.legend(false);
chart2.axis('score',false);



// chart2.axis('label', {
//   // textStyle: {
//   //   textAlign: 'start', // 文本的颜色
//   //   fontSize: '15', // 文本大小
//   //   fontWeight: 'bold', 
//   // offset: 100,
//   // startArrow: true,
//   // rotate:30 * Math.PI / 180
//   // },
//   label:null,
// });
chart2.axis('label', {
  labels: null
});
chart2.interval().position('label*score').color('colour', function(val) {
  return val;
}).style({
  stroke: '#999',
  lineWidth: 0
}).tooltip('score');
chart2.guide().text([4.5,-20], overallscorce + '%', {
  position:'center',
  fill: '#666', // 文本颜色
  fontSize: '15', // 文本大小
  fontWeight: 'bold' // 文本粗细
});


chart2.render({startArrow: false});
chart2.on('plotclick',function(ev){
  var data = ev.data;

  if (data ) {

   
    var name = data._origin['label'];
    var takeKeyValue=data._origin['index'];;
    var keyData=(takeKeyValue==0)?"jointPosAchieve":
                (takeKeyValue==1)?"analytics":
                (takeKeyValue==2)?"orientation":
                (takeKeyValue==3)?"emotionality":
                (takeKeyValue==4)?"authenticity":
                (takeKeyValue==5)?"jointPosPower":
                (takeKeyValue==6)?"jointPosAffil":"";
    // console.log(takeKeyValue);
    // console.log(keyData);
    // console.log(JSON.stringify(sideNotes));
    //  console.log("bar chart clicked"+event+item);
  if (key) {
      
   on(document.getElementById(keyData));
   console.log(takeKeyValue);
   console.log(keyData);
         
  }
  else{
    console.log("not successful");
  }
    
  }
});

  

   },
   
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log("not fetching data");
        console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
    } ,
 
});
localStorage.clear();
}
$("#menu").hide();
function publicComment()
{
  var client = ZAFClient.init();
  client.get('comment.text').then(function(data){
    var comments=(data['comment.text']);
    var cleanText = comments.replace(/(<([^>]+)>)/ig,"");
    var wordcount =cleanText.trim().split(' ');
    $('#wordCount').hide();
    if(wordcount.length < 50 ){
      $('#wordCount').show();
       $('#wordcount').html("In order to obtain a reliable result, the individual text samples should contain at least 50 words!");
    }else{
      $('#wordCount').hide();
    }
   $('#comment').val(cleanText);
   beforeLogin(cleanText);
   

  

  
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
        console.log(addWords);
    });

  document.getElementById("overlay").style.display = "block";

}

function off() {
  document.getElementById("overlay").style.display = "none";
}

function genderGraph1(cleantypeText,profiledetails)
{
$.ajax({
  url: "https://dev.100worte.de/v1/api/augmented_writing_customer/analyses_temp_profile",
 method: "post",
 data: JSON.stringify(
  {
      
          "text": cleantypeText,
          "lang": "en",
          "customer-profile":profiledetails ,        
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
    if (genderBalance > 0 && genderBalance < 0.5){
      var f3 = $(".f3").width((parseInt(genderper))) / $('.f3').parent().width() * 128;
    var g3= $(".g3").width(0);
    }else if (genderBalance > 0.5){
         var g3 = $(".g3").width(Math.abs(parseInt(genderper))) / $('.g3').parent().width() * 128;  
         var f3 = $(".f3").width(0);
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