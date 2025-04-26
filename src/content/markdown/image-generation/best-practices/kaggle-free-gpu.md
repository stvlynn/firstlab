# 白嫖Kaggle的免费GPU玩转流行的AI项目

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

通常来讲，在Jupyter Notebook中执行shell命令，只有`cd`需要变化成`%cd`，其他命令都在前面加上`!`即可。举个例子，[fish-speech](https://github.com/fishaudio/fish-speech)的安装代码原先是：

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