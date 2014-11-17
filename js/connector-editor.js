console.log('atetata');
$(document).ready(function(){

//$('#connectorEdit').data()['bs.modal'].options._object.options

	var changeLineType = function()
	{
		
		var 
			editor = $('#connectorEdit'),
			type = $('[name="lineType"]:checked',editor).val(),
		 	color = $('[name="lineColor"]:checked',editor).val(),
			connector = $(editor).data('_object');
		

		if (type == 'solid')
		{
			connector.setStyle(color == 'red'? 'red' : 'green','solid');	
		}
		else
		{
			connector.setStyle(color == 'red'? 'red' : 'green',color == 'red'? 'line2' : 'line1');
		}
	};

	$('#connectorEdit input[type="radio"]').on('change',changeLineType);
});



