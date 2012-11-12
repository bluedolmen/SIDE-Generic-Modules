var Requisition = Requisition || {};
Requisition = Requisition.initialization || {};
Requisition.initialization.Tree = Requisition.initialization.Tree || {};

var tree =
  [{
    name: "DCM2",
    children: [{
        name: "CPCS",
        children: []
      },{
        name: "IS",
        children: []
      },{
        name: "LS",
        children: [{
                name: "TS",
                children: []
            },{
                name: "TPS",
                children: []
        }]
      },{
        name: "PS",
        children: []
      },{
        name: "EO",
        children: []
      },{
        name: "OIME",
        children: [{
            name: "ITS",
            children: []
        },{
            name: "MERS",
            children: []
        }]
      }]
    }];
