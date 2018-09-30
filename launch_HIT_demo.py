import boto
import boto3
import pprint
import simplejson as json
from boto.mturk.connection import MTurkConnection
from boto.mturk.question import HTMLQuestion
from boto.mturk.layoutparam import LayoutParameter
from boto.mturk.layoutparam import LayoutParameters

region_name = # put in region name, like 'us-east-1'
aws_access_key_id = # put in access key id
aws_secret_access_key = # put in secret access key

endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'

# Uncomment this line to use in production
# endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'

client = boto3.client(
    'mturk',
    endpoint_url=endpoint_url,
    region_name=region_name,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
)

# Create your connection to MTurk
mtc = MTurkConnection(aws_access_key_id=aws_access_key_id,
aws_secret_access_key=aws_secret_access_key,
host='mechanicalturk.sandbox.amazonaws.com')

img_url = LayoutParameter('img_url', 'https://i.imgur.com/2nTUWBm.jpg')
params   = LayoutParameters([ img_url ])
response = mtc.create_hit(
  layout_params = params, 
  hit_type      = "", # put in hit_type
  hit_layout    = ""  # put in hit_layout
)

# The response included several fields that will be helpful later
hit_type_id = response[0].HITTypeId
hit_id = response[0].HITId
print("Your HIT has been created. You can see it at this link:")
print("https://workersandbox.mturk.com/mturk/preview?groupId={}".format(hit_type_id))
print("Your HIT ID is: {}".format(hit_id))

pp = pprint.PrettyPrinter(indent=4)
result = mtc.get_assignments(hit_id)
assignment = result[0]
worker_id = assignment.WorkerId
for pair in json.loads(assignment.answers[0][0].fields[0]):
    print('============================')
    pp.pprint(pair)