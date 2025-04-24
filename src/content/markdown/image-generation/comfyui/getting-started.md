---
title-zh: "ComfyUI入门指南"
title-en: "ComfyUI Getting Started"
title-ja: "ComfyUI 入門ガイド"
description-zh: "ComfyUI基础操作和工作流创建教程"
description-en: "Basic operations and workflow creation tutorial for ComfyUI"
description-ja: "ComfyUIの基本操作とワークフロー作成チュートリアル"
created_at: 2023-11-05
cover_image: "https://images.unsplash.com/photo-1659092836065-82d2d850987c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
tag-zh: "初学者"
tag-en: "Beginner"
tag-ja: "初心者"
tag_color: "emerald"
icon_id: "image"
icon_color: "primary"
author: "FirstLab AI团队"
---

# ComfyUI入门指南

## 什么是ComfyUI？

ComfyUI是一个强大的节点式AI图像生成界面，专为Stable Diffusion设计。与其他图像生成工具不同，ComfyUI采用流程图方式构建生成管线，提供更高的灵活性和控制力。

## 界面概述

启动ComfyUI后，您将看到一个空白的工作区，这就是您构建图像生成工作流的地方。界面主要部分包括：

- **画布区域**：中央的主要工作区，用于构建节点图
- **节点菜单**：右键点击画布，显示可添加的节点类别
- **属性面板**：选择节点后显示节点的详细属性
- **队列区域**：底部显示队列中的任务

## 基本概念

### 节点(Nodes)

节点是ComfyUI的基本构建块，每个节点执行特定功能，如加载模型、处理提示词或生成图像。节点有输入端口和输出端口，用于连接其他节点。

### 连接(Connections)

连接将一个节点的输出连接到另一个节点的输入，表示数据流向。使用鼠标从一个节点的输出拖动到另一个节点的输入创建连接。

### 工作流(Workflows)

工作流是连接在一起的节点集合，形成完整的图像生成管线，从输入提示到最终图像输出。

## 构建第一个工作流

让我们创建一个基本的文本到图像工作流：

### 1. 加载模型

右键点击画布 > 选择 `loaders` > `Load Checkpoint`:

- 选择您的Stable Diffusion模型(.ckpt或.safetensors文件)
- 这个节点会创建三个输出：MODEL、CLIP和VAE

### 2. 设置提示词

右键点击 > 选择 `conditioning` > `CLIPTextEncode`：

- 连接Load Checkpoint的CLIP输出到CLIPTextEncode的CLIP输入
- 在文本字段中输入正面提示词，如"a beautiful landscape, mountains, lake, sunset, detailed, realistic"

创建另一个CLIPTextEncode节点用于负面提示词：

- 同样连接CLIP输入
- 在文本字段中输入负面提示词，如"blurry, bad anatomy, poor quality"

### 3. 设置采样器

右键点击 > 选择 `sampling` > `KSampler`:

- 连接：
  - Load Checkpoint的MODEL输出到KSampler的MODEL输入
  - 正面提示词节点的CONDITIONING输出到KSampler的POSITIVE输入
  - 负面提示词节点的CONDITIONING输出到KSampler的NEGATIVE输入
- 设置参数：
  - Seed: 随机数(如42)
  - Steps: 20
  - CFG: 7.0
  - Sampler: euler_a
  - Scheduler: normal

### 4. 解码图像

右键点击 > 选择 `latent` > `VAE Decode`:

- 连接KSampler的LATENT输出到VAE Decode的LATENT输入
- 连接Load Checkpoint的VAE输出到VAE Decode的VAE输入

### 5. 显示图像

右键点击 > 选择 `image` > `Preview Image`:

- 连接VAE Decode的IMAGE输出到Preview Image的IMAGE输入

### 6. 运行工作流

点击界面底部的"Queue Prompt"按钮运行工作流。几秒钟后，您将看到生成的图像！

## 保存和加载工作流

### 保存工作流

点击界面右上角的菜单按钮，选择"Save"。您的工作流将以JSON格式保存。

### 加载工作流

点击菜单按钮，选择"Load"，然后选择之前保存的JSON文件。

## 高级技巧

### 1. ControlNet集成

ControlNet允许您使用参考图像控制生成过程：

1. 添加`ControlNet`节点
2. 连接到您的采样器
3. 加载ControlNet模型
4. 提供控制图像(如线稿、深度图等)

### 2. 使用LoRA模型

LoRA允许使用较小的模型文件微调风格：

1. 添加`LoRA Loader`节点
2. 连接到基础模型
3. 设置LoRA权重(通常在0.5-1.0之间)

### 3. 图像批处理

生成多个图像变体：

1. 在KSampler中设置Batch Size > 1
2. 或使用`SDXLSampler`的批处理功能

### 4. 图像到图像转换

添加`Load Image`和`VAE Encode`节点，将现有图像转换为潜在表示，然后通过采样器处理。

## 故障排除

### 常见错误

1. **CUDA内存不足**：
   - 降低图像分辨率
   - 使用`--lowvram`启动选项
   - 关闭其他GPU密集型应用

2. **节点连接错误**：
   - 确保连接到正确的输入/输出端口
   - 检查输入/输出类型匹配

3. **模型加载失败**：
   - 确认模型文件放在正确目录
   - 检查模型文件完整性

## 学习资源

- [ComfyUI官方Wiki](https://github.com/comfyanonymous/ComfyUI/wiki)
- [ComfyUI工作流分享社区](https://github.com/comfyanonymous/ComfyUI/discussions/categories/workflows)
- [ComfyUI节点参考](https://github.com/comfyanonymous/ComfyUI/wiki/Node-Reference)

## 后续步骤

掌握基础知识后，您可以探索：
- 自定义节点开发
- 高级图像处理技巧
- 动画工作流
- API集成与自动化

祝您在ComfyUI中创建出精彩的AI艺术作品！