import { Event } from '@/lib/types';
import { getAllEventMarkdowns } from '@/lib/markdown';

// Sample event data for client-side rendering when server data is not available
const SAMPLE_EVENTS: Event[] = [
  {
    date: "2023-11-25",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=812&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: {
      zh: "MCP 文件系统深度解析",
      ja: "MCPファイルシステム詳細分析",
      en: "MCP File System Deep Analysis"
    },
    description: {
      zh: "深入了解MCP文件系统的工作原理和高级应用技巧。",
      ja: "MCPファイルシステムの仕組みと高度な応用テクニックを深く理解します。",
      en: "Gain an in-depth understanding of how the MCP file system works and advanced application techniques."
    },
    link: "/events/mcp-file-system-analysis",
    organizer: "MCP技术社区"
  },
  {
    date: "2023-11-15",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=812&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: {
      zh: "AI 开发者研讨会",
      ja: "AI開発者ワークショップ",
      en: "AI Developer Workshop"
    },
    description: {
      zh: "探索最新的AI开发技术和工具，与行业专家交流。",
      ja: "最新のAI開発技術とツールを探索し、業界の専門家と交流します。",
      en: "Explore the latest AI development technologies and tools, and exchange ideas with industry experts."
    },
    link: "/events/ai-developer-workshop",
    organizer: "AI研究联盟"
  }
];

/**
 * Get all events sorted by date (newest first)
 * This function works both on the server and client
 */
export function getAllEvents(): Event[] {
  // If running on the client side, return sample data
  if (typeof window !== 'undefined') {
    console.warn('getAllEvents running on client, returning sample data');
    return SAMPLE_EVENTS;
  }
  
  try {
    // Get all markdown events
    const markdownEvents = getAllEventMarkdowns();
    
    if (markdownEvents.length === 0) {
      console.warn('No markdown events found, falling back to sample data');
      return SAMPLE_EVENTS;
    }
    
    // Convert markdown events to Event type
    return markdownEvents.map(mdEvent => ({
      date: mdEvent.metadata.date,
      image: mdEvent.metadata.image,
      title: mdEvent.title,
      description: mdEvent.description,
      link: `/events/${mdEvent.slug}`, // Create link from slug
      organizer: mdEvent.metadata.organizer
    }));
  } catch (error) {
    console.error('Error getting events from markdown:', error);
    return SAMPLE_EVENTS;
  }
}

/**
 * Get the most recent events
 */
export function getRecentEvents(count: number = 3): Event[] {
  return getAllEvents().slice(0, count);
} 