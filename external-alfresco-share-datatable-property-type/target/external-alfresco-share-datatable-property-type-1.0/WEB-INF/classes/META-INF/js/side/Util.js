//goog.provide("SIDE.custom.Controller");
var SIDE = SIDE || {};

SIDE.Util = {
	FORM_PREFIX: "template_x002e_formPortlet_x002e_standalonecreateform",
	EDIT_PREFIX: "template_x002e_edit-metadata_x002e_edit-metadata",
	DIRECT_PREFIX: "template_x002e_create-content_x002e_create-content",

	formatCurrency: function (value) {
		return YAHOO.util.Number.format(value,{
			prefix: '$',
			decimalPlaces: 2,
			thousandsSeparator: ','
		});
	},

	/**
	 * ID Prefixes are different according the way forms are called.
	 * Moreover, properties may be prefixed sometimes by _prop_.
	 * All these cases must be tested in order to get the value.
	 */
	getElementById: function(prop) {
		var prefixes = [
            SIDE.Util.FORM_PREFIX,
            SIDE.Util.EDIT_PREFIX,
            SIDE.Util.DIRECT_PREFIX
        ];

		for (var i = 0; i < prefixes.length; i++) {
			var elt = YAHOO.util.Dom.get(prefixes[i] + "_" + prop);
			if (elt) {
				return elt;
			};

			var elt = YAHOO.util.Dom.get(prefixes[i] + "_prop_" + prop);
			if (elt) {
				return elt;
			};
		}
	},

	getFloatById: function(prop) {
		return parseFloat(SIDE.Util.getElementById(prop).value);
	},

	//var prop = "prop_Requisition_ch_unog_dcm_oime_its_Order_amount";
	getElementId: function(prop) {
		return SIDE.Util.getElementById(prop).id;
	}
}