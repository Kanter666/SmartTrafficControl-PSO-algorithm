'''
Created on Nov 14, 2014

@author: user
'''

import csv
import os
import urllib2

from boto.mturk.connection import MTurkConnection, QualificationType
from boto.mturk.price import Price
from credentials import ACCESS_ID
from credentials import SECRET_KEY
from webapp.models import EVUser, Completion


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "EVChargingGame.local_settings.py")



#ACCESS_ID ='AKIAJTDRQWN2W5VIH76A'
#SECRET_KEY = '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'
HOST = 'mechanicalturk.amazonaws.com'
#HOST = 'mechanicalturk.sandbox.amazonaws.com'



conn = MTurkConnection(aws_access_key_id=ACCESS_ID,
                           aws_secret_access_key=SECRET_KEY,
                           host=HOST)

file = "C:/Users/Matt/Downloads/Batch_1735494_batch_results.csv"

#===============================================================================
# def read_batch_file(filename):
#     
#     with open(filename, 'rb') as csvfile:
#         reader = csv.reader(csvfile, delimiter=',')
#         reader.next()
#         for row in reader:
#             hit = row[0]
#             assignment = row[14]
#             worker = row[15]
#             answer = row[27]
#             print "HIT: %s, Worker: %s, Answer: %s" % (hit,worker,answer)
#             
#             #csv data would be added to database
#             
#             completion = Completion.objects.filter(user__username=answer)
#             if len(completion) > 0:
#                 if completion[0].assignment_id:
#                     # skip
#                     continue
#                 
#                 print "Found answer for worker: %s" % completion[0].user
#                 completion[0].worker_id = worker
#                 completion[0].assignment_id = assignment
#                 completion[0].hit_id = hit
#                 completion[0].save()
#             else:
#                 print "!!!!!!!! ERROR: Could not find worker for %s !!!!!!!!!" % answer 
#===============================================================================


def pay_unpaid_workers(filename):
    balance = conn.get_account_balance()[0].amount
    print "Current balance is: %s " % 23
    
    #===========================================================================
    # #get unpaid worker list and check if empty
    # 
    # unpaid = Completion.objects.filter(paid=False,approved=True)
    # if len(unpaid) == 0:
    #     print "There are no workers to pay."
    #     return
    #===========================================================================
    
    #Load correct answers from Heroku
    ans = []
    try:
        response = urllib2.urlopen('https://dataclips.heroku.com/cozjubnffncqxymvlopbdcatfwfem-Payable.csv')
    except urllib2.URLError, e:
        print e
    reader = csv.reader(response)
    reader.next
    for row in reader:
        ans.append(row[0])
        
    total = 0
    unpaid = []; 
    
    with open(filename, 'rU') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['AssignmentStatus'] == 'Submitted':
                worker = Worker()
                worker.hit = row['HITId']
                worker.assignment_id = row['AssignmentId']
                worker.id = row['WorkerId']
                worker.answer = row['Answer.surveycode']
                worker.base_payment = float(row['Reward'][1:])
                for row in ans:
                    if row == worker.answer:
                        unpaid.append(worker)
                        total += worker.base_payment
    #===========================================================================
    # with open(filename, 'rb') as csvfile:
    #     reader = csv.reader(csvfile, delimiter=',')
    #     reader = csv.reader(response)
    #     reader.next()
    #     for row in reader:
    #         if row[5] == 'Pending':
    #             hit = row[0]
    #             assignment = row[1]
    #             worker = Worker()
    #             worker.hit = hit
    #             worker.assignment_id = assignment
    #             worker.base_payment = 0.01
    #             unpaid.append(worker)
    #             total += worker.base_payment
    # for u in unpaid:
    #     if u.assignment_id:
    #         total += u.base_payment + u.bonus_payment 
    #===========================================================================
    print "The total unpaid amount for %s workers is $%s" % (len(unpaid), total)
    proceed = raw_input("Would you like to pay them now? [Y/N]")
    if proceed == "Y" or proceed == "y":
        for u in unpaid:
            if u.assignment_id:
                base = u.base_payment
                conn.approve_assignment(u.assignment_id,feedback="Thanks for playing the traffic attacker game!")
                print "Approved base payment of $%s for %s" % (base, u.assignment_id)
            else:
                print "WARNING: Skipping %s, as assignment ID unknown " % u
            

def create_HIT_for_specific_worker(worker_ID):
    qualification = conn.create_qualification_type("Qualification for %s" % worker_ID, "Qualification for %s" % worker_ID, "Active")
    print qualification
    print qualification[0]
    print qualification[0].QualificationTypeId
    conn.assign_qualification(qualification[0].QualificationTypeId, worker_ID, 1, True)
    print "Done"

class Worker(object):
    pass

if __name__ == '__main__':
#read_batch_file(file)
    pay_unpaid_workers(file)
    #create_HIT_for_specific_worker("A1ILV394W9AJVY")
#    balance = conn.get_account_balance()[0].amount
#    print balance
#    types = conn.search_qualification_types(query="A1ILV394W9AJVY")
#    id =  types[0].QualificationTypeId
#    print id
#    print conn.get_qualifications_for_qualification_type(id)[0].SubjectId
