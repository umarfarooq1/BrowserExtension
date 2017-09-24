console.log("loading")

var loggedInfb = false;
var loggedInGoogle = false;
var consent = false;

chrome.runtime.sendMessage({type:'init', data:'making sure that this content script has been injected'});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	// console.log("ab aya")
  	if(request.type == "fromBg"){
  		console.log(request.msg);

  		//do processing on data
  		// survey.showProgressBar = "top";
  		console.log(survey.getQuestionByName("dyn1", true));
  		var x = survey.getQuestionByName("dyn1", true)
  		x.title = "are you interested in Shopping?";
  		x.visible = true;
      survey.render();	
  	}

    if(request.type == "logStatus"){
      // console.log("#################################")
      loggedInfb = request.msgfb;
      loggedInGoogle = request.msgg;
      alterSurvey();
    } 	

    console.log("gg: " + loggedInGoogle);
    console.log("fb: " + loggedInfb);
    
    if(loggedInGoogle === true && loggedInfb === true && consent === true){
      chrome.runtime.sendMessage({type:'dataCollection'}); 
    }
});

function myfunc(val){
  console.log(val);
  if(val === "I Agree"){
    consent = true;
  }
  if(loggedInGoogle === true && loggedInfb === true && consent === true){
      chrome.runtime.sendMessage({type:'dataCollection'}); 
  }
}

function alterSurvey(){
  var gg = survey.getQuestionByName("gg", true);
  var gg1 = survey.getQuestionByName("gg1", true);
  var gg2 = survey.getQuestionByName("gg2", true);
  var fb1 = survey.getQuestionByName("fb1", true);
  var fb2 = survey.getQuestionByName("fb2", true);
  var fb = survey.getQuestionByName("fb", true);

  if(loggedInGoogle === true){
    gg1.visible = true;
    gg2.visible = false;
    gg.visible = false;
    
  } else {
    gg2.visible = true;
    gg1.visible = false;
    gg.visible = true;
  }

  if(loggedInfb === true){
    fb1.visible = true;
    fb2.visible = false;
    fb.visible = false;
  } else {
    fb2.visible = true;
    fb1.visible = false;
    fb.visible = true;
  }
  survey.render();
  // console.log(gg1);
  // console.log(fb2);
}

Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

var MyTextValidator = (function (_super) {
    Survey.__extends(MyTextValidator, _super);
    function MyTextValidator() {
        _super.call(this);
    }
    MyTextValidator.prototype.getType = function () { return "mytextvalidator"; };
    MyTextValidator.prototype.validate = function (value, name) {
        if(value === "Yes") {
            //report an error
            return new Survey.ValidatorResult(null, new Survey.CustomError(this.getErrorText("gg")));
        }
        if(value === "Yes!"){
          return new Survey.ValidatorResult(null, new Survey.CustomError(this.getErrorText("fb")));
        }
        if(value === "No"){
          return new Survey.ValidatorResult(null, new Survey.CustomError(this.getErrorText("no")));
        }
        if(value === "I Agree" || value === " I do not Agree"){
          myfunc(value);
          return null
        }
        //return Survey.ValidatorResult object if you want to correct the entered value
        // return new Survey.ValidatorResult(youCorrectedValue);
        //return nothing if there is no any error.
        return null;
    };
    //the default error text. It shows if user do not set the 'text' property
    MyTextValidator.prototype.getDefaultErrorText = function(name) {
        if(name === "no"){
          return "Please sign in to proceed";
        } 
        if(name === "gg"){
          return "I'm afraid you haven't logged into Google";
        } 
        if(name === "fb"){
          return "I'm afraid you haven't logged into Facebook";
        } 

    }
    return MyTextValidator;
})(Survey.SurveyValidator);

Survey.MyTextValidator = MyTextValidator;
//add into survey Json metaData
Survey.JsonObject.metaData.addClass("mytextvalidator", [], function () { return new MyTextValidator(name); }, "surveyvalidator");



