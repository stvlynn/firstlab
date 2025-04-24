---
title: ComfyUI部署指南
description: 学习如何部署ComfyUI到不同环境，包括本地和云服务器
created_at: 2023-12-01
cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
tag-zh: "部署"
tag-en: "Deployment"
tag-ja: "デプロイメント"
tag_color: "blue"
icon_id: "server"
icon_color: "blue-500"
author: "FirstLab AI团队"
---

# ComfyUI部署指南

## 简介

ComfyUI是一个功能强大、模块化的稳定扩散图像生成工具。它提供了灵活的节点式界面，使用户能够创建复杂的图像生成工作流。本指南将帮助您成功部署ComfyUI。

## 系统要求

- **GPU**: NVIDIA GPU，至少6GB显存（推荐8GB以上）
- **CPU**: 至少4核
- **RAM**: 至少16GB
- **磁盘空间**: 至少20GB用于基本安装和模型
- **操作系统**: Windows 10/11, Linux或macOS

## 安装步骤

### Windows安装

1. **安装Python**:
   - 下载并安装Python 3.10
   - 确保添加Python到系统PATH

2. **安装Git**:
   - 下载并安装Git

3. **克隆ComfyUI仓库**:
   ```bash
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

4. **创建虚拟环境**(可选但推荐):
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

5. **安装依赖**:
   ```bash
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   pip install -r requirements.txt
   ```

### Linux安装

1. **安装依赖**:
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv git
   ```

2. **克隆仓库**:
   ```bash
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

3. **创建虚拟环境**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **安装PyTorch和依赖**:
   ```bash
   pip install torch torchvision torchaudio
   pip install -r requirements.txt
   ```

### macOS安装

1. **安装依赖**:
   ```bash
   brew install python3 git
   ```

2. **克隆仓库**:
   ```bash
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

3. **创建虚拟环境**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **安装依赖**:
   ```bash
   pip install torch torchvision torchaudio
   pip install -r requirements.txt
   ```

## 下载模型

ComfyUI需要稳定扩散模型才能运行。您可以从以下来源下载模型：

1. **Hugging Face**: https://huggingface.co/models?pipeline_tag=text-to-image
2. **Civitai**: https://civitai.com/

将下载的模型文件(.ckpt或.safetensors)放入以下目录：
- 基础模型: `models/checkpoints/`
- LoRA模型: `models/loras/`
- VAE模型: `models/vae/`
- 控制网络模型: `models/controlnet/`

## 启动ComfyUI

激活虚拟环境后，运行以下命令启动ComfyUI：

```bash
python main.py
```

启动后，访问以下地址打开界面：
```
http://localhost:8188
```

## 高级配置

### GPU内存优化

如果您遇到显存不足的问题，可以尝试以下方法：

1. **降低VRAM使用量**:
   ```bash
   python main.py --lowvram
   ```

2. **极低VRAM模式**:
   ```bash
   python main.py --novram
   ```

### 自定义端口

要更改默认端口，使用以下命令：

```bash
python main.py --port 8000
```

### 远程访问

默认情况下，ComfyUI只允许本地访问。要启用远程访问：

```bash
python main.py --listen 0.0.0.0
```

## 常见问题排解

1. **CUDA错误**:
   - 确保安装了正确版本的PyTorch与您的CUDA版本兼容
   - 尝试降低批处理大小或图像分辨率

2. **导入模型失败**:
   - 确保模型放在正确的目录中
   - 检查模型文件是否完整下载

3. **界面无法加载**:
   - 检查控制台是否有错误信息
   - 确保没有防火墙阻止端口访问

## 更新ComfyUI

定期更新ComfyUI以获取最新功能和修复：

```bash
git pull
pip install -r requirements.txt
```

## 结论

恭喜！您现在应该已经成功部署了ComfyUI。接下来可以探索创建工作流、使用不同模型和自定义节点等更多功能。

## 资源和链接

- [ComfyUI GitHub仓库](https://github.com/comfyanonymous/ComfyUI)
- [ComfyUI文档](https://github.com/comfyanonymous/ComfyUI/wiki)
- [ComfyUI社区讨论](https://github.com/comfyanonymous/ComfyUI/discussions)