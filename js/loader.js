;(function($,window){


	

	var ConnectorFactory = function(source, mouse, stage)
	{
		var 
			connector = new Connector(source,  mouse),
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
				
				

				stage.update();
				//
			};
			stage.addChildAt(connector,0);
			window.Mouse.setDragObject(connector);
			connector.on('drop', function(e)
			{
				if (source !== e.originalTarget)
				{
					var tmp = new Connector(source, e.originalTarget);
					tmp.on('remove', function(e)
					{
						stage.removeChild(e.target);
						stage.update();
					});
					tmp.on('needRedraw', function(e)
					{
						stage.update();
					});

					stage.addChildAt(tmp,0);
					stage.update();

					window.Mouse.setDragObject(null);
					stage.off('stagemousemove', onMouseMoveEvent);
					stage.off('stagemousedown', onMouseDownEvent);
				}
			
			});
			var onMouseMoveEvent = stage.on('stagemousemove', onMouseMove);
			var onMouseDownEvent = stage.on('stagemousedown', onMouseDown);
	};
	var GraphCanvas = function(container)
	{

		var 
			stage = new createjs.Stage(container),
			
			addNewBox = function()
			{
				var a = new Artefact('Document',[],[]);
				b = a.getArtefactBounds();
				a.x = container.width / 2 - b.width/2;
				a.y = container.height / 2 - b.height/2;
				stage.addChild(a);
				a.on('needRedraw',function(e){ stage.update();});
				a.on('newConnector', createConnector);
				a.on('remove', function(e){
					stage.removeChild(e.target);
					stage.update();
				});
				stage.update();
			},

			createConnector = function(event)
			{
				
				new ConnectorFactory(event.target, window.Mouse, stage);
			},
			resizeCanvas = function()
			{

				container.width = $(container).parent().innerWidth();
		        container.height = $(container).parent().innerHeight();
		    	stage.update();			
			},
			exportToJSON = function()
			{
				var result = [];
				for(var i=0;i<stage.children.length;i++)
				{
					result.push(stage.children[i].serialize());
				}

				console.log(result);
			},
			initialize = function()
			{
				window.Mouse = new MouseObject(stage);

				$(window).resize(resizeCanvas);

				$('#add-new').on('click', addNewBox);
				$('#export').on('click', exportToJSON);

			
				resizeCanvas();
				addNewBox();
			};

		initialize();
	};



	$(document).ready(function(){
		var canvas = new GraphCanvas(document.getElementById('demoCanvas'));

	});

	
	

})(jQuery,window);