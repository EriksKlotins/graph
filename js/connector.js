


var Connector = function(from, to)
{
	var
		_self = new createjs.Shape(),
		_options = 
		{
			color: 'gray',
			width: 2, 
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
		line = function()
		{
			var g = new createjs.Graphics(),
			 	a = from.getConnectionPoint(to),
			 	b = to.getConnectionPoint(from),
				d = Math.PI/10;
			g.moveTo(a.x,a.y);
	        g.setStrokeStyle(_options.width);
	        g.beginStroke(_options.color);
	       	//g.bezierCurveTo(a.x + (a.x - b.x)/2 +50,a.y, a.x + (a.x - b.x)/2 -50,b.y,b.x,b.y);
	        g.lineTo(b.x,b.y);
			if (!!_options.endArrow)
			{
				g.moveTo(b.x,b.y);
		        g.lineTo(b.x+ Math.sin( Math.PI/2 - a.alpha + _options.endArrow.angle) * _options.endArrow.size, b.y+Math.cos(  Math.PI/2- a.alpha+_options.endArrow.angle) * _options.endArrow.size);
		        g.moveTo(b.x,b.y);
		       	g.lineTo(b.x+ Math.sin( Math.PI/2 - a.alpha - _options.endArrow.angle) * _options.endArrow.size, b.y+Math.cos(  Math.PI/2- a.alpha-_options.endArrow.angle) * _options.endArrow.size);
		        
			}
			if (!!_options.startArrow)
			{
				g.moveTo(a.x,a.y);
		        g.lineTo(a.x+ Math.sin( Math.PI/2 - b.alpha + _options.startArrow.angle) * _options.startArrow.size, a.y+Math.cos(  Math.PI/2- b.alpha+_options.startArrow.angle) * _options.startArrow.size);
		        g.moveTo(a.x,a.y);
		       	g.lineTo(a.x+ Math.sin( Math.PI/2 - b.alpha - _options.startArrow.angle) * _options.startArrow.size, a.y+Math.cos(  Math.PI/2- b.alpha-_options.startArrow.angle) * _options.startArrow.size);
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
			from.on('needRedraw', updateLine);
			to.on('needRedraw', updateLine);
		};
		render();
		setupEvents();
		return _self;
};