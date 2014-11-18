;(function($, window){



window. ArtefactEditor = function(artefact)
{

	var 
	_editor = $('#artefactEdit'),
	roleItem = function(id,role)
	{	
		var result = $('<div class="item"><input type="checkbox" name="enable" id="'+id+'" /><label for="'+id+'">'+role.options.title+'</label><div class="style"><input type="radio" value="0" name="style_'+id+'" checked="checked"><input type="radio" value="1" name="style_'+id+'" ></div><br class="cl"/> </div>');
		$(result).data('role', role);
		return result;
	},

	reset = function()
	{
		$('.role-editor.creator .items', _editor).empty();
		$('.role-editor.user .items', _editor).empty();
		$('#apply', _editor).off('click');
		$('#delete', _editor).off('click');
	},
	onDelete = function()
	{
		if (confirm('Really delete "'+artefact._options.title+'"?'))
    	{
			artefact.doRemove();
			$(_editor).modal('hide');
		}
	},
	onApply = function()
	{
		console.log('onApply');

		var title = $('input[name="title"]',_editor).val();
		var createdBy = [], usedBy = [];
		
		artefact.setText(title);
		
		
		$('.role-editor.creator .items .item', _editor).each(function(i,item)
		{
			var 
				enable = $('input[name="enable"]:checked', item).val(),
				style =  $('input[type="radio"]:checked', item).val();
			if (enable == 'on')
			{
				var 
					role = $(item).data('role');
					newRole = new Bubble(role.options);


				newRole.setStyle(style == '0' ? 'green' : 'orange');
				createdBy.push (newRole);
				//createdBy.push (role);
			}
		}) ;

		$('.role-editor.user .items .item', _editor).each(function(i,item)
		{
			var enable = $('input[name="enable"]:checked', item).val(),
				style =  $('input[type="radio"]:checked', item).val();
			if (enable == 'on')
			{
				var role = $(item).data('role'),
					newRole = new Bubble(role.options);
				newRole.setStyle(style == '0' ? 'green' : 'orange');
				usedBy.push (newRole);
			}
		}) ;
		
		artefact.editCreatedBy(createdBy);
		artefact.editUsedBy(usedBy);

		$(_editor).modal('hide');
		artefact.render(); 
		artefact.y -= Math.max(createdBy.length, usedBy.length) * artefact._options.bubble.radius*2;
		artefact.requestRedraw();
	},
	open = function()
	{

		$(_editor).modal({show:true });
	},
	_initialize = function()
	{
		var 
			createdBy = artefact.getCreatedBy();
			usedBy = artefact.getUsedBy();
		reset();
		$('input[name="title"]', _editor).val(artefact._options.title);
	



		for(var i=0;i<roleList.length;i++)
		{	
			var 
				role = roleList[i],
				creatorRole = roleItem('creator'+i, role),
				userRole = roleItem('user'+i, role);
			for(var j=0;j<createdBy.length;j++)
			{
				if (role.options.title == createdBy[j].options.title)
				{
					$('input[name="enable"]', creatorRole).attr('checked',true);
					var style =  createdBy[j].options.style == 'green' ? '0' : '1';
					$('.style input[value="'+style+'"]' , creatorRole).attr('checked', true);
					
				}
			}
			for(var j=0;j<usedBy.length;j++)
			{
				if (role.options.title == usedBy[j].options.title)
				{

					$('input[name="enable"]', userRole).attr('checked',true);
					var style =  usedBy[j].options.style == 'green' ? '0' : '1';
					$('.style input[value="'+style+'"]' , userRole).attr('checked', true);

				}
			}
			

			$('.role-editor.creator .items', _editor).append(creatorRole);
			$('.role-editor.user .items', _editor).append(userRole);
		}

		$('#apply', _editor).on('click',onApply);
		$('#delete', _editor).on('click',onDelete);
	};

	_initialize();

	this.open = open;
};



})(jQuery, window);