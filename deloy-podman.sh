#!/bin/bash


# sed -i `s/192.168.56.103/$ip/g` './conf.d/my.conf'
#
cp conf/my.conf conf/config.conf
sed -i -e "s/127.0.0.1/host.containers.internal/g" conf/config.conf

docker stop frontend
docker rm frontend
docker rmi frontend

# if [ $ip == "192.168.56.103" ]
# then
#   docker build --progress=plain -t frontend .
# else
#   docker build --progress=plain -f DockerfileHome -t frontend .
# fi
docker build --progress=plain -f Dockerfile -t frontend .
# docker build --progress=plain -t frontend .
docker run --name frontend -d -p 9100:9100 frontend
