#!/bin/bash

ip=`ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6|grep -v 172.\*.\*.\*|awk '{print $2}'|tr -d "addr:"`
echo $ip

# sed -i `s/192.168.56.103/$ip/g` './conf.d/my.conf'
#
cp conf/my.conf conf/config.conf
sed -i -e "s/127.0.0.1/$ip/g" conf/config.conf

docker stop frontend
docker rm frontend
docker rmi frontend

if [ $ip == "192.168.56.103" ]
then
  docker build --progress=plain -t frontend .
else
  docker build --progress=plain -f DockerfileHome -t frontend .
fi

docker build --progress=plain -t frontend .
docker run --name frontend -d -p 9100:9100 frontend
