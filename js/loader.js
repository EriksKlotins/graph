;(function($,window){


	var GraphCanvas = function(container)
	{

		var 
			stage = new createjs.Stage(container),
			initialize = function()
			{

				var a = new Artefact('bomzis',[],[]);
				stage.addChild(a);
				stage.update();
			}

		initialize();
	}

	$(document).ready(function(){
		var canvas = new GraphCanvas(document.getElementById('demoCanvas'));
	});
	

})(jQuery,window);