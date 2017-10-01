import mysql.connector,os,json,ast,traceback

path = '/home/ufarooq/BrowserExtension/User_Data'
users = os.listdir(path)
query = "INSERT INTO "
queries = []

inserted = open('/home/ufarooq/BrowserExtension/inserted.txt',"a+")
recorded = inserted.read().split('\n')

users = list(set(users) - set(recorded))

cnx = mysql.connector.connect(user='root',password = 'umarfarooq',database='ExtensionData')
cursor = cnx.cursor()

errorLog = open('/home/ufarooq/BrowserExtension/Error.txt',"a+")
for i in users:
	f = open(path+'/'+i)
	data = f.read()
	uid = i.split('ID')[0]
	timestamp = i.split('TS')[1].replace('.txt','')
#	print uid,timestamp
#	break
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
		error = str(exelate['Response'].encode('utf-8'))
		queryErr = query + "USER_ERROR(USER_ID,shot_timestamp,RESPONSE) VALUES "+ str((uid,str(timestamp),error))+";"
		queries.append(queryErr)
		print "insert in Error table"
	else:
		if len(exelate) != 0:
			query1 = query+"USER_Exelate (USER_ID,shot_timestamp, Interest_DESC) VALUES "
			for j in exelate:
				query1 = query1+ str((uid,str(timestamp),j))+", "
			query1 = query1[:-2]+";"
			queries.append(query1)
	if type(googAd) is not list:
                print "insert in Error table"
		error = str(googAd['Response'].encode('utf-8'))
                queryErr = query + "USER_ERROR(USER_ID,shot_timestamp,RESPONSE) VALUES "+ str((uid,str(timestamp),error))+";"
                queries.append(queryErr)
        else:
		if len(googAd) != 0:
			query2 = query+"USER_Google_ADS (USER_ID,shot_timestamp, AD_DESC) VALUES "
                        for j in googAd:
                                query2 = query2+ str((uid,str(timestamp),str(j)))+", "
                        query2 = query2[:-2]+";"
			queries.append(query2)
	if type(bluekai) is not list:
		error = str(bluekai['Response'].encode('utf-8'))
                queryErr = query + "USER_ERROR(USER_ID,shot_timestamp,RESPONSE) VALUES "+ str((uid,str(timestamp),error))+";"
                queries.append(queryErr)
                print "insert in Error table"
        else:
		user_bluekai = []
                if len(bluekai) != 0:
			query3 = query+"BlueKai (IMAGE_ID, IMAGE_title_url, IMAGE_desc_url, IMAGE_title_text, IMAGE_desc_text) VALUES "
                        for j in bluekai:
				bid = j['img']
				bid =  bid.split('/')[-1]
				bid = bid.split('_')[0]
				user_bluekai.append(bid)
                                query3 = query3+ str((int(bid),str(j['img']),str(j['fimg']),'NULL','NULL'))+", "
			query3 = query3[:-2]+";"
			queries.append(query3)
			if len(user_bluekai)!=0:
				query9 = query+"USER_BlueKai (USER_ID,shot_timestamp,IMAGE_ID) VALUES "
				for q in user_bluekai:
					query9 = query9+ str((str(uid),str(timestamp),int(q)))+", "
				query9 = query9[:-2]+";"
                       	queries.append(query9)
	if type(browsingHist) is not list:
		error = str(browsingHist['Response'].encode('utf-8'))
                queryErr = query + "USER_ERROR(USER_ID,shot_timestamp,RESPONSE) VALUES "+ str((uid,str(timestamp),error))+";"
                queries.append(queryErr)
                print "insert in Error table"
        else:
		if len(browsingHist) != 0:
			query4 = query+"USER_BROWSING_HISTORY (USER_ID,shot_timestamp, ID, TIMESTAMP, TITLE, URL) VALUES "
			for j in browsingHist:
