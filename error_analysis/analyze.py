import json
from collections import defaultdict

'''
Reads errors.json file with the results as an array and groups the errors based on class
'''

def group_errors(input_file):
    with open(input_file) as data_file:
        data = json.loads(data_file.read())
        results = data['results']
        groups = defaultdict(list)
        count = 0
        for item in results:

            if (item['prediction'] != item['truth']):
                if ("Left" in item['prediction'] and "Right" in item['truth']) or ("Right" in item['prediction'] and "Left" in item['truth']):
                    continue
                #elif ("Up" in item['prediction'] and "Down" in item['truth']) or ("Down" in item['prediction'] and "Up" in item['truth']):
                    #continue
                #elif ("bounce" in item['prediction'] and "fade" in item['truth']) or ("fade" in item['prediction'] and "bounce" in item['truth']):
                #    continue
                groups[item['truth']].append(item)
                count+=1
        for group in groups:
            print("Class: %s " % group)
            print("Error count: %d" % len(groups[group]))
            print("Items: %s" % groups[group])
        print("Error class count %d" % len(groups))

def errors(input_file):
    with open(input_file) as data_file:
        data = json.loads(data_file.read())
        results = data['results']
        count = 0
        left_right = 0
        up_down = 0
        fade_bounce = 0
        total_count = 0
        for item in results:
            total_count+=1
            if (item['prediction'] != item['truth']):
                count+=1
                if ("Left" in item['prediction'] and "Right" in item['truth']) or ("Right" in item['prediction'] and "Left" in item['truth']):
                    left_right+=1
                elif ("Up" in item['prediction'] and "Down" in item['truth']) or ("Down" in item['prediction'] and "Up" in item['truth']):
                    up_down+=1
                elif ("bounce" in item['prediction'] and "fade" in item['truth']) or ("fade" in item['prediction'] and "bounce" in item['truth']):
                    fade_bounce+=1
        print("Total count: %d " % total_count)
        print("Total errors: %d " % count)
        print("Left right errors: %d " % left_right)
        print("Up down errors: %d " % up_down)
        print("Fade bounce errors: %d " % fade_bounce)

if __name__ == "__main__":
    #errors('resnet10_validation_results.json')
    group_errors('resnet10_train_results.json')

