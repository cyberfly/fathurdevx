---
title: "How to generate API JSON to CSV script with ChatGPT"
slug: chatgpt-api-json-to-csv
date: 2024-03-09
description: "Learn how you can generate an API JSON to CSV script with ChatGPT"
tags:
  - Prompt Engineering
category: DEVELOPMENT
author:
  name: Fathur
  bio: Frontend engineer obsessed with micro-interactions and making the web feel "alive".
---

# How to generate API JSON to CSV script with ChatGPT

## Context

You want to add some data from API JSON response into CSV, but manually doing it is troublesome.

Let's ask ChatGPT to create a Python script that will easily do this.

## Tips

- Tell ChatGPT about basic API information such as the endpoint and POST/GET method
- Tell ChatGPT about API authorization information
- Tell ChatGPT about which data property that you need
- Tell ChatGPT about the response structure, so that it can properly write the code to traverse the data

## Full Prompt

```
Write a Python script to perform POST API call to this endpoint https://yoursite.com/api/v1/keywords_data

Authorisation using username and password

Parse the API response into CSV and pluck only this 3 columns:

keyword_data.keyword
keyword_data.keyword.keyword_info.search_volume
keyword_data.serp_info.check_url

Example response structure:

{
	tasks: [
		{
		  "result": [
		  	{
		  	  "items": [
	              {
	              	"keyword_data": {

	              	}
	              }
                  ]
		  	}
		  ]
		}
	]
}
```

## Result

This is the generated code from ChatGPT. Save as `api_to_csv.py`, run it and you will get your data inside CSV.

```
import requests
import csv

# API call

url = 'https://yoursite.com/api/v1/keywords_data'

api_username = 'user'
api_pass = 'secret'

auth = (api_username, api_pass)
headers = {'Content-Type': 'application/json'}

response = requests.post(url, json=payload, headers=headers, auth=auth)

data = response.json()

# go through the received data and extract the required information
column_values = []
for task in data.get('tasks', []):
    for result in task.get('result', []):
        for item in result.get('items', []):
            keyword_data = item.get('keyword_data', {})
            first_domain_serp_element = item.get('first_domain_serp_element', {})

            keyword = keyword_data.get('keyword')
            search_volume = keyword_data.get('keyword_info', {}).get('search_volume')
            check_url = keyword_data.get('serp_info', {}).get('check_url')

            column_values.append([keyword, search_volume, check_url])

filename = 'myfile.csv'

with open(filename, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['keyword', 'search_volume', 'check_url'])
    writer.writerows(column_values)
```

## Conclusion

There are multiple ways to convert API JSON to CSV, but having a small script like this is very handy for programmers when they need to present the data to non-technical users.

Happy prompting!
