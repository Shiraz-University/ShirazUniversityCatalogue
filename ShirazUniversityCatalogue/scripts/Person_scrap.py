# -*- coding: utf-8 -*- 
from __future__ import division
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import codecs
import json
def collapse_number(driver,num):
	root_xpath = "/html/body/form/table/tbody/tr[5]/td/table/tbody/tr["+str(2*num+1)+"]"
	elem = driver.find_element_by_xpath(root_xpath+"/td[1]/img")
	txt = driver.find_element_by_xpath(root_xpath+"/td[2]")
	# print (txt.text).encode('utf8')+" collapsed ..."
	elem.click()

def main():
	f = codecs.open('test', encoding='utf-8', mode='w+')
	driver = webdriver.PhantomJS()
	# driver =webdriver.Firefox()
	print "going to site"
	driver.get("http://sess.shirazu.ac.ir/sess/fresearch/facultycvsearch.aspx")
	print "get inside site"
	total = ''
	total_num = 0
	for img in xrange(0,15):
		collapse_number(driver,img)
		faculty_number = len(driver.find_elements_by_xpath("/html/body/form/table/tbody/tr[5]/td/table/tbody/tr["+str(img*2+2)+"]/td[2]/table/tbody/tr"))
		for nth_faculty in xrange(1,faculty_number+1):
			faculty = driver.find_element_by_xpath("/html/body/form/table/tbody/tr[5]/td/table/tbody/tr["+str(img*2+2)+"]/td[2]/table/tbody/tr["+str(nth_faculty)+"]/td[2]")

			print (total_num/864)*100
			print "going to "+(faculty.text).encode('utf8')
			faculty.click()

			cv_number = len(driver.find_elements_by_xpath("/html/body/form/table/tbody/tr[3]/td/table/tbody/tr"))
			for x in xrange(2,cv_number+1):
				elem = driver.find_element_by_xpath('/html/body/form/table/tbody/tr[3]/td/table/tbody/tr['+str(x)+']/td[2]')
				# print (elem.text).encode('utf8')
				elem.click()
				nprop = len(driver.find_elements_by_xpath('/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[2]/td/table/tbody/tr'))
				dic = {'fname' : '', 'lname': '','birth':'','tahol':'','madrak':'','estekhdam':'','martabe':'','bakhsh':'','daneshkade':'','address':'','phone':'','mobile':'','email':'','interest':''}
				for i in xrange(1,nprop+1):
					if len(driver.find_elements_by_xpath('/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[2]/td/table/tbody/tr['+str(i)+']/td'))>1:
						prop_xpath = driver.find_element_by_xpath('/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[2]/td/table/tbody/tr['+str(i)+']/td[1]').text
						ansprop_xpath = driver.find_element_by_xpath('/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[2]/td/table/tbody/tr['+str(i)+']/td[3]').text.encode('utf8')
						if prop_xpath=='نام'.decode('utf-8'):
							dic['fname'] = ansprop_xpath
						elif prop_xpath=='نام خانوادگي'.decode('utf-8'):
							dic['lname'] = ansprop_xpath
						elif prop_xpath=='سال تولد'.decode('utf-8'):
							dic['birth'] = ansprop_xpath
						elif prop_xpath=='وضعيت تاهل'.decode('utf-8'):
							dic['tahol'] = ansprop_xpath
						elif prop_xpath=='مدرک تحصيلي'.decode('utf-8'):
							dic['madrak'] = ansprop_xpath
						elif prop_xpath=='سال استخدام'.decode('utf-8'):
							dic['estekhdam'] = ansprop_xpath
						elif prop_xpath=='مرتبه علمي'.decode('utf-8'):
							dic['martabe'] = ansprop_xpath
						elif prop_xpath=='بخش'.decode('utf-8'):
							dic['bakhsh'] = ansprop_xpath
						elif prop_xpath=='دانشکده'.decode('utf-8'):
							dic['daneshkade'] = ansprop_xpath
						elif prop_xpath=='آدرس'.decode('utf-8'):
							dic['address'] = ansprop_xpath
						elif prop_xpath=='تلفن'.decode('utf-8'):
							dic['phone'] = ansprop_xpath
						elif prop_xpath=='تلفن همراه'.decode('utf-8'):
							dic['mobile'] = ansprop_xpath
						elif prop_xpath=='پست الکترونيک'.decode('utf-8'):
							dic['email'] = ansprop_xpath
						elif prop_xpath=='علاقه مندي ها'.decode('utf-8'):
							dic['interest'] = ansprop_xpath

						else:
							print "warrning : a fild not suportted :"
							print prop_xpath.encode('utf8')
							print type(prop_xpath)
				js = json.dumps(dic,sort_keys=False,indent=4, separators=(',', ': '),encoding="utf-8")
				# print js
				f.write(js+'\n')
				driver.back()
			total_num = total_num + cv_number-1


			driver.back()
			collapse_number(driver,img)
	# for x in xrange(2,21):
	# 	elem = driver.find_element_by_xpath('/html/body/form/table/tbody/tr[3]/td/table/tbody/tr['+str(x)+']')
	# 	f.write(elem.text+'\n')
	# 	# f.seek(0)
	# 	print str(x)+"th get"
	print str(total_num)+" person ... 100% done"
	f.close()

# elem = driver.find_element_by_name('/html/body/div[2]/div[2]/div[2]/div/div/div/ul/li[1]/a')                      
# elem.send_keys(Keys.RETURN)

# elem = driver.find_element_by_xpath("/html/body/table[2]/tbody/tr/td/table[2]/tbody/tr[3]/td[4]")
# return elem.text

if __name__ == '__main__':
	main()