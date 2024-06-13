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
    const resolvedFile1Path = path.resolve(process.cwd(), 'file1.i18n.js');
    const resolvedFile2Path = path.resolve(process.cwd(), 'file2.i18n.js');
    const baseFile1 = resolvedFile1Path.replace(/\.i18n\./, '.');
    const baseFile2 = resolvedFile2Path.replace(/\.i18n\./, '.');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should upload translations and handle existing files', (done) => {
        (fs.existsSync as jest.Mock).mockImplementation(
            (filePath) => filePath === resolvedFile1Path,
        );
        (fs.readFile as unknown as jest.Mock).mockImplementation(
            (filePath, _encoding, callback) => {
                if (filePath === resolvedFile1Path) {
                    callback(null, '{"key": "value"}');
                }
            },
        );

        (parseContent as jest.Mock).mockImplementation((data) =>
            JSON.parse(data),
        );

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

        push(authToken, files);

        process.nextTick(() => {
            expect(https.request).toHaveBeenCalledWith(
                {
                    hostname: 'https://localang.xyz',
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
            expect(request.write).toHaveBeenCalledWith({
                [baseFile1]: {
                    operation: 'update',
                    translations: { key: 'value' },
                },
                [baseFile2]: {
                    operation: 'delete',
                },
            });
            expect(request.end).toHaveBeenCalled();

            expect(parseContent).toHaveBeenCalledWith('{"key": "value"}');

            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile1Path);
            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile2Path);

            expect(fs.readFile).toHaveBeenCalledWith(
                resolvedFile1Path,
                'utf8',
                expect.any(Function),
            );
            expect(fs.readFile).not.toHaveBeenCalledWith(
                resolvedFile2Path,
                'utf8',
                expect.any(Function),
            );

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

        push(authToken, files);

        process.nextTick(() => {
            expect(https.request).toHaveBeenCalledWith(
                {
                    hostname: 'https://localang.xyz',
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
            expect(request.write).toHaveBeenCalledWith({
                [baseFile1]: { operation: 'delete' },
                [baseFile2]: { operation: 'delete' },
            });
            expect(request.end).toHaveBeenCalled();

            expect(parseContent).not.toHaveBeenCalled();

            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile1Path);
            expect(fs.existsSync).toHaveBeenCalledWith(resolvedFile2Path);

            expect(fs.readFile).not.toHaveBeenCalled();

            done();
        });
    });
});
