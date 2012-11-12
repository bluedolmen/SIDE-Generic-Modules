//template_x002e_formPortlet_x002e_standalonecreateform_prop_Requisition_ch_unog_dcm_oime_its_Order_amount
//template_x002e_create-content_x002e_create-content_prop_Requisition_ch_unog_dcm_oime_its_Order_amount
var SIDE = SIDE || {};
SIDE.custom = SIDE.custom || {};
SIDE.custom.requisition = SIDE.custom.requisition || {};

SIDE.custom.requisition.Order = {

	allotment: null,
	expended: null,

	on: function(htmlId) {
		if (htmlId.match(/Requisition_ch_unog_dcm_oime_its_Order_allotment/)) {
			YAHOO.util.Event.addListener(htmlId, 'change', SIDE.custom.requisition.Order.updateAllotment);
		};

		if (htmlId.match(/Requisition_ch_unog_dcm_oime_its_Order_expended/)) {
			YAHOO.util.Event.addListener(htmlId, 'change', SIDE.custom.requisition.Order.updateExpended);
		}

		if (htmlId.match(/Requisition_ch_unog_dcm_oime_its_Order_amount/)) {
			/* The following event doesn't seem to be triggered when the field
			 * is changed through javascript. compteAllotment needs to be called
			 * explicitly
			 */
			YAHOO.util.Event.addListener(htmlId, 'change', SIDE.custom.requisition.Order.computeAllotment);
		}
	},

	computeTotal: function(oArgs, self) {
		var elCell = oArgs.editor.getTdEl();
		var oOldData = oArgs.oldData;
		var oNewData = oArgs.newData;

		var elRow = self.getTrEl(elCell);
		var record = self.getRecord(elRow);

		var totalPrice = record.getData("quantity") * record.getData("unitPrice");
		record.setData("totalPrice", totalPrice);
		var el = self.getTdLinerEl(elRow.cells[4]);
		el.innerHTML = SIDE.Util.formatCurrency(record.getData("totalPrice"));

		SIDE.custom.requisition.Order.dataReady.fire(self.getRecordSet());
		SIDE.custom.requisition.Order.computeAllotment();
	},

    dataReady: new YAHOO.util.CustomEvent("dataReady", this),

	updateAllotment: function(e) {
		SIDE.custom.requisition.Order.allotment = this.value;
		SIDE.custom.requisition.Order.computeAllotment();
	},

	updateExpended: function(e) {
		SIDE.custom.requisition.Order.expended = this.value;
		SIDE.custom.requisition.Order.computeAllotment();
	},

	/**
	 * @TODO Find a solution to express business rules in a more standard way
	 * The ideal one should be:
	 * balance = allotment - expended
	 * committed = amount
	 * available = balance - committed
	 */
	computeAllotment: function() {
		if (SIDE.custom.requisition.Order.allotment && SIDE.custom.requisition.Order.expended) {
			SIDE.Util.getElementById("Requisition_ch_unog_dcm_oime_its_Order_balance").value =
				SIDE.Util.getFloatById("Requisition_ch_unog_dcm_oime_its_Order_allotment")
				- SIDE.Util.getFloatById("Requisition_ch_unog_dcm_oime_its_Order_expended");
			SIDE.Util.getElementById("Requisition_ch_unog_dcm_oime_its_Order_committed").value =
				SIDE.Util.getFloatById("prop_Requisition_ch_unog_dcm_oime_its_Order_amount");
			SIDE.Util.getElementById("Requisition_ch_unog_dcm_oime_its_Order_available").value =
				SIDE.Util.getFloatById("Requisition_ch_unog_dcm_oime_its_Order_balance")
				- SIDE.Util.getFloatById("Requisition_ch_unog_dcm_oime_its_Order_committed");
		}
	},

	onDataReady: function(type, args, me) {
		var records = args[0].getRecords();
		var amount = 0;
		// Let's compute the total amount of the order
		for(i = 0; i < records.length; i++) {
			amount = amount + records[i].getData("totalPrice");
		}

		var elt = SIDE.Util.getElementById("prop_Requisition_ch_unog_dcm_oime_its_Order_amount");
		//@TODO: make the elt disabled so user can't interact with this data
		elt.value = amount;
	}
}

SIDE.custom.requisition.Order.dataReady.subscribe(SIDE.custom.requisition.Order.onDataReady);
