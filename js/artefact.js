//;(function($,window){

	/**


	*/
	var Artefact = function(title, createdBy, usedBy)
	{
		var 
			_self = new createjs.Container(), 
			_isDragging = false,
			_dragDeltaX = 0,
			_dragDeltaY = 0,
			_options = {
				label:{
					font: '12px arial', 
					color: 'black'
				}, 
				box: 
				{
					color: 'pink', 
					width: 100, 
					height: 50
				}
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
		   
		      	var event = new createjs.Event("dragging");
		      	event.target = _self;
		      	_isDragging = true;
		      	_self.dispatchEvent(event);

		      	// return false;
		    },
		    endDragging = function(evt)
		    {
		        // do nothing..
		        _isDragging = false;
		    },
			setupEvents = function()
			{
				_self.on("pressmove", doDragging);
        		_self.on("pressup",endDragging);
			},
			render = function()
			{
				var box = new createjs.Shape(),
					label = new createjs.Text(title, _options.label.font, _options.label.color),
					i = 0,
					boxTopOffset = 0;
				

				box.graphics.beginFill('green');
				box.graphics.drawRoundRect(0,0,2,2, 1);


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
						boxTopOffset = Math.max(boxTopOffset, createdBy[i].y + createdBy[i].options.bubble.radius);

					}
					if (usedBy[i])
					{
						usedBy[i].x = _options.box.width- usedBy[i].options.bubble.radius;
					usedBy[i].y = usedBy[i].options.bubble.radius*2*(i)+usedBy[i].options.bubble.radius;
					_self.addChild(usedBy[i]);
					boxTopOffset = Math.max(boxTopOffset, usedBy[i].y + usedBy[i].options.bubble.radius);
					}	
				}

				// label
				label.textAlign = 'center';
				label.lineWidth = _options.box.width - 10;
				label.x = _options.box.width / 2 ;
				label.y = 5 + boxTopOffset;
				// box 
				box.graphics.beginFill(_options.box.color);
				box.graphics.drawRoundRect(0,boxTopOffset,_options.box.width,_options.box.height , 5);
				
	
				_self.addChild(box);
				_self.addChild(label);

			};
		render();
		setupEvents();
		return _self;
	};



//})(jQuery,window);