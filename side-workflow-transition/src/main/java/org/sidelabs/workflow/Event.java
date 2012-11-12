package org.sidelabs.workflow;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Event {

	private static final long serialVersionUID = 1L;
	private static Log logger = LogFactory.getLog(Util.class);

	public static String getMethodName(String eventType) {
		String prefix = "";
		if ("task-create".equalsIgnoreCase(eventType)) {
			prefix = "onCreatingTask";
		} else if ("task-start".equalsIgnoreCase(eventType)) {
			prefix = "onStartingTask";
		} else if ("task-assign".equalsIgnoreCase(eventType)) {
			prefix = "onAssigningTask";
		} else if ("task-end".equalsIgnoreCase(eventType)) {
			prefix = "onEndingTask";
		} else if ("node-enter".equalsIgnoreCase(eventType)) {
			prefix = "onEnteringNode";
		} else if ("node-leave".equalsIgnoreCase(eventType)) {
			prefix = "onLeavingNode";
		} else if ("before-signal".equalsIgnoreCase(eventType)) {
			prefix = "onSignalingBefore";
		} else if ("after-signal".equalsIgnoreCase(eventType)) {
			prefix = "onSignalingAfter";
		} else if ("superstate-enter".equalsIgnoreCase(eventType)) {
			prefix = "onEnteringSuperstate";
		} else if ("superstate-leave".equalsIgnoreCase(eventType)) {
			prefix = "onLeavingSuperstate";
		} else if ("transition".equalsIgnoreCase(eventType)) {
			prefix = "onTransition";
		} else if ("timer".equalsIgnoreCase(eventType)) {
			prefix = "onTimer";
		} else if ("subprocess-created".equalsIgnoreCase(eventType)) {
			prefix = "onCreatedSubprocess";
		} else if ("subprocess-end".equalsIgnoreCase(eventType)) {
			prefix = "onEndedSubprocess";
		} else if ("process-start".equalsIgnoreCase(eventType)) {
			prefix = "onStartingProcess";
		} else if ("process-end".equalsIgnoreCase(eventType)) {
			prefix = "onEndingProcess";
		} else {
			logger.debug("Unknown node type.");
		}
		
		return prefix;
	}
}
