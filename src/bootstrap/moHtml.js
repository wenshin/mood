window.moAttr.moHtml = function(attr, scope) {
  this.innerHTML = window.tmpl(attr, scope);
};