window.survey = new Survey.Model({

  title: "Our Survey", showProgressBar: "top", goNextPageAutomatic: false, showNavigationButtons: true,
    
   "pages": [
    {
     "elements": [
      {
       "type": "panel",
       "elements": [
        {
         "type": "html",
         "html": "<heading> Welcome to our Survey </heading>",
         "name": "question2"
        }
       ],
       "name": "panel3",
       "title": "Welcome"
      }
     ],
     "name": "page1"
    },
    {
     "elements": [
      {
       "type": "panel",
       "elements": [
        {
         "type": "html",
         "html": "<heading>We would like to invite you to participate in a research study. The goal of the study is to understand how people’s online behavior impacts the advertisements that they see on the web and in smartphone apps. </heading>",
         "name": "consent"
        },
        {
         "type": "radiogroup",
         "choices": [
          "I Agree",
          " I do not Agree"
         ],
         "colCount": 2,
         "isRequired": true,
         "name": "terms",
         "title": "Do you agree to the terms and Conditions",
         validators: [{type: "mytextvalidator"}]
        }
       ],
       "name": "panel2",
       "title": "Informed Consent"
      }
     ],
     "name": "page2"
    },
    {
     "elements": [
      {
       "type": "panel",
       "elements": [
        {
         "type": "html",
         "html": "To proceed with our survey you must have a Google account and be logged-in to it.\n",
         "name": "question3"
        }
       ],
       "name": "panel1",
       "title": "Google Login"
      },
      {
       "type": "html",
       "html": "CONGRATS you are already signed in",
       "name": "gg1",
       "visible": false
      },
      {
       "type": "html",
       "html": "<a href=\"http://google.com\" class=\"button\" target=\"_blank\">Go to Google</a>",
       "name": "gg2",
       "visible": false
      },
      { type: "radiogroup",  name: "gg", title: "Have you signed in to Google?", choices: ["Yes", "No"], visible: false, "colCount": 2,"isRequired": true, validators: [{type: "mytextvalidator"}]}
     ],
     "name": "page3"
    },
    {
     "elements": [
      {
       "type": "panel",
       "elements": [
        {
         "type": "html",
         "html": "To proceed with our survey you must have a Facebook account and be logged-in to it.\n",
         "name": "question6"
        }
       ],
       "name": "panel4",
       "title": "Facebook Login"
      },
      {
       "type": "html",
       "html": "CONGRATS you are already signed in",
       "name": "fb1",
       "visible": false
      },
      {
       "type": "html",
       "html": "<a href=\"https://facebook.com\" class=\"button\" target=\"_blank\">Go to Facebook</a>",
       "name": "fb2",
       "visible": false
      },
      { type: "radiogroup",  name: "fb", title: "Have you signed in to Facebook?", choices: ["Yes!", "No"], visible: false, "colCount": 2,"isRequired": true, validators: [{type: "mytextvalidator"}]}
     ],
     "name": "page5"
    },
    {
     "elements": [
      {
       "type": "radiogroup",
       "choices": [
        "United States",
        "Pakistan"
       ],
       "isRequired": true,
       "name": "loc",
       "title": "Where are you from?"
      }
     ],
     "name": "page6"
    },

    {
     "elements": [
      {
       "type": "panel","elements": [
        {
         "type": "html",
         "html": "First, we would like to know a bit about you. Remember, your answers to these questions are confidential so please be honest.\n",
         "name": "question1"
        }
       ],
       "name": "panel5",
       "title": "Basic Demographics"
      },

      // {"type": "radiogroup","choices": ["item1","item2","item3"],"name": "question4", isRequired: true, "visibleIf" : "{loc}='United States'" },
      {"type": "radiogroup",  name: "age", title: "How old are you?", choices: ["18-24", "25-44", "45-64", "65+"], isRequired: true},
      { "type": "radiogroup",  name: "gender", title: "Please select your gender:", choices: ["Male", "Female", "other"], isRequired: true},
      {"type": "checkbox","name": "ethnicity", title:"What is your race or ethnicity (check all that apply)?", "choices": ["White/Caucasian", "Black/African American", "Native American/Alaska Native/Hawaii Native", "Latino/Hispanic", "Asian", "Other"], isRequired: true, "visibleIf" : "{loc}='United States'" },
      { "type": "radiogroup",  name: "ed", title: "What is the highest level of education you have completed?", choices: ["None", "High School", "College", "some graduate school", "Masters", "doctoral"], isRequired: true}
      // {"type": "radiogroup","name": "question4", "choices": ["item1","item2","item3"], isRequired: true, "visibleIf" : "{loc}='Pakistan'" }                
     ],
     "name": "page7"
    },

    {
     "elements": [
      {
       "type": "panel",
       "elements": [
        {
         "type": "html",
         "html": "We would like to know about your usage of the internet in general.\n",
         "name": "question5"
        }
       ],
       "name": "panel6",
       "title": "General internet and web usage"
      },
      {
       "type": "radiogroup",
       "choices": [
        "item1",
        "item2",
        "item3"
       ],
       "name": "question8"
      }
     ],
     "name": "page8"
    },
    {
     "elements": [
      {
       "type": "panel",
       "name": "panel7",
       "title": "Usage of Specific Services"
      },
      { type: "radiogroup",  name: "dyn1", title: "kuch bhi", choices: ["yes", "no"], visible: false},
      {
       "type": "radiogroup",
       "choices": [
        "item1",
        "item2",
        "item3"
       ],
       "name": "question9"
      }
     ],
     "name": "page9"
    }
   ],
   "triggers": [
    {
     "type": "complete",
     "operator": "equal",
     "value": " I do not Agree",
     "name": "terms"
    }
   ]  
    //     { 
    //       questions: [
    //          { type: "radiogroup",  name: "gender", title: "Please select your gender:", choices: ["Male", "Female", "other"], isRequired: true},
    //          { type: "radiogroup",  name: "age", title: "Please select your age range:", choices: ["1-10", "11-20", "21-30", "30-40", "40 above"], isRequired: true},
    //          { type:"text", name:"loc", title: "Please enter the country you currently reside in:", placeHolder:"Oman", isRequired: true},
    //          { type: "radiogroup",  name: "income", title: "Please select you income:", choices: ["no income", "$1-$100", "$100-$10,000", "$10,000 above"], isRequired: true},
    //          { type: "radiogroup",  name: "ed", title: "Please select your level of education:", choices: ["High School", "Bachelors", "Masters", "PhD", "post-doctorate"], isRequired: true}
    //     ]},
    //      {questions: [
    //      	{ type: "radiogroup",  name: "dyn", title: "kuch bhi", choices: ["yes", "no"]},
    //       { type: "radiogroup",  name: "dyn1", title: "kuch bhi", choices: ["yes", "no"], visible: false}
    //     ]}
    // ],
    // completedHtml: "<p>Your anwers are:</p><p>When was the Civil War?: <b>{civilwar}</b>. The correct is: <b>1850-1900</b></p><p>Who said 'Give me liberty or give me death?': <b>{libertyordeath}</b>. The correct is: <b>Patrick Henry</b></p><p>What is the Magna Carta?: <b>{magnacarta}</b>. The correct is: <b>The foundation of the British parliamentary system</b></p>"
});

survey.onComplete.add(function(result) {
    document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
    //send result back to bg!
});


ReactDOM.render(< Survey.Survey model = {survey} />, 
		document.getElementById("surveyElement"));





