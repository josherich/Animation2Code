import json

'''
Reads a log file from running the model and converts it into json format
'''

input_file = 'slurm_v2.out'
output_file = 'results.json'

file = open(input_file, 'r')
output = open(output_file, 'w')

for line in file.readlines():
    results.append(json.loads(line))

obj = {"results": results}
output.write(json.dumps(obj))
