import { EventEmitter as NodeEventEmitter } from "events";
import { Logger } from "./logger.js";

export interface EventTypes {
  // Product events
  "product:created": {
    product: {
      _id: string;
      name: string;
      sku: string;
    };
  };
  "product:updated": {
    product: {
      _id: string;
      name: string;
      changes: Record<string, any>;
    };
  };
  "product:deleted": {
    productId: string;
  };
  "product:lowStock": {
    product: {
      _id: string;
      name: string;
      sku: string;
    };
    currentStock: number;
    reorderPoint: number;
  };

  // Order events
  "order:created": {
    orderId: string;
    customer: string;
    total: number;
  };
  "order:statusChanged": {
    orderId: string;
    previousStatus: string;
    newStatus: string;
  };
  "order:paymentReceived": {
    orderId: string;
    amount: number;
    paymentMethod: string;
  };

  // Inventory events
  "inventory:stockUpdated": {
    productId: string;
    previousLevel: number;
    newLevel: number;
    change: number;
  };
  "inventory:stockAlert": {
    productId: string;
    level: number;
    threshold: number;
    type: "low" | "out";
  };

  // User events
  "user:created": {
    userId: string;
    email: string;
    role: string;
  };
  "user:login": {
    userId: string;
    timestamp: Date;
    ip: string;
  };
  "user:logout": {
    userId: string;
    timestamp: Date;
  };
}

type EventHandler<T> = (data: T) => void | Promise<void>;

export class EventEmitter {
  private emitter: NodeEventEmitter;
  private logger: Logger;
  private handlers: Map<string, EventHandler<any>[]>;
  constructor(Logger: Logger) {
    this.logger = Logger;
    this.emitter = new NodeEventEmitter();
    this.handlers = new Map();
    this.emitter.setMaxListeners(50);
  }

  emit<K extends keyof EventTypes>(
    eventName: K,
    eventData: EventTypes[K]
  ): boolean {
    try {
      this.logger.debug(`Emitting event: ${String(eventName)}`, { eventData });
      return this.emitter.emit(String(eventName), eventData);
    } catch (error) {
      this.logger.error(
        `Error emitting event ${String(eventName)}:`,
        error || ""
      );
      return false;
    }
  }
  on<K extends keyof EventTypes>(
    eventName: K,
    handler: EventHandler<EventTypes[K]>
  ): void {
    try {
      const handlers = this.handlers.get(String(eventName)) || [];
      handlers.push(handler);
      this.handlers.set(String(eventName), handlers);

      this.emitter.on(String(eventName), async (data: EventTypes[K]) => {
        try {
          await handler(data);
        } catch (error) {
          this.logger.error(
            `Error in event handler for ${String(eventName)}:`,
            error || ""
          );
        }
      });

      this.logger.debug(`Registered handler for event: ${String(eventName)}`);
    } catch (error) {
      this.logger.error(
        `Error registering handler for ${String(eventName)}:`,
        error || ""
      );
    }
  }
  getHandlers<K extends keyof EventTypes>(
    eventName: K
  ): EventHandler<EventTypes[K]>[] {
    return this.handlers.get(String(eventName)) || [];
  }
}
