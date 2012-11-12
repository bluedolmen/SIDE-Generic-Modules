function Consumer(obj) {
    this.obj = obj;
    this.obj.dataReady.subscribe(this.onDataReady, this);
}

var onDataReady = function(type, args, me) {
	var records = args[0].getRecords();
	var amount = 0;
	// Let's compute the total amount of the order
	for(i = 0; i < records.length; i++) {
		amount = amount + records[i].getData("totalPrice");
	}

	alert("Amount = " + amount);
}

//var c1 = new Consumer(RequisitionDT);

RequisitionDT.dataReady.subscribe(onDataReady);
