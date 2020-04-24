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
	'ITP/Plate2.gif',
	'ITP/Plate5.gif',
	'ITP/Plate8.gif',
	'ITP/Plate11.gif',
	'ITP/Plate14.gif',
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
			setTimeout(ISI, 3000);
			psiTurk.showPage("ishihara.html");
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

	var ISI = function(){
		psiTurk.showPage("ISI.html");
	}

	psiTurk.showPage("ishihara.html");

	d3.select('#test').select('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
	setTimeout(ISI, 3000);
	
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

	//var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = 'Purple';
	current_item = sample_items.shift();
	//console.log(current_color, current_item);
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	//d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakOne();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//console.log(current_color, current_item);
			//d3.select('#sq').attr('style', "background-color:" + current_color);
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

	psiTurk.showPage(instructionPages[0]);

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

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		clearInterval(interval);
		currentview = new BreakTwo();
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
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
		}
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

	psiTurk.showPage(instructionPages[0]);

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

    var sample_items = ['wine', 'orchestra', 'proton', 'angst', 'mattress']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = 'Blue';
	current_item = sample_items.shift();
	//console.log(current_color, current_item);
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	//d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakThree();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			//console.log(current_color, current_item);
			//d3.select('#sq').attr('style', "background-color:" + current_color);
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

	psiTurk.showPage(instructionPages[0]);

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

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
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
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
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

	psiTurk.showPage(instructionPages[0]);

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

	//var color_names = ['green', 'blue', 'yellow', 'red', 'purple']

    var sample_items = ['whiskey', 'concert', 'neutron', 'alarm', 'blanket']
	
	var listening = true;

	psiTurk.showPage("practicetask.html")

	current_color = 'Red';
	current_item = sample_items.shift();
	//console.log(current_color, current_item);
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakFive();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			//console.log(current_color, current_item);
			//d3.select('#sq').attr('style', "background-color:" + current_color);
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

	psiTurk.showPage(instructionPages[0]);

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

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		clearInterval(interval);
		currentview = new BreakSix();
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
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	var interval = setInterval(next, 3500);
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

	psiTurk.showPage(instructionPages[0]);

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

    var sample_items = ['sake', 'ballet', 'quark', 'appalled', 'bed']
	
	var listening = true;

	psiTurk.showPage("practicetask.html");

	current_color = 'Yellow';
	current_item = sample_items.shift();
	//console.log(current_color, current_item);
	d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
	d3.select('#sq').select("img").attr('height', window.innerHeight/3);
	d3.select('#sq').select("img").attr('width', window.innerHeight/3);
	//d3.select("#f").text(current_item);

	var finish = function() {
		console.log("PRACTICE finish");
		clearInterval(interval);
		currentview = new BreakSeven();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			setTimeout(ISI,3000);
			psiTurk.showPage("practicetask.html");
			d3.select('#sq').select("img").attr('src', '/static/images/Fabric_Swatches/' + current_color + "_Fabric.jpg");
			d3.select('#sq').select("img").attr('height', window.innerHeight/3);
			d3.select('#sq').select("img").attr('width', window.innerHeight/3);
			//current_color = color_names.shift();
			current_item = sample_items.shift();
			//console.log(current_color, current_item);
			//d3.select('#sq').attr('style', "background-color:" + current_color);
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

	psiTurk.showPage(instructionPages[0]);

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

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		clearInterval(interval);
		currentview = new BreakEight();
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
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
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

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){

	currentview = new FlankerTaskOne();
	//currentview = new InstructionSetOne();
	//currentview = new PracticeTask(p_color_names, p_sample_items);
    /*psiTurk.doInstructions(
    	[], // a list of pages you want to display in sequence
    	function() { currentview = new Instructions(); } // what you want to do when you are done with instructions
    );*/
});
