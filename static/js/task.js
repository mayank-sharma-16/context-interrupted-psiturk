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
	"instructions/instruct-19.html",
	"instructions/instruct-ready.html",
	"practicetask.html",
	"stage.html",
	"ISI.html",
	"arrows.html",
	"baseline.html",
	"postquestionnaire.html"
];


psiTurk.preloadPages(pages);

var startTime, endTime;
var subjectData = new Map();


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

	startTime = new Date();

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-1.html",
		"instructions/instruct-2.html",
		"instructions/instruct-3.html",
		];

	psiTurk.showPage(instructionPages.shift());

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

	var ISIinputs = [];
	var ISItimes = [];
	var ISIstart, ISIend;

	var image_names = [
	'ITP/Plate2.gif',
	'ITP/Plate5.gif',
	'ITP/Plate8.gif',
	'ITP/Plate11.gif',
	'ITP/Plate14.gif',
	];

	for(let i = image_names.length-1; i>0; i--){
		const j = Math.floor(Math.random() * i)
  		const temp = image_names[i]
  		image_names[i] = image_names[j]
  		image_names[j] = temp
	}

	var current_image = image_names.shift();


	var finish = function() {
		subjectData.set('ISI inputs', ISIinputs);
		subjectData.set('ISI times', ISItimes);
		clearTimeout(plate_timeout);
		currentview = new InstructionSetTwo();
	}

	var next = function() {
		if (image_names.length === 0){
			ISItimes.push(new Date()-ISIstart);
			listening = false;
			finish();
		}
		else {
			if(in_plate == true){
				ISIend = new Date();
				ISI();
				plate_timeout = setTimeout(next, 500);
				in_plate = false;
			}
			else{ 
				psiTurk.showPage("ishihara.html");
				current_image = image_names.shift();
				d3.select('#test').select('img').attr('src', '/static/images/' + current_image);
				d3.select("p").text("[]");
				if(listening != false){
					ISIinputs.push(NaN);
				}
				listening = true;
				ISItimes.push(ISIend-ISIstart);
				ISIstart = new Date();
				plate_timeout = setTimeout(next, 3000);
				in_plate = true;
			}
		}
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode >= 48 && keyCode <= 57) && listening === true){
			//d3.select("p").text(e.which - 48);
			ISIinputs.push(String.fromCharCode(e.keyCode));
			ISIend = new Date();
			clearTimeout(plate_timeout);
			in_plate = false;
			plate_timeout = setTimeout(next, 500)
			ISI();
			listening = false;
		}

	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	psiTurk.showPage("ishihara.html");

	d3.select('#test').select('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	ISIstart = new Date();
	var plate_timeout = setTimeout(next, 3000);
	var in_plate = true;
	
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

	psiTurk.showPage(instructionPages.shift());

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

	var practiceInputs = [];
	var practiceTimes = [];
	var practiceStart;

	//var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = 'Purple';
	current_item = sample_items.shift();
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	//d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Practice Inputs", practiceInputs);
		subjectData.set("Practice Times", practiceTimes);
		clearInterval(interval);
		currentview = new BreakOne();
	}

	var next = function() {
		if (sample_items.length === 0){
			if(listening != false) {
				practiceInputs.push(NaN);
				practiceTimes.push(new Date() - practiceStart - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				practiceInputs.push(NaN);
				practiceTimes.push(new Date() - practiceStart - 500);
			}
			practiceStart = new Date();
			setTimeout(ISI, 3000);
			psiTurk.showPage("practicetask.html");
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			practiceTimes.push(new Date() - practiceStart);
			d3.select("#t").text(e.key);
			practiceInputs.push(e.key);
			listening = false;
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	
	var interval = setTimeout(ISI, 3000);
	practiceStart = new Date();

}

var BreakOne = function() {

	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new FlankerInstructionsOne()
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

var FlankerInstructionsOne = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-15.html",
		"instructions/instruct-16.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new FlankerTaskOne();
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

var FlankerTaskOne = function() {

	var Flanker1Inputs = [];
	var Flanker1Times = [];
	var Flanker1Start;

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		subjectData.set("Flanker1 Inputs", Flanker1Inputs);
		subjectData.set("Flanker1 Times", Flanker1Times);
		currentview = new BreakTwo();
	}

	var next = function() {
		if (arrows.length === 0){
			if(listening != false){
				Flanker1Inputs.push(NaN);
				Flanker1Times.push(new Date() - Flanker1Start - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				Flanker1Inputs.push(NaN);
				Flanker1Times.push(new Date() - Flanker1Start - 500);
			}
			Flanker1Start = new Date();
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
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
			Flanker1Times.push(new Date() - Flanker1Start);
			Flanker1Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	Flanker1Start = new Date();
	setTimeout(ISI,3000);

}

var BreakTwo = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new InstructionSetThree();
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

var InstructionSetThree = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-19.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new TaskOne();
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

var TaskOne = function() {

	var Task1Inputs = [];
	var Task1Times = [];
	var Task1Start;

    var sample_items = ['wine', 'orchestra', 'proton', 'angst', 'mattress']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = 'Blue';
	current_item = sample_items.shift();
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	//d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Task1 Inputs", Task1Inputs);
		subjectData.set("Task1 Times", Task1Times);
		currentview = new BreakThree();
	}

	var next = function() {
		if (sample_items.length === 0){
			if(listening != false){
				Task1Inputs.push(NaN);
				Task1Times.push(new Date() - Task1Start - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				Task1Inputs.push(NaN);
				Task1Times.push(new Date() - Task1Start - 500);
			}
			Task1Start = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			//d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
			Task1Times.push(new Date() - Task1Start);
			Task1Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI, 3000);
	practiceStart = new Date();

}

var BreakThree = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new FlankerInstructionsTwo()
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

var FlankerInstructionsTwo = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-15.html",
		"instructions/instruct-16.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new FlankerTaskTwo();
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

var FlankerTaskTwo = function() {

	var Flanker2Inputs = [];
	var Flanker2Times = [];
	var Flanker2Start;
	
	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		subjectData.set("Flanker2 Inputs", Flanker2Inputs);
		subjectData.set("Flanker2 Times", Flanker2Times);
		currentview = new BreakFour();
	}

	var next = function() {
		if (arrows.length === 0){
			if(listening != false){
				Flanker2Inputs.push(NaN);
				Flanker2Times.push(new Date() - Flanker2Start - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				Flanker2Inputs.push(NaN);
				Flanker2Times.push(new Date() - Flanker2Start - 500);
			}
			Flanker2Start = new Date();
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
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
			Flanker2Times.push(new Date() - Flanker2Start);
			Flanker2Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	Flanker2Start = new Date();
	setTimeout(ISI,3000);

}

var BreakFour = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new InstructionSetFive()
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

var InstructionSetFive = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-19.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new TaskTwo();
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

var TaskTwo = function() {
	
	var Task2Inputs = [];
	var Task2Times = [];
	var Task2Start;

	//var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['whiskey', 'concert', 'neutron', 'alarm', 'blanket']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = 'Red';
	current_item = sample_items.shift();
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Task2 Inputs", Task2Inputs);
		subjectData.set("Task2 Times", Task2Times);
		currentview = new BreakFive();
	}

	var next = function() {
		if (sample_items.length === 0){
			if(listening != false){
				Task2Inputs.push(NaN);
				Task2Times.push(new Date() - Task2Start - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				Task2Inputs.push(NaN);
				Task2Times.push(new Date() - Task2Start - 500);
			}
			Task2Start = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			//d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
			Task2Times.push(new Date() - Task2Start);
			Task2Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI,3000);
	practiceStart = new Date();

}

var BreakFive = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new FlankerInstructionsThree()
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

var FlankerInstructionsThree = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-15.html",
		"instructions/instruct-16.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new FlankerTaskThree();
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

var FlankerTaskThree = function() {

	var Flanker3Inputs = [];
	var Flanker3Times = [];
	var Flanker3Start;
	
	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		subjectData.set("Flanker3 Inputs", Flanker3Inputs);
		subjectData.set("Flanker3 Times", Flanker3Times);
		currentview = new BreakSix();
	}

	var next = function() {
		if (arrows.length === 0){
			if(listening != false){
				Flanker3Inputs.push(NaN);
				Flanker3Times.push(new Date() - Flanker3Start - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				Flanker3Inputs.push(NaN);
				Flanker3Times.push(new Date() - Flanker3Start - 500);
			}
			Flanker3Start = new Date();
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
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
			Flanker3Times.push(new Date() - Flanker3Start);
			Flanker3Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	Flanker3Start = new Date();
	setTimeout(ISI,3000);

}

var BreakSix = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new InstructionSetSix()
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

var InstructionSetSix = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-19.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new TaskThree();
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


var TaskThree = function() {

	//var color_names = ['green', 'blue', 'yellow', 'red', 'purple']
	var Task3Inputs = [];
	var Task3Times = [];
	var Task3Start;
	
	var sample_items = ['sake', 'ballet', 'quark', 'appalled', 'bed']
	
	var listening = true;

	psiTurk.showPage("practicetask.html");

	current_color = 'Yellow';
	current_item = sample_items.shift();
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	//d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Task3 Inputs", Task3Inputs);
		subjectData.set("Task3 Times", Task3Times);
		currentview = new BreakSeven();
	}

	var next = function() {
		if (sample_items.length === 0){
			if(listening != false){
				Task3Inputs.push(NaN);
				Task3Times.push(new Date() - Task3Start - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				Task3Inputs.push(NaN);
				Task3Times.push(new Date() - Task3Start - 500);
			}
			Task3Start = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			//d3.select('#sq').attr('style', "background-color:" + current_color);
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
			Task3Times.push(new Date() - Task3Start);
			Task3Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI,3000);
	practiceStart = new Date();

}

var BreakSeven = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new FlankerInstructionsFour()
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

var FlankerInstructionsFour = function() {
	

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-15.html",
		"instructions/instruct-16.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new FlankerTaskFour();
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

var FlankerTaskFour = function() {

	var Flanker4Inputs = [];
	var Flanker4Times = [];
	var Flanker4Start;

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		subjectData.set("Flanker4 Inputs", Flanker4Inputs);
		subjectData.set("Flanker4 Times", Flanker4Times);
		currentview = new BreakEight();
	}

	var next = function() {
		if (arrows.length === 0){
			if(listening != false){
				Flanker4Inputs.push(NaN);
				Flanker4Times.push(new Date() - Flanker4Start - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				Flanker4Inputs.push(NaN);
				Flanker4Times.push(new Date() - Flanker4Start - 500);
			}
			Flanker4Start = new Date();
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
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
			Flanker4Times.push(new Date() - Flanker4Start);
			Flanker4Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI,3000);
	Flanker4Start = new Date();

}

var BreakEight = function() {
	
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

	var BaselineInputs = [];
	var BaselineTimes = [];
	var BaselineStart;

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("baseline.html")

	current_item = sample_items.shift();
	d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Baseline Inputs", BaselineInputs);
		subjectData.set("Baseline Times", BaselineTimes);
		currentview = new ConcludingScreen();
	}

	var next = function() {
		if (sample_items.length === 0){
			if(listening != false){
				BaselineInputs.push(NaN);
				BaselineTimes.push(new Date() - BaselineStart - 500);
			}
			finish();
		}
		else {
			if(listening != false){
				BaselineInputs.push(NaN);
				BaselineTimes.push(new Date() - BaselineStart - 500);
			}
			BaselineStart = new Date();
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
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
			BaselineTimes.push(new Date() - BaselineStart);
			BaselineInputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI,3000);
	practiceStart = new Date();

}

var ConcludingScreen = function(){

	psiTurk.showPage('instructions/instruct-18.html');
	endTime = new Date();
	subjectData.set("TotalTime", new Date() - startTime);
	console.log(subjectData);

}

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){

	//currentview = new FlankerTaskOne();
	currentview = new InstructionSetOne();
	//currentview = new PracticeTask(p_color_names, p_sample_items);
    /*psiTurk.doInstructions(
    	[], // a list of pages you want to display in sequence
    	function() { currentview = new Instructions(); } // what you want to do when you are done with instructions
    );*/
});