#				print (uid,timestamp,j['id'],j['lastVisitTime'],j['title'],j['url'])
                                query4 = query4+ str((str(uid),str(timestamp),int(j['id']),str(j['lastVisitTime']),str(j['title'].encode('utf-8')),str(j['url'])))+", "
                        query4 = query4[:-2]+";"
			queries.append(query4)
	if type(googSearch) is not list:
		error = str(googSearch['Response'].encode('utf-8'))
                queryErr = query + "USER_ERROR(USER_ID,shot_timestamp,RESPONSE) VALUES "+ str((uid,str(timestamp),error))+";"
                queries.append(queryErr)
                print "insert in Error table"
        else:
		if len(googSearch) != 0:
			query5 = query+"Google_SearchTerms (USER_ID,shot_timestamp, SEARCH_TERM, CATEGORY, URL, TIMESTAMP) VALUES "
                        for j in googSearch:
				if len(j) == 5:
        	                        query5 = query5+ str((uid,str(timestamp),str(j[0].encode('utf-8')),str(j[2]),str(j[3].encode('utf-8')),str(j[4])))+", "
				elif len(j) == 4:
					query5 = query5+ str((uid,str(timestamp),str(j[0].encode('utf-8')),str(j[2]),"NULL",str(j[3])))+", "
				else:
					query5 = query5+ str((uid,str(timestamp),"NULL",str(j[0]),"NULL",str(j[1])))+", "
                        query5 = query5[:-2]+";"
			queries.append(query5)
	try:
		fbInterests['Error']
		error = str(fbInterests['Response'].encode('utf-8'))
                queryErr = query + "USER_ERROR(USER_ID,shot_timestamp,RESPONSE) VALUES "+ str((uid,str(timestamp),error))+";"
                queries.append(queryErr)
		print "insert in Error table"
	except KeyError:
		query6 = query+"USER_FB_INTERESTS (USER_ID,shot_timestamp, Description, disambiguation_category, FBID, IMAGE_URL,NAME,Subtype,Topic,TYPE) VALUES "
		test = query6
		for j in fbInterests['interests']:
			query6 = query6+ str((uid,str(timestamp),str(j['description'].encode('utf-8')),str(j['disambiguation_category']),int(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),str(j['subtype']),str(j['topic'].encode('utf-8')),str(j['type'])))+", "
		for j in fbInterests['removed_interests']:
                        query6 = query6+ str((uid,str(timestamp),str(j['description'].encode('utf-8')),str(j['disambiguation_category']),int(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),str(j['subtype']),str(j['topic'].encode('utf-8')),str(j['type'])))+", "
		for j in fbInterests['suggested_interests']:
                        query6 = query6+ str((uid,str(timestamp),str(j['description'].encode('utf-8')),str(j['disambiguation_category']),int(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),str(j['subtype']),str(j['topic'].encode('utf-8')),str(j['type'])))+", "
		if query6 != test:
			query6 = query6[:-2]+";"
			queries.append(query6)
        try:
                fbAdvert['Error']
		error = str(fbAdvert['Response'].encode('utf-8'))
                queryErr = query + "USER_ERROR(USER_ID,shot_timestamp,RESPONSE) VALUES "+ str((uid,str(timestamp),error))+";"
                queries.append(queryErr)
                print "insert in Error table"
        except KeyError:
		query7 = query+"USER_FB_ADS (USER_ID,shot_timestamp, ca_type, FBID, IMAGE_URL,NAME,REMOVED,report_date,SOURCE_URL) VALUES "
		test = query7
		fbAdvert = fbAdvert['advertisers']
		for j in fbAdvert['clicked']:
			query7 = query7+str((uid,str(timestamp),str(j['ca_type']),str(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),str(j['removed']),str(j['report_date']),str(j['source_url'])))+", "
		for j in fbAdvert['contact_info']:
                        query7 = query7+str((uid,str(timestamp),str(j['ca_type']),str(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),str(j['removed']),str(j['report_date']),str(j['source_url'])))+", "
		for j in fbAdvert['hidden']:
                        query7 = query7+str((uid,str(timestamp),str(j['ca_type']),str(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),str(j['removed']),str(j['report_date']),str(j['source_url'])))+", "
		for j in fbAdvert['store_visit']:
                        query7 = query7+str((uid,str(timestamp),str(j['ca_type']),str(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),str(j['removed']),str(j['report_date']),str(j['source_url'])))+", "
		for j in fbAdvert['website_app']:
                        query7 = query7+str((uid,str(timestamp),str(j['ca_type']),str(j['fbid']),str(j['image_url']),str(j['name'].encode('utf-8')),"NULL","NULL",str(j['source_url'])))+", "
		if test!=query7:
			query7 = query7[:-2]+";"
			queries.append(query7)
        try:
                survey['Error']
                print "insert in Error table"
        except KeyError:
		survey = ast.literal_eval(json.dumps(survey))
		survey = str(survey).replace("'",'"')
		query8 = query+"USER_SURVEY (USER_ID,shot_timestamp,SURVEY) VALUE " + str((uid,str(timestamp),survey))+";"
		queries.append(query8)

#	print len(queries)
#	print queries
	for q in queries:
		print "inserting"
		try:
			cursor.execute(q)
		except:
			errorLog.write(uid+'_'+timestamp+'.txt\n'+q+'\n')
			traceback.print_exc()
			print q
	inserted.write(i+"\n")
	queries = []
cnx.commit()
cursor.close()
cnx.close()
inserted.close()
errorLog.close()
