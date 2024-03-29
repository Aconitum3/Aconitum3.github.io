---
title: "4. イメージの作成と配布"
pubDate: 2023-02-28
description: "コンテナからイメージを作成し、イメージをtarファイル化する方法を学ぶ。"
tags: ["Docker", "Docker入門"]
prev: "docker-tutorial-03"
next: "docker-tutorial-05"
---


# イメージの作成と配布

チーム開発などで、自作したコンテナを配布したいことがある。この章では、コンテナからイメージを作成し、イメージをファイル化して配布する方法を学ぶ。

## コンテナからイメージを作成する
ここでは、前章で作成したjupyterコンテナからイメージを作成する。コンテナが停止していないなら、`docker stop`で停止した上で、ターミナルで次のコマンドを実行する。
```bash
$ docker commit jupyter jupyter:python3.7
```
`docker commit`は停止したコンテナからイメージを作成するコマンドである。ここでは、jupyterコンテナから`jupyter:python3.7`のイメージを作成した。

ローカル上のイメージは`docker image ls`で確認できる。
```bash
$ docker image ls
REPOSITORY        TAG         IMAGE ID       CREATED     SIZE
jupyter           python3.7   ********       *******     ****
ubuntu            18.04       ********       *******     ****
python            3.7         ********       *******     ****
```
`jupyter:python3.7`のイメージが作成できていることがわかる。

元のコンテナがどこまで再現されているか確認するために、作成したイメージから、再度コンテナを作成してみる。ターミナルで次のコマンドを実行する。
```bash
$ docker run -it -d --name jupyter2 -p 8080:8888 jupyter:python3.7
```
次に、bashシェルで以下を実行する。
```bash
$ cd home/mountpoint
$ ls


```
mountpointには何も含まれていない。このように、`docker commit`を実行しても、ボリュームでマウントしたディレクトリの中身はイメージに含まれないことを覚えておきたい。

Jupyter Labが実行できるかを確かめる。
```bash
$ jupyter lab --ip=0.0.0.0 --port=8888 --allow-root
```
ここまでが上手くいけば、正常に起動する。

## イメージの配布
自作イメージの配布には、Docker Hubへのアップロードや、tarファイル化など複数方法がある。Docker Hubにイメージをアップロードことで、大規模に配布を行うことが可能だが、Docker Hubのアカウントを作成する必要がある。本資料では、小規模な配布を想定し、tarファイル化によるイメージの配布方法を紹介する。ここでは、前節で作成したjupyter:python3のイメージをtarファイル化する。ターミナルで次のコマンドを実行する。
```bash
$ docker save jupyter:python3.7 > jupyter.tar
```
`docker save`は指定したイメージをtarファイルで、カレントディレクトリに保存するコマンドである。`tar`は複数のファイルを一つにまとめて格納するアーカイブファイルの形式である。作成したtarファイルを配布すれば良い。

配布されたtarファイルは、次のようにしてイメージとして読み込むことができる。
```bash
$ docker load -i jupyter.tar
```
`docker load`は`-i`で指定したファイルをイメージとして読み込むコマンドである。ここでは、カレントディレクトリの`jupyter.tar`からイメージを作成した。作成したイメージからコンテナを起動するには、今まで通り`docker run`を実行すれば良い。
