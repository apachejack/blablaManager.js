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

BlablaRenderHandler.prototype.capture = function(controller, args){
	if(!this.isEnabledRenders()){
		return ;
	}

	if(!this.isValidController(controller)){
		return false;
	}

	controller.render(args);
}

BlablaRenderHandler.prototype.isValidController = function(controller){
	if(!_.has(controller, "render") || !_.isFunction(controller.render)){
		console.error("the captured controller must have a render function");
		return false;
	}
	return true;
}

return BlablaRenderHandler;

}));