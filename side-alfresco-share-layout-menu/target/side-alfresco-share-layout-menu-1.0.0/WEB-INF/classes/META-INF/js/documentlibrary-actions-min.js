(function(){var q=Alfresco.util.encodeHTML,l=Alfresco.util.combinePaths,v=Alfresco.util.siteURL;
Alfresco.doclib.Actions={};
Alfresco.doclib.Actions.prototype={onActionDetails:function d(D){var C=this;
var B=function A(J,K){var I='<span class="light">'+q(D.displayName)+"</span>";
Alfresco.util.populateHTML([K.id+"-dialogTitle",C.msg("edit-details.title",I)]);
this.widgets.editMetadata=Alfresco.util.createYUIButton(K,"editMetadata",null,{type:"link",label:C.msg("edit-details.label.edit-metadata"),href:v("edit-metadata?nodeRef="+D.nodeRef)})
};
var G=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",{itemKind:"node",itemId:D.nodeRef,mode:"edit",submitType:"json",formId:"doclib-simple-metadata"});
var F=new Alfresco.module.SimpleDialog(this.id+"-editDetails");
F.setOptions({width:"50em",templateUrl:G,actionUrl:null,destroyOnHide:true,doBeforeDialogShow:{fn:B,scope:this},onSuccess:{fn:function H(J){var L=D.custom&&D.custom.isWorkingCopy?D.custom.workingCopyOriginal:D.nodeRef;
Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"slingshot/doclib/node/"+new Alfresco.util.NodeRef(L).uri,successCallback:{fn:function K(M){var N=M.json.item;
YAHOO.Bubbling.fire(D.type=="folder"?"folderRenamed":"fileRenamed",{file:N});
YAHOO.Bubbling.fire("metadataRefresh");
YAHOO.Bubbling.fire("tagRefresh");
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.success")})
},scope:this},failureCallback:{fn:function I(M){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})
},scope:this}})
},scope:this},onFailure:{fn:function E(I){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})
},scope:this}}).show()
},onActionLocate:function n(B){var C=B.isFolder?Alfresco.util.combinePaths("/",B.location.path.substring(0,B.location.path.lastIndexOf("/"))):B.location.path,A=B.isLink?B.linkedDisplayName:B.displayName;
if(this.options.workingMode===Alfresco.doclib.MODE_SITE&&B.location.site!==this.options.siteId){window.location=v("documentlibrary?file="+encodeURIComponent(A)+"&path="+encodeURIComponent(C),{site:B.location.site})
}else{this.options.highlightFile=A;
YAHOO.Bubbling.fire("changeFilter",{filterId:"path",filterData:C})
}},onActionDelete:function x(C){var D=this;
Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.confirm.delete.title"),text:this.msg("message.confirm.delete",C.displayName),buttons:[{text:this.msg("button.delete"),handler:function B(){this.destroy();
D._onActionDeleteConfirm.call(D,C)
}},{text:this.msg("button.cancel"),handler:function A(){this.destroy()
},isDefault:true}]})
},_onActionDeleteConfirm:function f(D){var E=D.location.path,F=D.fileName,B=l(E,F),A=D.displayName,C=new Alfresco.util.NodeRef(D.nodeRef);
this.modules.actions.genericAction({success:{activity:{siteId:this.options.siteId,activityType:"file-deleted",page:"documentlibrary",activityData:{fileName:F,path:E,nodeRef:C.toString()}},event:{name:D.isFolder?"folderDeleted":"fileDeleted",obj:{path:B}},message:this.msg("message.delete.success",A)},failure:{message:this.msg("message.delete.failure",A)},webscript:{method:Alfresco.util.Ajax.DELETE,name:"file/node/{nodeRef}",params:{nodeRef:C.uri}}})
},onActionEditOffline:function b(A){Alfresco.logger.error("onActionEditOffline","Abstract implementation not overridden")
},onlineEditMimetypes:{"application/vnd.ms-excel":"Excel.Sheet","application/vnd.ms-powerpoint":"PowerPoint.Slide","application/msword":"Word.Document","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"Excel.Sheet","application/vnd.openxmlformats-officedocument.presentationml.presentation":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"Word.Document"},onActionEditOnline:function h(A){if(this._launchOnlineEditor(A)){YAHOO.Bubbling.fire("metadataRefresh")
}},_launchOnlineEditor:function z(D){var G="SharePoint.OpenDocuments",J=D.mimetype,B=null,C=null,A={xls:"application/vnd.ms-excel",ppt:"application/vnd.ms-powerpoint",doc:"application/msword",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"};
if(this.onlineEditMimetypes.hasOwnProperty(J)){B=this.onlineEditMimetypes[J]
}else{var E=Alfresco.util.getFileExtension(D.location.file);
if(E!==null){E=E.toLowerCase();
if(A.hasOwnProperty(E)){J=A[E];
if(this.onlineEditMimetypes.hasOwnProperty(J)){B=this.onlineEditMimetypes[J]
}}}}if(B!==null){try{C=new ActiveXObject(G+".3");
return C.EditDocument3(window,D.onlineEditUrl,true,B)
}catch(F){try{C=new ActiveXObject(G+".2");
return C.EditDocument2(window,D.onlineEditUrl,B)
}catch(I){try{C=new ActiveXObject(G+".1");
return C.EditDocument(D.onlineEditUrl,B)
}catch(H){}}}}return window.open(D.onlineEditUrl,"_blank")
},onActionCheckoutToGoogleDocs:function y(A){Alfresco.logger.error("onActionCheckoutToGoogleDocs","Abstract implementation not overridden")
},onActionCheckinFromGoogleDocs:function t(A){Alfresco.logger.error("onActionCheckinFromGoogleDocs","Abstract implementation not overridden")
},onActionRules:function w(A){if(!this.modules.details){this.modules.details=new Alfresco.module.DoclibDetails(this.id+"-details")
}this.modules.details.setOptions({siteId:this.options.siteId,file:A}).showDialog()
},onActionSimpleApprove:function r(B){var A=B.displayName;
this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},message:this.msg("message.simple-workflow.approved",A)},failure:{message:this.msg("message.simple-workflow.failure",A)},webscript:{method:Alfresco.util.Ajax.POST,stem:Alfresco.constants.PROXY_URI+"api/",name:"actionQueue"},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{actionedUponNode:B.nodeRef,actionDefinitionName:"accept-simpleworkflow"}}})
},onActionSimpleReject:function c(B){var A=B.displayName;
this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},message:this.msg("message.simple-workflow.rejected",A)},failure:{message:this.msg("message.simple-workflow.failure",A)},webscript:{method:Alfresco.util.Ajax.POST,stem:Alfresco.constants.PROXY_URI+"api/",name:"actionQueue"},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{actionedUponNode:B.nodeRef,actionDefinitionName:"reject-simpleworkflow"}}})
},onActionUploadNewVersion:function u(E){var B=E.displayName,D=new Alfresco.util.NodeRef(E.nodeRef),A=E.version;
if(!this.fileUpload){this.fileUpload=Alfresco.getFileUploadInstance()
}var G=this.msg("label.filter-description",B),C="*";
if(B&&new RegExp(/[^\.]+\.[^\.]+/).exec(B)){C="*"+B.substring(B.lastIndexOf("."))
}if(E.custom&&E.custom.workingCopyVersion){A=E.custom.workingCopyVersion
}var F={updateNodeRef:D.toString(),updateFilename:B,updateVersion:A,overwrite:true,filter:[{description:G,extensions:C}],mode:this.fileUpload.MODE_SINGLE_UPDATE,onFileUploadComplete:{fn:this.onNewVersionUploadComplete,scope:this}};
if(this.options.workingMode==Alfresco.doclib.MODE_SITE){F.siteId=this.options.siteId;
F.containerId=this.options.containerId
}this.fileUpload.show(F)
},onNewVersionUploadComplete:function a(A){var E=A.successful.length,B,D;
if(E>0){if(E<this.options.groupActivitiesAt||5){for(var C=0;
C<E;
C++){D=A.successful[C];
B={fileName:D.fileName,nodeRef:D.nodeRef};
this.modules.actions.postActivity(this.options.siteId,"file-updated","document-details",B)
}}else{B={fileCount:E,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};
this.modules.actions.postActivity(this.options.siteId,"files-updated","documentlibrary",B)
}}},onActionCancelEditing:function p(C){var A=C.displayName,B=new Alfresco.util.NodeRef(C.nodeRef);
this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},message:this.msg("message.edit-cancel.success",A)},failure:{message:this.msg("message.edit-cancel.failure",A)},webscript:{method:Alfresco.util.Ajax.POST,name:"cancel-checkout/node/{nodeRef}",params:{nodeRef:B.uri}}})
},onActionCopyTo:function k(A){this._copyMoveTo("copy",A)
},onActionMoveTo:function o(A){this._copyMoveTo("move",A)
},_copyMoveTo:function i(B,A){if(!B in {copy:true,move:true}){throw new Error("'"+B+"' is not a valid Copy/Move to mode.")
}if(!this.modules.copyMoveTo){this.modules.copyMoveTo=new Alfresco.module.DoclibCopyMoveTo(this.id+"-copyMoveTo")
}this.modules.copyMoveTo.setOptions({mode:B,siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:A,workingMode:this.options.workingMode,rootNode:this.options.rootNode,parentId:this.doclistMetadata.parent.nodeRef}).showDialog()
},onActionAssignWorkflow:function m(F){var G="",A=null;
if(YAHOO.lang.isArray(F)){var B=true;
for(var D=0,C=F.length;
D<C;
D++){G+=(D===0?"":",")+F[D].nodeRef;
if(B&&D>0){B=F[D-1].location.parent.nodeRef==F[D].location.parent.nodeRef
}}if(B&&F.length>0){A=F[D-1].location.parent.nodeRef
}else{A=this.doclistMetadata.container
}}else{G=F.nodeRef;
A=F.location.parent.nodeRef
}var E={selectedItems:G};
if(A){E.destination=A
}Alfresco.util.navigateTo(v("start-workflow"),"POST",E)
},onActionManagePermissions:function j(A){if(!this.modules.permissions){this.modules.permissions=new Alfresco.module.DoclibPermissions(this.id+"-permissions")
}this.modules.permissions.setOptions({siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:A}).showDialog()
},onActionManageAspects:function g(A){if(!this.modules.aspects){this.modules.aspects=new Alfresco.module.DoclibAspects(this.id+"-aspects")
}this.modules.aspects.setOptions({file:A}).show()
},onActionChangeType:function e(C){var H=C.nodeRef,E=C.nodeType,G=C.displayName,A=Alfresco.constants.PROXY_URI+l("slingshot/doclib/type/node",H.replace(":/",""));
var I=function D(K){K.addValidation(this.id+"-changeType-type",function J(Q,M,P,O,L,N){return Q.options[Q.selectedIndex].value!=="-"
},null,"change");
K.setShowSubmitStateDynamically(true,false)
};
this.modules.changeType=new Alfresco.module.SimpleDialog(this.id+"-changeType").setOptions({width:"30em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/change-type?currentType="+encodeURIComponent(E),actionUrl:A,doSetupFormsValidation:{fn:I,scope:this},firstFocus:this.id+"-changeType-type",onSuccess:{fn:function F(J){YAHOO.Bubbling.fire("metadataRefresh",{highlightFile:G});
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.success",G)})
},scope:this},onFailure:{fn:function B(J){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.failure",G)})
},scope:this}});
this.modules.changeType.show()
},viewInSourceRepositoryURL:function s(E){var D=E.nodeRef,C=E.type,B=E.location.repositoryId,A=this.options.replicationUrlMapping,F;
if(!B||!A||!A[B]){return"#"
}F=Alfresco.util.siteURL(C+"-details?nodeRef="+D);
F=F.substring(Alfresco.constants.URL_CONTEXT.length);
return l(A[B],"/",F)
}}
})();
(function(){var j=YAHOO.util.Dom,a=YAHOO.util.Selector,d=YAHOO.util.KeyListener;
Alfresco.module.SimpleDialog=function(o,p){p=YAHOO.lang.isArray(p)?p:[];
this.isFormOwner=false;
if(o!=="null"){this.formsServiceDeferred=new Alfresco.util.Deferred(["onTemplateLoaded","onBeforeFormRuntimeInit"],{fn:this._showDialog,scope:this});
YAHOO.Bubbling.on("beforeFormRuntimeInit",this.onBeforeFormRuntimeInit,this)
}return Alfresco.module.SimpleDialog.superclass.constructor.call(this,"Alfresco.module.SimpleDialog",o,["button","container","connection","json","selector"].concat(p))
};
YAHOO.extend(Alfresco.module.SimpleDialog,Alfresco.component.Base,{dialog:null,form:null,isFormOwner:null,options:{templateUrl:null,actionUrl:null,firstFocus:null,onSuccess:{fn:null,obj:null,scope:window},onSuccessMessage:"",onFailure:{fn:null,obj:null,scope:window},onFailureMessage:"",doBeforeDialogShow:{fn:null,obj:null,scope:null},doSetupFormsValidation:{fn:null,obj:null,scope:null},doBeforeFormSubmit:{fn:null,obj:null,scope:window},doBeforeAjaxRequest:{fn:null,obj:null,scope:window},width:"30em",clearForm:false,destroyOnHide:false},show:function b(){if(this.dialog){this._showDialog()
}else{var o={htmlid:this.id};
if(this.options.templateRequestParams){o=YAHOO.lang.merge(this.options.templateRequestParams,o)
}Alfresco.util.Ajax.request({url:this.options.templateUrl,dataObj:o,successCallback:{fn:this.onTemplateLoaded,scope:this},failureMessage:"Could not load dialog template from '"+this.options.templateUrl+"'.",scope:this,execScripts:true})
}return this
},_showDialog:function e(){var o=j.get(this.id+"-form");
j.addClass(o,"bd");
var x=this.options.doSetupFormsValidation;
if(typeof x.fn=="function"){x.fn.call(x.scope||this,this.form,x.obj)
}var q=this.options.doBeforeFormSubmit;
if(typeof q.fn=="function"){this.form.doBeforeFormSubmit=q
}else{this.form.doBeforeFormSubmit={fn:function p(){this.widgets.okButton.set("disabled",true);
this.widgets.cancelButton.set("disabled",true)
},scope:this}
}var s=this.options.doBeforeAjaxRequest;
if(typeof s.fn=="function"){this.form.doBeforeAjaxRequest=s
}if(this.options.actionUrl!==null){o.attributes.action.nodeValue=this.options.actionUrl
}if(this.options.clearForm){var u=a.query("input",o),v;
u=u.concat(a.query("textarea",o));
for(var t=0,r=u.length;
t<r;
t++){v=u[t];
if(v.getAttribute("type")!="radio"&&v.getAttribute("type")!="checkbox"&&v.getAttribute("type")!="hidden"){v.value=""
}}}var w=this.options.doBeforeDialogShow;
if(w&&typeof w.fn=="function"){w.fn.call(w.scope||this,this.form,this,w.obj)
}if(this.isFormOwner){this.widgets.okButton.set("disabled",false);
this.widgets.cancelButton.set("disabled",false)
}this.form.updateSubmitElements();
this.dialog.show();
Alfresco.util.caretFix(o);
this.form.applyTabFix();
this.widgets.escapeListener=new d(document,{keys:d.KEY.ESCAPE},{fn:function(z,y){this.dialog.hide()
},scope:this,correctScope:true});
this.widgets.escapeListener.enable();
if(this.options.firstFocus!==null){j.get(this.options.firstFocus).focus()
}},hide:function k(){this.dialog.hide()
},_hideDialog:function g(){this.dialog.hideEvent.unsubscribe(this.onHideEvent,null,this);
if(this.widgets.escapeListener){this.widgets.escapeListener.disable()
}var o=j.get(this.id+"-form");
Alfresco.util.undoCaretFix(o);
if(this.options.destroyOnHide){YAHOO.Bubbling.fire("formContainerDestroyed");
YAHOO.Bubbling.unsubscribe("beforeFormRuntimeInit",this.onBeforeFormRuntimeInit);
this.dialog.destroy();
delete this.dialog;
delete this.widgets;
if(this.isFormOwner){delete this.form
}}},onHideEvent:function n(p,o){YAHOO.lang.later(0,this,this._hideDialog)
},onTemplateLoaded:function f(o){var q=document.createElement("div");
q.innerHTML=o.serverResponse.responseText;
var p=j.getFirstChild(q);
while(p&&p.tagName.toLowerCase()!="div"){p=j.getNextSibling(p)
}this.dialog=Alfresco.util.createYUIPanel(p,{width:this.options.width});
this.dialog.hideEvent.subscribe(this.onHideEvent,null,this);
if(j.get(this.id+"-form-submit")){this.isFormOwner=false;
this.formsServiceDeferred.fulfil("onTemplateLoaded")
}else{this.widgets.okButton=Alfresco.util.createYUIButton(this,"ok",null,{type:"submit"});
this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel",this.onCancel);
this.isFormOwner=true;
this.form=new Alfresco.forms.Form(this.id+"-form");
this.form.setSubmitElements(this.widgets.okButton);
this.form.setAJAXSubmit(true,{successCallback:{fn:this.onSuccess,scope:this},failureCallback:{fn:this.onFailure,scope:this}});
this.form.setSubmitAsJSON(true);
this.form.setShowSubmitStateDynamically(true,false);
this.form.init();
this._showDialog()
}},onBeforeFormRuntimeInit:function c(p,o){var q=o[1].component,r=o[1].runtime;
this.widgets.okButton=q.buttons.submit;
this.widgets.cancelButton=q.buttons.cancel;
this.widgets.cancelButton.set("onclick",{fn:this.onCancel,scope:this});
this.form=r;
this.form.setAJAXSubmit(true,{successCallback:{fn:this.onSuccess,scope:this},failureCallback:{fn:this.onFailure,scope:this}});
this.formsServiceDeferred.fulfil("onBeforeFormRuntimeInit")
},onCancel:function h(o,p){this.dialog.hide()
},onSuccess:function i(o){this.dialog.hide();
if(!o){if(this.options.onFailure&&typeof this.options.onFailure.fn=="function"){this.options.onFailure.fn.call(this.options.onFailure.scope,null,this.options.onFailure.obj)
}else{Alfresco.util.PopupManager.displayMessage({text:this.options.failureMessage||"Operation failed."})
}}else{if(this.options.onSuccess&&typeof this.options.onSuccess.fn=="function"){this.options.onSuccess.fn.call(this.options.onSuccess.scope,o,this.options.onSuccess.obj)
}else{Alfresco.util.PopupManager.displayMessage({text:this.options.successMessage||"Operation succeeded."})
}}},onFailure:function m(o){if(this.isFormOwner){this.widgets.okButton.set("disabled",false);
this.widgets.cancelButton.set("disabled",false)
}this.form.updateSubmitElements();
if(typeof this.options.onFailure.fn=="function"){this.options.onFailure.fn.call(this.options.onFailure.scope,o,this.options.onFailure.obj)
}else{if(o.json&&o.json.message&&o.json.status.name){Alfresco.util.PopupManager.displayPrompt({title:o.json.status.name,text:o.json.message})
}else{Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.failure"),text:o.serverResponse})
}}}});
var l=new Alfresco.module.SimpleDialog("null")
})();
(function(){var b=YAHOO.util.Dom,q=YAHOO.util.KeyListener,v=YAHOO.util.Selector;
var s=Alfresco.util.encodeHTML,p=Alfresco.util.combinePaths,z=Alfresco.util.hasEventInterest;
Alfresco.module.DoclibGlobalFolder=function(B){Alfresco.module.DoclibGlobalFolder.superclass.constructor.call(this,"Alfresco.module.DoclibGlobalFolder",B,["button","container","connection","json","treeview"]);
this.containers={};
if(B!="null"){this.eventGroup=B;
YAHOO.Bubbling.on("siteChanged",this.onSiteChanged,this);
YAHOO.Bubbling.on("containerChanged",this.onContainerChanged,this)
}return this
};
var x=Alfresco.module.DoclibGlobalFolder;
YAHOO.lang.augmentObject(x,{VIEW_MODE_SITE:0,VIEW_MODE_REPOSITORY:1,VIEW_MODE_USERHOME:2});
YAHOO.extend(Alfresco.module.DoclibGlobalFolder,Alfresco.component.Base,{options:{siteId:"",siteTitle:"",containerId:"documentLibrary",containerType:"cm:folder",rootNode:"alfresco://company/home",userHome:"alfresco://user/home",path:"",pathNodeRef:null,width:"60em",files:null,templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/global-folder",viewMode:x.VIEW_MODE_SITE,allowedViewModes:[x.VIEW_MODE_SITE,x.VIEW_MODE_REPOSITORY,x.VIEW_MODE_USERHOME],evaluateChildFoldersSite:true,maximumFolderCountSite:-1,evaluateChildFoldersRepo:true,maximumFolderCountRepo:-1},containerDiv:null,pathsToExpand:null,selectedNode:null,containers:null,showDialog:function k(){if(!this.containerDiv){Alfresco.util.Ajax.request({url:this.options.templateUrl,dataObj:{htmlid:this.id},successCallback:{fn:this.onTemplateLoaded,scope:this},failureMessage:"Could not load 'global-folder' template:"+this.options.templateUrl,execScripts:true})
}else{this._beforeShowDialog()
}},onTemplateLoaded:function m(C){var G=this;
this.containerDiv=document.createElement("div");
this.containerDiv.setAttribute("style","display:none");
this.containerDiv.innerHTML=C.serverResponse.responseText;
var E=b.getFirstChild(this.containerDiv);
this.widgets.dialog=Alfresco.util.createYUIPanel(E,{width:this.options.width});
this.widgets.okButton=Alfresco.util.createYUIButton(this,"ok",this.onOK);
this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel",this.onCancel);
var I=new YAHOO.widget.ButtonGroup(this.id+"-modeGroup");
I.on("checkedButtonChange",this.onViewModeChange,this.widgets.modeButtons,this);
this.widgets.modeButtons=I;
var F=this.widgets.modeButtons.getButtons(),H=function(J){if(q.KEY.ENTER==J.keyCode){this.set("checked",true)
}};
for(var D=0;
D<F.length;
D++){F[D].addListener("keydown",H)
}this.fnLoadNodeData=function B(N,K){var L=N.data.path;
var M=G._buildTreeNodeUrl.call(G,L);
var P={success:function J(T){var S=Alfresco.util.parseJSON(T.responseText);
if(S.parent){if(N.data.nodeRef.indexOf("alfresco://")===0){N.data.nodeRef=S.parent.nodeRef
}if(typeof N.data.userAccess=="undefined"){N.data.userAccess=S.parent.userAccess;
N.setUpLabel({label:N.label,style:S.parent.userAccess.create?"":"no-permission"})
}}if(S.items){var U,V;
for(var R=0,Q=S.items.length;
R<Q;
R++){U=S.items[R];
V=new YAHOO.widget.TextNode({label:s(U.name),path:p(L,U.name),nodeRef:U.nodeRef,description:U.description,userAccess:U.userAccess,style:U.userAccess.create?"":"no-permission"},N,false);
if(!U.hasChildren){V.isLeaf=true
}}if(S.resultsTrimmed){V=new YAHOO.widget.TextNode({label:"&lt;"+this.msg("message.folders-trimmed")+"&gt;",style:"folders-trimmed"},N,false)
}}T.argument.fnLoadComplete()
},failure:function O(T){try{var S=YAHOO.lang.JSON.parse(T.responseText);
var R=this.widgets.treeview.getRoot();
var Q=R.children[0];
Q.isLoading=false;
Q.isLeaf=true;
Q.label=S.message;
Q.labelStyle="ygtverror";
R.refresh()
}catch(U){}},scope:G,argument:{node:N,fnLoadComplete:K},timeout:7000};
YAHOO.util.Connect.asyncRequest("GET",M,P)
};
this._beforeShowDialog()
},_beforeShowDialog:function r(){if(this.options.pathNodeRef){var B=Alfresco.constants.PROXY_URI+"slingshot/doclib/node/"+this.options.pathNodeRef.uri+"/location";
if(this.options.rootNode){B+="?libraryRoot="+encodeURIComponent(this.options.rootNode.toString())
}Alfresco.util.Ajax.jsonGet({url:B,successCallback:{fn:function(D){if(D.json!==undefined){var C=D.json;
if(C.site){this.options.viewMode=x.VIEW_MODE_SITE;
this.options.path=p(C.site.path,C.site.file);
this.options.siteId=C.site.site;
this.options.siteTitle=C.site.siteTitle
}else{this.options.viewMode=x.VIEW_MODE_REPOSITORY;
this.options.path=p(C.repo.path,C.repo.file);
this.options.siteId=null;
this.options.siteTitle=null
}this._showDialog()
}},scope:this},failureMessage:this.msg("message.failure")})
}else{this._showDialog()
}},_showDialog:function o(){this.widgets.okButton.set("disabled",false);
this.widgets.cancelButton.set("disabled",false);
var F=b.get(this.id+"-title");
if(this.options.title){F.innerHTML=this.options.title
}else{if(YAHOO.lang.isArray(this.options.files)){F.innerHTML=this.msg("title.multi",this.options.files.length)
}else{F.innerHTML=this.msg("title.single",'<span class="light">'+s(this.options.files.displayName)+"</span>")
}}var B=Alfresco.util.arrayToObject(this.options.allowedViewModes),G=this.widgets.modeButtons.getButtons(),H,D;
if(!(this.options.viewMode in B)){this.options.viewMode=this.options.allowedViewModes[0]
}for(var C=0,E=G.length;
C<E;
C++){H=G[C];
D=parseInt(H.get("name"),10);
H.set("disabled",!(D in B));
if(D==this.options.viewMode){if(H.get("checked")){this.setViewMode(D)
}else{H.set("checked",true)
}}}if(!this.widgets.escapeListener){this.widgets.escapeListener=new q(document,{keys:q.KEY.ESCAPE},{fn:function(J,I){this.onCancel()
},scope:this,correctScope:true})
}this.widgets.escapeListener.enable();
this.widgets.dialog.show()
},setViewMode:function i(B){this.options.viewMode=B;
if(B==x.VIEW_MODE_SITE){b.removeClass(this.id+"-wrapper","repository-mode");
this._populateSitePicker()
}else{b.addClass(this.id+"-wrapper","repository-mode");
this._buildTree(B==x.VIEW_MODE_USERHOME?this.options.userHome:this.options.rootNode);
this.onPathChanged(this.options.path?this.options.path:"/")
}},onSiteChanged:function y(G,E){if(z(this,E)){var I=E[1];
if(I!==null){if(I.site!==null){this.options.siteId=I.site;
this.options.siteTitle=I.siteTitle;
this._populateContainerPicker();
var H=v.query("a",this.id+"-sitePicker"),D,F,C,B=b.get(this.id+"-sitePicker");
for(F=0,C=H.length;
F<C;
F++){D=H[F];
if(D.getAttribute("rel")==I.site){b.addClass(D,"selected");
if(I.scrollTo){B.scrollTop=b.getY(D)-b.getY(B)
}}else{b.removeClass(D,"selected")
}}}}}},onContainerChanged:function f(G,E){if(z(this,E)){var I=E[1];
if(I!==null){if(I.container!==null){this.options.containerId=I.container;
this.options.containerType=this.containers[I.container].type;
this._buildTree(this.containers[I.container].nodeRef);
this.onPathChanged(this.options.path);
var H=v.query("a",this.id+"-containerPicker"),B,F,D,C=b.get(this.id+"-containerPicker");
for(F=0,D=H.length;
F<D;
F++){B=H[F];
if(B.getAttribute("rel")==I.container){b.addClass(B,"selected");
if(I.scrollTo){C.scrollTop=b.getY(B)-b.getY(C)
}}else{b.removeClass(B,"selected")
}}}}}},onOK:function j(C,D){this.widgets.escapeListener.disable();
this.widgets.dialog.hide();
var B=this.selectedNode?this.selectedNode.data:null;
if(B&&this.options.viewMode==x.VIEW_MODE_SITE){B.siteId=this.options.siteId;
B.siteTitle=this.options.siteTitle;
B.containerId=this.options.containerId
}YAHOO.Bubbling.fire("folderSelected",{selectedFolder:B,eventGroup:this})
},onCancel:function a(B,C){this.widgets.escapeListener.disable();
this.widgets.dialog.hide()
},onViewModeChange:function l(D,E){var C=this.options.viewMode;
try{C=parseInt(D.newValue.get("name"),10);
this.setViewMode(C)
}catch(B){}},onExpandComplete:function h(E){Alfresco.logger.debug("DLGF_onExpandComplete");
this.widgets.treeview.render();
this._showHighlight(true);
if(this.pathsToExpand&&this.pathsToExpand.length>0){var D=this.widgets.treeview.getNodeByProperty("path",this.pathsToExpand.shift());
if(D!==null){var C=D.getContentEl(),B=b.get(this.id+"-treeview");
B.scrollTop=b.getY(C)-(B.scrollHeight/3);
if(D.data.path==this.currentPath){this._updateSelectedNode(D)
}D.expand()
}}},onNodeClicked:function u(C){Alfresco.logger.debug("DLGF_onNodeClicked");
var D=C.node,B=D.data.userAccess;
if((B&&B.create)||(D.data.nodeRef=="")||(D.data.nodeRef.indexOf("alfresco://")===0)){this.onPathChanged(D.data.path);
this._updateSelectedNode(D)
}return false
},onPathChanged:function d(F){Alfresco.logger.debug("DLGF_onPathChanged:"+F);
if(F.charAt(0)!="/"){F="/"+F
}this.currentPath=F;
var E=this.widgets.treeview.getNodeByProperty("path",F);
if(E!==null){this._updateSelectedNode(E);
E.expand();
while(E.parent!==null){E=E.parent;
E.expand()
}return
}var G=F.split("/"),D="/";
if(F==="/"){G=[""]
}this.pathsToExpand=[];
for(var C=0,B=G.length;
C<B;
C++){D=p("/",D,G[C]);
this.pathsToExpand.push(D)
}Alfresco.logger.debug("DLGF_onPathChanged paths to expand:"+this.pathsToExpand.join(","));
do{E=this.widgets.treeview.getNodeByProperty("path",this.pathsToExpand.shift())
}while(this.pathsToExpand.length>0&&E.expanded);
if(E!==null){E.expand()
}},_populateSitePicker:function w(){var C=b.get(this.id+"-sitePicker"),F=this;
C.innerHTML="";
var E=function B(I,M){var N=I.json,K,G,L,J,P=null;
var O=function H(Q){return function(){YAHOO.Bubbling.fire("siteChanged",{site:Q.shortName,siteTitle:Q.title,eventGroup:F});
return false
}
};
if(N.length>0){P=N[0]
}for(L=0,J=N.length;
L<J;
L++){G=N[L];
K=document.createElement("div");
if(L==J-1){b.addClass(K,"last")
}K.innerHTML='<a rel="'+G.shortName+'" href="#""><h4>'+s(G.title)+"</h4><span>"+s(G.description)+"</span></a>";
K.onclick=O(G);
M.appendChild(K)
}YAHOO.Bubbling.fire("siteChanged",{site:(this.options.siteId&&this.options.siteId.length>0)?this.options.siteId:P.shortName,siteTitle:(this.options.siteId&&this.options.siteId.length>0)?this.options.siteTitle:P.title,eventGroup:this,scrollTo:true})
};
var D={url:Alfresco.constants.PROXY_URI+"api/sites",responseContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:E,scope:this,obj:C},failureCallback:null};
Alfresco.util.Ajax.request(D)
},_populateContainerPicker:function e(){var F=b.get(this.id+"-containerPicker"),E=this;
F.innerHTML="";
var D=function B(I,N){var H=I.json.containers,K,G,L,J;
this.containers={};
var O=function M(P){return function(){YAHOO.Bubbling.fire("containerChanged",{container:P,eventGroup:E});
return false
}
};
for(L=0,J=H.length;
L<J;
L++){G=H[L];
this.containers[G.name]=G;
K=document.createElement("div");
if(L==J-1){b.addClass(K,"last")
}K.innerHTML='<a rel="'+G.name+'" href="#"><h4>'+G.name+"</h4><span>"+G.description+"</span></a>";
K.onclick=O(G.name);
N.appendChild(K)
}YAHOO.Bubbling.fire("containerChanged",{container:this.options.containerId,eventGroup:this,scrollTo:true})
};
var C={url:Alfresco.constants.PROXY_URI+"slingshot/doclib/containers/"+this.options.siteId,responseContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:D,scope:this,obj:F},failureCallback:null};
Alfresco.util.Ajax.request(C)
},_buildTree:function g(D){Alfresco.logger.debug("DLGF__buildTree");
var B=new YAHOO.widget.TreeView(this.id+"-treeview");
this.widgets.treeview=B;
YAHOO.widget.TreeView.FOCUS_CLASS_NAME="";
B.setDynamicLoad(this.fnLoadNodeData);
var C="location.path.repository";
if(this.options.viewMode==x.VIEW_MODE_SITE){if(this.options.containerType=="dod:filePlan"){C="location.path.filePlan"
}else{C="location.path.documents"
}}else{if(this.options.viewMode==x.VIEW_MODE_USERHOME){C="location.path.userHome"
}}var E=new YAHOO.widget.TextNode({label:this.msg(C),path:"/",nodeRef:D},B.getRoot(),false);
B.subscribe("clickEvent",this.onNodeClicked,this,true);
B.subscribe("expandComplete",this.onExpandComplete,this,true);
B.render()
},_showHighlight:function n(B){Alfresco.logger.debug("DLGF__showHighlight");
if(this.selectedNode!==null){if(B){b.addClass(this.selectedNode.getEl(),"selected")
}else{b.removeClass(this.selectedNode.getEl(),"selected")
}}},_updateSelectedNode:function t(B){Alfresco.logger.debug("DLGF__updateSelectedNode");
this._showHighlight(false);
this.selectedNode=B;
this._showHighlight(true)
},_buildTreeNodeUrl:function c(C){var D=Alfresco.constants.PROXY_URI;
if(this.options.viewMode==x.VIEW_MODE_SITE){if(this.options.containerType=="dod:filePlan"){D+="slingshot/doclib/dod5015/treenode/site/{site}/{container}{path}"
}else{D+="slingshot/doclib/treenode/site/{site}/{container}{path}"
}D+="?children="+this.options.evaluateChildFoldersSite;
D+="&max="+this.options.maximumFolderCountSite
}else{if(this.options.viewMode==x.VIEW_MODE_USERHOME){D+="slingshot/doclib/treenode/node/{userHome}{path}";
D+="?children="+this.options.evaluateChildFoldersRepo
}else{D+="slingshot/doclib/treenode/node/alfresco/company/home{path}";
D+="?children="+this.options.evaluateChildFoldersRepo;
D+="&libraryRoot="+this.options.rootNode
}D+="&max="+this.options.maximumFolderCountRepo
}var B=YAHOO.lang.substitute(D,{site:encodeURIComponent(this.options.siteId),container:encodeURIComponent(this.options.containerId),userHome:this.options.userHome.replace(":/",""),path:Alfresco.util.encodeURIPath(C)});
return B
}});
var A=new Alfresco.module.DoclibGlobalFolder("null")
})();
(function(){Alfresco.module.DoclibCopyMoveTo=function(h){Alfresco.module.DoclibCopyMoveTo.superclass.constructor.call(this,h);
this.name="Alfresco.module.DoclibCopyMoveTo";
Alfresco.util.ComponentManager.reregister(this);
return this
};
YAHOO.extend(Alfresco.module.DoclibCopyMoveTo,Alfresco.module.DoclibGlobalFolder,{setOptions:function g(j){var h={allowedViewModes:[Alfresco.module.DoclibGlobalFolder.VIEW_MODE_SITE,Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY,Alfresco.module.DoclibGlobalFolder.VIEW_MODE_USERHOME],extendedTemplateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/copy-move-to"};
if(typeof j.mode!=="undefined"){var i={copy:"copy-to",move:"move-to"};
if(typeof i[j.mode]=="undefined"){throw new Error("Alfresco.module.CopyMoveTo: Invalid mode '"+j.mode+"'")
}h.dataWebScript=i[j.mode]
}if(typeof j.workingMode!=="undefined"){h.viewMode=(j.workingMode==Alfresco.doclib.MODE_SITE)?Alfresco.module.DoclibGlobalFolder.VIEW_MODE_SITE:Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY;
this.modules.actions=new Alfresco.module.DoclibActions(j.workingMode)
}return Alfresco.module.DoclibCopyMoveTo.superclass.setOptions.call(this,YAHOO.lang.merge(h,j))
},onTemplateLoaded:function a(h){Alfresco.util.Ajax.request({url:this.options.extendedTemplateUrl,dataObj:{htmlid:this.id},successCallback:{fn:this.onExtendedTemplateLoaded,obj:h,scope:this},failureMessage:"Could not load 'copy-move-to' template:"+this.options.extendedTemplateUrl,execScripts:true})
},onExtendedTemplateLoaded:function c(h,i){Alfresco.module.DoclibCopyMoveTo.superclass.onTemplateLoaded.call(this,i)
},onOK:function d(q,v){var k,w=[],n,p,o,m={copy:"Copied",move:"Moved"};
if(YAHOO.lang.isArray(this.options.files)){k=this.options.files
}else{k=[this.options.files]
}for(p=0,o=k.length;
p<o;
p++){w.push(k[p].nodeRef)
}var u=function s(A){var x,B=A.json.successCount,C=A.json.failureCount;
this.widgets.dialog.hide();
if(!A.json.overallSuccess){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.failure")});
return
}YAHOO.Bubbling.fire("files"+m[this.options.mode],{destination:this.currentPath,successCount:B,failureCount:C});
for(var z=0,y=A.json.totalResults;
z<y;
z++){x=A.json.results[z];
if(x.success){YAHOO.Bubbling.fire((x.type=="folder"?"folder":"file")+m[this.options.mode],{multiple:true,nodeRef:x.nodeRef,destination:this.currentPath})
}}Alfresco.util.PopupManager.displayMessage({text:this.msg("message.success",B)})
};
var l=function h(i){this.widgets.dialog.hide();
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.failure")})
};
var r=this.options.dataWebScript+"/node/{nodeRef}",t=new Alfresco.util.NodeRef(this.selectedNode.data.nodeRef);
this.modules.actions.genericAction({success:{callback:{fn:u,scope:this}},failure:{callback:{fn:l,scope:this}},webscript:{method:Alfresco.util.Ajax.POST,name:r,params:{nodeRef:t.uri}},wait:{message:this.msg("message.please-wait")},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{nodeRefs:w}}});
this.widgets.okButton.set("disabled",true);
this.widgets.cancelButton.set("disabled",true)
},msg:function b(i){var h=Alfresco.util.message.call(this,this.options.mode+"."+i,this.name,Array.prototype.slice.call(arguments).slice(1));
if(h==(this.options.mode+"."+i)){h=Alfresco.util.message.call(this,i,this.name,Array.prototype.slice.call(arguments).slice(1))
}if(h==i){h=Alfresco.util.message(i,"Alfresco.module.DoclibGlobalFolder",Array.prototype.slice.call(arguments).slice(1))
}return h
},_showDialog:function f(){this.widgets.okButton.set("label",this.msg("button"));
return Alfresco.module.DoclibCopyMoveTo.superclass._showDialog.apply(this,arguments)
}});
var e=new Alfresco.module.DoclibCopyMoveTo("null")
})();
(function(){var f=YAHOO.util.Dom,n=YAHOO.util.Event;
var e=Alfresco.util.encodeHTML,h=Alfresco.util.userProfileLink;
Alfresco.PeopleFinder=function(p){Alfresco.PeopleFinder.superclass.constructor.call(this,"Alfresco.PeopleFinder",p,["button","container","datasource","datatable","json"]);
this.userSelectButtons={};
this.searchTerm="";
this.singleSelectedUser="";
this.selectedUsers={};
this.notAllowed={};
YAHOO.Bubbling.on("personSelected",this.onPersonSelected,this);
YAHOO.Bubbling.on("personDeselected",this.onPersonDeselected,this);
return this
};
YAHOO.lang.augmentObject(Alfresco.PeopleFinder,{VIEW_MODE_DEFAULT:"",VIEW_MODE_COMPACT:"COMPACT",VIEW_MODE_FULLPAGE:"FULLPAGE"});
YAHOO.lang.extend(Alfresco.PeopleFinder,Alfresco.component.Base,{options:{siteId:"",viewMode:Alfresco.PeopleFinder.VIEW_MODE_DEFAULT,singleSelectMode:false,showSelf:true,minSearchTermLength:1,maxSearchResults:100,setFocus:false,addButtonLabel:null,addButtonSuffix:"",dataWebScript:""},userSelectButtons:null,searchTerm:null,singleSelectedUser:null,selectedUsers:null,notAllowed:null,isSearching:false,onReady:function b(){var q=this;
if(this.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT){f.addClass(this.id+"-body","compact");
f.removeClass(this.id+"-results","hidden")
}else{if(this.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_FULLPAGE){f.setStyle(this.id+"-results","height","auto");
f.removeClass(this.id+"-help","hidden")
}else{f.setStyle(this.id+"-results","height","300px");
f.removeClass(this.id+"-results","hidden")
}}this.widgets.searchButton=Alfresco.util.createYUIButton(this,"search-button",this.onSearchClick);
var t=Alfresco.constants.PROXY_URI+YAHOO.lang.substitute(this.options.dataWebScript,this.options);
t+=(t.indexOf("?")<0)?"?":"&";
this.widgets.dataSource=new YAHOO.util.DataSource(t,{responseType:YAHOO.util.DataSource.TYPE_JSON,connXhrMode:"queueRequests",responseSchema:{resultsList:"people"}});
this.widgets.dataSource.doBeforeParseData=function s(z,w){var v=w;
if(w){var u=w.people,x,y;
if(u.length>q.options.maxSearchResults){u=u.slice(0,q.options.maxSearchResults-1)
}if(!q.options.showSelf){for(x=0,y=u.length;
x<y;
x++){if(u[x].userName==Alfresco.constants.USERNAME){u.splice(x,1);
break
}}}u.sort(function(D,C){var B=D.firstName+D.lastName,A=C.firstName+C.lastName;
return(B>A)?1:(B<A)?-1:0
});
q.notAllowed={};
if(w.notAllowed){q.notAllowed=Alfresco.util.arrayToObject(w.notAllowed)
}v={people:u}
}return v
};
this._setupDataTable();
var r=f.get(this.id+"-search-text");
var p=new YAHOO.util.KeyListener(r,{keys:YAHOO.util.KeyListener.KEY.ENTER},{fn:function(u,v,w){q.onSearchClick();
n.stopEvent(v[1]);
return false
},scope:this,correctScope:true},YAHOO.env.ua.ie>0?YAHOO.util.KeyListener.KEYDOWN:"keypress");
p.enable();
if(this.options.setFocus){r.focus()
}},_setupDataTable:function c(){var v=this;
var r=function u(A,z,B,C){f.setStyle(A.parentNode,"width",B.width+"px");
var y=Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png";
if(z.getData("avatar")!==undefined){y=Alfresco.constants.PROXY_URI+z.getData("avatar")+"?c=queue&ph=true"
}A.innerHTML='<img class="avatar" src="'+y+'" alt="avatar" />'
};
var p=function w(H,K,E,B){var G=K.getData("userName"),A=G,I=K.getData("firstName"),J=K.getData("lastName"),y=K.getData("userStatus"),C=K.getData("userStatusTime");
if((I!==undefined)||(J!==undefined)){A=I?I+" ":"";
A+=J?J:""
}var F=K.getData("jobtitle")||"",z=K.getData("organization")||"";
var D='<h3 class="itemname">'+h(G,A,'class="theme-color-1" tabindex="0"')+' <span class="lighter">('+e(G)+")</span></h3>";
if(F.length!==0){if(v.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT){D+='<div class="detail">'+e(F)+"</div>"
}else{D+='<div class="detail"><span>'+v.msg("label.title")+":</span> "+e(F)+"</div>"
}}if(z.length!==0){if(v.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT){D+='<div class="detail">&nbsp;('+e(z)+")</div>"
}else{D+='<div class="detail"><span>'+v.msg("label.company")+":</span> "+e(z)+"</div>"
}}if(y!==null&&v.options.viewMode!==Alfresco.PeopleFinder.VIEW_MODE_COMPACT){D+='<div class="user-status">'+e(y)+" <span>("+Alfresco.util.relativeTime(Alfresco.util.fromISO8601(C.iso8601))+")</span></div>"
}H.innerHTML=D
};
var s=function q(B,z,C,E){f.setStyle(B.parentNode,"width",C.width+"px");
f.setStyle(B.parentNode,"text-align","right");
var A=z.getData("userName"),D='<span id="'+v.id+"-select-"+A+'"></span>';
B.innerHTML=D;
if(v.options.viewMode!==Alfresco.PeopleFinder.VIEW_MODE_FULLPAGE){var y=new YAHOO.widget.Button({type:"button",label:(v.options.addButtonLabel?v.options.addButtonLabel:v.msg("button.add"))+" "+v.options.addButtonSuffix,name:v.id+"-selectbutton-"+A,container:v.id+"-select-"+A,tabindex:0,disabled:A in v.notAllowed,onclick:{fn:v.onPersonSelect,obj:z,scope:v}});
v.userSelectButtons[A]=y;
if((A in v.selectedUsers)||(v.options.singleSelectMode&&v.singleSelectedUser!=="")){v.userSelectButtons[A].set("disabled",true)
}}};
var t=[{key:"avatar",label:"Avatar",sortable:false,formatter:r,width:this.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT?36:70},{key:"person",label:"Description",sortable:false,formatter:p},{key:"actions",label:"Actions",sortable:false,formatter:s,width:80}];
this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-results",t,this.widgets.dataSource,{renderLoopSize:Alfresco.util.RENDERLOOPSIZE,initialLoad:false,MSG_EMPTY:this.msg("message.instructions")});
this.widgets.dataTable.doBeforeLoadData=function x(y,z,A){if(z.results){this.renderLoopSize=Alfresco.util.RENDERLOOPSIZE
}return true
};
this.widgets.dataTable.subscribe("rowMouseoverEvent",this.widgets.dataTable.onEventHighlightRow);
this.widgets.dataTable.subscribe("rowMouseoutEvent",this.widgets.dataTable.onEventUnhighlightRow)
},clearResults:function k(){if(this.widgets.dataTable){var p=this.widgets.dataTable.getRecordSet().getLength();
this.widgets.dataTable.deleteRows(0,p)
}f.get(this.id+"-search-text").value="";
this.singleSelectedUser="";
this.selectedUsers={}
},onPersonSelect:function g(p,r){var q=r.getData("userName");
YAHOO.Bubbling.fire("personSelected",{eventGroup:this,userName:q,firstName:r.getData("firstName"),lastName:r.getData("lastName"),email:r.getData("email")})
},onSearchClick:function m(q,r){var p=f.get(this.id+"-search-text").value;
if(p.replace(/\*/g,"").length<this.options.minSearchTermLength){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.minimum-length",this.options.minSearchTermLength)});
return
}this.userSelectButtons={};
this._performSearch(p)
},onPersonSelected:function i(r,p){var t=p[1];
if(t&&(t.userName!==undefined)){var s=t.userName;
this.selectedUsers[s]=true;
this.singleSelectedUser=s;
if(this.options.singleSelectMode){for(var q in this.userSelectButtons){if(this.userSelectButtons.hasOwnProperty(q)){this.userSelectButtons[q].set("disabled",true)
}}}else{if(this.userSelectButtons[s]){this.userSelectButtons[s].set("disabled",true)
}}}},onPersonDeselected:function a(r,p){var s=p[1];
if(s&&(s.userName!==undefined)){delete this.selectedUsers[s.userName];
this.singleSelectedUser="";
if(this.options.singleSelectMode){for(var q in this.userSelectButtons){if(this.userSelectButtons.hasOwnProperty(q)){this.userSelectButtons[q].set("disabled",false)
}}}else{if(this.userSelectButtons[s.userName]){this.userSelectButtons[s.userName].set("disabled",false)
}}}},_setDefaultDataTableErrors:function o(p){var q=Alfresco.util.message;
p.set("MSG_EMPTY",q("message.empty","Alfresco.PeopleFinder"));
p.set("MSG_ERROR",q("message.error","Alfresco.PeopleFinder"))
},_performSearch:function d(p){if(!this.isSearching){this.isSearching=true;
this._setDefaultDataTableErrors(this.widgets.dataTable);
this.widgets.dataTable.set("MSG_EMPTY",this.msg("message.searching"));
this.widgets.dataTable.deleteRows(0,this.widgets.dataTable.getRecordSet().getLength());
var q=function s(u,v,w){if(this.options.viewMode!=Alfresco.PeopleFinder.VIEW_MODE_COMPACT){if(f.hasClass(this.id+"-results","hidden")){f.removeClass(this.id+"-results","hidden");
f.addClass(this.id+"-help","hidden")
}}this._enableSearchUI();
this._setDefaultDataTableErrors(this.widgets.dataTable);
this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,u,v,w)
};
var r=function t(v,w){this._enableSearchUI();
if(w.status==401){window.location.reload()
}else{try{var u=YAHOO.lang.JSON.parse(w.responseText);
this.widgets.dataTable.set("MSG_ERROR",u.message);
this.widgets.dataTable.showTableMessage(u.message,YAHOO.widget.DataTable.CLASS_ERROR)
}catch(x){this._setDefaultDataTableErrors(this.widgets.dataTable)
}}};
this.searchTerm=p;
this.widgets.dataSource.sendRequest(this._buildSearchParams(p),{success:q,failure:r,scope:this});
this.widgets.searchButton.set("disabled",true);
YAHOO.lang.later(2000,this,function(){if(this.isSearching){if(!this.widgets.feedbackMessage){this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message("message.searching",this.name),spanClass:"wait",displayTime:0})
}else{if(!this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.show()
}}}},[])
}},_enableSearchUI:function l(){if(this.widgets.feedbackMessage&&this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.hide()
}this.widgets.searchButton.set("disabled",false);
this.isSearching=false
},_buildSearchParams:function j(p){return"filter="+encodeURIComponent(p)+"&maxResults="+this.options.maxSearchResults
}})
})();
(function(){var h=YAHOO.util.Dom;
var e=Alfresco.util.encodeHTML;
Alfresco.module.DoclibPermissions=function(n){Alfresco.module.DoclibPermissions.superclass.constructor.call(this,"Alfresco.module.DoclibPermissions",n,["button","container","connection","json"]);
this.rolePickers={};
return this
};
YAHOO.extend(Alfresco.module.DoclibPermissions,Alfresco.component.Base,{options:{siteId:"",roles:null,files:null,width:"44em"},rolePickers:null,containerDiv:null,showDialog:function f(){if(!this.modules.actions){this.modules.actions=new Alfresco.module.DoclibActions()
}if(!this.containerDiv){Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/permissions",dataObj:{htmlid:this.id,site:this.options.siteId},successCallback:{fn:this.onTemplateLoaded,scope:this},failureMessage:"Could not load Document Library Permissions template",execScripts:true})
}else{this._showDialog()
}},onTemplateLoaded:function c(o){this.containerDiv=document.createElement("div");
this.containerDiv.setAttribute("style","display:none");
this.containerDiv.innerHTML=o.serverResponse.responseText;
var s=h.getFirstChild(this.containerDiv);
while(s&&s.tagName.toLowerCase()!="div"){s=h.getNextSibling(s)
}this.widgets.dialog=Alfresco.util.createYUIPanel(s,{width:this.options.width});
this.widgets.okButton=Alfresco.util.createYUIButton(this,"ok",this.onOK);
this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel",this.onCancel);
var r=YAHOO.util.Selector.query("button.site-group",this.widgets.dialog.element),t,n;
for(var q=0,p=r.length;
q<p;
q++){t=r[q].id;
n=r[q].value;
this.rolePickers[n]=new YAHOO.widget.Button(t,{type:"menu",menu:t+"-select"});
this.rolePickers[n].getMenu().subscribe("click",this.onRoleSelected,this.rolePickers[n])
}this.widgets.resetAll=Alfresco.util.createYUIButton(this,"reset-all",this.onResetAll);
this._showDialog()
},onRoleSelected:function m(o,n,p){var q=n[1];
p.set("label",q.cfg.getProperty("text"));
p.set("name",q.value)
},onResetAll:function b(n,o){this._applyPermissions("reset-all")
},onOK:function i(o,p){var n=this._parseUI();
this._applyPermissions("set",n)
},_applyPermissions:function d(q,t){var o,w=[];
o=this.options.files;
for(var s=0,r=o.length;
s<r;
s++){w.push(o[s].nodeRef)
}var v=function u(A){var x;
var B=A.json.successCount;
var C=A.json.failureCount;
this._hideDialog();
if(!A.json.overallSuccess){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.permissions.failure")});
return
}YAHOO.Bubbling.fire("filesPermissionsUpdated",{successCount:B,failureCount:C});
for(var z=0,y=A.json.totalResults;
z<y;
z++){x=A.json.results[z];
if(x.success){YAHOO.Bubbling.fire(x.type=="folder"?"folderPermissionsUpdated":"filePermissionsUpdated",{multiple:true,nodeRef:x.nodeRef})
}}Alfresco.util.PopupManager.displayMessage({text:this.msg("message.permissions.success",B)})
};
var p=function n(x){this._hideDialog();
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.permissions.failure")})
};
this.modules.actions.genericAction({success:{callback:{fn:v,scope:this}},failure:{callback:{fn:p,scope:this}},webscript:{method:Alfresco.util.Ajax.POST,name:"permissions/{operation}/site/{site}",params:{site:this.options.siteId,operation:q}},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{nodeRefs:w,permissions:t}}});
this.widgets.okButton.set("disabled",true);
this.widgets.cancelButton.set("disabled",true)
},onCancel:function a(n,o){this._hideDialog()
},_showDialog:function g(){var q,p;
this.widgets.okButton.set("disabled",false);
this.widgets.cancelButton.set("disabled",false);
var s=h.get(this.id+"-title");
if(YAHOO.lang.isArray(this.options.files)){s.innerHTML=this.msg("title.multi",this.options.files.length)
}else{var n='<span class="light">'+e(this.options.files.displayName)+"</span>";
s.innerHTML=this.msg("title.single",n);
this.options.files=[this.options.files]
}for(var u in this.rolePickers){if(this.rolePickers.hasOwnProperty(u)){this.rolePickers[u].set("name","");
this.rolePickers[u].set("label",this.msg("role.None"))
}}var t=this.options.files[0].permissions.roles;
var r;
for(q=0,p=t.length;
q<p;
q++){r=t[q].split(";");
if(r[2] in this.options.roles){this.rolePickers[r[1]].set("name",r[2]);
this.rolePickers[r[1]].set("label",this.msg("role."+r[2]))
}}var o=new YAHOO.util.KeyListener(document,{keys:YAHOO.util.KeyListener.KEY.ESCAPE},{fn:function(w,v){this.onCancel()
},scope:this,correctScope:true});
o.enable();
this.widgets.dialog.show()
},_hideDialog:function j(){var n=h.get(this.id+"-form");
Alfresco.util.undoCaretFix(n);
this.widgets.dialog.hide()
},_parseUI:function k(){var o=[],p;
for(var n in this.rolePickers){if(this.rolePickers.hasOwnProperty(n)){p=this.rolePickers[n].get("name");
if((p!="")&&(p!="None")){o.push({group:this.rolePickers[n].get("value"),role:p})
}}}return o
}});
var l=new Alfresco.module.DoclibPermissions("null")
})();
(function(){var g=YAHOO.util.Dom,n=YAHOO.util.Event;
var d=Alfresco.util.encodeHTML;
Alfresco.module.DoclibAspects=function(o){Alfresco.module.DoclibAspects.superclass.constructor.call(this,o,["button","container","datasource","datatable"]);
this.eventGroup=o;
this.currentValues=[];
this.selectedValues={};
return this
};
YAHOO.extend(Alfresco.module.DoclibAspects,Alfresco.module.SimpleDialog,{currentValues:null,selectedValues:null,setOptions:function f(o){Alfresco.module.DoclibAspects.superclass.setOptions.call(this,{width:"50em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/aspects",doBeforeDialogShow:{fn:this.doBeforeDialogShow,obj:null,scope:this},doBeforeAjaxRequest:{fn:this.doBeforeAjaxRequest,obj:null,scope:this}});
this.options=YAHOO.lang.merge(this.options,o);
return this
},renderItem:function b(q,p){var o=function(v,x,w){var s="";
if(v.toLowerCase()=="icon"){var u="",r="",t;
if(w&&w.length>0){t=w.split(" ");
u=' width="'+t[0]+'"';
if(t.length>1){r=' height="'+t[1]+'"'
}}s='<img src="'+x+'"'+u+r+' alt="'+d(q.name)+'" title="'+d(q.name)+'" />'
}else{s=d(x)
}return s
};
return YAHOO.lang.substitute(p,q,o)
},i18n:function l(o,p){return this.msg("aspect."+o.replace(":","_"))
},doBeforeDialogShow:function i(p,r,q){var o='<span class="light">'+d(this.options.file.displayName)+"</span>";
g.get(this.id+"-title").innerHTML=this.msg("title",o);
if(!this.modules.actions){this.modules.actions=new Alfresco.module.DoclibActions(Alfresco.doclib.MODE_REPOSITORY)
}this._createAspectsControls();
this._requestAspectData();
this.widgets.okButton.set("disabled",false);
this.widgets.cancelButton.set("disabled",false)
},doBeforeAjaxRequest:function a(r){var p=function q(t){this.hide();
Alfresco.util.PopupManager.displayMessage({text:this.msg(t.json.overallSuccess?"message.aspects.success":"message.aspects.failure")});
if(t.json.results[0].tagScope){}};
var s=function o(t){this.hide();
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.aspects.failure")})
};
this.modules.actions.genericAction({success:{event:{name:"metadataRefresh",obj:{highlightFile:this.options.file.name}},callback:{fn:p,scope:this}},failure:{callback:{fn:s,scope:this}},webscript:{method:Alfresco.util.Ajax.POST,name:"aspects/node/{nodeRef}",params:{nodeRef:this.options.file.nodeRef.replace(":/","")}},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{added:this.getAddedValues(),removed:this.getRemovedValues()}}});
return false
},getAddedValues:function m(){var q=[],o=Alfresco.util.arrayToObject(this.currentValues);
for(var p in this.selectedValues){if(this.selectedValues.hasOwnProperty(p)){if(!(p in o)){q.push(p)
}}}return q
},getRemovedValues:function k(){var q=[],o=Alfresco.util.arrayToObject(this.currentValues);
for(var p in o){if(o.hasOwnProperty(p)){if(!(p in this.selectedValues)){q.push(p)
}}}return q
},_createAspectsControls:function j(){var v=this;
var t=function t(z,y,A,B){g.setStyle(z.parentNode,"width",A.width+"px");
z.innerHTML=v.renderItem(y.getData(),"<div>{icon 16 16}</div>")
};
var w=function w(z,y,A,B){z.innerHTML=v.renderItem(y.getData(),'<h3 class="name">{name}</h3>')
};
var o=function o(z,y,A,B){g.setStyle(z.parentNode,"width",A.width+"px");
if(y.getData("canAdd")){z.innerHTML='<a href="#" class="add-item add-'+v.eventGroup+'" title="'+v.msg("button.add")+'"><span class="addIcon">&nbsp;</span></a>'
}};
var r=function r(z,y,A,B){g.setStyle(z.parentNode,"width",A.width+"px");
if(y.getData("canRemove")){z.innerHTML='<a href="#" class="remove-item remove-'+v.eventGroup+'" title="'+v.msg("button.remove")+'"><span class="removeIcon">&nbsp;</span></a>'
}};
this.widgets.dataSourceLeft=new YAHOO.util.DataSource([],{responseType:YAHOO.util.DataSource.TYPE_JSARRAY});
var u=[{key:"icon",label:"icon",sortable:false,formatter:t,width:10},{key:"name",label:"name",sortable:false,formatter:w},{key:"id",label:"add",sortable:false,formatter:o,width:16}];
this.widgets.dataTableLeft=new YAHOO.widget.DataTable(this.id+"-left",u,this.widgets.dataSourceLeft,{MSG_EMPTY:this.msg("label.loading")});
var q=function p(B,A){var y=YAHOO.Bubbling.getOwnerByTagName(A[1].anchor,"div");
if(y!==null){var D=A[1].target,C=D.offsetParent,z=v.widgets.dataTableLeft.getRecord(C);
if(z){v.widgets.dataTableRight.addRow(z.getData());
v.selectedValues[z.getData("id")]=z;
v.widgets.dataTableLeft.deleteRow(C)
}}return true
};
YAHOO.Bubbling.addDefaultAction("add-"+this.eventGroup,q);
this.widgets.dataSourceRight=new YAHOO.util.DataSource([],{responseType:YAHOO.util.DataSource.TYPE_JSARRAY});
var s=[{key:"icon",label:"icon",sortable:false,formatter:t,width:10},{key:"name",label:"name",sortable:false,formatter:w},{key:"id",label:"remove",sortable:false,formatter:r,width:16}];
this.widgets.dataTableRight=new YAHOO.widget.DataTable(this.id+"-right",s,this.widgets.dataSourceRight,{MSG_EMPTY:this.msg("label.loading")});
var x=function x(B,A){var y=YAHOO.Bubbling.getOwnerByTagName(A[1].anchor,"div");
if(y!==null){var D=A[1].target,C=D.offsetParent,z=v.widgets.dataTableRight.getRecord(C);
if(z){v.widgets.dataTableLeft.addRow(z.getData());
delete v.selectedValues[z.getData("id")];
v.widgets.dataTableRight.deleteRow(C)
}}return true
};
YAHOO.Bubbling.addDefaultAction("remove-"+this.eventGroup,x)
},_requestAspectData:function e(){this.selectedValues={};
Alfresco.util.Ajax.request({method:"GET",url:Alfresco.constants.PROXY_URI+"slingshot/doclib/aspects/node/"+this.options.file.nodeRef.replace(":/",""),successCallback:{fn:this._requestAspectDataSuccess,scope:this},failureCallback:{fn:this._requestAspectDataFailure,scope:this}})
},_requestAspectDataFailure:function h(){this.widgets.dataTableLeft.set("MSG_EMPTY",this.msg("label.load-failure"));
this.widgets.dataTableRight.set("MSG_EMPTY",this.msg("label.load-failure"))
},_requestAspectDataSuccess:function c(r){this.currentValues={};
if(typeof r.json!="undefined"){var q=r.json.current,o=Alfresco.util.arrayToObject(q),B=this.options.visible,A=Alfresco.util.arrayToObject(B),x=this.options.addable,s=this.options.removeable,t,z;
this.currentValues=q;
if(x.length===0){x=B.slice(0)
}if(s.length===0){s=B.slice(0)
}var v=Alfresco.util.arrayToObject(x),p=Alfresco.util.arrayToObject(s);
var w,y,u;
for(t=0,z=q.length;
t<z;
t++){w=q[t];
u={id:w,icon:Alfresco.constants.URL_RESCONTEXT+"components/images/aspect-16.png",name:this.i18n(w),canAdd:w in v,canRemove:w in p};
if(w in A){this.widgets.dataTableRight.addRow(u)
}this.selectedValues[w]=u
}for(t=0,z=x.length;
t<z;
t++){y=x[t];
if((y in A)&&!(y in o)){this.widgets.dataTableLeft.addRow({id:y,icon:Alfresco.constants.URL_RESCONTEXT+"components/images/aspect-16.png",name:this.i18n(y),canAdd:true,canRemove:true})
}}this.widgets.dataTableLeft.set("MSG_EMPTY",this.msg("label.no-addable"));
this.widgets.dataTableRight.set("MSG_EMPTY",this.msg("label.no-current"));
this.widgets.dataTableLeft.render();
this.widgets.dataTableRight.render()
}}})
})();
var doclibAspects=new Alfresco.module.DoclibAspects("null");