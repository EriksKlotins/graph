;(function($,window){


	var GraphCanvas = function(container)
	{

		var 
			stage = new createjs.Stage(container),
			addNewBox = function()
			{
				var a = new Artefact('This is box',[],[]);
				a.x=100;
				a.y = 100;
				stage.addChild(a);
				a.on('needRedraw',function(e){ stage.update();});
				stage.update();
			},
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

				var d = new Artefact('Bomba',[],[]);
				d.x = 400;
				d.y = 400;
				b.x = 300;
				b.y = 200;
				var c1 = new Connector(a,b);
				var c2 = new Connector(a,d);

				a.on('needRedraw',function(e){ stage.update();});
				b.on('needRedraw',function(e){ stage.update();});
				d.on('needRedraw',function(e){ stage.update();});
				
				stage.addChildAt(c1,0);
				stage.addChildAt(c2,0);
				stage.addChildAt(a,1);
				stage.addChildAt(b,1);
				stage.addChildAt(d,0);
				

				$('#add-new').on('click', addNewBox);
				stage.enableMouseOver(10);
				stage.update();
			};

		initialize();
	};



	$(document).ready(function(){
		var canvas = new GraphCanvas(document.getElementById('demoCanvas'));
	});
	

})(jQuery,window);