/**
 * The matching preview (brief §6) is a deliberate device, not a real feature.
 * When the demo control is on, this stub gives every card a badged, clearly
 * fake percentage so the room can argue about a thing it can see — not built,
 * not validated, and not meant to be anything more than a prop for that
 * conversation.
 */
export function matchScoreStub(listingId: string): number {
  let hash = 0
  for (const char of listingId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return 55 + (hash % 41) // 55–95%
}
