//;(function($,window){

	/**
     *	Describes artefact item
	 *	@title
	 *	@createdBy
	 *	@usedBy
	 */
	var Artefact = function(title, createdBy, usedBy, options)
	{
		var 
			_self = new createjs.Container(), 
			_isDragging = false,
			_dragDeltaX = 0,
			_dragDeltaY = 0,
			_boxTopOffset = 0,
			_options = {
				label:{
					font: '16px arial', 
					color: '#1e376d'
				}, 
				box: 
				{
					color: '#fcd905', 
					selectedColor : '#e17f26',
					border: '#1e376d',
					width: 100, 
					height: 60,
					minWidth : 100,
					minHeight : 60
				}
			},
			box = new createjs.Shape(),
			connectionPointsOverlay = new createjs.Shape(),
			deleteButtonOverlay = new createjs.Shape(),
			label = new createjs.Text(title, _options.label.font, _options.label.color),
			serialize = function()
			{
				return {className: 'Document', x: _self.x, y:_self.y,_options:_options, title: title, createdBy : createdBy, usedBy : usedBy, options:options};
			},
			requestRedraw = function()
			{
				var event = new createjs.Event("needRedraw");
		      	event.target = _self;
		      
		      	_self.dispatchEvent(event);
			},
			setText = function(newTitle)
			{
				title = newTitle;
				label.text = newTitle;
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
		   		connectionPointsOverlay.visible = false;
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
		    	connectionPointsOverlay.visible = false;
		    	deleteButtonOverlay.visible = false;
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
					connectionPointsOverlay.visible = true;
					deleteButtonOverlay.visible = true;
		    	}

		    	
		    	requestRedraw();
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
    			if (confirm('Really delete "'+title+'"?'))
    			{
    				var e = new createjs.Event("remove");
			      	e.target = _self;
			      	_self.dispatchEvent(e);
    			}
    		},
    		randomizeBubbles = function()
    		{
    			var randomAbbr = function()
    			{
    				return 	String.fromCharCode( 65 + Math.random()*25 )+
    						String.fromCharCode( 65 + Math.random()*25 )+
    						String.fromCharCode( 65 + Math.random()*25 );
    			}, i;
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
			 	deleteButtonOverlay.on('click',doRemove);
				
			 	box.on('dblclick',function()
		 		{ 
		 			var a = prompt('title? ', title); 
		 			if (a)
		 			{
		 				
			 			setText(a); 
			 	
		 				_boxTopOffset = 0;
		 				render(); 
		 				requestRedraw();
			 			
		 			}
		 			
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



			render = function()
			{
				i = 0;
				
				_self.removeAllChildren();
				_self.y += _boxTopOffset;
				_boxTopOffset = 0;
				// --------- Bubbles -------

				
				while (createdBy.length != usedBy.length)
				{
					if (createdBy.length < usedBy.length)
					{
						createdBy.unshift(null);
					}
					else
					{
						usedBy.unshift(null);
					}
				}

				for( i=0;i<createdBy.length;i++)
				{
					if (createdBy[i])
					{
						createdBy[i].x = createdBy[i].options.bubble.radius;
						createdBy[i].y = (createdBy[i].options.bubble.radius+createdBy[i].options.bubble.borderWidth)*2*(i)+createdBy[i].options.bubble.radius;
						_self.addChild(createdBy[i]);
						_boxTopOffset = Math.max(_boxTopOffset, createdBy[i].y + createdBy[i].options.bubble.radius+createdBy[i].options.bubble.borderWidth);

					}
					if (usedBy[i])
					{
						usedBy[i].x = _options.box.width- usedBy[i].options.bubble.radius;
						usedBy[i].y = (usedBy[i].options.bubble.radius+usedBy[i].options.bubble.borderWidth)*2*(i)+usedBy[i].options.bubble.radius;
						_self.addChild(usedBy[i]);
						_boxTopOffset = Math.max(_boxTopOffset, usedBy[i].y + usedBy[i].options.bubble.radius+usedBy[i].options.bubble.borderWidth);
					}	
				}

				// -------------------------
				// connection points
				var b = getArtefactBounds();
				
				connectionPointsOverlay.graphics = new createjs.Graphics();
				connectionPointsOverlay
					.graphics.beginFill('white')
					.beginStroke(_options.box.border)
					.drawCircle(0,b.height / 2+ _boxTopOffset,10)
					.endStroke()
					.beginStroke(_options.box.border)
					.drawCircle(b.width ,b.height / 2+ _boxTopOffset,10)
					.endStroke()
					.beginStroke(_options.box.border)
					.drawCircle(b.width/2 , _boxTopOffset,10)
					.endStroke()
					.beginStroke(_options.box.border)
					.drawCircle(b.width/2 , _boxTopOffset + b.height,10);
			
				deleteButtonOverlay.graphics = new createjs.Graphics();
				deleteButtonOverlay
					.graphics.beginFill('red')
					.beginStroke(_options.box.border)
					.drawRect( b.width-10, _boxTopOffset,10,10)
					.endStroke();

				connectionPointsOverlay.visible = false;
				deleteButtonOverlay.visible = false;


				// label
				label.textAlign = 'center';
				setText(title);

			


				box.graphics = drawBox();
				
				_self.title = title;
				 _self.addChild(box);
				 _self.addChild(label);
				// _self.addChild(menu);
				_self.addChild(connectionPointsOverlay);
				_self.addChild(deleteButtonOverlay);
			
			};

		randomizeBubbles();
		render();
		setupEvents();
		_self._options = _options;
		_self.setText = setText;
		_self.getArtefactBounds = getArtefactBounds;
		_self.requestRedraw = requestRedraw;
		_self.serialize = serialize;
		
		return _self;
	};



//})(jQuery,window);