package org.sidelabs.workflow;

import org.sidelabs.workflow.SIDEActionHandler;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.net.URL;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class Util {

	private static final long serialVersionUID = 1L;
	private static Log logger = LogFactory.getLog(Util.class);

	public static Element getScript(String sUrl) {
		Element newScript = null;
		URL url = null;
		try {
			url = new URL(sUrl);
			 
			newScript = parse(url).getRootElement();
			logger.debug("Script Root element = " + newScript.getName());
			return newScript;
		} catch (Exception ex) {
			logger.error("Problem to get this url: " + sUrl);
			return null;
		}			 
    }

	public static Document parse(URL url) throws DocumentException {
        SAXReader reader = new SAXReader();
        Document document = reader.read(url);
        return document;
    }
}