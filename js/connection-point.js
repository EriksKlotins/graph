

/**
 * Extends any object with feature to be connected
 * @param {[type]} artefact
 */
var ConnectionPoint = function(artefact)
{
	var
		_self = {},
		_connectors = [],
		// _self.connectorRemoved = connectorRemoved;
		// _self.connectorAttached = connectorAttached;
		// 
		/*
			Return all conectors attached to the box
		*/
		getConnectors = function()
		{
			return _connectors;
		},



	_self.getConnectors = getConnectors;
	return _self;	
};