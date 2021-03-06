
var MouseObject = function(stage)
	{	
		var 
			_stageX = 0, 
			_stageY = 0,
			_dragging = false,
			_draggingObject = null,
			getArtefactBounds = function(event)
			{ 
				return {x:_stageX, y:_stageY, width:0, height:0}; 
			},
			onMouseOver = function(event)
			{
				_stageX = event.stageX;
				_stageY = event.stageY;
				//console.log(_stageX, _stageX, _dragging);
			},
			setDragObject = function(obj)
			{
				//console.log('setDragObject',obj);
				_draggingObject = obj;
			},
			getDragObject = function()
			{
				return _draggingObject === null? {className: null} : _draggingObject;
			},
			onMouseUp = function(event)
			{
				// console.log('MouseObject.onMouseUp');
				// _dragging = false;
				// _draggingObject=null;
			},
			getConnectorOrder = function()
			{
				return {count:1, order:0, to: 0};
			},
			removeConnection = function()
			{

			},
			registerConnection = function()
			{

			},
			calculateConnectionPoint = function()
			{
				return getArtefactBounds();
			},
			initialize = function()
			{
				stage.on('stagemousemove', onMouseOver);
				stage.on('stagemousedown', function(){_dragging = true;});
				stage.on('stagemouseup', onMouseUp);
				stage.enableMouseOver(30);
			};
			this.registerConnection = registerConnection;
			this.getArtefactBounds = getArtefactBounds;
			this.setDragObject = setDragObject;
			this.getDragObject = getDragObject;
			this.removeConnection = removeConnection;
			this.calculateConnectionPoint = calculateConnectionPoint;
			this.getConnectorOrder = getConnectorOrder;
		initialize();
	};

