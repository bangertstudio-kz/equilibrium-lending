/** Visitor's OS for download buttons; null when there's no direct build. */
export function detectOS(): 'mac' | 'windows' | 'ios' | null {
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac; touch gives it away.
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Macintosh|Mac OS X/.test(ua)) return 'mac';
  if (/Windows/.test(ua)) return 'windows';
  return null;
}
