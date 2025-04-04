"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var axios_1 = require("axios");
var cors_1 = require("cors");
var child_process_1 = require("child_process");
var util_1 = require("util");
var execAsync = (0, util_1.promisify)(child_process_1.exec);
var app = (0, express_1.default)();
var port = process.env.PORT || 3003;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Service configurations
var services = {
    taskService: {
        name: 'task-service',
        healthUrl: 'http://task-service:3000/health',
        versionUrl: 'http://task-service:3000/version'
    },
    uiService: {
        name: 'ui-service',
        healthUrl: 'http://ui-service:4000/health',
        versionUrl: 'http://ui-service:4000/version'
    },
    postgres: {
        name: 'postgres',
        healthUrl: 'http://postgres:5432' // We'll use pg_isready for health check
    }
};
// Health check endpoint for Heimdal itself
app.get('/health', function (req, res) {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Version endpoint for Heimdal itself
app.get('/version', function (req, res) {
    res.json({
        version: process.env.npm_package_version || '1.0.0',
        service: 'heimdal',
        environment: process.env.NODE_ENV || 'development'
    });
});
// Unified health check endpoint
app.get('/services/health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, response, error_1, response, error_2, stdout, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                results = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(services.taskService.healthUrl)];
            case 2:
                response = _a.sent();
                results.taskService = response.data;
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                results.taskService = { status: 'error', error: error_1.message };
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, axios_1.default.get(services.uiService.healthUrl)];
            case 5:
                response = _a.sent();
                results.uiService = response.data;
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                results.uiService = { status: 'error', error: error_2.message };
                return [3 /*break*/, 7];
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, execAsync('pg_isready -h postgres -U postgres')];
            case 8:
                stdout = (_a.sent()).stdout;
                results.postgres = { status: 'ok', message: stdout.trim() };
                return [3 /*break*/, 10];
            case 9:
                error_3 = _a.sent();
                results.postgres = { status: 'error', error: error_3.message };
                return [3 /*break*/, 10];
            case 10:
                res.json(results);
                return [2 /*return*/];
        }
    });
}); });
// Unified version endpoint
app.get('/services/version', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, response, error_4, response, error_5, stdout, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                results = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(services.taskService.versionUrl)];
            case 2:
                response = _a.sent();
                results.taskService = response.data;
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                results.taskService = { error: error_4.message };
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, axios_1.default.get(services.uiService.versionUrl)];
            case 5:
                response = _a.sent();
                results.uiService = response.data;
                return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                results.uiService = { error: error_5.message };
                return [3 /*break*/, 7];
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, execAsync('psql -h postgres -U postgres -c "SELECT version();"')];
            case 8:
                stdout = (_a.sent()).stdout;
                results.postgres = { version: stdout.trim() };
                return [3 /*break*/, 10];
            case 9:
                error_6 = _a.sent();
                results.postgres = { error: error_6.message };
                return [3 /*break*/, 10];
            case 10:
                res.json(results);
                return [2 /*return*/];
        }
    });
}); });
// Shutdown endpoint (protected by Loki service token)
app.post('/shutdown', function (req, res) {
    var lokiToken = req.headers['x-loki-token'];
    if (lokiToken === process.env.LOKI_SHUTDOWN_TOKEN) {
        res.json({ message: 'Shutting down service...' });
        process.exit(0);
    }
    else {
        res.status(403).json({ error: 'Unauthorized: Only Loki service can trigger shutdown' });
    }
});
app.listen(port, function () {
    console.log("Heimdal service running on port ".concat(port));
});
