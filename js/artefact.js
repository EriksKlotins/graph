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
			menu,
			label = new createjs.Text(title, _options.label.font, _options.label.color),
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
		    	console.log('Artefact.onMouseOut');
		    	box.graphics = drawBox();
		    	menu.visible = false;
		    	requestRedraw();
	 		//	console.log('out');
		    },
		    onMouseIn = function(event)
		    {
		    	console.log('Artefact.onMouseIn');
		    	box.graphics = drawBox(true);
		    	menu.visible = true;
		    	requestRedraw();
		    },

		    onDrop = function(event)
    		{
    			console.log('Artefact.onDrop', _isDragging);
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
        		menu.on('needRedraw',requestRedraw);
        		_self.addEventListener('mouseover', onMouseIn); 
			 	_self.addEventListener('mouseout', onMouseOut);
			},
			
			

			getConnectionPoint = function(otherEntity)
			{
				var 
					boxCenterX = _self.x + _options.box.width/2,
					boxCenterY = _self.y+_boxTopOffset + _options.box.height/2,
					line1 = {x0:0, y0:0, x1:0, y1:0},
					padding = 5;

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
						var side;
						// //top
						if ( (deg > 270-  (90-dalpha))&& (deg < 270+  (90-dalpha)))
						{
							//if (_isDragging) console.log('top', 90-dalpha);
							side = 'top';
							line1 = 
							{
								x0: _self.x, 
								y0: _self.y + _boxTopOffset + _options.box.height+ padding, 
								x1:  _self.x+ _options.box.width,
								y1: _self.y + _boxTopOffset + _options.box.height + padding
							};
						} 

						//bottom
						if (deg > 90-  (90-dalpha) && deg <= 90 +  (90-dalpha))
						{
							side = 'bottom';
							line1 = 
							{
								x0: _self.x, 
								y0: _self.y + _boxTopOffset - padding, 
								x1:  _self.x+ _options.box.width,
								y1: _self.y + _boxTopOffset - padding
							};
							//if (_isDragging) console.log('bottom',deg > 90-  (90-dalpha) , deg < 90 +  (90-dalpha),line1);
							
						} 
						// left
						if (deg > 180 - dalpha && deg <= 180 + dalpha)
						{
							side = 'left';
							//if (_isDragging) console.log('left');
							line1 = 
							{
								x0: _self.x + _options.box.width + padding, 
								y0: _self.y + _boxTopOffset , 
								x1:  _self.x+ _options.box.width + padding,
								y1: _self.y + _boxTopOffset +  _options.box.height 
							};	
						}
						// right
						if (deg > 360 - dalpha || deg <= dalpha)
						{
							//if (_isDragging) console.log('right');
							side = 'right';
							line1 = 
							{
								x0: _self.x - padding, 
								y0: _self.y + _boxTopOffset , 
								x1:  _self.x - padding,
								y1: _self.y + _boxTopOffset +  _options.box.height 
							};
						} 
					
							// var line2 = 
							// {
							// 	x0: boxCenterX,
							// 	y0: boxCenterY,
							// 	x1: o.x,
							// 	y1: o.y 
							// };
							// var 
							// 	x1 = line1.x0, y1 = line1.y0, x2 = line1.x1, y2 = line1.y1,
							// 	x3 = line2.x0, y3 = line2.y0, x4 = line2.x1, y4 = line2.y1,
							//  	newX = ((x1*y2 - y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)),
							//  	newY = ((x1*y2 - y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
							//return {x:newX, y:newY, alpha:alpha};
						var result = null;


						if (Math.abs(dx) < Math.abs(dy))
						{
							if (boxCenterY > o.y)
							{
						//	case 'bottom':
								result = {x: boxCenterX, y: boxCenterY - _options.box.height/2, alpha : Math.PI / 2 };
						//	break;
							}
							else
							{
						//	case 'top':
								result = {x: boxCenterX, y: boxCenterY + _options.box.height/2, alpha : Math.PI*2 / 4*3 };
						//	break;
							}
						}
						else
						{
							if (boxCenterX> o.x)
							{
						//	case 'right':
								result = {x: boxCenterX- _options.box.width/2, y: boxCenterY , alpha : 0};
						//	break;
							}
							else
							{
						//	case 'left':
								result = {x: boxCenterX+ _options.box.width/2, y: boxCenterY, alpha : Math.PI };
						//	break;
							}
						}
						
						
						return result;

						
					
				}
				
				return  {x:boxCenterX, y:boxCenterY};
			},



			render = function()
			{
				i = 0;
				
				_self.removeAllChildren();
				_self.y += _boxTopOffset;
				_boxTopOffset = 0;
				// --------- Bubbles -------

				createdBy.unshift(new Bubble('+'));
				usedBy.unshift(new Bubble('+'));
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

				// -------- bubbles -------
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
				// --------- MENU ----------
				menu = new Menu({items:[
						{title:'Edit', action: function(){ var a = prompt('title? '); setText(a); render(); requestRedraw();} } ,
						{title:'Connect', action: doConnect},
						{title:'Bubbles', action: randomizeBubbles } ]});
				
				menu.x =  0;//_options.box.width;
				menu.y =  _boxTopOffset;
				menu.visible = false;


				// label
				label.textAlign = 'center';
				setText(title);

			


				box.graphics = drawBox();
				_self._options = _options;
				_self.setText = setText;
				_self.getConnectionPoint = getConnectionPoint;
				_self.requestRedraw = requestRedraw;
				_self.title = title;
				_self.addChild(box);
				_self.addChild(label);
				_self.addChild(menu);
				
			
			};

		render();
		setupEvents();
		return _self;
	};



//})(jQuery,window);