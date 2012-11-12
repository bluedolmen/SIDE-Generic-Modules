var SIDE=SIDE||{};
SIDE.custom=SIDE.custom||{};
SIDE.custom.requisition=SIDE.custom.requisition||{};
SIDE.custom.requisition.Order={allotment:null,expended:null,on:function(a){if(a.match(/Requisition_ch_unog_dcm_oime_its_Order_allotment/)){YAHOO.util.Event.addListener(a,"change",SIDE.custom.requisition.Order.updateAllotment)
}if(a.match(/Requisition_ch_unog_dcm_oime_its_Order_expended/)){YAHOO.util.Event.addListener(a,"change",SIDE.custom.requisition.Order.updateExpended)
}if(a.match(/Requisition_ch_unog_dcm_oime_its_Order_amount/)){YAHOO.util.Event.addListener(a,"change",SIDE.custom.requisition.Order.computeAllotment)
}},computeTotal:function(d,j){var g=d.editor.getTdEl();
var c=d.oldData;
var f=d.newData;
var a=j.getTrEl(g);
var e=j.getRecord(a);
var h=e.getData("quantity")*e.getData("unitPrice");
e.setData("totalPrice",h);
var b=j.getTdLinerEl(a.cells[4]);
b.innerHTML=SIDE.Util.formatCurrency(e.getData("totalPrice"));
SIDE.custom.requisition.Order.dataReady.fire(j.getRecordSet());
SIDE.custom.requisition.Order.computeAllotment();
return h
},dataReady:new YAHOO.util.CustomEvent("dataReady",this),updateAllotment:function(a){SIDE.custom.requisition.Order.allotment=this.value;
SIDE.custom.requisition.Order.computeAllotment()
},updateExpended:function(a){SIDE.custom.requisition.Order.expended=this.value;
SIDE.custom.requisition.Order.computeAllotment()
},computeAllotment:function(){function b(c){return SIDE.Util.getElementById("Requisition_ch_unog_dcm_oime_its_Order_"+c)
}function a(c){return SIDE.Util.getFloatById("Requisition_ch_unog_dcm_oime_its_Order_"+c)
}if(SIDE.custom.requisition.Order.allotment&&SIDE.custom.requisition.Order.expended){b("balance").value=a("allotment")-a("expended");
b("committed").value=a("amount");
b("available").value=a("balance")-a("committed")
}},onDataReady:function(e,c,f){var a=c[0].getRecords();
var d=0;
for(i=0;
i<a.length;
i++){d=d+a[i].getData("totalPrice")
}var b=SIDE.Util.getElementById("Requisition_ch_unog_dcm_oime_its_Order_amount");
b.value=d
}};
SIDE.custom.requisition.Order.dataReady.subscribe(SIDE.custom.requisition.Order.onDataReady);