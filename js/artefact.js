//;(function($,window){

	/**


	*/
	var Artefact = function(title, createdBy, usedBy)
	{
		var 
			_self = new createjs.Shape(),
			_width = 50,
			_height = 30,
			render = function()
			{
				_self.graphics.beginFill('cyan');
				_self.graphics.drawRoundRect(-_width/2, -_height/2,_width,_height , 5);
			};
		render();
		return _self;
	}



//})(jQuery,window);