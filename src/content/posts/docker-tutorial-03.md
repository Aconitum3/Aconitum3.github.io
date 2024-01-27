---
title: "3. Python3環境の構築"
pubDate: 2023-02-28
description: "ubuntuイメージからpythonの実行環境を構築する。pythonイメージを利用する方法も学ぶ。Jupyter Lab環境を構築する方法も扱う。"
tags: ["Docker", "Docker入門"]
prev: "docker-tutorial-02"
next: "docker-tutorial-04"
---

# Python3環境の構築

この章では、はじめに、前章で扱った`ubuntu:18.04`のイメージからpython3が動作する環境を構築する。`ubuntu:18.04`のイメージにはpython3はインストールされていないため、python3をインストールすることから始める。その後に、Docker Hubで公開されているpythonイメージを利用する方法を紹介する。また、pythonイメージを用いたjupyter環境の構築も行う。

## python3のインストール
pythonとそのライブラリのインストールにはいくつか方法がある。本資料では、Anacondaを利用する方法と、pipのみを利用する方法を紹介する。**次節でpythonを手動でインストールしない方法を紹介するので、興味がなければ読み飛ばして構わない。**

### Anacondaを利用する方法
Anacondaはpythonでよく利用するライブラリをまとめてインストールしてくれる。その分容量が大きくなるため、目的に応じて後述するpipを用いた方法と使い分けるのがいいだろう。

