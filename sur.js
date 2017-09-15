console.log("loading")


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	// console.log("ab aya")
  	if(request.type == "fromBg"){
  		console.log(request.msg);

  		//do processing on data
  		survey.showProgressBar = "top";
  		console.log(survey.getQuestionByName("dyn1", true));
  		var x = survey.getQuestionByName("dyn1", true)
  		x.title = "are you interested in Shopping?";
  		x.visible = true;
		survey.render();	
  	}  	
});


Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";


window.survey = new Survey.Model({

    title: "Our Survey", showProgressBar: "bottom", goNextPageAutomatic: true, showNavigationButtons: false,
    pages: [
        { questions: [
             { type: "radiogroup",  name: "gender", title: "Please select your gender:", choices: ["Male", "Female", "other"], isRequired: true},
             { type: "radiogroup",  name: "age", title: "Please select your age range:", choices: ["1-10", "11-20", "21-30", "30-40", "40 above"], isRequired: true},
             { type:"text", name:"loc", title: "Please enter the country you currently reside in:", placeHolder:"Oman", isRequired: true},
             { type: "radiogroup",  name: "income", title: "Please select you income:", choices: ["no income", "$1-$100", "$100-$10,000", "$10,000 above"], isRequired: true},
             { type: "radiogroup",  name: "ed", title: "Please select your level of education:", choices: ["High School", "Bachelors", "Masters", "PhD", "post-doctorate"], isRequired: true}
        ]},
         { questions: [ 
            { type: "radiogroup",  name: "libertyordeath", title: "More random questionss", choicesOrder: "random", choices: ["John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"]}
         ]},
         {questions: [
         	{ type: "radiogroup",  name: "dyn", title: "kuch bhi", choices: ["yes", "no"]},
            { type: "radiogroup",  name: "dyn1", title: "kuch bhi", choices: ["yes", "no"], visible: false}
        ]}
    ],
    // completedHtml: "<p>Your anwers are:</p><p>When was the Civil War?: <b>{civilwar}</b>. The correct is: <b>1850-1900</b></p><p>Who said 'Give me liberty or give me death?': <b>{libertyordeath}</b>. The correct is: <b>Patrick Henry</b></p><p>What is the Magna Carta?: <b>{magnacarta}</b>. The correct is: <b>The foundation of the British parliamentary system</b></p>"
});

survey.onComplete.add(function(result) {
    document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
    //send result back to bg!
});

// const setState = page => {
// 	Object.assign(state, page)
// 	console.log(`j1`)
// 	ReactDOM.render(< Survey.Survey model = {survey} />, 
// 		document.getElementById("surveyElement"));
// 	// ReactDOM.render(React.createElement(Root,state), document.getElementById('root'))	
// }

	ReactDOM.render(< Survey.Survey model = {survey} />, 
		document.getElementById("surveyElement"));




