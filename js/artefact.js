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
					font: '12px arial', 
					color: 'black'
				}, 
				box: 
				{
					color: 'pink', 
					width: 100, 
					height: 60
				},
				menu:
				[
					{title : 'Bomba'},
					{title : 'Connect'}

				]
			},
			box = new createjs.Shape(),
			menu = new createjs.Container(),
			label = new createjs.Text(title, _options.label.font, _options.label.color),
			requestRedraw = function()
			{
				var event = new createjs.Event("needRedraw");
		      	event.target = _self;
		      
		      	_self.dispatchEvent(event);
			},
			setText = function(title)
			{
				label.text = title;
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

		      	requestRedraw();


		      	// return false;
		    },
		    endDragging = function(event)
		    {
		        // do nothing..
		        _isDragging = false;
		    },
		    onMouseOut = function(event)
		    {
		    	box.graphics = new createjs.Graphics();
		    	box.graphics.beginFill(_options.box.color);
				box.graphics.drawRoundRect(0,_boxTopOffset,_options.box.width,_options.box.height , 5);
		    	requestRedraw();
	 			console.log('out');
		    },
		    onMouseIn = function(event)
		    {
		    	box.graphics = new createjs.Graphics();
		    	box.graphics.beginFill('red');
				box.graphics.drawRoundRect(0,_boxTopOffset,_options.box.width,_options.box.height , 5);
		    	 console.log('in');
		    	 requestRedraw();
		    },
			setupEvents = function()
			{
				_self.on("pressmove", doDragging);
        		_self.on("pressup",endDragging);
        		_self.addEventListener('mouseover', onMouseIn); //function(e){}
			 	_self.addEventListener('mouseout', onMouseOut);//
			},
			getConnectionPoint = function(otherEntity)
			{
				var 
					boxCenterX = _self.x + _options.box.width/2,
					boxCenterY = _self.y+_boxTopOffset + _options.box.height/2,
					line1 = {x0:0, y0:0, x1:0, y1:0};

				if (!!otherEntity)
				{
						var o = otherEntity.getConnectionPoint(null);
						var dx =boxCenterX - o.x;
						var dy = boxCenterY- o.y;
						var h = Math.sqrt(dx*dx + dy*dy );
						var alpha = Math.asin( dy/h); // 
						// get the angles right

						if (dx < 0 && dy > 0) 	alpha = Math.PI - alpha;
						if (dx <= 0 && dy<= 0) 	alpha = Math.PI - alpha;
						if (dx > 0 && dy < 0) 	alpha = Math.PI*2 + alpha;

						var deg = alpha/Math.PI * 180;

						// getting angle between  diognals

						var hip = Math.sqrt(Math.pow(_options.box.width/2,2) + Math.pow(_options.box.height/2,2));
						var dalpha = Math.asin(_options.box.height/2/hip)/Math.PI * 180 ;
						
						// //top
						if ( (deg > 270-  (90-dalpha))&& (deg < 270+  (90-dalpha)))
						{
							//if (_isDragging) console.log('top', 90-dalpha);
							line1 = 
							{
								x0: _self.x, 
								y0: _self.y + _boxTopOffset + _options.box.height, 
								x1:  _self.x+ _options.box.width,
								y1: _self.y + _boxTopOffset + _options.box.height
							};
						} 


						//bottom
						if (deg > 90-  (90-dalpha) && deg <= 90 +  (90-dalpha))
						{
							line1 = 
							{
								x0: _self.x, 
								y0: _self.y + _boxTopOffset , 
								x1:  _self.x+ _options.box.width,
								y1: _self.y + _boxTopOffset 
							};
							//if (_isDragging) console.log('bottom',deg > 90-  (90-dalpha) , deg < 90 +  (90-dalpha),line1);
							
						} 
						// left
						if (deg > 180 - dalpha && deg <= 180 + dalpha)
						{
							//if (_isDragging) console.log('left');
							line1 = 
							{
								x0: _self.x + _options.box.width, 
								y0: _self.y + _boxTopOffset , 
								x1:  _self.x+ _options.box.width,
								y1: _self.y + _boxTopOffset +  _options.box.height 
							};	
						}
						// right
						if (deg > 360 - dalpha || deg <= dalpha)
						{
							//if (_isDragging) console.log('right');
							line1 = 
							{
								x0: _self.x, 
								y0: _self.y + _boxTopOffset , 
								x1:  _self.x,
								y1: _self.y + _boxTopOffset +  _options.box.height 
							};
						} 
					
						var line2 = 
						{
							x0: boxCenterX,
							y0: boxCenterY,
							x1: o.x,
							y1: o.y 
						};
						var 
							x1 = line1.x0, y1 = line1.y0, x2 = line1.x1, y2 = line1.y1,
							x3 = line2.x0, y3 = line2.y0, x4 = line2.x1, y4 = line2.y1,
						 	newX = ((x1*y2 - y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)),
						 	newY = ((x1*y2 - y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
					
						return {x:newX, y:newY, alpha:alpha};
				}
				
				return  {x:boxCenterX, y:boxCenterY};
			},
			render = function()
			{
				i = 0;
				

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

				// bubbles
				for( i=0;i<createdBy.length;i++)
				{
					if (createdBy[i])
					{
						createdBy[i].x = createdBy[i].options.bubble.radius;
						createdBy[i].y = createdBy[i].options.bubble.radius*2*(i)+createdBy[i].options.bubble.radius;
						_self.addChild(createdBy[i]);
						_boxTopOffset = Math.max(_boxTopOffset, createdBy[i].y + createdBy[i].options.bubble.radius);

					}
					if (usedBy[i])
					{
						usedBy[i].x = _options.box.width- usedBy[i].options.bubble.radius;
						usedBy[i].y = usedBy[i].options.bubble.radius*2*(i)+usedBy[i].options.bubble.radius;
						_self.addChild(usedBy[i]);
						_boxTopOffset = Math.max(_boxTopOffset, usedBy[i].y + usedBy[i].options.bubble.radius);
					}	
				}
				// --------- MENU ----------
				for(i=0;i<_options.menu.length;i++)
				{
					var butt = new createjs.Shape();

					var item = new createjs.Text(_options.menu[i].title, "12px arial", 'black');
					
					butt.graphics.
					item.x = _options.box.width;
					item.y = i * 20 + _boxTopOffset;
					item.addEventListener('click', function(e) {console.log(e);});
					menu.addChild(item);
				}

				// label
				label.textAlign = 'center';
				label.lineWidth = _options.box.width - 10;
				label.x = _options.box.width / 2 ;
				label.y = 5 + _boxTopOffset;
				// box 
				box.graphics.beginFill(_options.box.color);
				box.graphics.drawRoundRect(0,_boxTopOffset,_options.box.width,_options.box.height , 5);
				_self._options = _options;
				_self.setText = setText;
				_self.getConnectionPoint = getConnectionPoint;
				_self.addChild(box);
				_self.addChild(label);
				_self.addChild(menu);
			
			};

		render();
		setupEvents();
		return _self;
	};



//})(jQuery,window);