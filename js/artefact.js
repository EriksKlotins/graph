//;(function($,window){

	/**
     *	Describes artefact item
	 *	@title
	 *	@createdBy
	 *	@usedBy
	 */
	var Artefact = function(options)
	{
		var 
			_self = new createjs.Container(), 
			_isDragging = false,
			_dragDeltaX = 0,
			_dragDeltaY = 0,
			_boxTopOffset = 0,
			createdBy = [], 
			usedBy = [],
			_options = {
				title:'Document',
				label:{
					font: '16px arial', 
					color: '#1e376d'
				}, 
				box: 
				{
					color: '#fcd905', 
					selectedColor : '#fcd905',//'#e17f26',
					border: '#1e376d',
					width: 100, 
					height: 60,
					minWidth : 100,
					minHeight : 60,
					maxWidth : 200,
					maxHeight: 100
				},
				bubble:
				{
					radius : 16
				}
			},
			box = new createjs.Shape(),
			connectionPointsOverlay = new createjs.Shape(),
			//userBubbleOverlay = new createjs.Container(),
		//	deleteButtonOverlay = new createjs.Shape(),
		//	addCreatorBubbleOverlay = new createjs.Container(),
			label = new createjs.Text(_options.title, _options.label.font, _options.label.color),
			serialize = function()
			{
				return {className: 'Document', x: _self.x, y:_self.y,_options:_options, title: _options.title, createdBy : createdBy, usedBy : usedBy, options:options};
			},
			requestRedraw = function()
			{
				var event = new createjs.Event("needRedraw");
		      	event.target = _self;
		      
		      	_self.dispatchEvent(event);
			},
			setText = function(newTitle)
			{
			
				_options.title = newTitle;
				label.text = newTitle;
				label.maxWidth = _options.box.maxWidth;

				var bounds = label.getBounds();
				setSize(bounds.width - bounds.x , bounds.height - bounds.y);

				label.lineWidth = _options.box.width - 10;
				label.x = _options.box.width / 2 ;
				label.y = _options.box.height / 2 - bounds.height/2 + _boxTopOffset ;
				
			},

			setSize = function(width, height)
			{
				_options.box.width = Math.max(_options.box.minWidth, width);
				_options.box.height = Math.max(_options.box.minHeight, height);
			},

			drawBox = function(selected)
			{
				var box = new createjs.Graphics();
				box
					.beginFill( selected ? _options.box.selectedColor : _options.box.color)
					.setStrokeStyle(3)
					.beginStroke(_options.box.border);
			
				box.drawRoundRect(0,_boxTopOffset,_options.box.width,_options.box.height , 10);

				return box;
			},
			doDragging = function(evt)
		    {
		    	var obj = evt.currentTarget;
		    	if (!_isDragging)
		    	{
		    		_dragDeltaX = evt.currentTarget.x - evt.stageX;
		    		_dragDeltaY = evt.currentTarget.y - evt.stageY;
		    	}
		        evt.currentTarget.x = evt.stageX+ _dragDeltaX;
		        evt.currentTarget.y = evt.stageY+_dragDeltaY;
		   		_isDragging = true;
		   	//	connectionPointsOverlay.visible = false;
		   		setOverlays(false);
		      	requestRedraw();


		      	// return false;
		    },
		    endDragging = function(event)
		    {
		        // do nothing..
		        _isDragging = false;
		    },

		    doConnect = function(event)
		    {
		    	var e = new createjs.Event("newConnector");
		      	e.target = _self;
		      	_self.dispatchEvent(e);
		    },


		    onMouseOut = function(event)
		    {
		    	//console.log('Artefact.onMouseOut');
		    	box.graphics = drawBox();
		    	setOverlays(false);
		    	requestRedraw();
	 		//	
		    },
		    onMouseIn = function(event)
		    {
		    //	console.log('Artefact.onMouseIn');
		    	box.graphics = drawBox(true);

		    	var obj = window.Mouse.getDragObject();
		    	if (obj.className === null )
		    	{
					setOverlays(true);
		    	}

		    	
		    	requestRedraw();
		    },
		    setOverlays = function(visible)
		    {
		    	connectionPointsOverlay.visible = visible;
			//	deleteButtonOverlay.visible = visible;
			//	addCreatorBubbleOverlay.visible = visible;
			//	userBubbleOverlay.visible = visible;
		    },
		    onDrop = function(event)
    		{
    			//console.log('Artefact.onDrop', _isDragging);
    			if (_isDragging)
    			{
    				endDragging();
    			}
    			else
    			{
    				// checking global stuff..
    				var obj = window.Mouse.getDragObject();
    				//console.log(obj);
    				if (obj.className == 'Connector')
    				{
    					var e = new createjs.Event("drop");
				      	e.originalTarget = _self;
				      	obj.dispatchEvent(e);
    				}	
    			}
    			
    			

    		},
    		doRemove = function()
    		{
    			
    			var e = new createjs.Event("remove");
			  	e.target = _self;
			    _self.dispatchEvent(e);
    			
    		},
    		 randomAbbr = function()
			{
				return 	String.fromCharCode( 65 + Math.random()*25 )+
						String.fromCharCode( 65 + Math.random()*25 )+
						String.fromCharCode( 65 + Math.random()*25 );
			},
    		randomizeBubbles = function()
    		{
    			var i;
    			createdBy = [];
    			usedBy = [];
    			for ( i=0;i<Math.random() * 5; i++)
    			{
    				createdBy.push(new Bubble(randomAbbr() ));
    			}

    			for ( i=0;i<Math.random() * 5; i++)
    			{
    				usedBy.push(new Bubble( randomAbbr()) );
    			}
    			render();
    			_self.y -= _boxTopOffset;
    			requestRedraw();

    		},
			setupEvents = function()
			{
				_self.on("pressmove", doDragging);
        		_self.on("pressup",onDrop);	
        		_self .on('mouseover', onMouseIn); 
			 	_self.on('mouseout', onMouseOut);
			 	connectionPointsOverlay.on('click',doConnect);
			// 	deleteButtonOverlay.on('click',doRemove);

			 	box.on('dblclick',function()
		 		{ 
		 			var editor = new ArtefactEditor(_self);
		 			editor.open();
		 			// var a = prompt('title? ', title); 
		 			// if (a)
		 			// {
		 				
			 		// 	setText(a); 
			 	
		 			// 	_boxTopOffset = 0;
		 			// 	render(); 
		 			// 	requestRedraw();
			 			
		 			// }
		 			
		 		});
			},
			
			getArtefactBounds = function()
			{
				return {
					x : _self.x, 
					y : _self.y + _boxTopOffset, 
					width : _options.box.width, 
					height: _options.box.height};
			},
			editCreatedBy = function(roles)
			{
		
				
				createdBy = roles;//.push(new Bubble(randomAbbr(), ''));
				render();
				_self.y -= _boxTopOffset;
				requestRedraw();
			},
			editUsedBy = function(roles)
			{
				usedBy = roles;//.push(new Bubble(randomAbbr(), ''));
				render();
				_self.y -= _boxTopOffset;
				requestRedraw();
			},
			render = function()
			{
				i = 0;
				
				_self.removeAllChildren();
				_self.y += _boxTopOffset;
				label.textAlign = 'center';

				// --------- Bubbles -------


				_boxTopOffset = Math.max(createdBy.length, usedBy.length) * _options.bubble.radius*2;
				
				setText(_options.title);
				for(i=0;i<createdBy.length;i++)
				{
					createdBy[i].x = _options.bubble.radius;
					createdBy[i].y = _boxTopOffset -2 - (i) * _options.bubble.radius*2 -  _options.bubble.radius;
					//createdBy[i].render();				
					_self.addChild(createdBy[i]);	
					
				}

				for(i=0;i<usedBy.length;i++)
				{
					usedBy[i].x = _options.box.width- _options.bubble.radius;
					usedBy[i].y = _boxTopOffset - 2 - (i) * _options.bubble.radius*2 -  _options.bubble.radius;
				//	usedBy[i].render();
					_self.addChild(usedBy[i]);	

				}

				// connection points
				var b = getArtefactBounds();
				
				connectionPointsOverlay.graphics = new createjs.Graphics();
				connectionPointsOverlay
					.graphics.beginFill('white')
					.beginStroke(_options.box.border)
					.drawCircle(0,b.height / 2+ _boxTopOffset,7)
					.endStroke()
					.beginStroke(_options.box.border)
					.drawCircle(b.width ,b.height / 2+ _boxTopOffset,7)
					.endStroke()
					.beginStroke(_options.box.border)
					.drawCircle(b.width/2 , _boxTopOffset,7)
					.endStroke()
					.beginStroke(_options.box.border)
					.drawCircle(b.width/2 , _boxTopOffset + b.height,7);
			
				// deleteButtonOverlay.graphics = new createjs.Graphics();
				// deleteButtonOverlay
				// 	.graphics.beginFill('red')
				// 	.beginStroke(_options.box.border)
				// 	.drawRect( b.width-10, _boxTopOffset,10,10)
				// 	.endStroke();

				// //-- addCreatorBubbleOverlay
				// addCreatorBubbleOverlay = new Bubble('edit', '',{bubble:{color:'white'}});
				// addCreatorBubbleOverlay.x = _options.bubble.radius;
				// addCreatorBubbleOverlay.y = _boxTopOffset - (createdBy.length*0)*2*_options.bubble.radius-2-_options.bubble.radius;
				// 	addCreatorBubbleOverlay.on('click', editCreatedBy);
				// //-- userBubbleOverlay
				// userBubbleOverlay = new Bubble('edit', '',{bubble:{color:'white'}});
				// userBubbleOverlay.x = _options.box.width- _options.bubble.radius;
				// userBubbleOverlay.y =  _boxTopOffset - (usedBy.length*0)*2*_options.bubble.radius-2-_options.bubble.radius;

				// userBubbleOverlay.on('click', editUsedBy);

				setOverlays(false);



				

			


				box.graphics = drawBox();
				
				_self.addChild(
					box, 
					label, 
					connectionPointsOverlay
					//deleteButtonOverlay
					//addCreatorBubbleOverlay,
					//userBubbleOverlay
				);
		
				
			
			};

		//randomizeBubbles();
		render();
		setupEvents();
		_self._options = _options;
		_self.setText = setText;
		_self.getArtefactBounds = getArtefactBounds;
		_self.requestRedraw = requestRedraw;
		_self.render = render;
		_self.serialize = serialize;
		_self.editCreatedBy = editCreatedBy;
		_self.editUsedBy = editUsedBy;
		_self.getCreatedBy = function(){return createdBy;};
		_self.getUsedBy = function(){return usedBy;};
		_self._boxTopOffset = _boxTopOffset;
		_self.doRemove = doRemove;
		
		
		return _self;
	};



//})(jQuery,window);