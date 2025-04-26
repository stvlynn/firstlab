---
title: 使用Kaggle的免费GPU玩转流行的AI项目
description: 介绍如何在Kaggle上，使用免费GPU玩转流行的AI项目
created_at: 2025-04-26
cover_image: "https://images.unsplash.com/photo-1638562692477-274868157630?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
tag-zh: "中级"
tag-en: "Intermediate"
tag-ja: "中級"
tag_color: "blue"
icon_id: "edit"
icon_color: "green-600"
author: "FirstLab AI团队"
---

<lang-zh>

# 使用Kaggle的免费GPU玩转流行的AI项目

Kaggle是全球最大的数据科学社区，除开社交之外，它很慷慨地为用户提供了免费的GPU资源。这篇博客将详细介绍如何在Kaggle上利用这些免费的GPU资源来加速你的项目。

### **开篇警告：请不要在Kaggle上处理隐私数据！！**

## 什么是[Kaggle](https://www.kaggle.com/)？

Kaggle是一个由Google拥有的在线数据科学和机器学习平台，和Colab很像。它提供：
- 数据集托管（私有数据集可以存储200G）
- 代码分享环境（Notebooks）
- 机器学习竞赛
- 学习资源
- **免费的云计算资源**（包括GPU）

目前，免费用户可以使用的GPU配置有：
- NVIDIA T4 (14G VRAM)x2，每周30小时 
- NVIDIA P100 (16G VRAM)x1，每周30小时
- TPU VM v3-8，每周20小时

