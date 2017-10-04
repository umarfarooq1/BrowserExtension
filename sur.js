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
//abeera ki changes
Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-blue";
Survey.defaultBootstrapCss.progressBar = "progress-bar progress-bar-custom";

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
     "name": "panel3",
     "elements": [
      {
       "type": "html",
       "html": "<heading> Welcome to our Survey </heading>",
       "name": "question2"
      }
     ],
     "title": "Welcome"
    }
   ],
   "name": "page1"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel2",
     "elements": [
      {
       "type": "html",
       "html": "<heading>We would like to invite you to participate in a research study. The goal of the study is to understand how people’s online behavior impacts the advertisements that they see on the web and in smartphone apps. </heading>\n<br/><br/>\nYour participation should take no longer than XXX.\n<br/><br/>\n[[Version 1: No Browsing and Search History]]\n<br/>\nIf you choose to participate, this browser extension will collect the interest profiles that five online advertisers have collected about you: Google, Facebook, Bluekai, eXelate, and Videology. You will be asked to log in to Google and Facebook so that we may temporarily access these services and collect their interest profiles. We will NOT record any other information from these services, including your username, password, name, etc. Once the study is complete, you may uninstall this extension, at which point we will no longer be able to access your Google and Facebook information. The data collected by our browser extension will be kept strictly confidential and will be used for research purposes only.\n\n<br/><br/>\n[[Version 2: No Browsing and Search History]]\n<br/>\nIf you choose to participate, this browser extension will collect the interest profiles that five online advertisers have collected about you: Google, Facebook, Bluekai, eXelate, and Videology. You will be asked to log in to Google and Facebook so that we may temporarily access these services to collect two types of information: \n<br/>\n          - The interest profiles that they have developed about you\n<br/>\n          - Your search history on Google Search\n<br/>\nWe will NOT record any other information from these services, including your username, password, name, etc. \n<br/><br/>\nAdditionally, if you choose to participate, we will collect your browsing history from your web browser. This data, as well as your search history data, will be used to analyze the correlations between your online behavior and your interest profiles.\n<br/><br/>\nOnce this study is complete, you may uninstall this extension, at which point we will no longer be able to access your Google and Facebook information, or your browsing history. The data collected by our browser extension will be kept strictly confidential and will be used for research purposes only.\n<br/><br/>\nWhile we collect your online advertising interest profiles in the background, we will ask you several questions about your demographics, web and smartphone app usage, and interactions with online advertisements. Your responses to these questions are confidential and will be used for research purposes only. We will not share your responses with anyone who is not involved in this research.\n<br/><br/>\nThe decision to participate in this research project is voluntary. You do not have to participate;  there is no penalty if you choose not to participate in this research or if you choose to stop participating at any time.\n<br/><br/>\nIf you have any questions about this research project, you may contact Professor Christo Wilson at <a href=\"mailto:cbw@ccs.neu.edu\">cbw@ccs.neu.edu</a> or (617) 373-2177. If you have any questions about your rights as a research participant, you may contact Nan Regina, director for the office of Human Subjects Research Protection at <a href=\"mailto:n.regina@neu.edu\">n.regina@neu.edu</a> or (617) 373-4588.\n<br/><br/>\nBy checking the “I agree” box below, you agree that you have read and understand the information about and voluntarily agree to participate in the survey.",
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
     "title": "Informed Consent"
    }
   ],
   "name": "page2"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel1",
     "elements": [
      {
       "type": "html",
       "html": "To proceed with our survey you must have a Google account and be logged-in to it.\n",
       "name": "question3"
      }
     ],
     "title": "Google Login"
    },
    {
     "type": "html",
     "html": "<br/><br/>\n<b>CONGRATS</b> you are  signed in!\n<br/><br/>",
     "name": "gg1",
     "visible": false
    },
    {
     "type": "html",
     "html": "<br/><br/>\n<a href=\"http://google.com\" class=\"button\" target=\"_blank\">Go to Google</a>\n<br/><br/>",
     "name": "gg2",
     "visible": false
    },
    {
     "type": "radiogroup",
     "choices": [
      "Yes",
      "No"
     ],
     "colCount": 2,
     "isRequired": true,
     "name": "gg",
     "title": "Have you signed in to Google?",
     "visible": false,
      validators: [{type: "mytextvalidator"}]
    }
   ],
   "name": "page3"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel4",
     "elements": [
      {
       "type": "html",
       "html": "To proceed with our survey you must have a Facebook account and be logged-in to it.\n",
       "name": "question6"
      }
     ],
     "title": "Facebook Login"
    },
    {
     "type": "html",
     "html": "<br/><br/>\n<b>CONGRATS</b> you are signed in! You may proceed\n<br/><br/>",
     "name": "fb1",
     "visible": false
    },
    {
     "type": "html",
     "html": "<br/><br/>\n<a href=\"https://facebook.com\" class=\"button\" target=\"_blank\">Go to Facebook</a>\n<br/><br/>",
     "name": "fb2",
     "visible": false
    },
    {
     "type": "radiogroup",
     "choices": [
      "Yes!",
      "No"
     ],
     "colCount": 2,
     "isRequired": true,
     "name": "fb",
     "title": "Have you signed in to Facebook?",
     "visible": false,
      validators: [{type: "mytextvalidator"}]
    }
   ],
   "name": "page4"
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
   "name": "page5"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel5",
     "elements": [
      {
       "type": "html",
       "html": "First, we would like to know a bit about you. Remember, your answers to these questions are confidential so please be honest.\n",
       "name": "question1"
      }
     ],
     "title": "Basic Demographics"
    },
    {
     "type": "radiogroup",
     "choices": [
      "18-24",
      "25-44",
      "45-64",
      "65+"
     ],
     "isRequired": true,
     "name": "age",
     "title": "How old are you?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Male",
      "Female"
     ],
     "hasOther": true,
     "isRequired": true,
     "name": "gender",
     "title": "Please select your gender:"
    },
    {
     "type": "checkbox",
     "choices": [
      "White/Caucasian",
      "Black/African American",
      "Native American/Alaska Native/Hawaii Native",
      "Latino/Hispanic",
      "Asian",
      "Other"
     ],
     "isRequired": true,
     "name": "ethnicity",
     "title": "What is your race or ethnicity (check all that apply)?",
     "visible": false,
     "visibleIf": "{loc}='United States'"
    },
    {
     "type": "checkbox",
     "choices": [
      "Urdu",
      "English",
      "Balochi",
      "Punjabi",
      "Sindhi",
      "Pashtu"
     ],
     "isRequired": true,
     "name": "ethnicity-pk",
     "title": "What language do you speak (check all that apply)?",
     "visible": false,
     "visibleIf": "{loc}='Pakistan'"
    },
    {
     "type": "radiogroup",
     "choices": [
      "None",
      "High School",
      "College",
      "Some graduate school",
      "Masters",
      "Doctoral"
     ],
     "isRequired": true,
     "name": "education",
     "title": "What is the highest level of education you have completed?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Never married",
      "Married",
      "Divorced",
      "Separated",
      "Widowed",
      "I prefer not to say"
     ],
     "isRequired": true,
     "name": "marital status",
     "title": "What is your current marital status? "
    },
    {
     "type": "dropdown",
     "choices": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10"
     ],
     "isRequired": true,
     "name": "children",
     "title": "How many children do you care for in your household?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Yes, Full-time",
      "Yes, Part-time",
      "No"
     ],
     "isRequired": true,
     "name": "employment status",
     "title": "Are you currently employed?\n"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Under $15,000",
      "$15,000 to 30,000",
      "$30,000 to 45,000",
      "$45,000 to 60,000",
      "$60,000 to 75,000",
      "$75,000 to 100,000",
      "$100,000 to 150,000",
      "$150,000 and over",
      "I prefer not to say"
     ],
     "isRequired": true,
     "name": "income",
     "title": "What is your yearly household income? ",
     "visible": false,
     "visibleIf": "{loc}='United States'"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Under Rs. 3,000,000",
      "Rs. 3,000,000 to 6,000,000",
      "Rs. 6,000,000 to 10,000,000",
      "Rs. 10,000,000 to 15,000,000",
      "Rs. 15,000,000 and over",
      "I prefer not to say"
     ],
     "isRequired": true,
     "name": "income-pk",
     "title": "What is your yearly household income? ",
     "visible": false,
     "visibleIf": "{loc}='Pakistan'"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Pakistan People's Party (PPP)",
      "Pakistan Muslim League (N)",
      "Pakistan Tehreek-e-Insaf (PTI)",
      "Awami National Party (ANP)",
      "Jamaat-e-Islami Pakistan.",
      "Jamiat-e-Ulema-e-Islam (F)",
      "Muttahida Qaumi Movement (MQM)",
      "Pakistan Awami Tehreek (PAT)",
      "Other",
      "Prefer not to say"
     ],
     "isRequired": true,
     "name": "politics-pk",
     "title": "Which of the following best describes your political views?\n",
     "visible": false,
     "visibleIf": "loc='Pakistan'"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Conservative",
      "Moderate",
      "Liberal",
      "Other",
      "Prefer not to say"
     ],
     "isRequired": true,
     "name": "politics",
     "title": "Which of the following best describes your political views?\n",
     "visible": false,
     "visibleIf": "loc='United States'"
    },
    {
     "type": "dropdown",
     "choices": [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
      "District of Columbia",
      "Puerto Rico",
      "Guam",
      "American Samoa",
      "U.S. Virgin Islands",
      "Northern Mariana Islands"
     ],
     "isRequired": true,
     "name": "state",
     "title": "What state do you live in? ",
     "visible": false,
     "visibleIf": "loc='United States'"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Urban",
      "Suburban",
      "Rural"
     ],
     "isRequired": true,
     "name": "current place",
     "title": "How would you describe the place where you currently live? \n"
    }
   ],
   "name": "page6"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel6",
     "elements": [
      {
       "type": "html",
       "html": "We would like to know about your usage of the internet in general.\n",
       "name": "question5"
      }
     ],
     "title": "General internet and web usage"
    },
    {
     "type": "text",
     "inputType": "number",
     "isRequired": true,
     "name": "years of internet",
     "title": "How many years have you been using the internet?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "30 minutes or less",
      "30 minutes - 1 hour",
      "1 -2 hours",
      "2 - 4 hours",
      "More than 4 hours"
     ],
     "isRequired": true,
     "name": "time spent on internet",
     "title": "Approximately how much time do you spend each day browsing the web on a desktop computer or laptop? "
    },
    {
     "type": "radiogroup",
     "choices": [
      "Chrome",
      "Firefox",
      "Internet Explorer/Edge",
      "Safari",
      "Brave"
     ],
     "isRequired": true,
     "name": "internet browser",
     "title": "What Internet browser do you use most often? "
    },
    {
     "type": "radiogroup",
     "choices": [
      "Google",
      "Bing",
      "DuckDuckGo",
      "Yahoo",
      "AOL",
      "Baidu",
      "Other"
     ],
     "isRequired": true,
     "name": "search engines",
     "title": "Which search engines do you use most often? "
    },
    {
     "type": "radiogroup",
     "choices": [
      "less than 10",
      "10-50",
      "50-100",
      "100 or more"
     ],
     "isRequired": true,
     "name": "web searches",
     "title": "Approximately how many web searches do you conduct each day?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "yes",
      "no"
     ],
     "colCount": "2",
     "isRequired": true,
     "name": "phone",
     "title": "Do you own a smartphone? "
    },
    {
     "type": "text",
     "inputType": "number",
     "isRequired": true,
     "name": "How many years have you been using smartphones? ",
     "title": "How many years have you been using smartphones? ",
     "visible": false,
     "visibleIf": "{phone}= 'yes'"
    },
    {
     "type": "checkbox",
     "choices": [
      "iPhone",
      "Android",
      "Other",
      "I Don’t Know"
     ],
     "isRequired": true,
     "name": "What kind of smartphone do you have",
     "title": "What kind of smartphone do you have (check all that apply)? ",
     "visibleIf": "{phone}= 'yes'"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Always on smartphone",
      "Mostly on smartphone",
      "Slightly More on smartphone",
      "Equally on both",
      "Slightly more on desktop",
      "Mostly on desktop",
      "Always on desktop"
     ],
     "isRequired": true,
     "name": "What fraction of your web browsing is done on a smartphone versus a desktop computer?",
     "title": "What fraction of your web browsing is done on a smartphone versus a desktop computer?"
    }
   ],
   "name": "page7"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel7",
     "title": "Usage of Specific Services"
    },
    {
     "type": "matrix",
     "columns": [
      "Never",
      "Monthly",
      "Weekly",
      "Daily",
      "Multiple times a day"
     ],
     "isAllRowRequired": true,
     "isRequired": true,
     "name": "How frequently do you use the following services",
     "rows": [
      "Twitter ",
      "Instagram ",
      "Snapchat ",
      "LinkedIn ",
      "Pinterest",
      "YouTube ",
      "Gmail ",
      "Reddit ",
      "ESPN ",
      "CNN ",
      "New York Times ",
      "CNBC ",
      "Fox News ",
      "Yelp ",
      "Amazon ",
      "Walmart ",
      "Zillow ",
      "WebMD ",
      "Booking ",
      "TripAdvisor ",
      "Expedia ",
      "Hotels",
      "Kayak "
     ],
     "title": "How frequently do you use the following services, either via their website or via a smartphone app?\n"
    }
   ],
   "name": "page8"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel5",
     "title": "General Online Activities\n"
    },
    {
     "type": "matrix",
     "columns": [
      "Never",
      "Monthly",
      "Weekly",
      "Daily",
      "Multiple times a day"
     ],
     "isAllRowRequired": true,
     "isRequired": true,
     "name": "How often do you perform the following activities online",
     "rows": [
      "Posting content on social media",
      "Reading content on social media ",
      "Sending and receiving email",
      "Online banking and money management ",
      "Researching health information",
      "Reading the news",
      "Booking airline flights, hotels, and/or rental cars ",
      "Shopping for clothes ",
      "Shopping for electronics ",
      "Shopping for household items ",
      "Shopping for movies, music, and/or books",
      "Shopping for toys, games, or other entertainment ",
      "Shopping for office products ",
      "Shopping for food "
     ],
     "title": "How often do you perform the following activities online, either via websites or via smartphone apps?\n"
    }
   ],
   "name": "page9"
  },
  {
   "elements": [
    {
     "type": "panel",
     "elements": [
      {
       "type": "html",
       "html": "We would like to know about your experiences seeing and interacting with online advertisements. \n\n",
       "name": "q10a"
      }
     ],
     "name": "panel10",
     "title": "Online Advertising\n"
    },
    {
     "type": "panel",
     "elements": [
      {
       "type": "html",
       "html": "For these questions, please consider advertisements that you have seen on websites and in smartphone apps. We are referring to ads that look like this:\n<br/><br/>\n[screenshot of an online ad]\n<br/><br/>\n<b>Do not consider advertisements that you have seen on search engines.</b>\n",
       "name": "question1"
      },
      {
       "type": "matrix",
       "columns": [
        "Never",
        "Monthly",
        "Weekly",
        "Daily",
        "Multiple times a day"
       ],
       "isAllRowRequired": true,
       "isRequired": true,
       "name": "question4",
       "rows": [
        "See online advertisements ",
        "See online advertisements that you find relevant",
        "See online ads that you find annoying or intrusive ",
        "Click on online advertisements ",
        "Purchase a product after clicking an associated online advertisement "
       ],
       "title": "How frequently do you interact with online advertisements in the following ways?"
      }
     ],
     "name": "panel5",
     "title": "On Websites and Apps"
    },
    {
     "type": "panel",
     "elements": [
      {
       "type": "html",
       "html": "For these questions, please consider advertisements that you have seen on search engines. We are referring to ads that look like this:\n<br/><br/>\n[screenshot of an ad on Google]\n<br/><br/>\n<b>Do not consider advertisements that you have seen on other websites or smartphone apps.</b>\n",
       "name": "question10b"
      },
      {
       "type": "matrix",
       "columns": [
        "Never",
        "Monthly",
        "Weekly",
        "Daily",
        "Multiple times a day"
       ],
       "isAllRowRequired": true,
       "isRequired": true,
       "name": "How frequently do you interact with search advertisements in the following ways?",
       "rows": [
        "See search advertisements",
        "See search ads that you find relevant ",
        "See search ads that you find annoying or intrusive ",
        "Click on search engine ads",
        "Purchase a product after clicking an associated search ad"
       ],
       "title": "How frequently do you interact with search advertisements in the following ways?"
      }
     ],
     "name": "panel10b",
     "title": "On Search Engines"
    }
   ],
   "name": "page10"
  },
  {
   "elements": [
    {
     "type": "panel",
     "elements": [
      {
       "type": "html",
       "html": "We have a few questions about things you may have done to block online advertisements or enhance your online privacy.\n",
       "name": "question5"
      }
     ],
     "name": "panel11",
     "title": "Tracking and Privacy\n"
    },
    {
     "type": "matrix",
     "columns": [
      "Yes",
      "No ",
      "I don't know"
     ],
     "isAllRowRequired": true,
     "isRequired": true,
     "name": "Do you use any of the following browser extensions?",
     "rows": [
      "Adblock",
      "Adblock Plus",
      "uBlock Origin",
      "Ghostery",
      "Disconnect",
      "Privacy Badger"
     ],
     "title": "Do you use any of the following browser extensions?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Yes",
      "No",
      "I don't know"
     ],
     "colCount": 3,
     "isRequired": true,
     "name": "Do you have “Do Not Track” enabled in your web browser?",
     "title": "Do you have “Do Not Track” enabled in your web browser?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Yes",
      "No",
      "I don't know"
     ],
     "colCount": 3,
     "isRequired": true,
     "name": "Have you ever opted-out of online advertising or online tracking?",
     "title": "Have you ever opted-out of online advertising or online tracking?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Yes",
      "No",
      "I don't know"
     ],
     "colCount": 3,
     "isRequired": true,
     "name": "Do you use a proxy, virtual private network (VPN)",
     "title": "Do you use a proxy, virtual private network (VPN), or other anonymous web browsing service such as Tor?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Never",
      "Monthly",
      "Weekly",
      "Daily",
      "Multiple times a day"
     ],
     "isRequired": true,
     "name": "How often do you browse in private mode",
     "title": "How often do you browse in private mode (e.g. Incognito)?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Never",
      "Monthly",
      "Weekly",
      "Daily",
      "Multiple times a day"
     ],
     "isRequired": true,
     "name": "question7",
     "title": "How often do you clear your cookies?"
    },
    {
     "type": "radiogroup",
     "choices": [
      "Never",
      "Monthly",
      "Weekly",
      "Daily",
      "Multiple times a day"
     ],
     "isRequired": true,
     "name": "question8",
     "title": "How often do you clear your browsing history?"
    }
   ],
   "name": "page11"
  },
  {
   "elements": [
    {
     "type": "panel",
     "name": "panel12",
     "title": "Your Interests"
    },
    {
     "type": "rating",
     "isRequired": true,
     "name": "dyn",
     "rateValues": [
      {
       "value": "1",
       "text": " Not at all"
      },
      {
       "value": "2",
       "text": "A tiny amount"
      },
      {
       "value": "3",
       "text": "Somewhat"
      },
      {
       "value": "4",
       "text": "Very much"
      },
      {
       "value": "5",
       "text": "Extremely"
      }
     ],
     "title": "How interested are you in Sports?"
    },
    {
     "type": "rating",
     "isRequired": true,
     "maxRateDescription": "(very much)",
     "minRateDescription": "(not at all)",
     "name": "dyn1",
     "title": "How interested are you in shopping?",
     "visible": false
    }
   ],
   "name": "page12"
  },
  {
   "elements": [
    {
     "type": "panel",
     "elements": [
      {
       "type": "html",
       "html": "Thank you for taking our survey! You may now uninstall this browser extension.\n",
       "name": "question13"
      }
     ],
     "name": "panel13",
     "title": "Conclusion\n"
    }
   ],
   "name": "page13"
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
    chrome.runtime.sendMessage({type:'surveyResult', data:result.data});
    //send result back to bg!
});


ReactDOM.render(< Survey.Survey model = {survey} />, 
		document.getElementById("surveyElement"));





