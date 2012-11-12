/*
Initialize Mouseover Panel

    - anchorId: The id attribute of the element which will be moused over
    - panelId: The id attribute of the element which will become the panel
    - delay: A time delay in milliseconds to wait before closing the panel
*/
var Combo = Combo || {};

Combo.initMouseoverPanel = function(anchorId, panelId, delay) {
    var timeout;
    var oAnchor = document.getElementById(anchorId);
    var oOverlay  = document.getElementById(panelId);

    // instantiate a new YUI panel object and render to the page

    var yuiPanel = new YAHOO.widget.Panel(panelId, {
        context: [anchorId, "tl", "bl"],
        width: "300px",
        draggable: false,
        visible: false,
        close: false,
        underlay: "shadow"
    });

    yuiPanel.render(document.body);

    // define a function to hide the panel when the time delay is reached

    var timeoutFunc = function() {
        yuiPanel.hide();
    };

    /*
    When the anchor is moused over show the panel. Also clear the timeout in
    the mouseover of the anchor or the panel if the timeout has been set in
    a previous mouseout event.
    */
    YAHOO.util.Event.addListener(oAnchor, "mouseover", function(e) {
        yuiPanel.align("tl", "bl"); // re-align in case page resized
        yuiPanel.show();
        if (timeout) clearTimeout(timeout);
    });

    YAHOO.util.Event.addListener(oOverlay, "mouseover", function(e) {
        if (timeout) clearTimeout(timeout);
    });

    /*
    When the mouse leaves the anchor or the panel set a timeout to hide the
    panel. The mouseover event will clear this timeout if the user moves
    the mouse over the panel or anchor. In other words, the timeout will only
    fire if the user moves the mouse away from both the anchor and the panel
    for the amout of time specified in 'delay'.
    */
    YAHOO.util.Event.addListener(oAnchor, "mouseout", function(e) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(timeoutFunc, delay);
    });

    YAHOO.util.Event.addListener(oOverlay, "mouseout", function(e) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(timeoutFunc, delay);
        });
}
