# RobotStudio

#### 介绍

RobotStudio是一个机器人集成开发环境，主要针对不同构型的工业机器人，提供包括机器人程序调试、示教及仿真等功能。

#### 软件架构

RobotStudio主要是基于VueJS架构构建，其目前主要分为两个重要的apps，分别是针对桌面环境的集成开发环境软件，以及针对示教平板的示教软件，两个软件均基于VueJS架构构建，并共用了一些组件。
其中
1. 桌面软件：采用Vue+Electron架构，实现一个桌面客户端，主要可部署于上位机软件，通过网络直接连接真实机器人或者机器人仿真环境，进行机器人软件的开发。
2. 示教软件：采用Vue+QT的方案，在QT中嵌入了一个WebEngine，从而便于不属于各种嵌入式操作系统中（嵌入式系统大多数对Electron很难对Node及Electron环境进行支持），并通过QtWebChannel实现QT与JavaScript语言的交互。同时，为了方便示教器软件的开发，我们在桌面上提供了一个Electon+Vue的仿真开发调试器。

#### 安装教程


#### 使用说明


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
