
var awapikey='cb1d8448-4583-4b39-9e5b-65cb7b5bf73d';
function beforeLogin()
{
  $.ajax({
    url: "https://dev.100worte.de/v1/api/augmented_writing_customer/analyses",
   method: "post",
   data: JSON.stringify(
    {
        
            "text": "This is your first ticket. Ta-da! Any customer request sent to your supported channels (email, chat, voicemail, web form, and tweet) will become a Support ticket, just like this one. Respond to this ticket by typing a message above and clicking Submit. You can also see how an email becomes a ticket by emailing your new account, support@100worte2529.zendesk.com. Your ticket will appear in ticket views.",
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
       console.log(awapikey);
      console.log("success");
      var data = {
        datasets: [{
            data: [
               parseInt(cat)
            ],
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
          "Power"
        ]
    };
    console.log(data);s
   },
   
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log("not fetching data");
        console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
    } ,
 
});
}
beforeLogin();