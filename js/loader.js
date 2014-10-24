;(function($,window){


	var MouseObject = function(stage)
	{	
		var 
			_stageX = 0, 
			_stageY = 0,
			_dragging = false,
			_draggingObject = null,
			getConnectionPoint = function(event)
			{ 
				return {x:_stageX, y:_stageY}; 
			},
			onMouseOver = function(event)
			{
				_stageX = event.stageX;
				_stageY = event.stageY;
				//console.log(_stageX, _stageX, _dragging);
			},
			setDragObject = function(obj)
			{
				console.log('setDragObject',obj);
				_draggingObject = obj;
			},
			getDragObject = function()
			{
				return _draggingObject === null? {className:'null'} : _draggingObject;
			},
			onMouseUp = function(event)
			{
				// console.log('MouseObject.onMouseUp');
				// _dragging = false;
				// _draggingObject=null;
			},
			initialize = function()
			{
				stage.on('stagemousemove', onMouseOver);
				stage.on('stagemousedown', function(){_dragging = true;});
				stage.on('stagemouseup', onMouseUp);
				stage.enableMouseOver(30);
			};
			this.getConnectionPoint = getConnectionPoint;
			this.setDragObject = setDragObject;
			this.getDragObject = getDragObject;
		initialize();
	};



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
				 console.log('down',e);
				 stage.off(onMouseMove);
				stage.removeChild(connector);
				stage.update();
				//
			};
			stage.addChild(connector);
			window.Mouse.setDragObject(connector);
			connector.on('drop', function(e)
			{
				if (source !== e.originalTarget)
				{
						var tmp = new Connector(source, e.originalTarget);

					stage.addChild(tmp);
					stage.update();

					window.Mouse.setDragObject(null);
				}
			
			});
			stage.on('stagemousemove', onMouseMove);
			stage.on('stagemousedown', onMouseDown);
	};
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
				a.on('newConnector', createConnector);
				stage.update();
			},

			createConnector = function(event)
			{
				
				new ConnectorFactory(event.target, window.Mouse, stage);
			},
			initialize = function()
			{
				window.Mouse = new MouseObject(stage);



				$('#add-new').on('click', addNewBox);
			
				// var butt = new ImageButton('img/monkey.png',function(){ console.log('booo');});
				// stage.addChild(butt);
				

				stage.update();
			};

		initialize();
	};



	$(document).ready(function(){
		var canvas = new GraphCanvas(document.getElementById('demoCanvas'));

	});
	

})(jQuery,window);