

var Bubble = function(abbr, title, options)
{
	var 
		_self = new createjs.Container(),
		_options = {
			label:{
					font: '10px arial', 
					color: 'black'
				},
			bubble:
			{
				color: '#fcd905',
				borderColor:'white',
				borderWidth: 3,
				radius : 15
			}
		},
		render = function()
		{
			var bubble = new createjs.Shape();
			bubble.graphics.beginFill(_options.bubble.color).setStrokeStyle(_options.bubble.borderWidth).beginStroke(_options.bubble.borderColor);
			bubble.graphics.drawCircle(0, 0, _options.bubble.radius);
			
			var label = new createjs.Text(abbr, _options.label.font, _options.label.color);
			label.textAlign = 'center';
		
			label.x = 0;
			label.y = -5;
			_self.addChild(bubble);
			_self.addChild(label);
		};

	render();
	_self.options = _options;
	return _self;
};