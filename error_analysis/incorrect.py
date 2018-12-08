import json
from collections import defaultdict

'''
Reads a json file with the results as an array and groups the errors based on class
'''

input_file = 'results.json'
output_file = 'errors.json'
with open(input_file) as data_file:
    output = open(output_file, 'w')
    data = json.loads(data_file.read())
    results = data['results']
    groups = defaultdict(list)
    count = 0
    for item in results:

        if (item['prediction'] != item['truth']):
            groups[item['truth']].append(item)
            count+=1
    print len(groups)
    for group in groups:
        print("Class: %s " % group)
        print("Error count: %d" % len(groups[group]))
        print("Items: %s" % groups[group])
    errors = {'errors': groups}
    output.write(json.dumps(errors))
