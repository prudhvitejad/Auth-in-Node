with open("6.txt","r") as file1:
	str1 = file1.read()
	list1 = str1.split("\n")
	with open("async.txt", "w") as file2:
		for i in range(len(list1)):
			if(i%2!=0):
				val = list1[i]
				file2.write(val+"\n")