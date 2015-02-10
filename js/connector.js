

/**
 * Draws a nice line between two connection points
 */

var Connector = function(from, to, options)
{

	var
		_self = new createjs.Shape(),
		_endPoints = { from: null, to:null },
		_options = 
		{
			color: 'green',// '#90837a',
			style : 'solid',
			selectedColor : '#1c376c',
			width: 2, 
			selectedWidth : 3,

			startArrow: 
			{
				visible:true,
				size:10,
				angle:Math.PI/10
			},
			endArrow: 
			{
				visible:true,
				size:10,
				angle:Math.PI/10
			},
			assets :
			{
				line1: {image: null, url:'img/line1.png'},
				line2: {image: null, url:'img/line2.png'}
	 		}
		},
		toRemoveEvent = null,
		toNeedRedrawEvent = null,
		fromRemoveEvent = null,
		fromNeedRedrawEvent = null,
		selfMouseOverEvent = null,
		selfMouseOutEvent = null,
		selfDblClickEvent = null,
		serialize = function()
		{
			return null;
		},

		preloadAssets = function (callback)
		{
			var n = 0;
			var onImgLoaded = function()
			{
				n--;
				if (n===0)
				{
					//console.log('Viss ielādēts');
					if (callback) callback();
				}
			};
			for(var asset in _options.assets)
			{
				n = n+1;
				var img = new Image();
				img.onload = onImgLoaded;
				img.src = _options.assets[asset].url;

				_options.assets[asset].image = img;
			}
		},
		getAngleBetweenPoints = function(p0, A, B)
		{
			
			var h = Math.sqrt(A*A + B*B), alpha = Math.asin( B/ h);
			if (A < 0 && B > 0) 	alpha = Math.PI - alpha;
			if (A <= 0 && B<= 0) 	alpha = Math.PI - alpha;
			if (A > 0 && B < 0) 	alpha = Math.PI*2 + alpha;

			return   Math.PI/2- alpha  ;
		},
	
		
		line = function(selected)
		{

			console.log('Connector.line');
			var g = new createjs.Graphics(),
			 	a = calculateConnectionPoint(from,to),
			 	b = calculateConnectionPoint(to,from),// to.getConnectionPoint(from),
				d = Math.PI/10, qX = 0, qY = 0;
			

		 	console.log('from', a.side);
	  	   g.setStrokeStyle( selected ? _options.selectedWidth :  _options.width);
	       if (selected)
	       {
	       	 	g.beginStroke(_options.selectedColor );
	       }
	       else
	       {
	 			if (_options.style == 'solid')
	 			{
	 				g.beginStroke(_options.color );
	 			}
	 			else
	 			{
	 				
	 				g.beginBitmapStroke(_options.assets[_options.style].image, 'repeat');
	 			}
	       		
	       }
	       


	    


	        // gettings mindpoints..
	        var deltaX = (b. x - a.x);
	        var deltaY = (b.y - a.y);


	        if ([ 'top', 'bottom'].indexOf(a.side)>=0)
	        {
	        	qX = -deltaX/4;
	        	qY = +deltaY/4;
	        }
	        else
	        {
				qX = +deltaX/4;
	        	qY = -deltaY/4;
	        }
	      

	        var p1 = {
	        	x : a.x + deltaX/4 + qX,// * 0.5* (_order+1),
	        	y : a.y + deltaY/4 + qY// * 0.5*(1+_order)
	        };
	        

	        var p2 = {
	        	x : b.x - deltaX/4 - qX,// * 0.5*(1+_order),
	        	y : b.y - deltaY/4 - qY// * 0.5*(1+_order)
	        };
	       //  g.moveTo(a.x,a.y).lineTo(p1.x, p1.y);
	        // g.moveTo(b.x,b.y).lineTo(p2.x, p2.y);


	    //     g.;
	       	g.moveTo(a.x,a.y).bezierCurveTo(p1.x,p1.y , p2.x,p2.y,b.x,b.y);

	       	// alphas
	     //  	a.alpha = getAngleBetweenPoints(a, ;
	     	a.alpha = getAngleBetweenPoints(a, -qX - deltaX/3,-qY - deltaY/3);
	       	b.alpha = getAngleBetweenPoints(b, qX + deltaX/3,qY + deltaY/3);

	       	console.log(  qX, qY );
	        //g.lineTo(b.x,b.y);
	        //g.setStrokeStyle(_options.width / 2);
			if (!!_options.endArrow.visible)
			{
				g.setStrokeStyle( selected ? _options.selectedWidth :  _options.width);
	       	 	g.beginStroke( selected ? _options.selectedColor :  _options.color);
				g.moveTo(b.x,b.y);
		        g.lineTo(b.x+ Math.sin( a.alpha + _options.endArrow.angle) * _options.endArrow.size, b.y+Math.cos(  a.alpha+_options.endArrow.angle) * _options.endArrow.size);
		        g.moveTo(b.x,b.y);
		       	g.lineTo(b.x+ Math.sin( a.alpha - _options.endArrow.angle) * _options.endArrow.size, b.y+Math.cos( a.alpha-_options.endArrow.angle) * _options.endArrow.size);
		        
			}
			if (!!_options.startArrow.visible)
			{
				g.setStrokeStyle( selected ? _options.selectedWidth :  _options.width);
	       	 	g.beginStroke( selected ? _options.selectedColor :  _options.color);
				g.moveTo(a.x,a.y);
		        g.lineTo(a.x+ Math.sin( b.alpha + _options.startArrow.angle) * _options.startArrow.size, a.y+Math.cos(  b.alpha+_options.startArrow.angle) * _options.startArrow.size);
		        g.moveTo(a.x,a.y);
		       	g.lineTo(a.x+ Math.sin(b.alpha - _options.startArrow.angle) * _options.startArrow.size, a.y+Math.cos(  b.alpha-_options.startArrow.angle) * _options.startArrow.size);
	       	}

	        return g;
		},
		render = function()
		{ 
			_self.set({graphics:line()});
		},
		
		doRemove = function()
		{
			

			var e = new createjs.Event("remove");
	      	e.target = _self;
	      	_self.dispatchEvent(e);
	      	_removed = true;
	      	if (from.off)
			{
				console.log('Connector.doRemove');
				from.off('needRedraw', fromNeedRedrawEvent);
				from.off('remove', fromRemoveEvent);
			//	from.on('drop', checkMultipleConnectors);
			}
			if (to.on)
			{
				to.off('needRedraw', toNeedRedrawEvent);
				to.off('remove', toRemoveEvent);
				//to.on('drop', checkMultipleConnectors);
			} 
			_self.off('mouseover', selfMouseOverEvent);
			_self.off('mouseout', selfMouseOutEvent);
			_self.off('dblclick', selfDblClickEvent);


			from.removeConnection(_self.id);
			to.removeConnection(_self.id);
			
		},
		requestRedraw = function()
		{
			
			var event = new createjs.Event("needRedraw");
	      	event.target = _self;
	      	_self.dispatchEvent(event);
		

		},

		
		getMidpoint = function(bounds)
		{
			return {x : bounds.x + bounds.width / 2, y:bounds.y + bounds.height / 2};
		},
		
		calculateConnectionPoint =  function(from, to )
			{
				var 
					fromBounds = from.getArtefactBounds();
				if (!!to)
				{
					// lets see where the other object is..
					var 
						toBounds = to.getArtefactBounds(),
						o = getMidpoint(toBounds),
						e = getMidpoint(fromBounds),
						dx = e.x - o.x,
						dy = e.y- o.y,
						h = Math.sqrt(dx*dx + dy*dy ),
						result = null;
						// --------
						if (Math.abs(dx) < Math.abs(dy))
						{
							if (e.y > o.y)
							{	
								result = {x: e.x , y: e.y - fromBounds.height/2, side:'top' };
							}
							else
							{
								result = {x: e.x , y: e.y + fromBounds.height/2 , side:'bottom' };
							}
						}
						else
						{
							if (e.x> o.x)
							{
								result = {x: e.x - fromBounds.width/2, y: e.y, side:'left'  };
							}
							else
							{
								result = {x: e.x + fromBounds.width/2, y: e.y , side:'right' };
							}
						}

						from.registerConnection( _self.id,result.side, to);
						var c = from.getConnectorOrder(_self.id, result.side);
						var offset = 0;

						if (['top', 'bottom'].indexOf(result.side)>= 0)
						{
							//result.x += 10*(c.order-1);
							result.x = fromBounds.x+ fromBounds.width / (c.count+1) * c.order;
							
						}
						else
						{
							//result.y += 10*(c.order-1);
							result.y = fromBounds.y + fromBounds.height / (c.count+1) * c.order;
						}

						console.log('I am the',c);

						return result;

				}
				else
				{
					// if nothing is known, return midpoint
					return getMidpoint(fromBounds);
				}

			},
		setStyle = function( color, style)
		{
			_options.style = style;
			_options.color =  color;

		},
		setArrows = function(arrows)
		{
			if (arrows == 'from_to')
			{
				_options.startArrow.visible = false;
				_options.endArrow.visible = true;
				
			}
			if (arrows == 'to_from')
			{
				
				_options.startArrow.visible = true;
				_options.endArrow.visible = false;
			}
			if (arrows == 'both')
			{
				_options.startArrow.visible = true;
				_options.endArrow.visible = true;
			}

		},
		setupEvents = function()
		{
			if (from.on)
			{
				fromNeedRedrawEvent = from.on('needRedraw',render);
				fromRemoveEvent = from.on('remove', doRemove);
			//	from.on('drop', checkMultipleConnectors);
			}
			if (to.on)
			{
				toNeedRedrawEvent = to.on('needRedraw', render);
				toRemoveEvent = to.on('remove', doRemove);
				//to.on('drop', checkMultipleConnectors);
			} 
			selfMouseOverEvent = _self.on('mouseover', function() 
			{
				console.log('connector.mouseover');
				_self.set({graphics:line(true)});
				requestRedraw();
			});	
			selfMouseOutEvent = _self.on('mouseout', function() 
			{
				console.log('connector.mouseout');
				_self.set({graphics:line(false)});
				requestRedraw();
			});	
			selfDblClickEvent = _self.on('dblclick', function()
			{ 

		 			var editor = new ConnectorEditor(_self);
		 			editor.open();
		 	});
		};

		_options = $.extend(true, _options, options );
		_options.color =  from._options.box.color; //default color = from box color
		preloadAssets();
		render();
		setupEvents();

		


		_self.setStyle = setStyle;
		_self.requestRedraw = requestRedraw;
		_self.options = _options;
		_self.doRemove = doRemove;
		_self.className = 'Connector';
		_self.from = from;
		_self.to = to;
		_self.render = render;
		_self.setArrows = setArrows;
		_self.calculateConnectionPoint = calculateConnectionPoint;
		return _self;
};








