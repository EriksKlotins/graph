

var ConnectorEditor = function(connector)
{

	var _editor = $('#connectorEdit'),

	//$('#connectorEdit').data()['bs.modal'].options._object.options
	reset = function()
	{
		
		$('input[type="radio"]', _editor).off('change');
		$('#delete', _editor).off('click');
	},
	changeLineType = function()
	{
		
		var 
			type = $('[name="lineType"]:checked',_editor).val(),
		 	color = $('[name="lineColor"]:checked',_editor).val(),
		 	arrows = $('[name="lineArrows"]:checked',_editor).val();
		

		if (type == 'solid')
		{
			connector.setStyle(color == 'red'? 'red' : 'green','solid');	
		}
		else
		{
			connector.setStyle(color == 'red'? 'red' : 'green',color == 'red'? 'line2' : 'line1');
		}

		connector.setArrows(arrows);
		connector.render();
		connector.requestRedraw();


	},
	doRemove = function()
	{
		connector.doRemove();
	},
	open = function()
	{

		$(_editor).modal({show:true });
	},
	_initialize = function()
	{
		reset();

		$('input[value="'+connector.options.color+'"]', _editor).prop("checked", true);
		
		if (connector.options.style == 'solid')
		{
			$('input[value="solid"]', _editor).prop("checked", true);
		}
		else
		{
			$('input[value="dashed"]', _editor).prop("checked", true);
		}

		if (!connector.options.startArrow.visible && connector.options.endArrow.visible )
		{
			$('input[value="from_to"]', _editor).prop("checked", true);
		}

		if (connector.options.startArrow.visible && !connector.options.endArrow.visible )
		{
			$('input[value="to_from"]', _editor).prop("checked", true);
		}
		if (connector.options.startArrow.visible && connector.options.endArrow.visible )
		{
			$('input[value="both"]', _editor).prop("checked", true);
		}


		$('input[type="radio"]', _editor).on('change',changeLineType);
		$('#delete', _editor).on('click', doRemove);
	};

	
	_initialize();
	this.open = open;
};



