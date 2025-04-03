export class BaseUtil {
  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  static isEmpty(value: any): boolean {
    if (this.isNullOrUndefined(value)) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static formatDate(date: Date): string {
    return date.toISOString();
  }

  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }
} 