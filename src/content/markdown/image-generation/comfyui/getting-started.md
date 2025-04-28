---
title-zh: "ComfyUI入门指南"
title-en: "ComfyUI Getting Started"
title-ja: "ComfyUI入門ガイド"
description-zh: "ComfyUI基础操作和工作流创建教程"
description-en: "Basic operations and workflow creation tutorial for ComfyUI"
description-ja: "ComfyUIの基本操作とワークフロー作成チュートリアル"
created_at: 2023-11-05
cover_image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
tag-zh: "入门"
tag-en: "Beginner"
tag-ja: "入門"
tag_color: "emerald"
icon_id: "image"
icon_color: "emerald-500"
author: "FirstLab AI团队"
---

# ComfyUI入门指南

ComfyUI是一款强大的开源图像生成工具，采用节点式界面设计，让用户能够直观地构建复杂的图像生成工作流。本教程将帮助您快速上手ComfyUI的基本功能。

## 界面介绍

ComfyUI的界面主要由以下部分组成：
- 节点编辑区：创建和连接节点的主要工作区
- 节点菜单：包含所有可用节点的分类列表
- 图像预览区：显示生成结果的区域

## 基础工作流创建

下面是创建一个基本的文本到图像工作流的步骤：

1. 添加`KSampler`节点
2. 添加`CLIPTextEncode`节点（创建两个，一个用于正面提示词，一个用于负面提示词）
3. 添加`CheckpointLoader`节点加载模型
4. 添加`VAEDecode`节点将潜空间转换为图像
5. 添加`EmptyLatentImage`节点创建空白潜空间
6. 正确连接所有节点
7. 设置适当的参数
8. 点击`Queue Prompt`执行工作流

## 节点连接说明

每个节点都有输入端口（顶部）和输出端口（底部）。要连接节点，只需从一个节点的输出端口拖动到另一个节点的输入端口。

## 常用节点介绍

- **CheckpointLoader**：加载Stable Diffusion模型
- **CLIPTextEncode**：将文本提示词编码为模型可理解的格式
- **KSampler**：核心采样器节点，负责生成图像
- **EmptyLatentImage**：创建指定尺寸的空白潜空间
- **VAEDecode**：将潜空间转换为可见图像
- **SaveImage**：保存生成的图像到磁盘

## 提示词技巧

优化提示词可以显著改善生成结果：
- 使用详细的描述
- 包含艺术风格
- 添加适当的关键词，如"高质量"、"精细细节"等
- 使用权重语法：`(关键词:1.5)`增加权重，`[关键词:0.5]`减少权重

## 保存和加载工作流

您可以通过以下方式保存工作流：
1. 点击界面右上角的菜单
2. 选择"Save"保存当前工作流为JSON文件
3. 使用"Load"可以加载保存的工作流

## 下一步学习

掌握基础知识后，您可以进一步探索：
- 添加ControlNet进行精确控制
- 使用LoRA模型和Embeddings增强特定风格
- 创建更复杂的工作流，如图像修复和生成动画

希望本教程能帮助您开始使用ComfyUI！随着实践的增加，您将能够创建越来越复杂和精细的图像生成工作流。