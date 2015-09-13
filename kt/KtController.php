<?php

class KtController
{
	/**
	 * @url GET /
	 */
	public function index()
	{
		if($_GET['f'] == 'processKT(') {
			echo 'processKT(1,{"about":[{"id":"136854775807","the":"sentient","user":"127.0.0.1"}]});';

/*
        long startTime = System.currentTimeMillis();

        String[] tuples = request.getParameterValues("t");
        String[] keywords = request.getParameterValues("k");
        for (int i = 0; i < keywords.length; i++) {
          keywords[i] = UTFUtils.parseStringsForLiterals(keywords[i]);
        }
        
        String countStr = request.getParameter("max");
        String func = request.getParameter("f");
        if (func == null)
          func = "";
        if (tuples == null)
          tuples = new String[0];
        int count =
          (StringUtils.isDigit(countStr) ? Integer.parseInt(countStr) : 256);

        Set<String> filters = new LinkedHashSet<String>();
        String[] has = request.getParameterValues("has");
        for (int i = 0; has != null && i < has.length; i++ ) {
          String hasCurrent = has[i];
          if (hasCurrent != null && hasCurrent.length() > 0) {
            filters.add(hasCurrent);
          }
        }
        String newer = request.getParameter("newer");
        if (newer != null && newer.length() > 0) {
          filters.add("newer:" + newer);
        }

        String[] filtersAr =
          (String[])ArrayUtils.convert(filters.toArray(), String.class);

        String output = kt.getKeyword(tuples, keywords, count, filtersAr);
        PrintWriter out = response.getWriter();
        if (func.length() > 0)
          out.print(func);
        out.print(output);
        if (func.length() > 0)
          out.print(");");
        out.flush();
        out.close();
        long endTime = System.currentTimeMillis();
        long diff = endTime - startTime;
        LOG.info("kt.js: total time " + diff + "ms");
*/

		}
		
		if($_GET['f'] == 'processWISEKT(') {
			echo 'processWISEKT();';
		}
		
		if($_GET['f'] == 'processTriggerKT(') {
			echo 'processTriggerKT();';
		}
		
	}

  	public function getKeyword($tuples, $keywords, $count, $filters) {

/*
    	    if (ArrayUtils.isEmpty(keywords)) {
      		return "Incomplete";
    	    }

    	    try {

      HTableWrapper keywordTable =
        new HTableWrapper(this.conf, memCacheClient, new Text(KEYWORD_TABLE), true, false);
      JSONObject wrapper = new JSONObject();
      for (String keyword : keywords) {
        JSONObject keywordWrapper = new JSONObject();
        for (int i = 0; i < tuples.length; i++ ) {
          JSONArray jsonAr = new JSONArray();

          String curTuple = tuples[i];
          int curMax = count;
          int seperator = tuples[i].indexOf(':');

          // there is an individual tuple max ex: &t=tuple:max
          if (seperator != -1) {
            curTuple = tuples[i].substring(0, seperator);
            try {
              curMax = Integer.parseInt(tuples[i].substring(seperator + 1));
            }
            catch (NumberFormatException nfe) {
              curMax = count;
            }
          }

          Text tupleText = new Text("tuple:" + curTuple);
          byte[][] json = keywordTable.get(new Text(keyword), tupleText, count);
          if (json != null) {
            for (int j = 0; j < json.length && jsonAr.length() < curMax; j++ ) {
              JSONObject jsonObj = new JSONObject(new String(json[j]));
              boolean put = true;
              for (int f = 0; filters != null && f < filters.length; f++ ) {
                seperator = filters[f].indexOf(':');
                if (seperator != -1) {
                  String curFilter = filters[f].substring(0, seperator);
                  if (curFilter.equals("newer")) {
                    long id = Long.parseLong(jsonObj.getString("id"));
                    long newerThen =
                      Long.parseLong(filters[f].substring(seperator + 1));
                    if (id <= newerThen) {
                      put = false;
                    }
                  }
                  else if (!jsonObj.has(curFilter)) {
                    put = false;
                  }
                  else if (!(jsonObj.getString(curFilter).equals(filters[f]
                    .substring(seperator + 1)))) {
                    put = false;
                  }
                }
                else {
                  String curFilter = filters[f];
                  if (!jsonObj.has(curFilter)) {
                    put = false;
                  }
                }

                if (!put) {
                  break;
                }
              }
              if (put) {
                jsonAr.put(jsonObj);
              }
            }
          }
          keywordWrapper.put(curTuple, jsonAr);
        }
        JSONObject metaObj = new JSONObject();
        
        // get meta tick info
        byte[][] lMetaTick =
          keywordTable.get(new Text(keyword), new Text("meta:tick"), 1);
        int tick = 0;
        if ((lMetaTick != null) && (lMetaTick.length == 1)) {
          tick = Integer.parseInt(new String(lMetaTick[0]));
          metaObj.put("tick", tick);
        }
        
        // get meta last info
        byte[][] lMetaLast =
          keywordTable.get(new Text(keyword), new Text("meta:last"), 1);
        long last = 0;
        if ((lMetaLast != null) && (lMetaLast.length == 1)) {
          last = Long.parseLong(new String(lMetaLast[0]));
          metaObj.put("last", last);
        }
        
        // get meta rights info
        byte[][] lMetaRights =
          keywordTable.get(new Text(keyword), new Text("meta:rights"), 1);
        if (lMetaRights != null) {
          JSONObject rights = new JSONObject(new String(lMetaRights[0]));
          if (rights.length() != 0) {
            metaObj.put("rights", rights);
          }
        }

        keywordWrapper.put("_meta", metaObj);
        wrapper.put(keyword, keywordWrapper);
      }
      return wrapper.toString();

    }
    catch (Exception e) {
      LOG.error(org.apache.hadoop.util.StringUtils.stringifyException(e));
      return "Error";
    }
*/
  }
	
}