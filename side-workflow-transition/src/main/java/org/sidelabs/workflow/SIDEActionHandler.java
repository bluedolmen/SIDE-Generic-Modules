/*
 * Copyright (C) 2005-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
package org.sidelabs.workflow;

import java.lang.reflect.Method;

import org.jbpm.graph.exe.ExecutionContext;
import org.alfresco.repo.workflow.jbpm.AlfrescoJavaScript;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.dom4j.Element;

/**
 * A jBPM Action Handler for executing Alfresco Script
 *
 * The configuration of this action is as follows:
 *  <script>
 *     <expression>
 *        the script to execute
 *     </expression>
 *     <variable name="watcha" access="write"/>
 *  </script>
 *
 * It's exactly the same as jBPM's own script configuration.
 *
 * @author davidc
 */
public class SIDEActionHandler extends AlfrescoJavaScript
{
    private static final long serialVersionUID = -2908748080671212745L;
	private static Log logger = LogFactory.getLog(SIDEActionHandler.class);

	private Element script;

    /* (non-Javadoc)
     * @see org.jbpm.graph.def.ActionHandler#execute(org.jbpm.graph.exe.ExecutionContext)
     */
    public void execute(final ExecutionContext executionContext) throws Exception {
        // validate script
        if (script != null) {
        	super.execute(executionContext);
        } else {
        	executeAction(executionContext);
        	if (script != null) {
            	super.execute(executionContext);
        	}
        }
	}

    public void executeAction(final ExecutionContext ec) throws Exception {}

	public void executeTransition(Class clazz, String aMethod) throws Exception {
		Class params[] = {};
		Object paramsObj[] = {};

		Method thisMethod = null;
		try {
			String method = aMethod.substring(0,1).toLowerCase() + aMethod.substring(1, aMethod.length());
			thisMethod = clazz.getDeclaredMethod(method, params);
	        thisMethod.invoke(this, paramsObj);
		} catch (Exception ex) {

		}
	}

	public void executeEvent(Class clazz, String eventType, String aNodeName) throws Exception {
		Class params[] = {};
		Object paramsObj[] = {};

		Method thisMethod = null;
		String nodeName = aNodeName.substring(0,1).toUpperCase() + aNodeName.substring(1, aNodeName.length());

		String prefix = Event.getMethodName(eventType);
		logger.debug("Method: " + prefix + nodeName);

		thisMethod = clazz.getDeclaredMethod(prefix + nodeName, params);
        thisMethod.invoke(this, paramsObj);
	}

    public void setScript(Element script) {
		this.script = script;
		super.setScript(script);
	}
}
