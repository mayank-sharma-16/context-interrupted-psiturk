/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"ishihara.html",
	"instructions/instruct-4.html",
	"instructions/instruct-5.html",
	"instructions/instruct-6.html",
	"instructions/instruct-6.html",
	"instructions/instruct-6.html",
	"instructions/instruct-7.html",
	"instructions/instruct-8.html",
	"instructions/instruct-9.html",
	"instructions/instruct-10.html",
	"instructions/instruct-11.html",
	"instructions/instruct-12.html",
	"instructions/instruct-15.html",
	"instructions/instruct-16.html",
	"instructions/instruct-17.html",
	"instructions/instruct-18.html",
	"instructions/instruct-ready.html",
	"practicetask.html",
	"stage.html",
	"ISI.html",
	"arrows.html",
	"baseline.html",
	"postquestionnaire.html"
];


psiTurk.preloadPages(pages);



/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/

var InstructionSetOne = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-1.html",
		"instructions/instruct-2.html",
		"instructions/instruct-3.html",
		];

	psiTurk.showPage(instructionPages[0]);

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new IshiharaTask();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var IshiharaTask = function () {

	var listening = true;

	var image_names = [
	'8plate.png',
	'3plate.jpeg',
	'8plate.png',
	'3plate.jpeg',
	'8plate.png'
	];

	var current_image = image_names.shift();


	var finish = function() {
		console.log("finish");
		clearInterval(interval);
		currentview = new InstructionSetTwo();
	}

	var next = function() {
		if (image_names.length === 0){
			finish();
		}
		else {
			current_image = image_names.shift();
			d3.select('#test').select('img').attr('src', '/static/images/' + current_image);
			d3.select("p").text("[]");
			listening = true;
		}
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode >= 48 && keyCode <= 57) && listening === true){
			d3.select("p").text(e.which - 48);
			listening = false;
		}
	}

	psiTurk.showPage("ishihara.html");

	d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 1000);
	
}

var InstructionSetTwo = function() {

	var instructionPages = [
		"instructions/instruct-4.html",
		"instructions/instruct-5.html",
		"instructions/instruct-6.html",
		"instructions/instruct-7.html",
		"instructions/instruct-8.html",
		"instructions/instruct-9.html",
		"instructions/instruct-10.html",
		"instructions/instruct-11.html",
	]

	psiTurk.showPage(instructionPages[0]);

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new PracticeTask();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var PracticeTask = function() {

	var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = color_names.shift();
	current_item = sample_items.shift();
	console.log(current_color, current_item);
	d3.select('#sq').attr('style', "background-color:" + current_color);
	d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakOne();
	}

	var next = function() {
		if (color_names.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			current_color = color_names.shift();
			current_item = sample_items.shift();
			console.log(current_color, current_item);
			d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
		}
		//console.log(e.key);
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
	setTimeout(ISI,3000);

}

var BreakOne = function() {

	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new TaskOne()
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var TaskOne = function() {

	var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['wine', 'orchestra', 'proton', 'angst', 'mattress']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = color_names.shift();
	current_item = sample_items.shift();
	console.log(current_color, current_item);
	d3.select('#sq').attr('style', "background-color:" + current_color);
	d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakTwo();
	}

	var next = function() {
		if (color_names.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			current_color = color_names.shift();
			current_item = sample_items.shift();
			console.log(current_color, current_item);
			d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
		}
		//console.log(e.key);
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
	setTimeout(ISI,3000);

}

var BreakTwo = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new TaskTwo()
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var TaskTwo = function() {

	var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['whiskey', 'concert', 'neutron', 'alarm', 'blanket']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = color_names.shift();
	current_item = sample_items.shift();
	console.log(current_color, current_item);
	d3.select('#sq').attr('style', "background-color:" + current_color);
	d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakThree();
	}

	var next = function() {
		if (color_names.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			current_color = color_names.shift();
			current_item = sample_items.shift();
			console.log(current_color, current_item);
			d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
		}
		//console.log(e.key);
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
	setTimeout(ISI,3000);

}

var BreakThree = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new TaskThree()
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var TaskThree = function() {

	var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['sake', 'ballet', 'quark', 'appalled', 'bed']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = color_names.shift();
	current_item = sample_items.shift();
	console.log(current_color, current_item);
	d3.select('#sq').attr('style', "background-color:" + current_color);
	d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new InstructionSetThree();
	}

	var next = function() {
		if (color_names.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			current_color = color_names.shift();
			current_item = sample_items.shift();
			console.log(current_color, current_item);
			d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
		}
		//console.log(e.key);
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
	setTimeout(ISI,3000);

}

var InstructionSetThree = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-15.html",
		"instructions/instruct-16.html",
		];

	psiTurk.showPage(instructionPages[0]);

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new ArrowTask();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var ArrowTask = function() {

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakFour();
	}

	var next = function() {
		if (arrows.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("arrows.html");
			current_arrows = arrows.shift();
			d3.select('#test').select('#text').text(current_arrows);
			d3.select("#entry").text('[]');
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	var response_handler = function(e){
		if((e.key == '<' || e.key == '>') && listening === true){
			if(e.key == '<'){
				d3.select("#entry").text('left');
			}
			if(e.key == '>'){
				d3.select("#entry").text('right');
			}
			listening = false;
		}
		//console.log(e.key);
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
	setTimeout(ISI,3000);

}

var BreakFour = function() {
	
	var time = 60;

	psiTurk.showPage("instructions/instruct-17.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new BaselineTest()
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var BaselineTest = function() {

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("baseline.html")

	current_item = sample_items.shift();
	d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new ConcludingScreen();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("baseline.html");
			current_item = sample_items.shift();
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
		}
		//console.log(e.key);
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
	setTimeout(ISI,3000);

}

var ConcludingScreen = function(){

	psiTurk.showPage('instructions/instruct-18.html');

}


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){

	currentview = new InstructionSetOne();
	//currentview = new InstructionSetOne();
	//currentview = new PracticeTask(p_color_names, p_sample_items);
    /*psiTurk.doInstructions(
    	[], // a list of pages you want to display in sequence
    	function() { currentview = new Instructions(); } // what you want to do when you are done with instructions
    );*/
});
