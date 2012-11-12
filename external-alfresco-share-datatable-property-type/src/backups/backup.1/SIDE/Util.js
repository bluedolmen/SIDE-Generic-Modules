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

	getElementById: function(prop) {
		var elt = YAHOO.util.Dom.get(SIDE.Util.FORM_PREFIX + "_" + prop);
		if (elt) {
			return elt;
		};

		elt = YAHOO.util.Dom.get(SIDE.Util.EDIT_PREFIX + "_" + prop);
		if (elt) {
			return elt;
		}

		elt = YAHOO.util.Dom.get(SIDE.Util.DIRECT_PREFIX + "_" + prop);
		if (elt) {
			return elt;
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