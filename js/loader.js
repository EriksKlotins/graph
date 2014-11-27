;(function($,window){

	var GraphCanvas = function(container)
	{

		var 
			stage = new createjs.Stage(container),
			
			updateStage = function()
			{
				stage.update();
			},
			addNewBox = function()
			{
				var a = new Artefact({});
				var w = $('.canvas-wrapper');
				b = a.getArtefactBounds();
				a.x =  Math.min(window.innerWidth, container.width )/2  + $(w).scrollLeft();
				a.y = Math.min(window.innerHeight, container.height)/2 + $(w).scrollTop();
				//console.log(a.x,a.y);
				stage.addChild(a);
				a.on('needRedraw',updateStage);
				a.on('newConnector', createConnector);
				a.on('moved', resizeCanvas);
				a.on('remove', function(e){
					stage.removeChild(e.target);
					updateStage();
				});
				updateStage();
			},

			createConnector = function(event)
			{
				

				var 
					source = event.target,
					connector = new Connector(source,  window.Mouse),
					onMouseMove = function(e)
					{
						source.requestRedraw();
					},
					onMouseDown = function(e)
					{
						stage.off('stagemousemove', onMouseMoveEvent);
						stage.off('stagemousedown', onMouseDownEvent);
						stage.removeChild(connector);
						//
						setTimeout(function(){
							window.Mouse.setDragObject(null);
						},500);
						updateStage();
					};
					stage.addChildAt(connector,0);
					window.Mouse.setDragObject(connector);
					connector.on('drop', function(e)
					{
						var from = source,
							to = e.originalTarget;
						if (from !== to)
						{
							var tmp = new Connector(from, to);

							tmp.on('remove', function(e)
							{
								stage.removeChild(e.target);
								updateStage();
							});
							tmp.on('needRedraw', function(e)
							{
								updateStage();
							});

							stage.addChildAt(tmp,0);
							updateStage();

							window.Mouse.setDragObject(null);
							stage.off('stagemousemove', onMouseMoveEvent);
							stage.off('stagemousedown', onMouseDownEvent);
						
							
						}
						
					
					});
					var onMouseMoveEvent = stage.on('stagemousemove', onMouseMove);
					var onMouseDownEvent = stage.on('stagemousedown', onMouseDown);
			},
			resizeCanvas = function()
			{
				var 
					maxW = Math.max(300, container.width),
					maxH = Math.max(200, container.height);
				for (var i=0;i<stage.children.length;i++)
				{
					
					var x = stage.children[i].x, y = stage.children[i].y;
				
					if (x > maxW - 200) 
					{
						maxW += 300;
					}
					if (y > maxH - 200) 
					{
						maxH += 300;
					}
				}
				

				container.width = maxW;
		        container.height = maxH;

		      //  console.log(stage);
		    	updateStage();		
			},

			resizeScreen = function()
			{
				var el = $('.canvas-wrapper'), offset = $(el).parent().offset();
				$(el).css({'height':window.innerHeight-offset.top + 'px'});


			},

			exportToJSON = function()
			{
				var result = [];
				for(var i=0;i<stage.children.length;i++)
				{
					result.push(stage.children[i].serialize());
				}

		
			},
			initialize = function()
			{
				window.Mouse = new MouseObject(stage);

				$(window).resize(resizeScreen);

				$('#add-new').on('click', addNewBox);
				$('#export').on('click', exportToJSON);

			
				resizeScreen();
				resizeCanvas();
				addNewBox();
			};

		initialize();
	};



	$(document).ready(function(){

		window. roleList = 
		[
			
			new Bubble({title:'Designers', abbr:'D'}),
			new Bubble({title:'Development', abbr:'DEV'}),
			new Bubble({title:'Product management', abbr:'PM'}),
			new Bubble({title:'Simulation', abbr:'S'}),
			new Bubble({title:'System management', abbr:'SM'}),
			new Bubble({title:'Software test', abbr:'ST'}),
			new Bubble({title:'Tester', abbr: 'T'}),
			new Bubble({title:'Test lead', abbr: 'TL'}),
			new Bubble({title:'Test team', abbr:'TT'})
		];
		var canvas = new GraphCanvas(document.getElementById('demoCanvas'));

	});

	
	

})(jQuery,window);