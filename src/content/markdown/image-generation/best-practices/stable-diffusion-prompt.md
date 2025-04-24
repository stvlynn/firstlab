---
title: Stable Diffusion提示词优化指南
description: 如何编写高质量的提示词以获得更好的AI图像生成结果
created_at: 2023-12-10
cover_image: "https://images.unsplash.com/photo-1638562692477-274868157630?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
tag-zh: "中级"
tag-en: "Intermediate"
tag-ja: "中級"
tag_color: "blue"
icon_id: "edit"
icon_color: "green-600"
author: "FirstLab AI团队"
---

# Stable Diffusion提示词优化指南

<lang-zh>
## 提示词设计的基本原则

AI图像生成的质量很大程度上取决于您提供的提示词。一个好的提示词可以让AI明确理解您想要的内容和风格。以下是编写高效提示词的关键原则：

### 1. 具体胜于抽象

描述具体的细节，避免使用过于抽象的词汇。例如，不要仅仅说"一个美丽的风景"，而应该说"一个有着高耸雪山、清澈湖泊和金色夕阳的山间风景"。

### 2. 结构化提示词

将提示词分为几个主要部分：
- **主题**：描述图像的核心对象或人物
- **环境**：描述场景、背景或位置
- **光照**：描述光线条件（如"柔和的自然光"、"戏剧性的侧光"）
- **风格**：指定艺术风格、艺术家或媒介
- **技术细节**：指定渲染质量、相机设置等

### 3. 使用权重调整重要性

在Stable Diffusion中，您可以使用特殊语法为词语分配不同的权重：
- 增加权重：`(word:1.2)` 或 `((word))` 或 `(((word)))`
- 减少权重：`(word:0.8)` 或 `[word]` 或 `[[word]]`

例如：`(masterpiece:1.3), (detailed:1.2), a beautiful (mountain landscape:1.4), [people], [buildings]`

### 4. 负面提示词的使用

负面提示词告诉AI要避免什么。常用的负面提示词包括：
```
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry
```

## 实例分析

### 优质提示词示例

```
(masterpiece:1.2), (highly detailed:1.3), professional photograph of a japanese garden, stone pathway, cherry blossom trees, wooden bridge over koi pond, moss-covered stone lanterns, spring season, kyoto, golden hour lighting, 8k uhd, professional photography, shallow depth of field, canon 5d mark iv
```

这个提示词：
- 指定了高质量（masterpiece, highly detailed）
- 清晰描述了场景（日本花园、石头小径、樱花树等）
- 提供了位置和时间（京都、春季、黄金时段）
- 增加了技术细节（8K超高清、专业摄影、浅景深、佳能相机）

### 优化前后对比

**优化前**：
```
a beautiful landscape with mountains
```

**优化后**：
```
(professional photograph:1.2) of alpine landscape, snow-capped mountains, pine forest, reflective lake, dramatic clouds, golden sunset light, (detailed:1.3), 8k resolution, sharp focus, high dynamic range, sony a7r4
```

第二个提示词提供了更多细节和技术特征，创建出更加逼真和视觉上令人印象深刻的图像。

## 常见提示词类别和示例

### 1. 艺术风格

- `oil painting style`：油画风格
- `watercolor style`：水彩风格
- `digital art`：数字艺术
- `concept art`：概念艺术
- `illustration`：插画风格
- `anime style`：动漫风格
- `studio ghibli style`：吉卜力工作室风格
- `cyberpunk style`：赛博朋克风格

### 2. 光照效果

- `golden hour lighting`：黄金时段照明
- `cinematic lighting`：电影式照明
- `rim lighting`：轮廓光
- `volumetric lighting`：体积光
- `dramatic shadows`：戏剧性阴影
- `soft diffused lighting`：柔和漫射光

### 3. 相机设置

- `bokeh`：散景效果
- `shallow depth of field`：浅景深
- `telephoto lens`：远摄镜头
- `wide angle`：广角
- `macro shot`：微距拍摄
- `8k resolution`：8K分辨率
- `photorealistic`：逼真的照片效果

## 高级技巧

### 1. 使用艺术家和参考作品

提及特定艺术家可以帮助AI模拟其风格：
```
landscape in the style of Thomas Kinkade, pastoral scene, cottage, gentle light
```

### 2. 混合多种风格

结合不同风格创造独特效果：
```
cyberpunk cityscape, (watercolor:0.8), (digital art:1.2), neon lights, rainy night
```

### 3. 使用Lora模型微调风格

如果您使用支持Lora的界面，可以应用特定风格模型：
```
a portrait of woman, <lora:pixarStyle:0.7>, warm smile, professional lighting
```

## 总结

编写好的提示词是AI图像生成的艺术和科学结合。通过提供清晰、具体的描述，设置适当的权重，并利用风格和技术细节，您可以大大提高生成图像的质量和准确性。实验不同的提示词组合，并从每次尝试中学习，将帮助您掌握这一强大工具。

记住：好的AI艺术不仅仅来自于强大的模型，更来自于精心设计的提示词和持续的实践。
</lang-zh>

<lang-en>
## Basic Principles of Prompt Design

The quality of AI-generated images largely depends on the prompts you provide. A good prompt helps the AI clearly understand your desired content and style. Here are key principles for writing effective prompts:

