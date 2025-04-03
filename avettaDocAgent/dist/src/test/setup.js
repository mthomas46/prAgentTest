"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@jest/globals");
process.env.GITHUB_TOKEN = 'test-token';
process.env.BOT_USERNAME = 'test-bot';
global.console.log = jest.fn();
global.console.error = jest.fn();
global.console.warn = jest.fn();
beforeEach(() => {
    jest.clearAllMocks();
});
afterEach(() => {
    jest.resetAllMocks();
});
//# sourceMappingURL=setup.js.map