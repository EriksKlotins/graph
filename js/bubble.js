

var Bubble = function(options)
{
	var 
		_self = new createjs.Container(),
		_options = {
			title : '',
			abbr : '',
			style : 'default',
			label:{
					font: '10px arial', 
					color: 'black'
				},



			default:
			{
				color: '#fcd905',
			
			},
			blue:
			{
				color:'#008ed0'
			},
			green:
			{
				color:'green'
			},
			orange:
			{
				color:'orange'
			},
			bubble:
			{
				borderColor:'white',
				borderWidth: 3,
				radius : 15
			}
		},
		setStyle = function(style)
		{
			_options.style = style;
			render();
		},
		render = function()
		{
			_self.removeAllChildren();
			var bubble = new createjs.Shape();
			bubble.graphics.beginFill(_options[_options.style].color).setStrokeStyle(_options.bubble.borderWidth).beginStroke(_options.bubble.borderColor);
			bubble.graphics.drawCircle(0, 0, _options.bubble.radius);
			
			var label = new createjs.Text(_options. abbr, _options.label.font, _options.label.color);
			label.textAlign = 'center';
		
			label.x = 0;
			label.y = -5;
			_self.addChild(bubble);
			_self.addChild(label);
		};

	_options = $.extend(true,_options, options);
	render();
	_self.options = _options;
	_self.setStyle = setStyle;
	_self.render = render;
	return _self;
};