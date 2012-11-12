var DTP = DTP || {
	jsonProp : null,
	columnDefinitions : new Array(),
	readOnly : false,
	label : "Datatable property",

	init: function(fieldHtmlId, config, view, label, events){
		this.dtConfig = config;
		this.label = label;
		this.events = events;

		if ( view == "view") { this.readOnly = true; }
		DTP.jsonProp = YAHOO.util.Dom.get(fieldHtmlId);
		DTP.drawDatatable(YAHOO.lang.trim(this.jsonProp.value));
	},

	/*
		generates datatable using JSON string from text field
	*/
	drawDatatable: function(jsonString){
		if (!jsonString || jsonString == "") jsonString = "{}";
		var jsonData = eval ("(" + jsonString + ")");

		DTP.getTableDefinition();

		/* datatable columns are retreived based on table definition */
		var getMyKeys = function() {
			var columnsList = [];

			for(var i = 0; i < DTP.columnDefinitions.length; i++) {
				var c = DTP.columnDefinitions[i];
				if (c.type == "date") {
					columnsList.push({key : c.key, parser: "date"});
				} else {
					columnsList.push(c.key);
				}
			}
			return columnsList;
		}

		var jsonSource = new YAHOO.util.DataSource(jsonData);
		jsonSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		jsonSource.responseSchema = { fields: getMyKeys() };

		this.dtpDatatable = new YAHOO.widget.DataTable("dtp-dt", DTP.columnDefinitions, jsonSource);

		DTP.datatableEvents();
	},

	/*
		adds events to datatable, add row, remove row, highlight, open edit cell...
	*/
	datatableEvents: function(){

		if (!DTP.readOnly) {
			/* create "add" button */
			//get last th cell, and attach 'add' event
			var lastCellNo = DTP.dtpDatatable.getTheadEl().rows[0].cells.length-1;
			this.newRowButton = DTP.dtpDatatable.getTheadEl().rows[0].cells[lastCellNo];
			var addButton = document.createElement('span');
			addButton.innerHTML  = '+';
			addButton.title = 'Add new row';
			addButton.className = "addButton";
			YAHOO.util.Event.addListener(addButton,'click',function(e){
				var rowData = { "delete": "-" };
				var record = YAHOO.widget.DataTable._cloneObject(rowData);
				DTP.dtpDatatable.addRow(record);
			});
			this.newRowButton.appendChild(addButton);
			/* add "-" to each delete column */

	        for (var i = 0; i < YAHOO.util.Dom.getElementsByClassName('delButton', 'td').length; i++) {
	        	var e = YAHOO.util.Dom.getElementsByClassName('delButton', 'td')[i];
	        	e.innerHTML = "<div class='yui-dt-liner'>-</div>";
	        }
		}

		this.highlightEditableCell = function(oArgs) { var elCell = oArgs.target;
			if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) { this.highlightCell(elCell); }
		};

		/* Fires the event so subscriber may process it */
		for(i = 0; i < this.events.length; i++) {
			this[this.events[i].name] = this.events[i].fn;
			//DTP.dtpDatatable.subscribe("editorSaveEvent", this.editorSaveEvent);
			DTP.dtpDatatable.subscribe(this.events[i].name, this[this.events[i].name]);
		}

		DTP.dtpDatatable.subscribe("cellMouseoverEvent", this.highlightEditableCell);
		DTP.dtpDatatable.subscribe("cellMouseoutEvent", DTP.dtpDatatable.onEventUnhighlightCell);

		/* save, update json string after save event */
		DTP.dtpDatatable.subscribe("editorSaveEvent", function(oArgs) { DTP.dtToJson(); });

		/* delete row event, or, by default, open cell to edit */
		DTP.dtpDatatable.subscribe('cellClickEvent',function(oArgs) {
			var target = oArgs.target;
			var column = DTP.dtpDatatable.getColumn(target);
			if (column.key == 'delete') DTP.handleConfirm(target);
			else DTP.dtpDatatable.onEventShowCellEditor(oArgs);
		});

		/* if in read mode, popup datatable on click */
		if (DTP.readOnly) {
			DTP.dtpDatatable.subscribe('cellClickEvent', function(){ DTP.popupDT(); } );
			DTP.tooltip = new YAHOO.widget.Tooltip("dtp-tooltip", { context:"dtp-dt", text:"Click on datagrid to popup!" });
		}
	},

	/*
		confirm dialog when deleting row
	*/
	handleConfirm: function(toDelete){

		var handleYes = function(){
			this.hide(); DTP.dtpDatatable.deleteRow(toDelete); DTP.dtToJson(); return true;
		};
		var handleNo = function(){
			this.hide(); return false;
		};

		var confirmDialog = new YAHOO.widget.SimpleDialog('DTPconfirmDialog',{
			width: '300px',
			fixedcenter: true,
			visible: false,
			draggable: false,
			close: true,
			text: "Are you sure you want to delete this row?",
			constraintoviewport: true,
			buttons: [{text:'Yes',handler:handleYes, isDefault:true },{text:'No',handler:handleNo}]
		});

		confirmDialog.setHeader('Delete row');
		confirmDialog.render(document.body);
		confirmDialog.show();

	},

	/*
		brings datatable in popup dialog
	*/
	popupDT: function(){

		var handleClose = function(){
			YAHOO.util.Dom.get("dtContainer").appendChild(YAHOO.util.Dom.get("dtp-dt"));
			DTP.dtpDatatable.subscribe('cellClickEvent', function(){ DTP.popupDT(); } );
			this.hide();
			return true;
		};

		var confirmDialog = new YAHOO.widget.SimpleDialog('dtDialog',{
			fixedcenter: true,
			visible: false,
			draggable: true,
			close: false,
			constraintoviewport: true,
			modal:true,
			buttons: [{text:'Close',handler:handleClose, isDefault:true }]
		});

		DTP.dtpDatatable.unsubscribe('cellClickEvent');
		confirmDialog.setHeader(DTP.label);
		confirmDialog.setBody(YAHOO.util.Dom.get("dtp-dt"));
		confirmDialog.render(document.body);
		confirmDialog.show();
	},

	/*
		gets table definition from what was provided in XML configuration. Parses parameter string to get definition.
		Sets-up formattters and editors according to column definition.
	*/
	getTableDefinition: function(){

		var getFormatter = function(t){
			switch(t){
				case "currency"	: return YAHOO.widget.DataTable.formatCurrency; break;
				case "number"	: return YAHOO.widget.DataTable.formatNumber; 	break;
				case "date"	: return YAHOO.widget.DataTable.formatDate; 	break;
				default 	: return YAHOO.widget.DataTable.formatText; 	break;
			}
			return t;
		};

		var getEditor = function(t, options){
			if (DTP.readOnly == true) return null;
			switch(t){
				case "currency"	: return new YAHOO.widget.TextboxCellEditor(); 	break;
				case "number"	: return new YAHOO.widget.TextboxCellEditor(); 	break;
				case "date"	: return new YAHOO.widget.DateCellEditor();  	break;
				case "radio"	: return new YAHOO.widget.RadioCellEditor({radioOptions: options ,disableBtns : true}); break;
				case "checkbox"	: return new YAHOO.widget.CheckboxCellEditor({checkboxOptions: options}); break;
				case "dropdown"	: return new YAHOO.widget.DropdownCellEditor({multiple: false, dropdownOptions: options}); break;
				default 	: return new YAHOO.widget.TextboxCellEditor(); 	break;
			}
		}

		DTP.dtConfig = DTPtrim(DTP.dtConfig, ["&quot;"]); /* handles quotes if there's any */

		definition = DTP.dtConfig.split(";")

		for (var e = 0; e < definition.length; e++) {
			var columns = definition[e].split(",");
			if (columns && columns.length == 3) {
				definition[e] = [
				    DTPtrim(columns[0]),
				    DTPtrim(columns[1]),
				    DTPtrim(columns[2]),
				    null
				];
			} else if (columns && columns.length > 3) {
				var l = [];
				for (i = 6; i < columns.length; i++) {
					l.push(DTPtrim(columns[i], ["'", "[", "]"]));
				}
				definition[e] = [
				    DTPtrim(columns[0]),
				    DTPtrim(columns[1]),
				    DTPtrim(columns[2]),
				    DTPtrim(columns[3]),
				    DTPtrim(columns[4]),
				    DTPtrim(columns[5]),
				    l
				];
			} else {
				// alert("Wrong datatable definition!" + (columns[0] ? " (at column)" + columns[0] : "" ));
			}
		};

		for (var i = 0; i < definition.length; i++) {
			var c = definition[i];
			if (c[0] && c[0] != "") this.columnDefinitions.push({
				"key": c[0],
				"label": c[1],
				"type": c[2],
				"sortable": c[3] == "nosort" ? false : true,
				"resizeable": c[4] == "noresize" ? false : true,
				"readOnly": c[5] == "readonly" ? true : false,
				"formatter": getFormatter(c[2]),
				"editor": c[5] == "readonly" ? null : getEditor(c[2], c[3])
			});
		}

		if (!this.readOnly) {
			this.columnDefinitions.push({
				key:"delete",
				label:" ",
				className:"delButton"});
		}

		function DTPtrim(s, toRemove){
			for (var i = 0; toRemove != null && i < toRemove.length; i++) {
				var t = toRemove[i];
				while (s.indexOf(t) != -1) {
					s = s.replace(t,"");
				}
			}
			return YAHOO.lang.trim(s);
		};
	},

	/*
		Gets datatable values in object, then converts object to JSON string
	*/
	dtToJson: function(){
		var records = DTP.dtpDatatable.getRecordSet().getRecords();
		var str = new Array();
		for (var i=0; i < records.length; i++) {
			var o = new Object();
			var keys = DTP.dtpDatatable.getColumnSet().keys;
			for (var j=0; j < keys.length; j++) {
				o[keys[j].getKey()] = records[i].getData(keys[j].getKey());
			}
			str.push(o);
		}
		DTP.jsonProp.value = YAHOO.lang.JSON.stringify(str);
	}
};
