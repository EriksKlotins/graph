;(function($,window){


	var GraphCanvas = function(container)
	{

		var 
			stage = new createjs.Stage(container),
			initialize = function()
			{

				var a = new Artefact(
					'Requirements specification document',
					[
						new Bubble('ekx',''), 
						new Bubble('mun','' )
					],
					[
						new Bubble('tgo')
					]);
				a.x = 100;
				a.y = 200;

				var b = new Artefact(
					'Some other thing document',
					[
						new Bubble('ekx',''), 
						
					],
					[
						new Bubble('tgo'),new Bubble('mun','' ),
						new Bubble('ekx',''), 
						new Bubble('mun','' ),
						new Bubble('ekx',''), 
						new Bubble('mun','' )
					]);
				b.x = 300;
				b.y = 200;

				a.on('dragging',function(e){ stage.update();});
				b.on('dragging',function(e){ stage.update();});
				stage.addChild(a);
				stage.addChild(b);
				stage.update();
			};

		initialize();
	}

	$(document).ready(function(){
		var canvas = new GraphCanvas(document.getElementById('demoCanvas'));
	});
	

})(jQuery,window);