### 1. Specific Over Abstract

Describe specific details and avoid overly abstract terms. Rather than saying "a beautiful landscape," say "a mountain landscape with towering snow-capped peaks, a clear lake, and golden sunset."

### 2. Structured Prompts

Divide your prompt into several main sections:
- **Subject**: Describe the core objects or characters
- **Environment**: Describe the scene, background, or location
- **Lighting**: Describe lighting conditions (e.g., "soft natural light," "dramatic side lighting")
- **Style**: Specify artistic style, artist, or medium
- **Technical details**: Specify rendering quality, camera settings, etc.

### 3. Using Weights to Adjust Importance

In Stable Diffusion, you can use special syntax to assign different weights to words:
- Increase weight: `(word:1.2)` or `((word))` or `(((word)))`
- Decrease weight: `(word:0.8)` or `[word]` or `[[word]]`

For example: `(masterpiece:1.3), (detailed:1.2), a beautiful (mountain landscape:1.4), [people], [buildings]`

### 4. Using Negative Prompts

Negative prompts tell the AI what to avoid. Common negative prompts include:
```
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry
```

## Example Analysis

### Quality Prompt Example

```
(masterpiece:1.2), (highly detailed:1.3), professional photograph of a japanese garden, stone pathway, cherry blossom trees, wooden bridge over koi pond, moss-covered stone lanterns, spring season, kyoto, golden hour lighting, 8k uhd, professional photography, shallow depth of field, canon 5d mark iv
```

This prompt:
- Specifies high quality (masterpiece, highly detailed)
- Clearly describes the scene (Japanese garden, stone pathway, cherry blossoms, etc.)
- Provides location and time (Kyoto, spring, golden hour)
- Adds technical details (8K UHD, professional photography, shallow depth of field, Canon camera)

### Before and After Optimization

**Before**:
```
a beautiful landscape with mountains
```

**After**:
```
(professional photograph:1.2) of alpine landscape, snow-capped mountains, pine forest, reflective lake, dramatic clouds, golden sunset light, (detailed:1.3), 8k resolution, sharp focus, high dynamic range, sony a7r4
```

The second prompt provides more details and technical characteristics, creating a more realistic and visually impressive image.

## Common Prompt Categories and Examples

### 1. Artistic Styles

- `oil painting style`
- `watercolor style`
- `digital art`
- `concept art`
- `illustration`
- `anime style`
- `studio ghibli style`
- `cyberpunk style`

### 2. Lighting Effects

- `golden hour lighting`
- `cinematic lighting`
- `rim lighting`
- `volumetric lighting`
- `dramatic shadows`
- `soft diffused lighting`

### 3. Camera Settings

- `bokeh`
- `shallow depth of field`
- `telephoto lens`
- `wide angle`
- `macro shot`
- `8k resolution`
- `photorealistic`

## Advanced Techniques

### 1. Using Artists and Reference Works

Mentioning specific artists can help the AI emulate their style:
```
landscape in the style of Thomas Kinkade, pastoral scene, cottage, gentle light
```

### 2. Mixing Multiple Styles

Combine different styles to create unique effects:
```
cyberpunk cityscape, (watercolor:0.8), (digital art:1.2), neon lights, rainy night
```

### 3. Using Lora Models to Fine-tune Styles

If you're using an interface that supports Lora, you can apply specific style models:
```
a portrait of woman, <lora:pixarStyle:0.7>, warm smile, professional lighting
```

## Summary

Writing good prompts is both an art and science in AI image generation. By providing clear, specific descriptions, setting appropriate weights, and utilizing style and technical details, you can greatly improve the quality and accuracy of generated images. Experimenting with different prompt combinations and learning from each attempt will help you master this powerful tool.

Remember: Great AI art comes not just from powerful models, but from well-crafted prompts and consistent practice.
</lang-en>

<lang-ja>
## プロンプト設計の基本原則

AI画像生成の品質は、提供するプロンプト（指示語）に大きく依存します。良いプロンプトは、AIにあなたが望む内容やスタイルを明確に理解させることができます。効果的なプロンプトを書くための主要な原則は以下の通りです：

### 1. 具体的であることが抽象的であることよりも重要

具体的な詳細を説明し、過度に抽象的な用語を避けましょう。単に「美しい風景」と言うのではなく、「高くそびえる雪をかぶった山々、澄んだ湖、黄金色の夕日がある山の風景」と言いましょう。

### 2. 構造化されたプロンプト

プロンプトをいくつかの主要セクションに分けましょう：
- **被写体**：中心となるオブジェクトやキャラクターを説明
- **環境**：シーン、背景、場所を説明
- **照明**：照明条件を説明（例：「柔らかい自然光」、「劇的なサイドライティング」）
- **スタイル**：芸術的スタイル、アーティスト、または媒体を指定
- **技術的詳細**：レンダリング品質、カメラ設定などを指定

### 3. 重要度を調整するための重みの使用

Stable Diffusionでは、特殊な構文を使用して単語に異なる重みを割り当てることができます：
- 重みを増やす：`(word:1.2)` または `((word))` または `(((word)))`
- 重みを減らす：`(word:0.8)` または `[word]` または `[[word]]`

例：`