//goog.provide("SIDE.custom.Controller");
var SIDE = SIDE || {};
SIDE.custom	= SIDE. custom || {};
SIDE.custom.Controller = SIDE.custom.Controller || {};

SIDE.custom.Controller.dispatch = function(htmlId) {
	// HtmlId example:
	// * text field:
	// template_x002e_formPortlet_x002e_standalonecreateform_prop_yamma_com_sidelabs_is_operational_yamma_Dossier_name
	// var matches = id.match(/^.*_prop_([^_]*)_(.*)$/g);
	// Association
	// * template_x002e_formPortlet_x002e_standalonecreateform_assoc_yamma_com_sidelabs_is_operational_yamma_Dossier_groups_com_sidelabs_is_operational_yamma_Document-cntrl-picker_c
	// var matches = id.match(/^.*_assoc_([^_]*)_([^A-Z]*[A-Z][^_]*)_([^_]*)_([^A-Z]*[A-Z][^_]*)$/g);

	var library = {
			'SIDE.com.iminfo.kinedoc.Ouvrage.': function() {}
	}

	var id = htmlId.replace(/_x002e_/g,'\/');
	var matches = null;

	var property = null;
	var association = null;

	var pattern = /^.*prop_([^_]*)_(.*)_(.*)$/g;
	matches = pattern.exec(id);
	if (matches != null) {
		// It's a property
		property = {
			model: matches[1],
			clazz: matches[2].replace(/_/g, '.'),
			name: matches[3]
		}
		var fn = null;
		try {
			// Call the hook on the field's parent form

			// Call a general hook on this field
			// We could use publish/subscribe pattern
			fn = 'SIDE' + '.' + property.clazz + '.on';
			eval(fn)('created', property.name, htmlId);

		} catch (e) {
			// We look in a hash table to see if there is an indirection to
			// a hook for this field
			var fn2 = library[fn];
			eval(fn2)
		}
	} else {
		// It's an association
		// Is it possible on a textfield?
		var pattern = /^.*_assoc_([^_]*)_([^A-Z]*[A-Z][^_]*)_([^_]*)_([^A-Z]*[A-Z][^_]*)$/g;
		matches = pattern.exec(id);
		if (matches != null) {
			association = {
				model: matches[1],
				source: matches[2].replace(/_/g, '.'),
				name: matches[3],
				target: matches[4].replace(/_/g, '.')
			}
		}
	}
}

SIDE.custom.Controller.on = function(htmlId){
	if (htmlId.match(/Requisition_ch_unog_dcm_oime_its_Order/)) {
		SIDE.custom.requisition.Order.on(htmlId);
	}

}
