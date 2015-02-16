(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else {
        // Browser globals
        root.BlablaRenderHandler = factory(root._);
    }
}(this, function (_) {

var BlablaRenderHandler = function(){
	this._dispatchRenders = true;
	this.enqueuedRenders = [];
}

BlablaRenderHandler.prototype._setDispatchRenders = function(value){
	this._dispatchRenders = value;
}

BlablaRenderHandler.prototype.isEnabledRenders = function(){
	return this._dispatchRenders;
}

BlablaRenderHandler.prototype.enableRenders = function(){
	this._setDispatchRenders(true);
}

BlablaRenderHandler.prototype.disableRenders = function(){
	this._setDispatchRenders(false);
}

BlablaRenderHandler.prototype.capture = function(render, args){
	if(!this.isValidRender(render)){
		return false;
	}

	if(this.isEnabledRenders()){
		render(args);
	}
	else{
		this.enqueueRender(render, args);
	}
}

BlablaRenderHandler.prototype.deleteEnqueuedRenders = function(){
	this.enqueuedRenders = [];
}

BlablaRenderHandler.prototype.enqueueRender = function(render, args){
	var renderSaved = {
		fn: function(args){
			return render(args);
		}, 
		arguments: args
	};

	this.enqueuedRenders.push(renderSaved);
}

BlablaRenderHandler.prototype.isValidRender = function(render){
	if(!_.isFunction(render)){
		console.error("the captured render must be a function");
		return false;
	}
	return true;
}

BlablaRenderHandler.prototype.dispatchEnqueuedRenders = function(){
	var executeEnqueued = function(enqueued){
		var fn = enqueued.fn;
		var args = enqueued.arguments;

		try {
			fn(args);
		}
		catch(err) {
    		console.error(err.message);
		}
	};
	_.each(this.enqueuedRenders, executeEnqueued);
	this.deleteEnqueuedRenders();
}

return BlablaRenderHandler;

}));