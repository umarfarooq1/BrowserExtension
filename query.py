import mysql.connector,os,json

path = '/home/ufarooq/BrowserExtension/User_Data'
users = os.listdir(path)
query = "INSERT INTO "
queries = []

cnx = mysql.connector.connect(user='root',password = 'umarfarooq',database='ExtensionData')
cursor = cnx.cursor()

for i in users:
	f = open(path+'/'+i)
	data = f.read()
	uid = i.split('1')[0][:-1]
	timestamp = i.split('_')[2].replace('.txt','')
	jsonData = json.loads(data)
	exelate = jsonData['exelate']
	bluekai = jsonData['BlueKai']
	browsingHist = jsonData['BrowsingHistory']
	fbInterests = jsonData['FBinterests']
	fbAdvert = jsonData['FBadvertisers']
	googAd = jsonData['googleAdSettings']
	googSearch = jsonData['googleSearchTerms']
	survey = jsonData['survey']
	f.close()
	if type(exelate) is not list:
		print "insert in Error table"
	else:
		exelate = ['shopping']
		if len(exelate) != 0:
			query1 = query+"USER_Exelate (USER_ID,shot_timestamp, Interest_DESC) VALUES "
			for j in exelate:
				query1 = query1+ str((uid,str(timestamp),j))+", "
			query1 = query1[:-2]+";"
			queries.append(query1)
	if type(googAd) is not list:
                print "insert in Error table"
        else:
		if len(googAd) != 0:
			query2 = query+"USER_Google_ADS (USER_ID, AD_DESC) VALUES "
                        for j in googAd:
                                query2 = query2+ str((uid,j))+", "
                        query2 = query2[:-2]+";"
#			queries.append(query2)
	if type(bluekai) is not list:
                print "insert in Error table"
        else:
                if len(bluekai) != 0:
			query3 = query+"BlueKai (IMAGE_ID, IMAGE_title_url, IMAGE_desc_url, IMAGE_title_text, IMAGE_desc_text) VALUES "
                        for j in bluekai:
                                query3 = query3+ str((j['id'],j['img'],j['fimg'],'NULL','NULL'))+", "
			query3 = query3[:-2]+";"
#			queries.append(query3)
	if type(browsingHist) is not list:
                print "insert in Error table"
        else:
		if len(browsingHist) != 0:
			query4 = query+"USER_BROWSING_HISTORY (USER_ID, ID, TIMESTAMP, TITLE, URL) VALUES "
			for j in browsingHist:
                                query4 = query4+ str((uid,j['id'],j['lastVisitTime'],j['title'],j['url']))+", "
                        query4 = query4[:-2]+";"
#			queries.append(query4)
	if type(googSearch) is not list:
                print "insert in Error table"
        else:
		if len(googSearch) != 0:
			query5 = query+"Google_SearchTerms (USER_ID, SEARCH_TERM, CATEGORY, URL, TIMESTAMP) VALUES "
                        for j in googSearch:
				if len(j) == 5:
        	                        query5 = query5+ str((uid,j[0],j[2],j[3],j[4]))+", "
				elif len(j) == 4:
					query5 = query5+ str((uid,j[0],j[2],"NULL",j[3]))+", "
				else:
					query5 = query5+ str((uid,"NULL",j[0],"NULL",j[1]))+", "
                        query5 = query5[:-2]+";"
#			queries.append(query5)
	try:
		fbInterests['Error']
		print "insert in Error table"
	except KeyError:
		query6 = query+"USER_FB_INTERESTS (USER_ID, Description, disambiguation_category, FBID, IMAGE_URL,NAME,Subtype,Topic,TYPE) VALUES "
		test = query6
		for j in fbInterests['interests']:
			query6 = query6+ str((uid,j['description'],j['disambiguation_category'],j['fbid'],j['image_url'],j['name'],j['subtype'],j['topic'],j['type']))+", "
		for j in fbInterests['removed_interests']:
                        query6 = query6+ str((uid,j['description'],j['disambiguation_category'],j['fbid'],j['image_url'],j['name'],j['subtype'],j['topic'],j['type']))+", "
		for j in fbInterests['suggested_interests']:
                        query6 = query6+ str((uid,j['description'],j['disambiguation_category'],j['fbid'],j['image_url'],j['name'],j['subtype'],j['topic'],j['type']))+", "
		if query6 != test:
			query6 = query6[:-2]+";"
#			queries.append(query6)
        try:
                fbAdvert['Error']
                print "insert in Error table"
        except KeyError:
		query7 = query+"USER_FB_ADS (USER_ID, ca_type, FBID, IMAGE_URL,NAME,REMOVED,report_date,SOURCE_URL) VALUES "
		test = query7
		fbAdvert = fbAdvert['advertisers']
		for j in fbAdvert['clicked']:
			query7 = query7+str((uid,j['ca_type'],j['fbid'],j['image_url'],j['name'],j['removed'],j['report_date'],j['source_url']))+", "
		for j in fbAdvert['contact_info']:
                        query7 = query7+str((uid,j['ca_type'],j['fbid'],j['image_url'],j['name'],j['removed'],j['report_date'],j['source_url']))+", "
		for j in fbAdvert['hidden']:
                        query7 = query7+str((uid,j['ca_type'],j['fbid'],j['image_url'],j['name'],j['removed'],j['report_date'],j['source_url']))+", "
		for j in fbAdvert['store_visit']:
                        query7 = query7+str((uid,j['ca_type'],j['fbid'],j['image_url'],j['name'],j['removed'],j['report_date'],j['source_url']))+", "
		for j in fbAdvert['website_app']:
                        query7 = query7+str((uid,j['ca_type'],j['fbid'],j['image_url'],j['name'],"NULL","NULL",j['source_url']))+", "
		if test!=query7:
			query7 = query7[:-2]+";"
#			queries.append(query7)
        try:
                survey['Error']
                print "insert in Error table"
        except KeyError:
		 query8 = query+"USER_SURVEY (USER_ID,RESPONSE) VALUE " + str((uid,survey))+";"
#		 queries.append(query8)

#	print len(queries)
	print queries
	for q in queries:
		print "I wash ehre"
		cursor.execute(q)
	queries = []
cnx.commit()
cursor.close()
cnx.close()

