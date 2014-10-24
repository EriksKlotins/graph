


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

		getAngleBetweenPoints = function(p0, A, B)
		{
			
			var h = Math.sqrt(A*A + B*B), alpha = Math.asin( B/ h);
			if (A < 0 && B > 0) 	alpha = Math.PI - alpha;
			if (A <= 0 && B<= 0) 	alpha = Math.PI - alpha;
			if (A > 0 && B < 0) 	alpha = Math.PI*2 + alpha;

			return  Math.PI/2 - alpha + Math.PI;
		},
		line = function(selected)
		{
			var g = new createjs.Graphics(),
			 	a = from.getConnectionPoint(to),
			 	b = to.getConnectionPoint(from),
				d = Math.PI/10;
			g.moveTo(a.x,a.y);
	      	g.setStrokeStyle( selected ? _options.selectedWidth :  _options.width);
	        g.beginStroke( selected ? _options.selectedColor :  _options.color);
	       	
	        // gettings mindpoints..
	        var deltaX = (b. x - a.x);
	        var deltaY = (b.y - a.y);

	        var qX = deltaX/4 * ((Math.abs(deltaX) > Math.abs(deltaY)) ?  1 : -1);
	        var qY = deltaY/4 * ((Math.abs(deltaX) < Math.abs(deltaY)) ?   -1 : 1);


	        var p1 = {
	        	x : a.x + deltaX/4 + qX,
	        	y : a.y + deltaY/4 - qY
	        };
	        var p2 = {
	        	x : b.x - deltaX/4 - qX,
	        	y : b.y - deltaY/4 + qY
	        };

	       	g.bezierCurveTo(p1.x,p1.y , p2.x,p2.y,b.x,b.y);

	       	// alphas
	       	a.alpha = getAngleBetweenPoints(a, deltaX/4 + qX,  deltaY/4 - qY);
	       	b.alpha = getAngleBetweenPoints(b, - deltaX/4 - qX,- deltaY/4 + qY );

				        
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
		setupEvents = function()
		{
			if (from.on) from.on('needRedraw', updateLine);
			if (to.on) to.on('needRedraw', updateLine);
			// _self.on('mouseover', function() {
			// 	_self.set({graphics:line(true)});
			// });	
			// _self.on('mouseout', function() {
			// 	_self.set({graphics:line(false)});
			// });	
			// _self.on('click', function(){ console.log('click', _self);});
		};
		render();
		setupEvents();

		_self.update = updateLine;
		_self.className = 'Connector';
		return _self;
};