总的来说，这个配置相当大方，对于不算复杂的项目来说完全够用了。但是，**天下没有免费的午餐**，Kaggle的[隐私政策](https://www.kaggle.com/privacy)明确指出，它会利用你所有的个人数据来干任何它想干的事情。但是像我一样，以个人娱乐为目的使用Kaggle的用户，大可不必纠结于这些条款，但是我也绝对不会把个人隐私放在Kaggle上。

## 如何使用Kaggle的免费GPU

### 1. 创建Kaggle账号
访问[kaggle.com](https://www.kaggle.com)注册一个免费账户，可以使用电子邮箱注册，也可以直接使用Google账号登陆。

### 2. 开始和GPU交互

Kaggle中调用GPU的方式为，使用一个类似于Jupyter Notebook的Notebook前端。你可以自己新建一个notebook

![新建一个notebook](/images/kaggle-free-gpu/2025-04-26_img1.jpg)

也可以从其他人分享的公开Notebook修改。打开一个Notebook，点击右上角的 Copy & Edit。

![从其他人分享的公共notebook修改](/images/kaggle-free-gpu/2025-04-26_img2.jpg)

在开始之前，还需要确保右侧的Session Options中，选择了GPU实例，这里最推荐选择`GPU T4x2`，运行速度较快，兼容性好，后面会详细讨论。但是记得，使用结束以后记得点击开关键停止会话释放资源，否则每周30小时的限额会在你离开页面后继续计算。

![选择GPU](/images/kaggle-free-gpu/2025-04-26_img5.jpg)

### 3. shell 代码语法

和Jupyter Notebook一样，每个单元格中都是Python代码，使用Shift+Enter执行。其实我蛮希望Kaggle让我们直接和shell交互的。但是目前真的不可以。免费总是有代价的嘛，那就忍忍。

这里有一个问题，Kaggle不提供传统的shell命令行，如果我们想执行`git clone`这类基本的操作该怎么办呢。答案是在单元格中使用 `!` 加在行首，就可以执行shell代码而不是python代码。

特别需要注意的是，有一个常见的例外，那就是`cd`。由于`cd`是一个shell函数，改变当前shell的工作目录，而不是执行某一个具体的程序命令，所以`!cd`显然也不能在Jupyter Notebook中达到一般大家预期的效果。我们需要使用Jupyter Notebook中的[Magic Function](Jupyter Notebook)来实现`cd`，语法为`%cd`。

通常来讲，在Jupyter Notebook中执行shell命令，只有`cd`需要变化成`%cd`，其他命令都在前面加上`!`即可。举个例子，[ComfyUI](https://github.com/comfyanonymous/ComfyUI)的安装代码原先是：

```
cd /kaggle/
git clone https://github.com/comfyanonymous/ComfyUI.git
cd /kaggle/ComfyUI/custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git
pip install -r /kaggle/ComfyUI/requirements.txt
```

经过一番转化，可以变成：

```
%cd /kaggle/
!git clone https://github.com/comfyanonymous/ComfyUI.git
%cd /kaggle/ComfyUI/custom_nodes
!git clone https://github.com/ltdrdata/ComfyUI-Manager.git
!pip install -r /kaggle/ComfyUI/requirements.txt
```

### 4. ngrok 反向代理

经过以上的步骤，我们可以实现，把大多数项目的代码下载下来，然后安装好依赖，然后启动项目。现在我们又遇到了一个问题：我们此时要么使用命令行的方式运行代码，这样交互起来非常麻烦。大多数项目都提供了基于gradio的WebUI，但是我们把这个WebUI运行起来以后，怎么访问这个`http://localhost:7860`呢？

本节介绍的`ngrok`就可以解决这个问题。它的原理是，把Kaggle上`http://localhost:7860`的流量转发到它的公共服务器上，然后我们访问它的公共服务器，就可以访问到咱们在Kaggle上的`http://localhost:7860`了。

首先，我们需要在[ngrok](https://ngrok.com/)的官网注册，获得一个API Key。点击Register，我们同样可以使用Google账户登陆。然后点击左侧的Your Authtoken，即可在右侧复制自己的API Key。

![获得 API Key](/images/kaggle-free-gpu/2025-04-26_img3.jpg)

假设运行WebUI的方式是`python aaa/bbb/ccc/webui.py`，WebUI监听端口是7860。我们可以使用`pyngrok`来转发网络流量，然后使用`!python aaa/bbb/ccc/webui.py`来运行项目。

```
# --- 变量 ---
Ngrok_token = ""  # 填写你的APIKey
port = 7860 # 你的WebUI的地址
# -----------------
!pip install pyngrok==6.1.0  # 这个低版本的pyngrok支持隧道转发
from pyngrok import ngrok, conf
import gc
gc.collect()
if Ngrok_token:
    try:
        ngrok.set_auth_token(Ngrok_token)
        ngrok.kill()
        srv = ngrok.connect(port)
        print(f"Ngrok Tunnel is active at: {srv.public_url}")
        
        # 启动WebUI的命令行
        !python aaa/bbb/ccc/webui.py
        
    except Exception as e:
        print(f"Error starting ngrok tunnel: {e}")
```

运行之后，可以看到一个`.ngrok-free.app`的网址，稍等一会WebUI启动完毕后，访问这个网址即可访问我们启动的WebUI。

![运行成功的例子](/images/kaggle-free-gpu/2025-04-26_img4.jpg)

理论上Cloudflare Tunnel也可以达成这个目的，后面我会尝试。

### 5. 代码优化与bfloat16

前面说，GPU实例推荐选择`GPU T4x2`，运行速度较快，兼容性好。这源于它拥有更高的[Compute Capability](https://developer.nvidia.com/cuda-gpus)。

![T4拥有更高的兼容性](/images/kaggle-free-gpu/2025-04-26_img6.jpg)

但是观察这张表，我们发现，T4的计算兼容性确实更好，但是也不高啊（是啊，不然为什么它免费呢）。T4只拥有7.5的兼容性，而bfloat16原生支持需要8.0，所以**bfloat16这种新技术，我们是无法使用的，需要退回float32**。

bfloat16（Brain Floating Point 16）是一种 16 位浮点数格式，由 Google Brain 团队于 2018 年提出，主要用于深度学习领域。与float16相比，它拥有更多的指数位和更少的尾数位。有以下两个优点：

1. 保持与 float32 相似的动态范围（8-bit 指数部分），同时减少存储和计算开销，节约显存。

2. 比 float16 更稳定，避免梯度下溢（underflow）问题。

在深度学习训练中，float32（FP32）是传统的精度标准，但它的存储和计算成本较高。为了加速训练，业界尝试使用 float16（FP16），但 FP16 的动态范围较小（5-bit 指数），容易导致梯度下溢或溢出，影响模型收敛。而bfloat16拥有更多的指数位，不会有这个问题，可以大幅加快推理速度。

然而，这些免费的GPU不支持bfloat16，所以如果我们想要更快地运行项目，又不想效果太差的话，我们需要把推理精度从bfloat16更换为float32，而不是float16。pytorch代码中`torch.bfloat16`的地方应该修改为`torch.float32`。

### 6. 上传自己的数据集

请先压缩自己的数据集。展开右侧面板的Input栏目，点击Upload，然后将压缩包拖放至此。即可上传自己的数据集，之后需要为数据集起个名字。完成之后，数据就会以被解压缩的形态，放置在`/kaggle/input/<数据集名>/`下。

![上传数据集](/images/kaggle-free-gpu/2025-04-26_img7.jpg)

## 例子

我在Kaggle上运行过两个项目，[fish-audio（文字转语音）](https://github.com/fishaudio/fish-speech)和[ComfyUI（画图）](https://github.com/comfyanonymous/ComfyUI)。我将完整的Notebook分享给大家。

- fish-speech，携带了一个很迷你的原神语音包，1秒计算大约可以生成2秒语音: [https://www.kaggle.com/code/lindohe/fish-speech-public](https://www.kaggle.com/code/lindohe/fish-speech-public)

- ComfyUI，默认拉取 AnymagineXL3.1 模型，SDXL的1024x1024图片大约15秒生成一张: [https://www.kaggle.com/code/lindohe/comfyui-public](https://www.kaggle.com/code/lindohe/comfyui-public)

## TODO

感觉上TPU应该速度会比这些旧款NVIDIA GPU速度快很多，我还在学习中。

Kaggle还可以用于模型微调（训练Lora），但是我fish-speech训练的时候总是爆显存，还在摸索解决方案。

</lang-zh>

<lang-en>

# Using Kaggle's Free GPU to Play with Popular AI Projects

Kaggle is the largest data science community in the world. Beyond its social features, it generously provides users with free GPU resources. This blog post will detail how to leverage these free GPU resources on Kaggle to accelerate your projects.

### **Warning: Do NOT process private data on Kaggle!!**

## What is [Kaggle](https://www.kaggle.com/)?  

Kaggle is an online data science and machine learning platform owned by Google, similar to Colab. It offers:  
- Dataset hosting (private datasets can store up to 200G)  
- Code-sharing environment (Notebooks)  
- Machine learning competitions  
- Learning resources  
- **Free cloud computing resources** (including GPUs)  

Currently, free users can access the following GPU configurations:  
- NVIDIA T4 (14G VRAM) x2, 30 hours per week  
- NVIDIA P100 (16G VRAM) x1, 30 hours per week  
- TPU VM v3-8, 20 hours per week  

Overall, these configurations are quite generous and sufficient for less complex projects. However, **there's no such thing as a free lunch**. Kaggle's [privacy policy](https://www.kaggle.com/privacy) clearly states that it can use all your personal data for whatever it wants. But for users like me who use Kaggle for personal entertainment, there's no need to dwell on these terms. That said, I would never store personal privacy data on Kaggle.  

## How to Use Kaggle's Free GPU  

### 1. Create a Kaggle Account  
Visit [kaggle.com](https://www.kaggle.com) to register for a free account. You can sign up with an email or log in directly with a Google account.  

### 2. Start Interacting with the GPU  

To invoke the GPU on Kaggle, use a Notebook frontend similar to Jupyter Notebook. You can create a new notebook yourself.  

![Create a new notebook](/images/kaggle-free-gpu/2025-04-26_img1.jpg)  

Alternatively, you can modify a publicly shared Notebook from others. Open a Notebook and click "Copy & Edit" in the top-right corner.  

![Modify a publicly shared notebook](/images/kaggle-free-gpu/2025-04-26_img2.jpg)  

Before starting, ensure that the GPU instance is selected in the Session Options on the right. Here, `GPU T4x2` is the most recommended option, as it offers faster performance and better compatibility (this will be discussed in detail later). Remember to click the power button to stop the session and release resources after use. Otherwise, the weekly 30-hour limit will continue to count even after you leave the page.  

![Select GPU](/images/kaggle-free-gpu/2025-04-26_img5.jpg)  

### 3. Shell Code Syntax  

Like Jupyter Notebook, each cell contains Python code, executed with Shift+Enter. I personally wish Kaggle would allow direct interaction with the shell, but currently, it doesn't. Well, free services always come with trade-offs, so we'll have to bear with it.  

Here's a problem: Kaggle doesn't provide a traditional shell command line. If we want to perform basic operations like `git clone`, what should we do? The answer is to use `!` at the beginning of a line in a cell to execute shell code instead of Python code.  

A notable exception is `cd`. Since `cd` is a shell function that changes the current shell's working directory rather than executing a specific program command, `!cd` obviously won't achieve the expected effect in Jupyter Notebook. Instead, we need to use Jupyter Notebook's [Magic Function](https://ipython.readthedocs.io/en/stable/interactive/magics.html) to implement `cd`, with the syntax `%cd`.  

Generally, in Jupyter Notebook, only `cd` needs to be changed to `%cd`, while other commands simply require adding `!` at the beginning. For example, the installation code for [ComfyUI](https://github.com/comfyanonymous/ComfyUI) originally looks like this:  

```
cd /kaggle/
git clone https://github.com/comfyanonymous/ComfyUI.git
cd /kaggle/ComfyUI/custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git
pip install -r /kaggle/ComfyUI/requirements.txt
```  

After conversion, it becomes:  

```
%cd /kaggle/
!git clone https://github.com/comfyanonymous/ComfyUI.git
%cd /kaggle/ComfyUI/custom_nodes
!git clone https://github.com/ltdrdata/ComfyUI-Manager.git
!pip install -r /kaggle/ComfyUI/requirements.txt
```  

### 4. Ngrok Reverse Proxy  

After the above steps, we can download most project codes, install dependencies, and launch the project. Now we encounter another problem: we can either run the code via the command line, which is cumbersome for interaction, or launch the WebUI (often based on Gradio). But how do we access `http://localhost:7860` after launching the WebUI?  

This section introduces `ngrok`, which solves this problem. Its principle is to forward traffic from `http://localhost:7860` on Kaggle to its public server. By accessing its public server, we can reach `http://localhost:7860` on Kaggle.  

First, we need to register on the [ngrok](https://ngrok.com/) website to obtain an API Key. Click "Register," and you can log in with a Google account. Then, click "Your Authtoken" on the left to copy your API Key on the right.  

![Obtain API Key](/images/kaggle-free-gpu/2025-04-26_img3.jpg)  

Assuming the WebUI is launched with `python aaa/bbb/ccc/webui.py` and listens on port 7860, we can use `pyngrok` to forward network traffic and then run the project with `!python aaa/bbb/ccc/webui.py`.  

```
# --- Variables ---
Ngrok_token = ""  # Fill in your API Key
port = 7860  # Your WebUI's port
# -----------------
!pip install pyngrok==6.1.0  # This older version of pyngrok supports tunnel forwarding
from pyngrok import ngrok, conf
import gc
gc.collect()
if Ngrok_token:
    try:
        ngrok.set_auth_token(Ngrok_token)
        ngrok.kill()
        srv = ngrok.connect(port)
        print(f"Ngrok Tunnel is active at: {srv.public_url}")
        
        # Command to launch the WebUI
        !python aaa/bbb/ccc/webui.py
        
    except Exception as e:
        print(f"Error starting ngrok tunnel: {e}")
```  

After running, you'll see a `.ngrok-free.app` URL. Once the WebUI starts, you can access it via this URL.  

![Example of successful execution](/images/kaggle-free-gpu/2025-04-26_img4.jpg)  

In theory, Cloudflare Tunnel could also achieve this, which I'll explore later.  

### 5. Code Optimization and bfloat16  

Earlier, it was recommended to choose the `GPU T4x2` GPU instance for better performance and compatibility, owing to its higher [Compute Capability](https://developer.nvidia.com/cuda-gpus).  

![T4 offers better compatibility](/images/kaggle-free-gpu/2025-04-26_img6.jpg)  

However, looking at this table, we notice that while the T4's compute compatibility is indeed better, it's still not high (well, otherwise why would it be free?). The T4 only has a compute capability of 7.5, while native support for bfloat16 requires 8.0. Therefore, **we cannot use bfloat16 and must fall back to float32**.  

bfloat16 (Brain Floating Point 16) is a 16-bit floating-point format proposed by Google Brain in 2018, primarily for deep learning. Compared to float16, it has more exponent bits and fewer mantissa bits, offering two advantages:  

1. Maintains a dynamic range similar to float32 (8-bit exponent) while reducing storage and computational overhead, saving VRAM.  
2. More stable than float16, avoiding gradient underflow issues.  

In deep learning training, float32 (FP32) is the traditional precision standard, but its storage and computational costs are high. To speed up training, the industry has tried using float16 (FP16), but FP16's smaller dynamic range (5-bit exponent) can lead to gradient underflow or overflow, affecting model convergence. bfloat16, with more exponent bits, avoids this issue and can significantly speed up inference.  

However, these free GPUs don't support bfloat16. So if we want to run projects faster without sacrificing too much quality, we need to switch the inference precision from bfloat16 to float32, not float16. In PyTorch code, replace `torch.bfloat16` with `torch.float32`.  

### 6. Uploading Your Own Dataset  

First, compress your dataset. Expand the Input section on the right panel, click "Upload," and drag and drop the compressed file here. You'll need to name the dataset. Once completed, the data will be decompressed and placed under `/kaggle/input/<dataset_name>/`.  

![Upload dataset](/images/kaggle-free-gpu/2025-04-26_img7.jpg)  

## Examples  

I've run two projects on Kaggle: [fish-audio (text-to-speech)](https://github.com/fishaudio/fish-speech) and [ComfyUI (image generation)](https://github.com/comfyanonymous/ComfyUI). I’ll share the complete Notebooks here.  

- fish-speech, with a mini Genshin Impact voice pack included, generates approximately 2 seconds of speech per 1 second of computation: [https://www.kaggle.com/code/lindohe/fish-speech-public](https://www.kaggle.com/code/lindohe/fish-speech-public)  

- ComfyUI, defaulting to the AnymagineXL3.1 model, generates a 1024x1024 SDXL image in about 15 seconds: [https://www.kaggle.com/code/lindohe/comfyui-public](https://www.kaggle.com/code/lindohe/comfyui-public)  

## TODO  

In theory, TPUs should be much faster than these older NVIDIA GPUs, but I'm still learning.  

Kaggle can also be used for model fine-tuning (e.g., training LoRAs), but I keep running into VRAM issues when training fish-speech. Still exploring solutions.

</lang-en>

<lang-ja>

# Kaggleの無料GPUを活用して人気のAIプロジェクトを楽しむ

Kaggleは世界最大のデータサイエンスコミュニティで、ソーシャル機能に加え、ユーザーに無料のGPUリソースを提供しています。このブログでは、Kaggle上でこれらの無料GPUリソースを活用してプロジェクトを加速させる方法を詳しく紹介します。

### **最初の警告：Kaggleでプライバシーデータを処理しないでください！！**

## [Kaggle](https://www.kaggle.com/)とは？

KaggleはGoogleが所有するオンラインデータサイエンスおよび機械学習プラットフォームで、Colabとよく似ています。以下を提供しています：
- データセットホスティング（プライベートデータセットは200Gまで保存可能）
- コード共有環境（Notebooks）
- 機械学習コンペティション
- 学習リソース
- **無料のクラウドコンピューティングリソース**（GPUを含む）

現在、無料ユーザーが利用できるGPU構成は以下の通りです：
- NVIDIA T4 (14G VRAM)x2、週30時間
- NVIDIA P100 (16G VRAM)x1、週30時間
- TPU VM v3-8、週20時間

全体的に、この構成は非常に寛大で、複雑でないプロジェクトには十分です。しかし、**無料のランチはありません**。Kaggleの[プライバシーポリシー](https://www.kaggle.com/privacy)には、すべての個人データを自由に利用できると明確に記載されています。私のように個人的な楽しみのためにKaggleを使用するユーザーはこれらの条項にこだわる必要はありませんが、個人のプライバシーをKaggleに置くことは絶対にしません。

## Kaggleの無料GPUの使用方法

### 1. Kaggleアカウントの作成
[kaggle.com](https://www.kaggle.com)にアクセスして無料アカウントを登録します。メールアドレスで登録するか、Googleアカウントで直接ログインできます。

### 2. GPUとの対話を開始

KaggleでGPUを呼び出す方法は、Jupyter Notebookに似たNotebookフロントエンドを使用することです。自分で新しいnotebookを作成することもできます。

![新しいnotebookを作成](/images/kaggle-free-gpu/2025-04-26_img1.jpg)

または、他の人が共有した公開Notebookを編集することもできます。Notebookを開き、右上のCopy & Editをクリックします。

![他の人が共有した公開Notebookを編集](/images/kaggle-free-gpu/2025-04-26_img2.jpg)

開始する前に、右側のSession OptionsでGPUインスタンスを選択する必要があります。ここでは`GPU T4x2`を選択することをお勧めします。実行速度が速く、互換性が良いです。後で詳しく説明します。ただし、使用後は必ず電源ボタンをクリックしてセッションを停止し、リソースを解放してください。そうしないと、週30時間の制限がページを離れた後もカウントされ続けます。

![GPUを選択](/images/kaggle-free-gpu/2025-04-26_img5.jpg)

### 3. shellコードの構文

Jupyter Notebookと同様に、各セルにはPythonコードが含まれており、Shift+Enterで実行します。実際には、Kaggleで直接shellと対話できるようにしてほしいのですが、現在はできません。無料には常に代償があるので、我慢しましょう。

ここで問題があります。Kaggleは従来のshellコマンドラインを提供していません。`git clone`のような基本的な操作を実行したい場合、どうすればよいでしょうか。答えは、セル内で行の先頭に`!`を付けることで、Pythonコードではなくshellコードを実行できることです。

特に注意が必要な例外として、`cd`があります。`cd`はshell関数であり、特定のプログラムコマンドを実行するのではなく、現在のshellの作業ディレクトリを変更するため、`!cd`はJupyter Notebookで一般的に期待される効果を達成できません。Jupyter Notebookの[Magic Function](Jupyter Notebook)を使用して`cd`を実現する必要があり、構文は`%cd`です。

一般的に、Jupyter Notebookでshellコマンドを実行する場合、`cd`のみを`%cd`に変更し、他のコマンドは前に`!`を付けるだけです。例えば、[ComfyUI](https://github.com/comfyanonymous/ComfyUI)のインストールコードは元々以下の通りです：

```
cd /kaggle/
git clone https://github.com/comfyanonymous/ComfyUI.git
cd /kaggle/ComfyUI/custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git
pip install -r /kaggle/ComfyUI/requirements.txt
```

変換後、以下のようになります：

```
%cd /kaggle/
!git clone https://github.com/comfyanonymous/ComfyUI.git
%cd /kaggle/ComfyUI/custom_nodes
!git clone https://github.com/ltdrdata/ComfyUI-Manager.git
!pip install -r /kaggle/ComfyUI/requirements.txt
```

### 4. ngrokリバースプロキシ

上記の手順により、ほとんどのプロジェクトのコードをダウンロードし、依存関係をインストールし、プロジェクトを起動できます。次に問題が発生します：コマンドライン方式でコードを実行すると、対話が非常に面倒です。ほとんどのプロジェクトはgradioベースのWebUIを提供していますが、このWebUIを実行した後、`http://localhost:7860`にどのようにアクセスすればよいでしょうか？

このセクションで紹介する`ngrok`はこの問題を解決できます。その原理は、Kaggle上の`http://localhost:7860`のトラフィックをそのパブリックサーバーに転送し、そのパブリックサーバーにアクセスすることで、Kaggle上の`http://localhost:7860`にアクセスできるようにすることです。

まず、[ngrok](https://ngrok.com/)の公式サイトで登録し、API Keyを取得する必要があります。Registerをクリックし、Googleアカウントでログインすることもできます。次に、左側のYour Authtokenをクリックし、右側で自分のAPI Keyをコピーできます。

![API Keyを取得](/images/kaggle-free-gpu/2025-04-26_img3.jpg)

WebUIの実行方法が`python aaa/bbb/ccc/webui.py`で、WebUIのリスンポートが7860であると仮定します。`pyngrok`を使用してネットワークトラフィックを転送し、`!python aaa/bbb/ccc/webui.py`でプロジェクトを実行できます。

```
# --- 変数 ---
Ngrok_token = ""  # あなたのAPIKeyを入力
port = 7860 # あなたのWebUIのアドレス
# -----------------
!pip install pyngrok==6.1.0  # この低バージョンのpyngrokはトンネル転送をサポート
from pyngrok import ngrok, conf
import gc
gc.collect()
if Ngrok_token:
    try:
        ngrok.set_auth_token(Ngrok_token)
        ngrok.kill()
        srv = ngrok.connect(port)
        print(f"Ngrok Tunnel is active at: {srv.public_url}")
        
        # WebUIを起動するコマンドライン
        !python aaa/bbb/ccc/webui.py
        
    except Exception as e:
        print(f"Error starting ngrok tunnel: {e}")
```

実行後、`.ngrok-free.app`のURLが表示されます。WebUIが起動するまで少し待ってから、このURLにアクセスすると、起動したWebUIにアクセスできます。

![実行成功の例](/images/kaggle-free-gpu/2025-04-26_img4.jpg)

理論的にはCloudflare Tunnelもこの目的を達成できますが、後で試してみます。

### 5. コードの最適化とbfloat16

前述のように、GPUインスタンスは`GPU T4x2`を選択することをお勧めします。実行速度が速く、互換性が良いです。これは、より高い[Compute Capability](https://developer.nvidia.com/cuda-gpus)を持っているためです。

![T4はより高い互換性を持つ](/images/kaggle-free-gpu/2025-04-26_img6.jpg)

しかし、この表を見ると、T4の計算互換性は確かに良いですが、それほど高くないことがわかります（そうです、そうでなければなぜ無料なのでしょうか）。T4は7.5の互換性しか持っておらず、bfloat16のネイティブサポートには8.0が必要なため、**bfloat16のような新技術は使用できず、float32に戻す必要があります**。

bfloat16（Brain Floating Point 16）は、16ビットの浮動小数点形式で、Google Brainチームが2018年に提案し、主に深層学習分野で使用されています。float16と比較して、より多くの指数ビットと少ない仮数ビットを持っています。以下の2つの利点があります：

1. float32と同様のダイナミックレンジ（8ビットの指数部分）を維持しながら、ストレージと計算のオーバーヘッドを削減し、VRAMを節約します。

2. float16よりも安定しており、勾配のアンダーフロー（underflow）問題を回避します。

深層学習のトレーニングでは、float32（FP32）が伝統的な精度基準ですが、ストレージと計算コストが高いです。トレーニングを加速するために、業界はfloat16（FP16）の使用を試みましたが、FP16のダイナミックレンジは小さく（5ビットの指数）、勾配のアンダーフローやオーバーフローを引き起こしやすく、モデルの収束に影響を与えます。bfloat16はより多くの指数ビットを持っているため、この問題がなく、推論速度を大幅に向上させることができます。

しかし、これらの無料GPUはbfloat16をサポートしていないため、プロジェクトをより速く実行したいが、効果をあまり犠牲にしたくない場合、推論精度をbfloat16からfloat32に変更する必要があります。pytorchコードの`torch.bfloat16`を`torch.float32`に変更する必要があります。

### 6. 自分のデータセットをアップロード

まず、自分のデータセットを圧縮してください。右側のパネルのInputセクションを展開し、Uploadをクリックして、圧縮ファイルをドラッグアンドドロップします。その後、データセットに名前を付ける必要があります。完了すると、データは解凍された状態で`/kaggle/input/<データセット名>/`の下に配置されます。

![データセットをアップロード](/images/kaggle-free-gpu/2025-04-26_img7.jpg)

## 例

私はKaggleで2つのプロジェクトを実行しました。[fish-audio（テキスト読み上げ）](https://github.com/fishaudio/fish-speech)と[ComfyUI（画像生成）](https://github.com/comfyanonymous/ComfyUI)。完全なNotebookを共有します。

- fish-speech、ミニ原神音声パックを搭載、1秒の計算で約2秒の音声を生成：[https://www.kaggle.com/code/lindohe/fish-speech-public](https://www.kaggle.com/code/lindohe/fish-speech-public)

- ComfyUI、デフォルトでAnymagineXL3.1モデルをダウンロード、SDXLの1024x1024画像は約15秒で1枚生成：[https://www.kaggle.com/code/lindohe/comfyui-public](https://www.kaggle.com/code/lindohe/comfyui-public)

## TODO

TPUはこれらの旧型NVIDIA GPUよりもはるかに速いと感じていますが、まだ学習中です。

Kaggleはモデルのファインチューニング（Loraのトレーニング）にも使用できますが、fish-speechをトレーニングする際に常にVRAMが不足するため、解決策を模索中です。

</lang-ja>