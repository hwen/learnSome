
# MongoDB 主从配置及备份

```
MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
```

## MongoDB主从数据库实现原理：

```
首先,主节点会把本服务的与写有关的操作记录下来,读操来不记录,这些操作就记录在local数据库中的oplog.$admin这个集合中,这是一个固定集合,大小是可以配置的,主要是通过配置oplogSize这个参数来实现,单位是M,大小一般为磁盘剩余空间的5%左右.因为是固定集合所以当固定集合放满日志的时候,新进来的日志就会把最旧的日志覆盖掉,如果这个值设置的不合理,导致数据很快的被覆盖,而从节点没有来得及更新,这样就会产生数据不同步的情况.设置为主节点的local数据库有会有oplog.$admin与slave这两个集合.slave记录的是从节点的信息.
从节点与主节点的数据同步主要是从节点定时的会去连接主节点,请求主节点的操作日志,从而对自己的数据副表进行同样的操作来达到数据的同步.从节点的local数据库中会多了source与me这两个集合,source是记录主节点的信息,me是记录从节点的标识
```

### 环境配置

```
我这里准备了2台机器作为演示机
172.16.0.138    master
172.16.0.139    salve
系统版本为 centos 7.2
```

### 包地址

```
https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-3.6.3.tgz
```

### 解压文件

```
[root@iZuf6ahuk73s2puww2elmpZ]# tar xf mongodb-linux-x86_64-rhel70-3.6.3.tgz 
[root@iZuf6ahuk73s2puww2elmpZ]# cd mongodb-linux-x86_64-rhel70-3.6.3/
```

### 建立数据目录

```
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# mkdir /opt/mongodb/data -p
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# mkdir /opt/mongodb/logs -p
```

### 配置文件修改

```
# 设置数据文件的存放目录
dbpath=/opt/mongodb/data
# 设置日志文件的存放目录及其日志文件名
logpath=/opt/mongodb/logs/mongodb.log
# 设置端口号（默认的端口号是 27017）
master=true
# 设置为以守护进程的方式运行，即在后台运行
fork=true
#监听网卡
bind_ip= 0.0.0.0
#服务端口
port=27017
oplogSize=2048
```

### 启动主库

```
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# ./bin/mongod -f mongodb.conf  
about to fork child process, waiting until server is ready for connections.
forked process: 5702
child process started successfully, parent exiting
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# ps -ef |grep mongodb
root      5702     1  2 14:38 ?        00:00:00 ./bin/mongod -f mongodb.conf
root      5729  5601  0 14:39 pts/0    00:00:00 grep --color=auto mongodb
```

### 配置从库

```
部署包从主库上拷贝过来
```

### 建立数据目录

```
[root@izuf6ahuk73s2puww2elmqz mongodb-linux-x86_64-rhel70-3.6.3]# mkdir /opt/mongodb/data -p
[root@izuf6ahuk73s2puww2elmqz mongodb-linux-x86_64-rhel70-3.6.3]# mkdir /opt/mongodb/logs -p
```

### 修改配置文件

```
# 设置数据文件的存放目录
dbpath=/opt/mongodb/data
# 设置日志文件的存放目录及其日志文件名
logpath=/opt/mongodb/logs/mongodb.log
# 设置为以守护进程的方式运行，即在后台运行
fork=true
#服务端口
port=27017
bind_ip= 0.0.0.0
slave=true
source=172.16.0.138:27017
autoresync=true
```

### 启动从库

```
[root@izuf6ahuk73s2puww2elmqz mongodb-linux-x86_64-rhel70-3.6.3]# ./bin/mongod -f mongodb.conf 
about to fork child process, waiting until server is ready for connections.
forked process: 10233
child process started successfully, parent exiting
[root@izuf6ahuk73s2puww2elmqz mongodb-linux-x86_64-rhel70-3.6.3]# ps -ef |grep mongodb
root     10302     1  0 15:03 ?        00:00:09 ./bin/mongod -f mongodb.conf
root     10369 10210  0 15:38 pts/0    00:00:00 grep --color=auto mongodb
到这里基本主从就配置完了,你可以查看主节点的local数据库里有没有slave,oplog.$admin,从节点中有没有source,me这几个集合
接下来你可以主节点创建数据库插入数据看看从节点是否同步过去了.这些都可以通过查看日志来查看的
```

### 验证结果

- 主库

