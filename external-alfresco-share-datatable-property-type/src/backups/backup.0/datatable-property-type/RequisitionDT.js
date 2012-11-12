var RequisitionDT = RequisitionDT || {

	formatCurrency: function (value) {
		return YAHOO.util.Number.format(value,{prefix:'$',decimalPlaces:2,thousandsSeparator:','});
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
		el.innerHTML = RequisitionDT.formatCurrency(record.getData("totalPrice"));

		this.dataReady.fire(self.getRecordSet());
	},

    dataReady: new YAHOO.util.CustomEvent("dataReady", this)
}
