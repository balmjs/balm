// FIX: typescript conflict between dom and webworker
interface ExtendableEvent extends Event {
  waitUntil(f: any): void;
}
