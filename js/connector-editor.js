$(document).ready(function()
{
	var _editor = $('#connectorEdit');
//$('#connectorEdit').data()['bs.modal'].options._object.options

	var changeLineType = function()
	{
		
		var 
			type = $('[name="lineType"]:checked',_editor).val(),
		 	color = $('[name="lineColor"]:checked',_editor).val(),
			connector = $(_editor).data('_object');
		

		if (type == 'solid')
		{
			connector.setStyle(color == 'red'? 'red' : 'green','solid');	
		}
		else
		{
			connector.setStyle(color == 'red'? 'red' : 'green',color == 'red'? 'line2' : 'line1');
		}
	},
	doRemove = function()
	{
		console.log('remove');
		var connector = $(_editor).data('_object');
		connector.doRemove();
	};

	$('input[type="radio"]', _editor).on('change',changeLineType);
	$('#delete', _editor).on('click', doRemove);

});



