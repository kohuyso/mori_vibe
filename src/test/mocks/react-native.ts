export const AppState = {
  currentState: 'active',
  addEventListener: jest.fn((_type: string, _listener: (state: string) => void) => ({
    remove: jest.fn(),
  })),
};

export const Platform = {
  OS: 'ios',
  select: jest.fn((obj: Record<string, unknown>) => obj.ios ?? obj.default),
};

export const StyleSheet = {
  create: jest.fn((styles: Record<string, unknown>) => styles),
};

export default {
  AppState,
  Platform,
  StyleSheet,
};
