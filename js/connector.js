


var Connector = function(from, to)
{

	var
		_self = new createjs.Shape(),
		_options = 
		{
			color: '#90837a',
			selectedColor : '#1c376c',
			width: 2, 
			selectedWidth : 3,
			startArrow: 
			{
				size:10,
				angle:Math.PI/10
			},
			endArrow: 
			{
				size:10,
				angle:Math.PI/10
			}
		},
		serialize = function()
		{
			return null;
		},
		getAngleBetweenPoints = function(p0, A, B)
		{
			
			var h = Math.sqrt(A*A + B*B), alpha = Math.asin( B/ h);
			if (A < 0 && B > 0) 	alpha = Math.PI - alpha;
			if (A <= 0 && B<= 0) 	alpha = Math.PI - alpha;
			if (A > 0 && B < 0) 	alpha = Math.PI*2 + alpha;

			return  Math.PI/2 - alpha + Math.PI;
		},
		getMidpoint = function(bounds)
		{
			return {x : bounds.x + bounds.width / 2, y:bounds.y + bounds.height / 2};
		},
		calculateConnectionPoint =  function(from, to )
		{
			var fromBounds = from.getArtefactBounds();
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


					if (Math.abs(dx) < Math.abs(dy))
					{
						if (e.y > o.y)
						{
					//	case 'bottom':
							result = {x: e.x, y: e.y - fromBounds.height/2, side:'bottom' };
						}
						else
						{
					//	case 'top':
							result = {x: e.x, y: e.y + fromBounds.height/2 , side:'top' };
						}
					}
					else
					{
						if (e.x> o.x)
						{
					//	case 'right':
							result = {x: e.x- fromBounds.width/2, y: e.y, side:'right'  };
						}
						else
						{
					//	case 'left':
							result = {x: e.x+  fromBounds.width/2, y: e.y , side:'left' };
						}
					}
					return result;

			}
			else
			{
				// if nothing is known, return midpoint
				return getMidpoint(fromBounds);
			}
			





			
		},
		line = function(selected)
		{
			var g = new createjs.Graphics(),
			 	a = calculateConnectionPoint(from, to),
			 	b = calculateConnectionPoint(to,from),// to.getConnectionPoint(from),
				d = Math.PI/10, qX = 0, qY = 0;
			
			g.moveTo(a.x,a.y);
	      	g.setStrokeStyle( selected ? _options.selectedWidth :  _options.width);
	        g.beginStroke( selected ? _options.selectedColor :  _options.color);
	       	
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
	        	x : a.x + deltaX/4 + qX,
	        	y : a.y + deltaY/4 + qY
	        };
	        

	        var p2 = {
	        	x : b.x - deltaX/4 - qX,
	        	y : b.y - deltaY/4 - qY
	        };

	       	g.bezierCurveTo(p1.x,p1.y , p2.x,p2.y,b.x,b.y);

	       	// alphas
	       	a.alpha = getAngleBetweenPoints(a, deltaX/4 + qX,  deltaY/4 + qY);
	       	b.alpha = getAngleBetweenPoints(b, - deltaX/4 - qX,- deltaY/4 - qY );

				        
	        //g.lineTo(b.x,b.y);
	        //g.setStrokeStyle(_options.width / 2);
			if (!!_options.endArrow)
			{

				g.moveTo(b.x,b.y);
		        g.lineTo(b.x+ Math.sin( a.alpha + _options.endArrow.angle) * _options.endArrow.size, b.y+Math.cos(  a.alpha+_options.endArrow.angle) * _options.endArrow.size);
		        g.moveTo(b.x,b.y);
		       	g.lineTo(b.x+ Math.sin( a.alpha - _options.endArrow.angle) * _options.endArrow.size, b.y+Math.cos( a.alpha-_options.endArrow.angle) * _options.endArrow.size);
		        
			}
			if (!!_options.startArrow)
			{
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
		updateLine = function(event)
		{
			render();
			
		},
		doRemove = function()
		{
			var e = new createjs.Event("remove");
	      	e.target = _self;
	      	_self.dispatchEvent(e);
		},
		requestRedraw = function()
		{
			var event = new createjs.Event("needRedraw");
	      	event.target = _self;
	      	_self.dispatchEvent(event);
		},
		setupEvents = function()
		{
			if (from.on)
			{
				from.on('needRedraw', updateLine);
				from.on('remove', doRemove);
			}
			if (to.on)
			{
				to.on('needRedraw', updateLine);
				to.on('remove', doRemove);
			} 
			_self.on('mouseover', function() 
			{
				console.log('con:mouseover');
				_self.set({graphics:line(true)});
				requestRedraw();
			});	
			_self.on('mouseout', function() 
			{
				_self.set({graphics:line(false)});
				requestRedraw();
			});	
			_self.on('click', function(){ console.log('click', _self);});
		};
		render();
		setupEvents();

		_self.update = updateLine;
		_self.className = 'Connector';
		return _self;
};