はじめに、コンテナを作成する。ターミナルで次のコマンドを実行する。
```bash
$ docker run -it --name anaconda ubuntu:18.04
```
Anacondaは[anaconda.com](https://www.anaconda.com/products/distribution)でインストーラを公開している。`wget`コマンドを用いて、ダウンロードする。`wget`は指定したURLのファイルをカレントディレクトリ上にダウンロードするコマンドである。
```bash
$ apt update
$ apt install wget
$ wget https://repo.anaconda.com/archive/Anaconda3-2019.10-Linux-x86_64.sh   # リンク先の Anaconda3-2019.10-Linux-x86_64.sh をダウンロード
$ bash Anaconda3-2019.10-Linux-x86_64.sh   # インストーラを実行
```
Anacondaのインストールが完了したが、PATHを通していないため、このままでは実行できない。ubuntuでPATHを通すにはrootディレクトリ上の`.profile`ファイルに設定を追記する必要がある。
```bash
$ apt install vim
$ vim ~/.profile
```
vimで`.profile`を開いたら、ファイルの末尾に`PATH="$PATH:/root/anaconda3/bin"`を追記する。半角スペースが意味を持つため、`=`の間には半角スペースを入れないように注意する。

次に、以下のコマンドを実行して`.profile`への変更を反映する。
```bash
$ source ~/.profile   # .profileへの変更を反映する
```
PATHを通したため、anacondaでインストールしたpythonが実行できるようになる。次のコマンドを実行すると、python3のシェルが起動する。
```bash
$ python3
```
対話モードを抜けるには、`exit()`と入力すれば良い。
### pipを利用する方法
pipは Python Package Index ( PyPI ) 上に公開されているPythonパッケージをインストールするシステムである。PyPIには誰でも自由にパッケージの公開ができるため、Anacondaに比べて利用できるパッケージが非常に多い。

はじめに、コンテナを作成する。ターミナルで次のコマンドを実行する。
```bash
$ docker run -it --name pipython ubuntu:18.04
```
python3, pipはどちらも`apt`コマンドでインストールできる。
```bash
$ apt update
$ apt install python3 python3-pip
```
`apt`はインストールしたいパッケージを並べて書くことで、まとめてインストールすることもできる。

次のコマンドを実行すると、python3のシェルが起動する。
```bash
$ python3
```
対話モードを抜けるには、`exit()`と入力すれば良い。

また、pipを用いたパッケージのインストールはシェル上で行う。例えば、numpyをインストールする場合、次のコマンドを実行する。
```bash
$ pip install numpy
```

## pythonイメージを利用した環境構築
前節では、`ubuntu:18.04`からpython3環境を構築した。実は、Docker Hubでは、[pythonのイメージ](https://hub.docker.com/_/python)も公開されている。pythonのバージョンも指定できるため、dockerでpythonを利用する際には、このイメージを用いることが多い。以降は断りがない限り、本資料では`python:3.7`のイメージを用いる。

はじめに、`docker pull`で、Docker Hubから、`python:3.7`のイメージをダウンロードする。
```bash
$ docker pull python:3.7
```
python:3.7から、コンテナを起動する。
```bash
$ docker run -it --name python3 python:3.7
```
`ubuntu:18.04`でコンテナを作成したときと異なり、`python:3.7`からコンテナを作成した場合、pythonの対話モードが起動する。これは、**Root Process**の違いが原因である。Root Processとは、コンテナ上で最初に実行されるプロセスのことである。Root Processを確認してみる。一度コンテナをdetach ( Ctrl+P, Ctrl+Q )した後に、ターミナル上で`docker ps`を実行する。
```bash
$ docker ps
CONTAINER ID   IMAGE        COMMAND     CREATED       STATUS      PORTS     NAMES
************   python:3.7   "python3"   *******       Up ***                python3
```
COMMANDに表示されているコマンドがRoot Processである。`ubuntu:18.04`から作成したコンテナのRoot Processは`bash`であった。python3コンテナは、Root Processが`python3`であるため、`bash`ではなく、pythonのシェルが起動するのである。また、**Root Processが終了すると、そのコンテナは停止する。**  例えば、`pip`でパッケージをインストールするために、一度`exit()`すると、python3コンテナは停止してしまう。python3コンテナで`bash`を起動するには、ターミナルで次のコマンドを実行する。
```bash
$ docker exec -it python3 bash
```
`docker exec`は、指定したコンテナで指定したコマンドを実行するコマンドである。ここでは、python3コンテナで、`bash`コマンドを実行した。ここで起動したシェルで`pip install`を実行すれば良い。

ここで、`docker exec`について少し詳しく説明する。`docker exec`でbashに入った状態なら、`exit`で抜けた後に次のコマンドを実行する。
```bash
$ docker exec -it python3 python3
```
これは、python3コンテナで、python3のシェルを起動するコマンドである。python3のシェルで`exit()`を実行した後に、`docker ps`で起動中のコンテナを確認してみる。
```bash
$ docker ps
CONTAINER ID   IMAGE        COMMAND     CREATED       STATUS      PORTS     NAMES
************   python:3.7   "python3"   *******       Up ***                python3
```
`exit()`を実行したのにも関わらず、コンテナが停止していないことがわかる。実は、`docker exec`でRoot Processと同じシェルを起動しても、それはRoot Processではないのだ。つまり、ここでは、Root Processとは別に新たなpython3のシェルを起動していることになる。Root Processのpython3のシェルに接続するには、`docker attach`を実行すれば良い。

### オプション -it について
前章から`docer run`や`docker exec`で`-it`は度々現れた。やや複雑になるため、説明を避けていたが、ここで詳しく説明する。`-it`は`-i`と`-t`の2つのオプションが組み合わさったものである。`-i`はユーザの入力をRoot Processに送るオプションである。`-t`はRoot Processからの出力をターミナルに送るオプションである。前章で、`-it`を付けないとコンテナが起動直後に停止すると述べた。これは、`bash`や`python3`などのシェルは、実行時に出力するターミナルが見つからないと終了するためだ。つまり、`-it`はRoot Processがシェルの場合に必要なオプションである。

## Jupyter Lab環境の構築
Jupyter Labはブラウザ上で動作するプログラムの対話型実行環境である。`pip`でインストールし簡単に起動することができる。しかし、それをコンテナ上で実行することを考えると、話は少し複雑になる。まず、Jupyter Labは起動するとWebサーバーを立ち上げ、ユーザーのWebブラウザに情報を送る。デフォルトは [http://localhost:8888]() である。ユーザーはそのブラウザ上でインタラクティブにプログラムを評価できる。`localhost`とは通信ネットワークで位置関係を示す際に、自分自身を表す。`8888`の部分をポート番号という。ポート番号は、コンピュータが通信に使用するプログラムを識別するための番号である。つまり、Jupyter Labをコンテナで利用するには、コンテナの外から、コンテナ内の8888番のポートにアクセスする必要がある。また、Jupyter Labで作成したノートブックにはコンテナの外からアクセスできないと不便だ。つまり、ローカルのディレクトリとコンテナのディレクトリをリンクする必要がある。これらの課題を解決しつつ新たにコンテナを作成する。

ホストの任意のディレクトリ上で次のコマンドを実行する。

```bash
$ mkdir mountpoint
$ docker run -it -d --name jupyter -p 8080:8888 -v $PWD/mountpoint:/home/mountpoint python:3.7
$ docker exec -it jupyter bash
```
`-p`と`-v`について説明する。`-p`は、コンテナのポートとホストのポートをマッピングするオプションである。ここでは、コンテナの8888番ポートが、ホストの8080番ポートにマッピングされた。つまり、コンテナの`localhost:8888`に、ホストの`localhost:8080`からアクセスできるようになる。`-v`はホストのディレクトリを、コンテナのディレクトリにマウントするオプションである。ここでは、ホストのカレントディレクトリ内の`mountpoint`ディレクトリをコンテナの`/home/mountpoint`ディレクトリにマウントしている。つまり、ホストの`mountpoint`ディレクトリ内のファイルはコンテナの`mountpoint`ディレクトリに共有される。その逆も同様である。

次に、コンテナのbashシェルで次のコマンドを実行する。
```bash
$ pip install jupyterlab
$ cd home/mountpoint
$ jupyter lab --ip=0.0.0.0 --port=8888 --allow-root
```
`jupyter lab`を実行後の出力にいくつかURLが含まれている。ホストから`localhost:8080`にアクセスするとトークンが要求されるため、URLの`?token=`以降の文字列を入力すれば良い。

`jupyter lab`のオプションについて説明する。`--ip`はサーバーを立ち上げる際のipアドレスを指定している。Dockerのコンテナでは、`0.0.0.0`でサーバーを立てないと、コンテナ外からアクセスができない。`--port`はポート番号を指定している。デフォルトで`8888`が割り当てられるため、本当は書く必要がないが、明示しておく。`--allow-root`はroot権限のユーザーがアクセスできるようになるオプションである。root権限とは、ほぼ全ての操作が可能なシステム管理者用の権限のことである。Dockerではコンテナのユーザー権限がデフォルトではrootになっている。また、tokenの入力を省略するオプションもあるが、セキュリティ的な観点から勧めない。ポートをマッピングしたことで、同一ネットワークに接続していて、ホストのipアドレスがわかれば、誰でもWebサーバーにアクセスできてしまうからだ。例えば、一般的な家庭のネットワーク環境下でこの演習をしているなら、今使っているパソコンのipアドレスを調べて、スマートフォンで同じネットワークに接続した上で、SafariなどのWebブラウザで`{-- ipアドレス --}:8080`にアクセスしてみると良い。スマートフォンからJupyter Labが利用できる。
