package edu.wisc.my.profile.util;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SessionUtils {
  
  protected static final Logger logger = LoggerFactory.getLogger(SessionUtils.class);
  
  public static String getHeader(HttpServletRequest request, String ... attributes) {
    Object valObject = null;
    
    for (String attribute : attributes) {
      logger.debug("Checking for attribute: " + attribute);
      valObject = request.getHeader(attribute);
      if(StringUtils.isNotBlank((String) valObject)) {
        logger.debug("Found valid value using attribute : " + attribute);
        break;
      }
    }
    if(valObject instanceof String)
      return (String) valObject;
    else 
      return null;
  }
}
