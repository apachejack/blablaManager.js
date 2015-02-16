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

	render(args);
}

BlablaRenderHandler.prototype.isValidRender = function(render){
	if(!_.isFunction(render)){
		console.error("the captured render must be a function");
		return false;
	}
	return true;
}

BlablaRenderHandler.prototype.dispatchEnqueuedRenders = function(){
	_.each(this.enqueuedRenders, function(enqueued){
		var renderFn = function(){
			return enqueued.render;
		}

		renderFn(enqueued.args);
	});


}

return BlablaRenderHandler;

}));