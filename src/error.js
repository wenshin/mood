'use strict';

var IntermediateInheritor = function() {};
    IntermediateInheritor.prototype = Error.prototype;


function ScopeRepeatError() {
    var tmp = Error.apply(this, arguments);
    tmp.name = this.name = 'ScopeRepeatError';

    this.message = tmp.message;
    Object.defineProperty(this, 'stack', { // getter for more optimizy goodness
        get: function() {
            return tmp.stack;
        }
    });

    return this;
}

ScopeRepeatError.prototype = new IntermediateInheritor();

exports.MoErrors = {
  ScopeRepeatError: ScopeRepeatError
};
