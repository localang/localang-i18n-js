import path from 'path';
import fs from 'fs';
import https from 'https';
import { push } from './push';
import { parseContent } from '../core';

jest.mock('fs');
jest.mock('https');
jest.mock('../core', () => ({
    parseContent: jest.fn(),
}));

describe('synchronizer/push', () => {
    const authToken = 'test-token';
    const files = ['file1.i18n.js', 'file2.i18n.js'];
    const file1Name = 'file1.js';
    const file2Name = 'file2.js';
    const resolvedFile1Path = path.resolve(process.cwd(), 'file1.i18n.js');
    const resolvedFile2Path = path.resolve(process.cwd(), 'file2.i18n.js');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should upload translations and handle existing files', (done) => {
        (fs.existsSync as jest.Mock).mockImplementation(
            (filePath) => filePath === resolvedFile1Path,
        );

        (parseContent as jest.Mock).mockImplementation(() => ({
            key: 'value',
        }));

        const request = {
            on: jest.fn(),
            write: jest.fn(),
            end: jest.fn(),
        };

        (https.request as jest.Mock).mockImplementation(
            (_options, callback) => {
                const res = {
                    on: jest.fn((event, handler) => {
                        if (event === 'data') {
                            handler(JSON.stringify({ status: 'success' }));
                        }
                        if (event === 'end') {
                            handler();
                        }
                    }),
                };

                callback(res);
                return request;
            },
        );

        push(authToken, 1, files);

        process.nextTick(() => {
            expect(https.request).toHaveBeenCalledWith(
                {
                    hostname: 'localang.xyz',
                    port: 443,
                    path: '/api/translations/update',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                },
                expect.any(Function),
            );

            expect(request.on).toHaveBeenCalledWith(
                'error',
                expect.any(Function),
            );
            expect(request.write).toHaveBeenCalledWith(
                JSON.stringify({
                    project_id: 1,
                    files: {
                        [file1Name]: {
                            operation: 'update',
                            translations: { key: 'value' },
                        },
                        [file2Name]: {
                            operation: 'delete',
                        },
                    },
                }),
            );
            expect(request.end).toHaveBeenCalled();

            expect(parseContent).toHaveBeenCalled();

            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile1Path);
            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile2Path);

            done();
        });
    });

    it('should handle non-existing files', (done) => {
        (fs.existsSync as jest.Mock).mockImplementation(() => false);

        const request = {
            on: jest.fn(),
            write: jest.fn(),
            end: jest.fn(),
        };

        (https.request as jest.Mock).mockImplementation(
            (_options, callback) => {
                const res = {
                    on: jest.fn((event, handler) => {
                        if (event === 'data') {
                            handler(JSON.stringify({ status: 'success' }));
                        }
                        if (event === 'end') {
                            handler();
                        }
                    }),
                };

                callback(res);
                return request;
            },
        );

        push(authToken, 1, files);

        process.nextTick(() => {
            expect(https.request).toHaveBeenCalledWith(
                {
                    hostname: 'localang.xyz',
                    port: 443,
                    path: '/api/translations/update',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                },
                expect.any(Function),
            );

            expect(request.on).toHaveBeenCalledWith(
                'error',
                expect.any(Function),
            );
            expect(request.write).toHaveBeenCalledWith(
                JSON.stringify({
                    project_id: 1,
                    files: {
                        [file1Name]: { operation: 'delete' },
                        [file2Name]: { operation: 'delete' },
                    },
                }),
            );
            expect(request.end).toHaveBeenCalled();

            expect(parseContent).not.toHaveBeenCalled();

            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile1Path);
            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile2Path);

            done();
        });
    });
});
