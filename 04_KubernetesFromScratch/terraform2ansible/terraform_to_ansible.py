import json
from pprint import pprint

hosts = {'master':[], 'worker':[], 'management':[]}

with open(r'../terraform/terraform.tfstate') as file:
    tfstate = json.load(file)

    for resource in tfstate['resources']:
        if 'google_compute_address' == resource['type']:
            for instance in resource['instances']:
                address = instance['attributes']['address']
                name = instance['attributes']['name']

                if 'master' in name:
                    hosts['master'].append(address)
                elif 'worker' in name:
                    hosts['worker'].append(address)
                elif 'management' in name:
                    hosts['management'].append(address)

                # pprint(address + ' ' + instance['attributes']['name'])
                # pprint(instance)


template = """
[masters]
master ansible_host=%s ansible_user=dennislee

[workers]
worker1 ansible_host=%s ansible_user=dennislee
worker2 ansible_host=%s ansible_user=dennislee

[managements]
mngt1 ansible_host=%s ansible_user=dennislee

[all:vars]
ansible_python_interpreter=/usr/bin/python3
"""

print(template % (hosts['master'][0], hosts['worker'][0], hosts['worker'][1], hosts['management'][0]))
