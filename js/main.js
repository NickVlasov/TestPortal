$(document).ready(function(){
	var slideDelay = 2000;
	var slideSpeed = 500;
	var currentSlide = 0;
	var sliderAmount = $('.sliderlist li').length;
	var slideWidth = $(".sliderCont").width();
	$(".slide").width(slideWidth);
	var sliderGo;
	$(function(){
		$('.sliderlist').width(sliderAmount*slideWidth);
		sliderGo=setInterval(nextSlide,slideDelay);
		$('.slide').hover(function(){
			clearInterval(sliderGo);
		},function(){
			sliderGo=setInterval(nextSlide,slideDelay);
		});
		$('#next_slide').click(function(){
			clearInterval(sliderGo);
			nextSlide();
			sliderGo=setInterval(nextSlide,slideDelay);
		});
		$('#prev_slide').click(function(){
			clearInterval(sliderGo);
			prevSlide();
			sliderGo=setInterval(nextSlide,slideDelay);
		});
	});

	function nextSlide(){
		currentSlide++;
		if(currentSlide>=sliderAmount)
		{
			currentSlide=0;   
		}
		$('.sliderlist').animate({left: -currentSlide*slideWidth},slideSpeed);
	}

	function prevSlide(){
		currentSlide--;
		if(currentSlide<0)
		{
			currentSlide=sliderAmount-1;   
		}
		$('.sliderlist').animate({left: -currentSlide*slideWidth},slideSpeed);
	}

	$.ajax({
		type: "GET",
		url: "jsons/test.json",
		dataType: "json",
		success: function(data){
			// var curTestNumber = 0;
			var mainPageItems = 8;
			function renderMain(){
				$(".chooseTest").html("");
				for(var i=0; i<mainPageItems;i++){
					var currTestBlock = $("<div class='testBlock'></div>");
					var testTitle = "<div class='testTitle'>" + data.tests[i].title + "</div>";
					var testLink = "testPage" + i + ".html";
					var anchorAround = $("<a href=" + testLink + "></a>");
					var testImg = $("<div><img src=" + data.tests[i].imgLink + "/></div>");
					var testDesc = $("<div class='testDesc'>" + data.tests[i].description + "</div>");
					anchorAround.append(testImg);
					anchorAround.append(testTitle);
					anchorAround.append(testDesc);
					currTestBlock.append(anchorAround);
					$(".chooseTest").append(currTestBlock);
				}
			}

			renderMain();

			var standarPaginationQuantity = 9;
			var pageNum = 1;
			renderAll(1,standarPaginationQuantity,renderTests);

			$(".pag").on("click", function(){
				var pageNum = $(this).text();
				renderAll(pageNum, standarPaginationQuantity, renderTests);
			})

			function createButtons(itemsQuantity){
				var buttonsNumber = Math.ceil(data.tests.length / itemsQuantity);
				$(".pag").remove();
				for(var i=0; i<buttonsNumber; i++){
					var b = $('<button>',
					{
						text: i+1,
						class: "pag",
						click: function () { 
							var pageNum = $(this).text();
							renderAll(pageNum, standarPaginationQuantity, renderTests);
						}
					});
					$(".pagButtons").append(b);
				}
			}

			function renderAll(pageNum,itemsQuantity, ff){
				$(".allTests").html("");
				createButtons(itemsQuantity);
				var itemsQuantity = itemsQuantity;
				for(var i=itemsQuantity*(pageNum-1); i<itemsQuantity*pageNum; i++){
					ff(i);
				}
			}

			function renderTests(i){
				if(!data.tests[i]) return;
				var currTestBlock = $("<div class='testBlock'></div>");
				var testLink = "testPage" + (i+1) + ".html";
				var anchorAround = $("<a href=" + testLink + "></a>");
				var testImg = $("<div class='imgWrap'><img src=" + data.tests[i].imgLink + "/></div>");
				var testTitle = "<div class='testTitle'>" + data.tests[i].title + "</div>";
				var testDesc = $("<div class='testDesc'>" + data.tests[i].description + "</div>");
				var testContent = $("<div class='testContent'><div>");
				anchorAround.append(testImg);
				testContent.append(testTitle);
				testContent.append(testDesc);
				anchorAround.append(testContent);
				currTestBlock.append(anchorAround);
				$(".allTests").append(currTestBlock);
			}

			$(".filter").on("click", filterTags);
			$(".showAll").on("click", function(){
				renderAll(1,standarPaginationQuantity,renderTests);
			});
			function filterTags(){
				$(".pagButtons").html("");
				$(".allTests").html("");
				var checkedFilter = $(".filter input:checked").siblings().text().toLowerCase();
				for(var i=0; i<data.tests.length;i++){
					var testTags = data.tests[i].tags;
					testTags = testTags.map(function(j){
						return j.toLowerCase();
					})
					var ind = testTags.indexOf(checkedFilter);
					if(ind!=-1){
						renderTests(i);
					}
				}
				if($(".allTests").is(":empty")){
					$(".allTests").html("There are no items to display");
				}
			}

			function sort(){
				$(".allTests").html("");
				$(".pagButtons").html("");
				var testsArray = data.tests;
				testsArray.sort(function(a, b) {
					return a.title > b.title;
				});
				for(var i=0; i<standarPaginationQuantity; i++){
					if(!testsArray[i]) return;
					var currTestBlock = $("<div class='testBlock'></div>");
					var testLink = "testPage" + (i+1) + ".html";
					var anchorAround = $("<a href=" + testLink + "></a>");
					var testImg = $("<div class='imgWrap'><img src=" + testsArray[i].imgLink + "/></div>");
					var testTitle = "<div class='testTitle'>" + testsArray[i].title + "</div>";
					var testDesc = $("<div class='testDesc'>" + testsArray[i].description + "</div>");
					var testContent = $("<div class='testContent'><div>");
					anchorAround.append(testImg);
					testContent.append(testTitle);
					testContent.append(testDesc);
					anchorAround.append(testContent);
					currTestBlock.append(anchorAround);
					$(".allTests").append(currTestBlock);
				}
			}

			$(".sort").on("click", sort);

			$(".search").on("keyup", search);
			function search(){
				$(".allTests").html("");
				$(".pagButtons").html("");
				var inputValue = $(".search").val().toLowerCase();
				for(var i=0; i<data.tests.length;i++){
					var testTitle = data.tests[i].title.toLowerCase();
					var ind = testTitle.indexOf(inputValue);
					if((ind!=-1) && inputValue){
						renderTests(i);
					}
				}
			}
			
			var needTimer = true;
			function renderQuestions(testNumber){
				var testTitle = $("<div class='testTitle' ></div>").html(data.tests[testNumber].title);
				console.log('test');
				$(".testContainer").prepend(testTitle);
				var questionsContainer = $("<div class='questionsContainer'></div>");
				for(var i=0; i<data.tests[testNumber].questions.length; i++){
					var res = $("<div class='question'></div>");
					var questionTitle = "<div class='questionTitle'>" + data.tests[testNumber].questions[i].Title + "</div>";
					res.append(questionTitle);
					var variants = $("<div class='variants'></div>");
					for(var j = 0; j<data.tests[testNumber].questions[i].Questions.length; j++){
						var variant = "<label><input type='radio' name="+ i +" value='da3'/><div>" + data.tests[testNumber].questions[i].Questions[j] + "</div></label>";
						variants.append(variant);
					}
					res.append(variants);
					questionsContainer.append(res);
					$(".testContainer").append(questionsContainer);
				}
			}
			
			renderQuestions(curTestNumber);

			var questionsNumber = $(".testContainer .question").length;
			$(".check").on("click", function(){
				var allCheckedNumber = $( ".testContainer input:checked" ).length;
				var questionsNumber = $(".question").length;
				if(allCheckedNumber<questionsNumber){
					$(".danger").remove();
					var danger =  $("<div class='danger'>Please answer for all questions</div>");
					$(".testContainer").append(danger);
				} else {
					handler(curTestNumber);
				}
			});
			
			function handler(testNumber){
				var que = $(".testContainer .question");
				$(".danger").remove();
				var rightAnswers = data.tests[testNumber].answers;
				var currAnswers = [];
				var rightCount = 0;
				que.each(function(){
					var labelIndex = $(this).find(":checked").parent().index()+1;
					currAnswers.push(labelIndex);
				})
				for(var i=0; i<rightAnswers.length; i++){
					if(rightAnswers[i] == currAnswers[i]){
						rightCount++;
					}
				}
				$(".rightAnwersBlock").remove();
				$(".questionsContainer").remove();
				$(".check").remove();
				var rightA = $("<div class='rightAnwersBlock'></div>").html("You have answered correctly <span class='rightAnswers'>" + rightCount + "</span> out of <span class='allAnswers'>" +currAnswers.length + "</span> questions");
				$(".testContainer").append(rightA);
				needTimer = false;
			}

			function timer(sec, format){
				var later = new Date();
				var timerNum = sec;
				if(format == "sec"){
					later.setSeconds(later.getSeconds()+timerNum);
				} else{
					later.setMinutes(later.getMinutes()+timerNum);
				}
				
				var x = setInterval(function() {
					if(needTimer == false){
						$(".timeLeft").remove();
						clearInterval(x);
					}
					var now = new Date();
					var dif = later-now;
					var minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
					var seconds = Math.floor((dif % (1000 * 60)) / 1000);
					$(".timeLeft").html("Time left: " + minutes + " minutes and " + seconds + " seconds");
					if(dif<60000){
						$(".timeLeft").addClass("animateTime")
					}
					if (dif < 0) {
						clearInterval(x);
						$(".timeLeft").removeClass("animateTime").css("text-align","center").text("The time has expired");
						handler(curTestNumber);
					}
				}, 1000);
			}

			timer(1, "sec");
		}
	})


})


