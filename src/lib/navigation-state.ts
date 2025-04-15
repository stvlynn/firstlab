"use client";

/**
 * 导航栏状态管理
 * 管理导航栏的折叠状态并通知其他组件
 */

// 获取导航栏折叠状态
export function getNavCollapsedState(): boolean {
  if (typeof window === 'undefined') return true;
  const state = localStorage.getItem('navCollapsed');
  return state === 'true'; // 默认折叠
}

// 设置导航栏折叠状态
export function setNavCollapsedState(isCollapsed: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('navCollapsed', String(isCollapsed));
  dispatchNavStateChanged(isCollapsed);
}

// 切换导航栏折叠状态
export function toggleNavCollapsedState(): boolean {
  const currentState = getNavCollapsedState();
  const newState = !currentState;
  setNavCollapsedState(newState);
  return newState;
}

// 分发导航栏状态变化事件
export function dispatchNavStateChanged(isCollapsed: boolean): void {
  if (typeof window === 'undefined') return;
  
  // 使用CustomEvent通知所有监听组件
  window.dispatchEvent(
    new CustomEvent('navStateChanged', {
      detail: { isCollapsed }
    })
  );
  
  // 确保事件被发送
  console.log('Navigation state changed:', isCollapsed);
}

// 监听导航栏状态变化
export function listenToNavStateChanges(callback: (isCollapsed: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ isCollapsed: boolean }>;
    callback(customEvent.detail.isCollapsed);
  };
  
  window.addEventListener('navStateChanged', handler as EventListener);
  
  // 在组件初始化时调用一次回调，传入当前状态
  callback(getNavCollapsedState());
  
  // 返回清理函数
  return () => {
    window.removeEventListener('navStateChanged', handler as EventListener);
  };
} 