import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "First Lab",
  description: "First Lab - 学习资源和工具",
  icons: {
    icon: '/firstlab.png',
    apple: '/firstlab.png',
  },
  authors: [
    {
      name: 'First Lab',
      url: 'https://firstlab.ai',
    },
  ],
  keywords: ['AI', 'Dify', 'MCP', '社区', '学习资源'],
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  openGraph: {
    title: 'First Lab',
    description: 'First Lab - 学习资源和工具',
    images: [
      {
        url: '/firstlab.png',
        width: 1200,
        height: 630,
        alt: 'First Lab',
      }
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Lab',
    description: 'First Lab - 学习资源和工具',
    images: ['/firstlab.png'],
    creator: '@firstlab',
  },
}; 