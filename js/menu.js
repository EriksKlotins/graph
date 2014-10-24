
var ImageButton = function(imageUrl, action)
{
	var 
		_self = new createjs.Container(),
		bitmap = new createjs.Bitmap(imageUrl),

		render = function()
		{
			_self.addChild(bitmap);
		};


	render();
	_self.on('click', action);
	return _self;
};



var Menu = function(options)
{
	var _options = {
			items : 
			[
				{
					title: 'Pirmais',
					bitmap : null,
					action: function(e){console.log('Pirmais');}
				},
				{
					title : 'Otrais',
					bitmap : null,
					action: function(e){console.log('Otrais');}
				},
			],
			style:
			{
				font: "12px arial",
				textColor: 'black',
				color: "yellow",
				activeColor:'orange',
				width: 60,
				height: 20,
				paddingTop: 5,
				paddingLeft: 10,
				marginTop: 5
			}
		},
		_buttons = [],
		_self = new createjs.Container(),
		requestRedraw = function()
		{
			var event = new createjs.Event("needRedraw");
	      	event.target = _self;
	      	_self.dispatchEvent(event);
		},
		drawButton = function(item) 
		{
			var container = new createjs.Container();
			var button = new createjs.Shape();
			var label = new createjs.Text(item.title, _options.style.font, _options.style.textColor);
			label.y = _options.style.paddingTop;
			label.x = _options.style.paddingLeft;
			button.graphics.beginFill(_options.style.color);
			button.graphics.drawRoundRect(0, 0,_options.style.width,_options.style.height , 5);

			container.addEventListener('mouseover', function(e)
			{
				button.graphics = new createjs.Graphics();
				button.graphics.beginFill(_options.style.activeColor);
				button.graphics.drawRoundRect(0, 0,_options.style.width,_options.style.height , 5);
			}); 

		 	container.addEventListener('mouseout', function(e)
			{
				button.graphics = new createjs.Graphics();
				button.graphics.beginFill(_options.style.color);
				button.graphics.drawRoundRect(0, 0,_options.style.width,_options.style.height , 5);
			}); 
		 	container.addEventListener('pressup',function(event) 
		 	{
		 		console.log('Menu.click');
		 		item.action (event); 
		 		event.preventDefault(); 
		 		return false;
		 	});


			container.addChild(button);
			container.addChild(label);
			return container;
		},

		onMouseIn = function(event)
		{
			requestRedraw();
		},

		onMouseOut = function(event)
		{
			requestRedraw();
		},

		render = function()
		{
			for(var i=0;i<_options.items.length;i++)
			{
				var button = drawButton(_options.items[i]);	
				button.y = (_options.style.height+5) * i;
				

				_buttons.push(button);
				_self.addChild(button);
			}
		};

	for(var item in options)
	{
		_options[item] = options[item];
	}	
	render();
	return _self;
};