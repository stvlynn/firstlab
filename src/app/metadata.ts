import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "First Lab",
  description: "First Lab - Learning Resources and Tools",
  icons: {
    icon: '/firstlab.png',
    apple: '/firstlab.png',
  },
  authors: [
    {
      name: 'First Lab',
      url: 'https://1st.ac.cn',
    },
  ],
  keywords: ['AI', 'Dify', 'MCP', '社区', '学习资源', 'コミュニティ', '学習リソース'],
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  openGraph: {
    title: 'First Lab',
    description: 'First Lab - Learning Resources and Tools',
    images: [
      {
        url: '/firstlab.png',
        width: 821,
        height: 821,
        alt: 'First Lab',
      }
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Lab',
    description: 'First Lab - Learning Resources and Tools',
    images: ['/firstlab.png'],
    creator: '@firstlab',
  },
}; 