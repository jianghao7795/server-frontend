#!/bin/bash

ip=`ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|grep -v 172.\*.\*.\*|awk '{print $2}'|tr -d "addr:"`
echo $ip

# sed -i `s/192.168.56.103/$ip/g` './conf.d/my.conf'


sed -i -e "s/192.168.56.103/$ip/g" conf/my.conf

docker stop frontend
docker rm frontend
docker rmi frontend
docker build -t frontend .
docker run --name frontend -d -p 9100:9100 frontend