```
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# ./bin/mongo
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.3
> db.printReplicationInfo();
configured oplog size:   2048MB
log length start to end: 1517secs (0.42hrs)
oplog first event time:  Mon Apr 16 2018 14:38:53 GMT+0800 (CST)
oplog last event time:   Mon Apr 16 2018 15:04:10 GMT+0800 (CST)
now:                     Mon Apr 16 2018 15:04:11 GMT+0800 (CST)
```

- 从库

```
[root@izuf6ahuk73s2puww2elmqz mongodb-linux-x86_64-rhel70-3.6.3]# ./bin/mongo
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.3
Server has startup warnings: 

> db.printSlaveReplicationInfo()
source: 172.16.0.138:27017
    syncedTo: Mon Apr 16 2018 15:04:30 GMT+0800 (CST)
    7 secs (0 hrs) behind the freshest member (no primary available at the moment)
```

### 同步测试

- 在主库中插入数据

```
> use testsalve
switched to db testsalve
> db
testsalve
> db.testsalve.insert({"name" : "测试同步"})
WriteResult({ "nInserted" : 1 })
> show collections
testsalve
> db.testsalve.find().pretty()
{ "_id" : ObjectId("5ad44d090dd23b7a5c1a983f"), "name" : "测试同步" }
```

- 从库里查看是否同步

```
> rs.slaveOk();
> show dbs;
admin      0.000GB
config     0.000GB
local      0.000GB
testsalve  0.000GB
> use testsalve
switched to db testsalve
> db.testsalve.find().pretty()
{ "_id" : ObjectId("5ad44d090dd23b7a5c1a983f"), "name" : "测试同步" }
# 数据已同步过来
```

### 注意

```
salve节点默认是无法读写的，如果非要解决，方法如下：
在从库执行
> rs.slaveOk();
```

## 备份

```
1、语法：
        mongodump -h dbhost -d dbname -o dbdirectory
        参数说明：
            -h： MongDB所在服务器地址，例如：127.0.0.1，当然也可以指定端口号：127.0.0.1:27017
            -d： 需要备份的数据库实例，例如：test
            -o： 备份的数据存放位置，例如：/home/mongodump/，当然该目录需要提前建立，这个目录里面存放该数据库实例的备份数据。
```

- 示例

```
#以下命令备份了testsalve库到/opt/目录下
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# ./bin/mongodump -h 127.0.0.1:27017 -d testsalve -o /opt/
2018-04-16T15:19:54.779+0800    writing testsalve.testsalve to 
2018-04-16T15:19:54.780+0800    done dumping testsalve.testsalve (1 document)
#备份出来的文件
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# ll /opt/testsalve/
total 8
-rw-r--r-- 1 root root  45 Apr 16 15:19 testsalve.bson
-rw-r--r-- 1 root root 133 Apr 16 15:19 testsalve.metadata.json
```

## 恢复

```
1、语法：
       mongorestore -h dbhost -d dbname --dir dbdirectory
       参数或名：
           -h： MongoDB所在服务器地址
           -d： 需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如test2
           --dir： 备份数据所在位置，例如：/opt
           --drop： 恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除。
```

- 示例

```
#先删除当前库
> use testsalve
switched to db testsalve
> db.dropDatabase()
{ "dropped" : "testsalve", "ok" : 1 }
#执行恢复
[root@iZuf6ahuk73s2puww2elmpZ mongodb-linux-x86_64-rhel70-3.6.3]# ./bin/mongorestore -h 127.0.0.1:27017 -d testsalve --dir  /opt/testsalve/
2018-04-16T15:23:27.416+0800    the --db and --collection args should only be used when restoring from a BSON file. Other uses are deprecated and will not exist in the future; use --nsInclude instead
2018-04-16T15:23:27.417+0800    building a list of collections to restore from /opt/testsalve dir
2018-04-16T15:23:27.418+0800    reading metadata for testsalve.testsalve from /opt/testsalve/testsalve.metadata.json
2018-04-16T15:23:27.440+0800    restoring testsalve.testsalve from /opt/testsalve/testsalve.bson
2018-04-16T15:23:27.449+0800    no indexes to restore
2018-04-16T15:23:27.449+0800    finished restoring testsalve.testsalve (1 document)
2018-04-16T15:23:27.449+0800    done
#查看恢复结果
> show dbs;
admin      0.000GB
config     0.000GB
local      0.000GB
testsalve  0.000GB
> use testsalve
switched to db testsalve
> db.testsalve.find().pretty()
{ "_id" : ObjectId("5ad44d090dd23b7a5c1a983f"), "name" : "测试同步" }
```