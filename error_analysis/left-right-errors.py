import json

input_file = 'results.json'

with open(input_file) as data_file:
    data = json.loads(data_file.read())
    results = data['results']
    count = 0
    left_right = 0
    for item in results:
        if (item['prediction'] != item['truth']):
            count+=1
            if ("Left" in item['prediction'] and "Right" in item['truth']) or ("Right" in item['prediction'] and "Left" in item['truth']):
                left_right+=1
                print("Prediction: %s . Truth: %s" % (item['prediction'], item['truth']))
    print("Total errors: %d " % count)
    print("Left right errors: %d " % left_right)